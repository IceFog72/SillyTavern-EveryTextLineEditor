# Plan 005: Stop background server polling and per-keystroke diff/history work

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 2908706..HEAD -- src/EveryTextLineEditor.ts`
> Compare the "Current state" excerpts against the live code; on a mismatch, STOP.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: 004 recommended first (the watcher triggers `refreshSources(true)`, which is only draft-safe after 004)
- **Category**: perf
- **Planned at**: commit `2908706` + uncommitted working tree, 2026-10-25

## Why this matters

1. A source watcher runs every 500 ms for the whole session, even with the editor
   drawer closed. For character-card sources it calls `readFresh()`, which calls
   SillyTavern's `getOneCharacter()` (a server request). That is two backend
   requests per second forever once a card source is selected.
2. On every keystroke the editor recomputes a full line diff and rewrites the
   hidden left diff editor, even when the Diff view is closed. With the History
   tab open it also re-runs `refreshHistory()` (IndexedDB reads + SHA hashing of
   every source in the group), although that result does not depend on the
   editor buffer. Typing slows down on large sources (lorebook / card Full JSON).

## Current state

File: `src/EveryTextLineEditor.ts`.

- Watcher (1949-1953), started once from `inject()` (269) and stopped only in `destroy()`:
```ts
    startSourceWatcher() {
        this.stopSourceWatcher();
        this.sourceWatchTimer = window.setInterval(() => {
            this.refreshSelectedSourceBaseline().catch((error) => console.warn(`[${NAME}] Failed to refresh selected source`, error));
        }, 500);
    }
```
- `refreshSelectedSourceBaseline` (1962-1992) uses `watchedSource.readFresh?.() ?? watchedSource.read()`.
- `readFresh` for card sources: `src/SourceManager.ts:637,655` → `refresh()` → `getFreshCharacter` → `await getOneCharacter?.(avatar)` (`SourceManager.ts:532-533`).
- Drawer open state: `this.dom.root.classList.contains('openDrawer')` (used the same way in `handleDocumentClick`, line ~343).
- Keystroke handlers. Prism `onUpdate` (1179-1185) and Monaco `onDidChangeModelContent` (1249-1256) both do:
```ts
                    this.updateDirty(this.isValueDirty(value));
                    this.renderDiff();
                    this.updateStatusBar();
```
- `renderDiff` (2672-2690):
```ts
    renderDiff() {
        if (!this.oldEditor) return;
        this.updateDiffSideLabels();
        if (this.diffOpen && this.editorEngine.id === 'monaco') {
            this.updateMonacoDiffModels();
            return;
        }
        const saved = this.getDiffOriginalValue();
        const unsaved = this.getCurrentEditorValue();
        const diff = getLineDiff(saved, unsaved);
        try {
            this.oldEditor.setOptions({ language: 'text', value: diff.oldDisplayText });
            requestAnimationFrame(() => this.highlightDiff(diff));
        } catch (error) { ... }
    }
```
- `applyDiffMarks` (2729-2743) removes the diff classes from every `.pce-line` and only re-adds them `if (this.diffOpen)`. So when Diff closes, `toggleDiff()` (2631-2659, `else if (!this.diffOpen)` branch) calls `renderDiff()` to clear the marks.
- `updateDirty` (2858-2868) ends with:
```ts
        this.updateStatusBar();
        if (this.selectedSidebarTab === 'history') this.refreshHistory();
```
- `refreshHistory` (2914-2950) reads `source.read()` (saved values) for each source in the group, never the editor buffer.

## Commands you will need

| Purpose   | Command | Expected on success |
|-----------|---------|---------------------|
| Typecheck | `npm run check` | exit 0 |
| Build     | `npx tsc -p tsconfig.json` | exit 0 (do NOT run `npm run build`) |

## Scope

**In scope**: `src/EveryTextLineEditor.ts`, matching `dist/EveryTextLineEditor.*`.

**Out of scope**: `src/SourceManager.ts`, `getLineDiff` algorithm, Monaco diff path (`updateMonacoDiffModels`), status-bar content.

## Git workflow

- Branch: `advisor/005-idle-and-typing-cost`
- Commit: `perf: pause source watcher when hidden and skip closed-diff work`
- Do NOT push.

## Steps

### Step 1: Pause the watcher while the drawer is closed or the tab is hidden

At the start of the interval callback in `startSourceWatcher`, add:

```ts
            if (document.hidden || !this.dom.root?.classList.contains('openDrawer')) return;
```

**Verify**: `npm run check` → exit 0.

### Step 2: Skip Prism diff work while Diff is closed

In `renderDiff`, directly after `this.updateDiffSideLabels();`, add `if (!this.diffOpen) return;`.

Because closing Diff relied on `renderDiff()` to strip the marks, add a method:

```ts
    clearDiffMarks() {
        this.applyDiffMarks(this.oldEditor, [], 'removed');
        this.applyDiffMarks(this.editor, [], 'added');
    }
```

and in `toggleDiff()`'s `else if (!this.diffOpen)` branch replace `this.renderDiff();` with `this.clearDiffMarks();`. Opening Diff still calls `renderDiff()` (both other branches), which recomputes from the current values.

**Verify**: `npm run check` → exit 0.

### Step 3: Refresh history only when the dirty flag flips

In `updateDirty`, capture `const wasDirty = this.dirty;` before assigning, and change the last line to:

```ts
        if (wasDirty !== this.dirty && this.selectedSidebarTab === 'history') this.refreshHistory();
```

Other callers that need a history refresh (source selection, save, tab switch) already call `refreshHistory()` themselves (e.g. `selectSource` last line).

**Verify**: `npm run check` → exit 0.

### Step 4: Build and check in SillyTavern

`npx tsc -p tsconfig.json`, reload.

1. Select a "Current Card" or "Character Card" source. Close the drawer. DevTools → Network, filter `characters/get`. Wait 10 s → 0 new requests. Open the drawer → requests resume (≈2/s).
2. With Diff closed, type in the editor. Then open Diff → left pane shows the saved text with removed/added lines highlighted correctly for what you typed. Close Diff → no line keeps a red/green background.
3. With Diff open, type → highlights update as before.
4. History tab open: type several characters, then Apply (save). The History "changed" list shows the source as modified. Revert a second edit → list is unchanged from the saved state.

**Verify**: all four checks hold.

## Done criteria

- [ ] `npm run check` exits 0
- [ ] `grep -n "document.hidden" src/EveryTextLineEditor.ts` matches inside `startSourceWatcher`
- [ ] `grep -n "clearDiffMarks" src/EveryTextLineEditor.ts` shows definition and use in `toggleDiff`
- [ ] Step 4 checks pass
- [ ] `plans/README.md` status row updated

## STOP conditions

- With Step 2 applied, opening Diff shows stale or missing highlights in any engine. Report which engine.
- The History panel shows a dirty/unsaved indicator that depends on the keystroke refresh (i.e. Step 3 removes visible behavior). Report.

## Maintenance notes

- A future 'live' history indicator that depends on the buffer must debounce instead of restoring the per-keystroke call.
- Interval stays 500 ms while open. If card sources still feel heavy, throttle only `readFresh` (e.g. every 3 s) rather than the whole watcher.
- Plan 007 (Prism 5) changes `scrollContainer` naming but not these methods.
