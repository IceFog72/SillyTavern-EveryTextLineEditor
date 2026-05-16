# Cut-Down Git History Spec

## Purpose

Every Text Line Editor should have a local history workflow that feels like a small, practical subset of Git, but is shaped for SillyTavern prompt sources.

This is not real Git. It is a browser-local safety system for prompt editing:

- show what text sources changed,
- save those changed sources under one commit,
- inspect older commits,
- diff old text against current text,
- load old text back into the editor without auto-saving.

The UI may borrow Git terms where they are helpful, but it must not pretend to have remotes, merges, authors, or full branch mechanics.

## Mental Model

Map Git concepts to ETLE concepts like this:

| Git concept | ETLE concept |
| --- | --- |
| Repository | One source group in one active scope/profile/preset |
| Branch | Active SillyTavern profile/preset/scope, only when the adapter really has one |
| File | One `TextSource` |
| Working tree | Current saved SillyTavern source values visible to ETLE |
| Staged changes | Not in V1 |
| Commit | One user-created batch containing snapshots of all changed sources in the current repository |
| Commit file list | The sources included in that batch |
| Diff | Snapshot text vs current editor/source text |
| Checkout/restore | Load a snapshot into the editor and mark it dirty |

Important: ETLE should behave like "git without staging," but only for saved source values. Unsaved editor typing is not part of the history working tree until the user clicks Apply.

## Repository Scope

A repository scope is:

```text
source group + active scope/profile/preset
```

Examples:

- `Chat Completion Prompts + IceChatCPv34`
- `Power User Instruct + Alpaca`
- `Power User Context + Default`
- `Persona + current persona`
- `World Info + selected world`
- `Global Settings + global`

If a source group has no profile/preset, use `global` as the scope id.

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
    group: string;              // source group
    message: string;
    createdAt: number;
    reason: 'manual' | 'apply' | 'restore';
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
    createdAt: number;
    parentId: string | null;    // previous snapshot for this source + scope
    reason: 'manual' | 'apply' | 'restore';
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

1. Read every writable, non-placeholder source in the active group/scope.
2. Always use the saved backing value from `source.read()`.
3. Hash current text.
4. Compare with the latest stored hash for `sourceId + scopeId`.
5. Mark changed sources:
   - `A` when no previous snapshot exists.
   - `M` when latest hash differs.
   - `D` is reserved for future source deletion support.

The Changes list is the saved working tree status for the active repository.

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

If later we want Apply to auto-create history, that must still use one batch per Apply action and must run only after `source.save()` succeeds.

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
- each nested row can offer Diff and Load actions.

Top-level commit title:

- use message when present,
- otherwise use `Manual commit`,
- use `Initial commit` for the first baseline batch,
- use `Restore` only for restore-generated commits.

Do not use raw message values like `1` as the only visible structure if it makes the tree unreadable. The row may show the message, but it still needs file rows nested under it.

## Diff Workflow

For a snapshot row:

```text
Diff
```

opens split diff:

- left editor = snapshot content,
- right editor = current editor/source content,
- left editor readonly,
- right editor editable if the current source is editable,
- scroll sync works only while diff view is visible.

If the snapshot source is not the currently selected source:

1. select that source first,
2. load current source content into the right editor,
3. put snapshot content into the left editor,
4. show diff mode.

Do not diff a snapshot against the wrong current source.

## Load Workflow

For a snapshot row:

```text
Load
```

means "load this old text into the editor." It does not mean "save immediately."

Flow:

```text
user clicks Load
-> if current editor is dirty, ask Save / Discard / Cancel
-> select snapshot source if needed
-> set editor text to snapshot content
-> mark dirty
-> user can inspect/edit
-> user clicks Apply to persist
```

This is equivalent to Git restore into the working tree, not moving the commit pointer backward.

## Scope/Profile Selector

If the active source group supports profiles/presets/scopes, show a compact selector in the status bar or History/Sources header.

Rules:

- switching scope refreshes sources and history,
- switching scope with dirty editor must ask Save / Discard / Cancel,
- history latest hashes are separate per `sourceId + scopeId`,
- the UI label should match the domain, for example `Preset`, `Profile`, or `World`.

This is the closest ETLE has to branches, but user-facing behavior is still "switch profile/preset", not Git branch management.

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
