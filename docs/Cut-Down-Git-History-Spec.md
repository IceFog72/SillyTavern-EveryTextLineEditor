# Cut-Down Git History Spec

## Purpose

Every Text Line Editor should have a local history workflow that feels like a small, practical subset of Git, but is shaped for SillyTavern prompt sources.

This is not real Git. It is a browser-local safety system for prompt editing:

- show what text sources changed,
- save those changed sources under one commit,
- inspect older commits,
- compare any old file snapshot from any old commit with the current editable editor value for that same source,
- load old text back into the current SillyTavern working state,
- export/import local history later.

The main purpose of history is comparison. A user should be able to answer:

```text
What did this prompt/source look like in that old commit, compared with what it is now?
```

Loading old text is secondary. The primary workflow is old snapshot vs current editor diff.

The UI may borrow Git terms where they are helpful, but it must not pretend to have remotes, merges, authors, or full branch mechanics.

## Mental Model

Map Git concepts to ETLE concepts like this:

| Git concept | ETLE concept |
| --- | --- |
| Repository | One logical SillyTavern namespace/profile/preset |
| Branch | A real SillyTavern profile/preset/scope, only when the adapter really has one |
| File | One `TextSource` |
| Working tree | Current saved SillyTavern source values visible to ETLE |
| Staged changes | Not in V1 |
| Commit | One user-created batch containing snapshots of all changed sources in the current namespace |
| Commit file list | The sources included in that batch |
| Diff | Snapshot text from an old commit vs current editable editor text for the same source |
| Checkout/restore | Load a snapshot or commit back into the current working state, then leave it as uncommitted changes |

Important: ETLE should behave like "git without staging," but only for saved source values. Unsaved editor typing is not part of the history working tree until the user clicks Apply.

## Repository Scope

A repository scope is the smallest logical SillyTavern area that should have its own independent history:

```text
namespace type + namespace id
```

Examples:

- `openai-preset:IceChatCPv34`
- `instruct-template:Alpaca`
- `context-template:Default`
- `sysprompt:Creative Writer`
- `world:Eldoria`
- `persona:current persona id`
- `global:global`

Source groups map into scopes:

- `Chat Completion Prompts`, `Utility Prompts`, and `Formatting Prompts` use the active OpenAI/chat-completion preset scope.
- `Power User Instruct` uses the active instruct template scope.
- `Power User Context` uses the active context template scope.
- `System Prompt` uses the active system prompt preset scope.
- `World/Lorebook` entries use the world/lorebook name scope.
- Persona sources use the persona/profile scope when implemented.
- Sources with no real profile/preset use `global`.

Do not make one flat global history for all prompt sources. Histories must be separate per scope so a user can reason about one preset/profile at a time.

Do not show fake Git remotes like `origin/main`.
Do not show fake author names.
Do not show Git branch labels unless they map to a real ETLE scope. Prefer labels like `Preset`, `Profile`, or `Scope`.

## Commit Shape

The storage may continue to store one snapshot record per source, but the product-level commit is the group of records with the same `batchId`.

Logical commit:

```ts
interface HistoryBatch {
    id: string;                 // batchId
    scopeId: string;            // active repository scope
    scopeType: string;          // openai-preset, instruct-template, sysprompt, world, etc.
    scopeLabel: string;         // user-visible preset/profile/world label
    message: string;
    createdAt: number;
    reason: 'manual' | 'initial' | 'load';
    files: HistorySnapshot[];
}
```

Snapshot record:

```ts
interface HistorySnapshot {
    id: string;
    batchId: string;
    sourceId: string;
    sourceLabel: string;
    sourceGroup: string;
    scopeId: string;
    scopeType: string;
    scopeLabel: string;
    createdAt: number;
    parentId: string | null;    // previous snapshot for this source + scope
    reason: 'manual' | 'initial' | 'load';
    content: string;
    hash: string;
}
```

