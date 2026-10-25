# Plan 004: Never discard an unsaved draft without asking

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 2908706..HEAD -- src/EveryTextLineEditor.ts`
> Compare the "Current state" excerpts against the live code; on a mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: MED
- **Depends on**: none (independent of 001-003; touches different methods of the same file)
- **Category**: bug
- **Planned at**: commit `2908706` + uncommitted working tree, 2026-10-25

## Why this matters

The editor keeps an unsaved draft (`dirty === true`) in the editor buffer. Many
routine actions call `refreshSources(true)`, which re-selects the current source
with `selectSource(id, { force: true })`. `force` skips the "Save / Discard /
Cancel" prompt **and** overwrites the editor with the saved text. Toggling a
prompt on/off, opening the Control dialog, the Refresh button, renaming, a
background character-card change, picking a source in the History tab, and the
Prompt Inspector all throw away typing with no warning. Users lose work.

## Current state

File: `src/EveryTextLineEditor.ts`.

- `selectSource` (1750-1780):
```ts
    async selectSource(id, { force = false } = {}) {
        if (!force && this.selectedSource?.id === id) return;
        if (!force && this.dirty) {
            const choice = await this.confirmUnsavedSourceChange('switch');
            if (choice === 'cancel') return;
            if (choice === 'save') {
                const saved = await this.saveCurrentSource({ refresh: false, toast: true });
                if (!saved) return;
            }
            if (choice === 'discard') {
                this.updateDirty(false);
            }
        }
        const source = this.sources.find(item => item.id === id);
        if (!source || source.selectable === false) return;

        this.selectedSource = source;
        if (this.historyCommit?.sourceId !== source.id) this.historyCommit = undefined;
        setSetting(STORAGE.selectedSource, source.id);
        this.selectedSourceBaseline = source.read();
        this.selectedSourceChanged = false;
        this.updateHeader();
        this.editor?.setOptions({ readOnly: !!source.readonly });
        this.setActiveLanguage(this.getLanguageForSource(source), { updateUi: false });
        this.setEditorValue(this.selectedSourceBaseline);
        this.updateDirty(false);
        ...
```
- `refreshSources` (1449-1467):
```ts
    async refreshSources(keepSelection = false) {
        const previousId = keepSelection ? this.selectedSource?.id : getSetting<string>(STORAGE.selectedSource, '');
        this.sources = await getSources();
        this.pruneTrackedSources();
        this.renderTree();
        this.updateStatusBar();

        const visibleSources = this.getTrackedSources();
        if (previousId && visibleSources.some(source => source.id === previousId)) {
            await this.selectSource(previousId, { force: true });
        } else if (visibleSources.length && (!this.selectedSource || !visibleSources.some(source => source.id === this.selectedSource?.id))) {
            await this.selectSource(visibleSources[0].id, { force: true });
        } else if (!visibleSources.length) {
            this.clearSelectedSource(...);
        }
    }
```
  `getSources()` (in `src/SourceManager.ts`) rebuilds **new** `TextSource` objects every call. Each object captures its backing SillyTavern object in a closure.
- Callers of `refreshSources` that can run while dirty: Refresh button (389), branch switch (1002), `toggleSource` (1742), `openSourceControlDialog` (1695), rename `finish` (2464, `refreshSources()` with no arg — `previousId` comes from the stored selected id, normally the same source), `open()` (2871), the source watcher (1973, 1985).
- `refreshSourcesFromRuntime` (1619-1626) already refuses to refresh while dirty, except for the current character card when it changed upstream:
```ts
        const selectedCurrentCard = this.selectedSource?.id.startsWith('current-character-card:') ?? false;
        if (this.dirty && !(selectedCurrentCard && this.selectedSourceChanged)) {
```
- Current-card source ids are `current-character-card:<field>` for **every** character (`src/SourceManager.ts:619-631`). The character identity is only visible via `source.displayGroup` (the card name) and `source.meta` (`"Character card: current (<name>)"`). Saving through the **old** source object writes to the **old** character (its closure holds that character).
- History panel callbacks (620-633):
```ts
                onSelectCategory: async (groupName) => {
                    ...
                    if (firstSource && (!this.selectedSource || this.selectedSource.group !== groupName)) {
                        await this.selectSource(firstSource.id, { force: true });
                    ...
                onSelectSource: async (sourceId) => {
                    await this.selectSource(sourceId, { force: true });
                },
```
- Prompt Inspector (`inspectGeneratedPrompt`, 1517-1521):
```ts
        setPromptInspectorSnapshot(value);
        await this.open();
        const sourceId = getPromptInspectorSourceId();
        await this.selectSource(sourceId, { force: true });
        if (this.selectedSource?.id !== sourceId) return;
```
- `setTrackedSourceGroups` (1672) force-selects the first visible source when the selected one becomes hidden.
- Calls that must KEEP `force` (no dirty draft at that point, or the user already chose): `selectInitialSource` (1632, 1634), history "load commit" (3007, prompt happens just above at 2997-3004), `saveCurrentSource` → `refreshSources(true)` (dirty already false).
- Vocabulary (from `CONTEXT.md`): **TextSource** = one editable piece of text with `id`, `label`, `group`, `read()/write()/save()`. Use these names.

## Commands you will need

| Purpose   | Command | Expected on success |
|-----------|---------|---------------------|
| Typecheck | `npm run check` | exit 0 |
| Build     | `npx tsc -p tsconfig.json` | exit 0 (do NOT run `npm run build`) |

## Scope

**In scope**: `src/EveryTextLineEditor.ts`, matching `dist/EveryTextLineEditor.*`.

**Out of scope**: `src/SourceManager.ts` (do not change source ids), the source watcher interval (plan 005), rename Escape handling, `confirmUnsavedSourceChange` UI text.

## Git workflow

- Branch: `advisor/004-preserve-dirty-draft`
- Commit per step is fine; style `fix: keep unsaved draft when sources refresh`.
- Do NOT push.

## Steps

### Step 1: Add an identity check for "same id, same backing object"

Add a module-level helper near the other helpers at the top of the file:

```ts
// Same id is not enough: Current Card ids are shared by every character.
const isSameSourceIdentity = (a: TextSource, b: TextSource) =>
    a.id === b.id && a.group === b.group && (a.displayGroup ?? '') === (b.displayGroup ?? '') && a.label === b.label;
```

**Verify**: `npm run check` → exit 0.

### Step 2: Add `rebindSelectedSource` that keeps the editor buffer

Add a method next to `selectSource`:

```ts
    // Point at the refreshed TextSource object without touching the editor buffer.
    rebindSelectedSource(source: TextSource) {
        const baseline = source.read();
        if (baseline !== this.selectedSourceBaseline) this.selectedSourceChanged = true;
        this.selectedSource = source;
        this.selectedSourceBaseline = baseline;
        this.updateHeader();
        this.updateDirty(this.isCurrentEditorDirty());
        this.renderDiff();
        this.renderTree();
    }
```

**Verify**: `npm run check` → exit 0.

### Step 3: Use it in `refreshSources` when a draft is dirty

Replace the first branch of the `if` chain in `refreshSources`:

```ts
        const nextSource = previousId ? visibleSources.find(source => source.id === previousId) : undefined;
        if (nextSource) {
            const current = this.selectedSource;
            if (this.dirty && current?.id === nextSource.id) {
                if (isSameSourceIdentity(current, nextSource)) {
                    this.rebindSelectedSource(nextSource);
                    return;
                }
                // Backing object changed (e.g. a different current character). Ask first;
                // "save" writes through the old TextSource, i.e. to the old character.
                const choice = await this.confirmUnsavedSourceChange('switch');
                if (choice === 'cancel') return;
                if (choice === 'save' && !(await this.saveCurrentSource({ refresh: false, toast: true }))) return;
                this.updateDirty(false);
            }
            await this.selectSource(nextSource.id, { force: true });
        } else if ( ...unchanged... )
```

Keep the remaining two branches unchanged. Note that `return` before `clearSelectedSource` is only reached in the dirty+same-id path.

**Verify**: `npm run check` → exit 0.

### Step 4: Route user-driven switches through the prompt

- History panel `onSelectCategory` and `onSelectSource` (620-633): drop `{ force: true }`. `selectSource` without force returns early for the same id and prompts when dirty.
- `setTrackedSourceGroups` (1672): drop `{ force: true }`.
- `inspectGeneratedPrompt` (1520): use `force` only when the inspector source is already selected:
```ts
        await this.selectSource(sourceId, { force: this.selectedSource?.id === sourceId });
```
  If the user cancels the prompt, the existing `if (this.selectedSource?.id !== sourceId) return;` exits and the generation proceeds uninspected. That is the intended fallback.

**Verify**: `grep -n "force: true" src/EveryTextLineEditor.ts` → only lines inside `refreshSources`, `selectInitialSource`, and the history "load commit" method remain.

### Step 5: Build and check in SillyTavern

`npx tsc -p tsconfig.json`, reload. For each scenario: select a Chat Completion prompt source, type `DRAFT-TEST` into it (title shows ` *`), then perform the action and check the editor still contains `DRAFT-TEST` and the ` *` marker remains.

1. Click the toggle on another prompt in the source tree.
2. Click Sources → Control, close the dialog.
3. Click the Refresh sources button.
4. Rename the current prompt via the header (if supported for that source).
5. History tab → click a different source → expect the Save/Discard/Cancel prompt; Cancel keeps `DRAFT-TEST`.
6. Current Card: select "Current Card → Description", type `DRAFT-TEST`, switch to a different character in SillyTavern → expect the prompt. Choose Cancel → draft kept. Choose Save → the **previous** character's description now contains `DRAFT-TEST` (check that character card), and the editor now shows the new character.
7. Edit the same current character's description in SillyTavern's own character panel while the draft is dirty → draft stays, header shows "source changed".

**Verify**: all seven scenarios behave as stated.

## Test plan

No automated harness. The seven manual scenarios in Step 5 are the test plan. Record pass/fail per scenario in the PR description.

## Done criteria

- [ ] `npm run check` exits 0
- [ ] `grep -n "rebindSelectedSource\|isSameSourceIdentity" src/EveryTextLineEditor.ts` shows definition and use in `refreshSources`
- [ ] Step 4 grep result matches
- [ ] Step 5 scenarios pass
- [ ] `git status` shows only `src/EveryTextLineEditor.ts` and `dist/EveryTextLineEditor.*`
- [ ] `plans/README.md` status row updated

## STOP conditions

- `TextSource` has no `displayGroup` field in `src/types.ts` (identity check needs a different field). Report the available fields.
- Scenario 6 "Save" writes to the **new** character. That means the old TextSource closure does not hold the old character, and the identity reasoning is wrong. Revert step 3's save branch and report.
- `confirmUnsavedSourceChange` cannot be awaited from a background refresh (e.g. throws because a popup is already open). Report with the error.

## Maintenance notes

- Two characters with the same name and same field still pass `isSameSourceIdentity`. If that matters, add an explicit `identity` field to `TextSource` (e.g. avatar for card sources) in `SourceManager.ts` and compare it here.
- New code that refreshes sources should call `refreshSources(true)` and rely on this path. Do not add new `selectSource(..., { force: true })` calls unless the draft is known clean.
- The source watcher (plan 005) still triggers `refreshSources(true)` for current-card changes. After this plan that path is safe.
