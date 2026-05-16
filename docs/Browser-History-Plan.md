# Browser Git-Like History Plan

## Goal

Add local, browser-side history for Every Text Line Editor sources. The feature should feel like a small Git log for prompt/text sources: each successful Apply can create a recoverable commit, users can inspect old versions, diff against current text, and restore a previous version.

This is not real Git. Do not try to run Git in the browser. Implement a simple append-only history database in IndexedDB.

## Opinion

This is worth doing if it stays small and boring. The extension edits important prompts, and a local history makes experimentation safer. The dangerous version is trying to build branches, merges, remotes, or a full VCS. V1 should only do linear per-source commits, diffs, restore, and cleanup.

## Storage Choice

Use IndexedDB, not `localStorage`.

Reasons:
- Prompt text can be large.
- History can contain many entries.
- IndexedDB is async and survives reloads.
- `localStorage` blocks the UI thread and is too small for this.

Use a tiny wrapper module in `src/HistoryStore.ts`. Do not add Dexie or another dependency unless the raw IndexedDB code becomes unmaintainable.

## Data Model

Database name:

```ts
const DB_NAME = `${NAME}:history`;
const DB_VERSION = 1;
```

Object stores:

```ts
commits
sources
```

Commit record:

```ts
interface HistoryCommit {
    id: string;              // uuid or `${Date.now()}-${random}`
    sourceId: string;        // TextSource.id
    sourceLabel: string;     // label at time of commit
    sourceGroup: string;     // group at time of commit
    createdAt: number;       // Date.now()
    parentId: string | null; // previous commit for same source
    reason: 'apply' | 'restore' | 'manual';
    content: string;         // full text snapshot for V1
    hash: string;            // hash of content to skip duplicates
    meta?: {
        app?: string;
        extensionVersion?: string;
        sourceMeta?: string;
    };
}
```

Source record:

```ts
interface HistorySource {
    sourceId: string;
    latestCommitId: string | null;
    latestHash: string | null;
    updatedAt: number;
    label: string;
    group: string;
}
```

Indexes:

```ts
commits: keyPath 'id'
commits indexes:
  sourceId
  createdAt
  [sourceId, createdAt]

sources: keyPath 'sourceId'
```

## Snapshot Strategy

V1 should store full snapshots, not patches.

Why:
- Simpler restore.
- Easier to debug.
- Prompt texts are usually small enough.
- Existing diff code can compare snapshots at render time.

Do not store only diffs in V1. Patch chains are easy to corrupt and annoying to recover from. If storage becomes a problem later, add compression or periodic full snapshots plus patches.

## Hashing

Before creating a commit, compute a stable hash of the current text.

Use browser crypto when available:

```ts
crypto.subtle.digest('SHA-256', new TextEncoder().encode(content))
```

Fallback to a simple non-cryptographic hash only if `crypto.subtle` is unavailable. The hash is for duplicate detection, not security.

Skip creating a commit if the latest commit for that source has the same hash.

## Commit Flow

Hook history only after a successful source save.

Current Apply flow is:

```text
editor value -> source.write(value) -> source.save() -> clean state
```

New flow:

```text
editor value
-> source.write(value)
-> source.save()
-> historyStore.commit(source, value, 'apply')
-> clean state
```

Important:
- Do not commit before `source.save()` succeeds.
- If history commit fails, do not fail the user save. Show a warning toast and log the error.
- Do not create commits on every keystroke.
- Do not create commits for readonly sources.
- Do not create commits for failed saves.

## Restore Flow

Restoring should be explicit and safe.

Flow:

```text
user picks commit
-> show diff old/current
-> user clicks Restore
-> editor value becomes commit.content
-> mark dirty
-> user still clicks Apply to persist
```

Do not directly write restored content into SillyTavern settings unless the user confirms with Apply. Restore should behave like loading old text into the editor, not an immediate save.

When Apply saves restored content, create a new commit with:

```ts
reason: 'restore'
parentId: latestCommitId
```

Do not move the history pointer backward. Git-style history should remain append-only.

## UI Plan

Add a History button near Diff/Revert/Apply.

Also restructure the left sidebar before adding history UI:

```html
<aside class="etle--sidebar">
    <div class="etle--sidebarHead">...</div>
    <div class="etle--sidebarTabs">
        <button data-tab="sources">Sources</button>
        <button data-tab="history">History</button>
        <button data-tab="settings">Settings</button>
    </div>
    <div class="etle--sidebarBody">
        <section class="etle--tabPanel etle--sourcesPanel">
            <div class="etle--tree"></div>
        </section>
        <section class="etle--tabPanel etle--historyPanel"></section>
        <section class="etle--tabPanel etle--settingsPanel"></section>
    </div>
</aside>
```

`etle--tree` must move inside the Sources tab panel. It should no longer be a direct child of `etle--sidebar`.

Sidebar tabs:
- Sources: existing source tree.
- History: Git-like local history for the currently selected source.
- Settings: empty placeholder in V1, but create the tab and panel now so layout does not need another rewrite later.