All snapshots created by one press of `Commit` must share one `batchId`.

If five prompt sources changed, the History UI must show:

```text
Commit message                  just now
  T  <user>                     M
  T  </user>                    M
  T  <NPC>                      M
  T  </NPC>                     M
  T  Main Prompt                M
```

It must not show five separate top-level commits.

## Change Detection

For the active repository scope:

1. Read every writable, non-placeholder source in the active scope.
2. Always use the saved backing value from `source.read()`.
3. Hash current text.
4. Compare with the latest stored hash for `sourceId + scopeId`.
5. Mark changed sources:
   - `A` when no previous snapshot exists.
   - `M` when latest hash differs.
   - `D` is reserved for future source deletion support.

The Changes list is the saved working tree status for the active repository.

External change rule:

- ETLE must not care whether a changed value came from ETLE or from another SillyTavern UI.
- If the current saved source value differs from the latest committed snapshot, show it in Changes.
- If an external edit changes it back to the latest committed snapshot, remove it from Changes.

Unsaved editor buffer rule:

- If the user types in the editor but has not clicked Apply, that source must not appear in Changes.
- If the user clicks Apply and the saved source differs from latest history, that source appears in Changes.
- If the user edits back to the latest historical text and clicks Apply, that source disappears from Changes.
- Commit must snapshot `source.read()`, not `editor.value`.

Readonly sources:

- may appear in Sources,
- may appear as grey placeholder rows if useful,
- must not appear as committable Changes,
- must not be written into history.

## Commit Workflow

V1 uses one button:

```text
Commit
```

Flow:

```text
user edits one or more sources
-> user clicks Apply for sources they want to persist
-> History tab detects changed sources
-> user writes optional message
-> user clicks Commit
-> create one batchId
-> snapshot every changed writable source in the current repository scope
-> skip unchanged duplicates
-> refresh Changes and History
```

Commit must not save unsaved editor text to SillyTavern and must not snapshot unsaved editor text. History is a snapshot of saved ETLE-visible source values. The editor still keeps explicit Apply semantics for real SillyTavern persistence.

Apply must not auto-create commits. Commits happen only when the user clicks Commit.

Commit message rules:

- Message is optional.
- If the user leaves it empty, auto-generate a message from changed source names.
- Example: `Update <user>, </user>, Story String`.
- Keep the auto-generated message short; truncate long file lists with a count suffix.

## History UI

The History tab has two vertical sections, each taking about half of the available height:

```text
Changes
  message textarea
  Commit button
  changed source tree

History
  commit tree
```

Changes:

- show count of changed sources,
- list current changed sources,
- clicking a changed source selects it in the editor,
- show file/source kind, source label, group/scope when needed, and status `A` or `M`.

History:

- show count of logical commits, not raw snapshot records,
- newest commit first,
- top-level row is the commit,
- nested rows are source snapshots in that commit,
- clicking a nested snapshot row should default to comparing that old file with the current saved file,
- each nested row can offer explicit Compare and Load File actions,
- each top-level row can offer Load Commit when all target sources still exist.

Top-level commit title:

- use message when present,
- otherwise use `Manual commit`,
- use `Initial commit` for the first baseline batch,
- use `Load` only for commits created after loading old history into the working state and committing that result.

Do not use raw message values like `1` as the only visible structure if it makes the tree unreadable. The row may show the message, but it still needs file rows nested under it.

## Diff Workflow

Diff is the main History feature.

For a snapshot row:

```text
Compare
```

opens split diff between that historical file and the current editable editor value for the same source:

- left editor = snapshot content,
- right editor = current editor buffer,
- left editor readonly,
- right editor editable if the current source is editable,
- scroll sync works only while diff view is visible.

If the selected history snapshot belongs to the current source, do not discard unsaved edits. Compare the old snapshot against the current editor buffer exactly as it is.

If the snapshot source is not the currently selected source:

