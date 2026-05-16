# Browser Git-Like History Plan

See also: [Cut-Down Git History Spec](./Cut-Down-Git-History-Spec.md). That spec is the stricter source of truth for the ETLE-specific history model: source group plus active profile/preset is the repository scope, one user commit is one `batchId`, and nested rows are source snapshots/files.

## Goal

Add local, browser-side history for Every Text Line Editor sources. The feature should feel like a small Git log for prompt/text sources: each successful Apply can create a recoverable commit, users can inspect old versions, diff against current text, and restore a previous version.

This is not real Git. Do not try to run Git in the browser. Implement a simple append-only history database in IndexedDB.

## Opinion

This is worth doing if it stays small and boring. The extension edits important prompts, and a local history makes experimentation safer. Some SillyTavern source groups are profile-backed, so history must understand source profiles/presets. The dangerous version is trying to build Git-style branches, merges, remotes, or a full VCS. V1 should only do profile-scoped linear commits, diffs, restore, and cleanup.

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
    scopeId: string;         // active profile/preset/scope for the source
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
    scopeId: string;
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
  scopeId
  createdAt
  [sourceId, scopeId, createdAt]

sources: keyPath ['sourceId', 'scopeId']
```

## Source Profiles And Scopes

Some tree groups are not a single global text surface. They are profile-backed:

- Chat Completion Prompts depend on the selected completion preset.
- Power User Context depends on the selected context preset.
- Power User Instruct depends on the selected instruct preset.
- Future adapters may have their own profile/preset/card scope.

Treat these as **source scopes**, not Git branches in the UI.

Internal shape:

```ts
interface SourceScope {
    id: string;              // stable scope id, e.g. preset name/key
    label: string;           // user-facing profile/preset label
    kind: 'preset' | 'profile' | 'character' | 'world' | 'global';
}

interface SourceScopeManager {
    getScopes(): SourceScope[];
    getCurrentScope(): SourceScope;
    switchScope(scopeId: string): Promise<void> | void;
}
```

`TextSource` may expose:

```ts
scope?: SourceScope;
scopeManager?: SourceScopeManager;
```

History identity must be:

```text
source id + scope id
```

Do not mix commits from different profiles/presets under one source timeline. A prompt named `Main Prompt` in preset A and the same prompt in preset B should have separate latest hashes and separate commit histories.

User-facing wording:
- Use "Profile", "Preset", or "Scope" depending on the adapter.
- Do not call it a Git branch unless the UI is clearly describing the history metaphor.
- Do not show fake remote labels like `origin/main`.
- Do not show author/branch badges unless that data is real and useful.

Workflow:

```text
user selects source group
-> UI shows current profile/preset selector when the group supports scopes
-> switching scope warns if editor is dirty
-> sources refresh for that scope
-> history panel shows commits for selected source/scope only
```

Keep the scope selector small, probably in the status bar or History/Sources header. It should not dominate the editor header.

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

Do not move the history pointer backward. History should remain append-only per source/scope.

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
- Current profile/preset/scope when applicable.
- List of commits newest first.
- Timestamp.
- Reason label: Apply, Restore, Manual.
- Small content stats: lines/chars.
- Buttons:
  - Diff
  - Load
  - Delete commit only if needed later, not V1 default.

For V1, avoid a complex graph. Show one linear list per selected source/scope. A commit row may expand into a tree of edited files/sources, but there are no merge lines.

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
    listCommits(sourceId: string, scopeId: string, limit?: number): Promise<HistoryCommit[]>;
    getCommit(id: string): Promise<HistoryCommit | null>;
    pruneSource(sourceId: string, scopeId: string, keepCount: number): Promise<number>;
}
```

`EveryTextLineEditor.ts` should only call:

```ts
await this.historyStore.commit(source, value, 'apply');
const commits = await this.historyStore.listCommits(source.id, source.scope?.id ?? 'global');
```

## Pruning

V1 should have automatic per-source/scope pruning.

Default:

```ts
keep last 100 commits per source/scope
```

Make this a constant, not a UI setting yet.

Prune after creating a new commit. Delete oldest commits for that source/scope beyond the limit.

Do not prune across all sources or scopes by total count in V1; it makes behavior harder to explain.

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
- Switch completion/context/instruct preset, edit the same apparent source, and confirm history is separate per preset.
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
3. Add source scope/profile types and expose scope only from adapters that actually support it.
4. Refactor the sidebar so `etle--tree` lives inside a Sources tab panel.
5. Add History and Settings tab panels. Settings can be empty in V1.
6. Instantiate the store in `EveryTextLineEditor`.
7. On startup, open the store but do not block editor rendering.
8. Hook commit after successful Apply.
9. Add a History button that switches the sidebar to the History tab.
10. Render commit list in the History tab for the selected source/scope.
11. Add diff/load actions.
12. Add pruning.
13. Run build checks.

## Things Not To Do

- Do not use `localStorage` for snapshots.
- Do not save on every keystroke.
- Do not commit before SillyTavern save succeeds.
- Do not overwrite current text when loading history without dirty-state confirmation.
- Do not implement Git branches, merge, remotes, or branch graphs in V1.
- Do not mix different SillyTavern profiles/presets into one history. Use source scopes.
- Do not implement merge in V1.
- Do not store only patches in V1.
- Do not make history failure block normal editing.
- Do not leave `etle--tree` as a direct sidebar child after adding tabs.
- Do not make History a separate popup while also having a History tab. Use the tab.
- Do not put real settings into the Settings tab until there is a clear setting to expose.
- Do not assume `source.label` is stable. Use `source.id` as identity and store label only for display.
- Do not assume `source.id` alone is enough for profile-backed sources. Use `source.id + scope.id`.
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