History tab content:
- Current source name.
- List of commits newest first.
- Timestamp.
- Reason label: Apply, Restore, Manual.
- Small content stats: lines/chars.
- Buttons:
  - Diff
  - Load
  - Delete commit only if needed later, not V1 default.

For V1, avoid a complex graph. Show one linear list per selected source.

The History button near Diff/Revert/Apply may simply switch the sidebar to the History tab. Do not open a second popup if the sidebar tab exists.

History Diff:
- Reuse existing split diff editor.
- Old side = selected commit content.
- New side = current editor value.
- Old side readonly.
- Keep scroll sync.

History Load:
- If current editor is dirty, reuse the existing unsaved-change confirmation.
- Set editor value to commit content.
- Mark dirty.
- Do not save automatically.

## Suggested Files

Add:

```text
src/HistoryStore.ts
src/HistoryPanel.ts
```

Update:

```text
src/types.ts
src/EveryTextLineEditor.ts
src/constants.ts
style.css
```

Do not put IndexedDB code inside `EveryTextLineEditor.ts`. Keep it in `HistoryStore.ts`.

Keep tab state small:

```ts
selectedSidebarTab: 'sources' | 'history' | 'settings'
```

Persist it only if it feels useful. It is safe to default to `sources` on every load.

## Minimal Interfaces

`HistoryStore.ts`:

```ts
export class HistoryStore {
    open(): Promise<void>;
    commit(source: TextSource, content: string, reason: HistoryCommit['reason']): Promise<HistoryCommit | null>;
    listCommits(sourceId: string, limit?: number): Promise<HistoryCommit[]>;
    getCommit(id: string): Promise<HistoryCommit | null>;
    pruneSource(sourceId: string, keepCount: number): Promise<number>;
}
```

`EveryTextLineEditor.ts` should only call:

```ts
await this.history.commit(source, value, 'apply');
const commits = await this.history.listCommits(source.id);
```

## Pruning

V1 should have automatic per-source pruning.

Default:

```ts
keep last 100 commits per source
```

Make this a constant, not a UI setting yet.

Prune after creating a new commit. Delete oldest commits for that source beyond the limit.

Do not prune across all sources by total count in V1; it makes behavior harder to explain.

## Privacy And Scope

This history is local to the browser profile. It is not synced to the SillyTavern server and not included in SillyTavern exports unless a future export feature is added.

Warn users in docs/UI that browser data clearing can delete history.

Do not store API keys, secrets, or unrelated page data. Store only text source snapshots from this extension.

## Migration And Compatibility

Database version 1 creates stores only.

If a migration fails:
- log the error,
- disable history for the session,
- keep the editor usable.

Never block editing because history storage failed.

## Test Plan

Manual tests:

- Apply a PromptManager prompt edit, reload page, confirm a history commit exists.
- Apply the same content twice, confirm only one commit is created.
- Apply two different edits, confirm newest-first history order.
- Open diff from a history commit, confirm old side is readonly and current side matches editor value.
- Load an old commit, confirm editor becomes dirty but SillyTavern is not saved yet.
- Apply loaded old commit, reload page, confirm restored content persists and a new restore commit exists.
- Edit a readonly/non-selectable source and confirm no history write happens.
- Fill more than 100 commits for one test source, confirm old commits are pruned.
- Disable IndexedDB in browser/devtools if possible, confirm editor still works and shows/logs a history warning.

Automated-ish tests:

- Unit test hash duplicate detection if a test runner exists.
- Unit test IndexedDB wrapper with fake-indexeddb only if adding test tooling is already acceptable.

## Implementation Order

1. Add `HistoryStore.ts` with open, commit, list, get, prune.
2. Add types in `types.ts`.
3. Refactor the sidebar so `etle--tree` lives inside a Sources tab panel.
4. Add History and Settings tab panels. Settings can be empty in V1.
5. Instantiate the store in `EveryTextLineEditor`.
6. On startup, open the store but do not block editor rendering.
7. Hook commit after successful Apply.
8. Add a History button that switches the sidebar to the History tab.
9. Render commit list in the History tab for the selected source.
10. Add diff/load actions.
11. Add pruning.
12. Run build checks.

## Things Not To Do

- Do not use `localStorage` for snapshots.
- Do not save on every keystroke.
- Do not commit before SillyTavern save succeeds.
- Do not overwrite current text when loading history without dirty-state confirmation.
- Do not implement branches in V1.
- Do not implement merge in V1.
- Do not store only patches in V1.
- Do not make history failure block normal editing.
- Do not leave `etle--tree` as a direct sidebar child after adding tabs.
- Do not make History a separate popup while also having a History tab. Use the tab.
- Do not put real settings into the Settings tab until there is a clear setting to expose.
- Do not assume `source.label` is stable. Use `source.id` as identity and store label only for display.
- Do not store object references from SillyTavern in IndexedDB. Store plain serializable records only.

## Build Checklist

After implementation:

```bash
npm run check
npm run build
node --check dist/index.js
node --check dist/EveryTextLineEditor.js
node --check dist/SourceManager.js
```

Also inspect browser console during:

```text
open editor -> edit -> apply -> history -> diff -> load -> apply -> reload
```