1. select that source first,
2. if the current editor is dirty, ask Save / Discard / Cancel before switching sources,
3. load the selected source into the right editor,
4. keep the right editor editable,
5. put snapshot content into the left editor,
6. show diff mode.

Do not diff a snapshot against the wrong current source.

If the snapshot's source no longer exists in the current SillyTavern state:

- still allow viewing the historical content,
- show the right side as missing/unavailable,
- do not pretend the comparison is live,
- disable editing and Load unless the source can be matched again.

Working Changes comparison:

- clicking a changed file in Changes compares latest committed snapshot vs current editor text.
- if there is no previous snapshot, left side should show an empty/new-file state and right side should show current editor text.

Old commit comparison:

- clicking a file in an old commit compares that old snapshot vs current editor text for that source, not vs the commit's parent.
- parent-vs-child historical diff can be a later feature, but it is not the default purpose of the History tab.

The user should never need to load an old version just to compare it with current.

## Load Workflow

For a snapshot row:

```text
Load File
```

means "load this old text back into the current working state."

Flow:

```text
user clicks Load File
-> if current editor is dirty, ask Save / Discard / Cancel
-> select snapshot source if needed
-> set editor text to snapshot content
-> mark dirty
-> user can inspect/edit
-> user clicks Apply to persist
-> source appears in Changes if it differs from latest committed snapshot
```

This is equivalent to Git restore into the working tree, not moving the commit pointer backward.

For a top-level commit row:

```text
Load Commit
```

means "load every still-existing file from this commit into the current working state."

Flow:

```text
user clicks Load Commit
-> if current editor is dirty, ask Save / Discard / Cancel
-> for every file in commit that still has a live writable source:
   -> write snapshot content to that source
   -> call the source save path
-> skip missing/deleted sources and report the skipped count
-> refresh Changes
```

Loading a commit is not rollback. It creates saved working-tree changes that wait for a new Commit.

Avoid the label `Restore` in the UI because users may read it as destructive rollback. Prefer:

- `Load File`
- `Load Commit`
- `Commit Changes`
- `Working Changes`

## Scope/Profile Selector

If the active source group supports profiles/presets/scopes, show a compact selector in the status bar or History/Sources header.

Rules:

- switching scope refreshes sources and history,
- switching scope with dirty editor must ask Save / Discard / Cancel,
- history latest hashes are separate per `sourceId + scopeId`,
- the UI label should match the domain, for example `Preset`, `Profile`, or `World`.

This is the closest ETLE has to branches, but user-facing behavior is still "switch profile/preset", not Git branch management.

## Archived Scopes

History must outlive current SillyTavern presets/profiles.

If a profile, preset, world, or other scope was deleted from SillyTavern:

- keep its history visible,
- mark the scope as archived/read-only,
- allow browsing commits,
- allow expanding files,
- allow viewing old content/diffs when meaningful,
- allow export,
- disable new commits into that scope,
- disable Load File / Load Commit unless the target live sources exist again.

The archived state is computed from current SillyTavern sources. It is not permanent metadata.

If a matching scope appears again later with the same stable scope id, the history becomes active again and committing/loading can work again.

## Storage Rules

Use IndexedDB.

Object stores:

```text
snapshots / commits
sources
```

Required indexes:

```text
sourceId
scopeId
batchId
createdAt
[sourceId, scopeId, createdAt]
[scopeId, createdAt]
```

The current code can keep the object store name `commits`, but the code should treat each record as a source snapshot. The grouped `batchId` is the logical commit.

Keep a latest-source table keyed by:

```text
sourceId + scopeId
```

Do not key latest source state by `sourceId` alone, because prompt presets/profiles can share the same apparent source ids.

Keep scope metadata keyed by:

```text
scopeId
```

Scope metadata should include:

```ts
interface HistoryScope {
    scopeId: string;
    scopeType: string;
    scopeLabel: string;
    lastSeenAt: number;
}
```

Do not store `active` as durable truth. Compute active/archived by comparing stored scopes against currently discovered ETLE scopes.

## Export / Import

Export/import is not required for the first working version, but the storage shape must not block it.

Export should support:

- one active scope,
- one archived scope,
- all ETLE history.

Export file should contain:

- schema version,
- exportedAt timestamp,
- extension name/version when available,
- scopes,
- batches,
- snapshots.

Import should:

- validate schema version,
- avoid overwriting existing history silently,
- preserve archived scopes,
- merge by stable ids where possible,
- assign new ids if imported ids conflict with different content.

Do not export SillyTavern secrets or unrelated settings.

## Pruning

Prune by source and scope:

```text
keep last 100 snapshots per source + scope
```

Do not prune by raw global count in V1.

When deleting old snapshots, accept that an old logical commit may become partial. If that becomes confusing, later add batch-aware pruning:

```text
keep batches where at least one snapshot is within the last 100 per source
```

Do not implement complex garbage collection in V1.

## Edge Cases

No history yet:

- show `Create Initial Commit`,
- initial commit snapshots all writable sources in the active repository scope,
- one top-level commit row should appear after creation.

Duplicate content:

- skip creating a snapshot when content hash matches latest snapshot for that source/scope,
- if every changed source is skipped, do not create an empty commit.

Missing source:

- old history may reference a source that no longer exists,
- show it as a grey historical file row,
- allow Diff only if meaningful,
- Load should be disabled unless the source can be matched again.

Deleted scope/profile/preset:

- old history remains visible as archived history,
- Commit is disabled for that scope,
- Load File and Load Commit are disabled unless matching live writable sources exist again,
- export remains enabled.

Readonly source:

- never commit,
- never load into editor as writable,
- may be shown for inspection only.

IndexedDB failure:

- editor must still work,
- show/log a history warning,
- disable Commit button or show empty History state.

## Things Not To Build

- no remote names,
- no fake `main`,
- no fake `origin/main`,
- no fake author,
- no merge UI,
- no rebase,
- no cherry-pick,
- no staging area in V1,
- no branch graph lines unless they represent real ETLE profile/scope history,
- no automatic commit on every keystroke,
- no automatic commit on Apply,
- no committing failed saves as successful history,
- no mixing histories across presets/profiles.

## Acceptance Tests

1. Create initial commit for Chat Completion Prompts in one preset.
   - Expected: one top-level commit row with many prompt source rows inside.

2. Edit three Chat Completion prompt sources and commit.
   - Expected: one new top-level commit row with exactly those three source rows.

3. Switch to another completion preset.
   - Expected: Changes and History reflect that preset, not the previous one.

4. Switch back to the first preset.
   - Expected: previous commits return.

5. Diff a source snapshot that is not currently selected.
   - Expected: ETLE selects the correct source and diffs snapshot vs that source's current text.

6. Load an old snapshot.
   - Expected: editor becomes dirty, SillyTavern is not saved until Apply.

7. Commit the same unchanged text twice.
   - Expected: no duplicate snapshot and no empty top-level commit.

8. Reload SillyTavern.
   - Expected: history is still present from IndexedDB.

9. Clear/browser-block IndexedDB.
   - Expected: ETLE editor still works, history area gracefully warns or appears empty.

10. Edit a source externally in SillyTavern.
   - Expected: ETLE shows it in Changes when it differs from the latest committed snapshot.

11. Edit a changed source back to its latest committed text and Apply.
   - Expected: the source disappears from Changes.

12. Commit with an empty message.
   - Expected: commit message is auto-generated from changed source names.

13. Delete a preset/profile in SillyTavern after it has history.
   - Expected: old history remains visible as archived/read-only; Commit is disabled.

14. Load a whole old commit.
   - Expected: existing writable files are written to ST, missing files are skipped, and resulting changes wait for a new Commit.
