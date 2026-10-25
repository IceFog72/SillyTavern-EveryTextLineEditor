# Plan 002: Make onDelete/onClean actually wipe the IndexedDB history

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 2908706..HEAD -- src/index.ts src/HistoryStore.ts`
> Compare the "Current state" excerpts against the live code; on a mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `2908706` + uncommitted settings refactor, 2026-10-25

## Why this matters

When the user deletes or cleans the extension, SillyTavern calls `onDelete` /
`onClean`, which are meant to wipe all local data. The history wipe is a no-op:
it calls `clearAll()` on a brand-new `HistoryStore` that was never opened, and
`clearAll()` returns immediately when no DB connection exists. Every history
snapshot (full prompt, lorebook and character-card text) stays in IndexedDB
while the user believes it was removed.

## Current state

- `src/index.ts:31-36`:

```ts
const cleanLocalData = async () => {
    destroy();
    Object.values(STORAGE).forEach(key => localStorage.removeItem(key));
    clearSettings();
    await new HistoryStore().clearAll();
};
```

- `src/HistoryStore.ts:7-8` — `open()` starts with `if (this.db) return;` and opens `indexedDB.open(DB.NAME, DB.VERSION)`.
- `src/HistoryStore.ts:200-210`:

```ts
    async clearAll(): Promise<void> {
        if (!this.db) return;

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(['commits', 'sources'], 'readwrite');
            transaction.objectStore('commits').clear();
            transaction.objectStore('sources').clear();
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }
```

- `clearAll()` is also used by the in-UI "clear history" setting (`src/EveryTextLineEditor.ts:704`) on the app's already-opened store. That path works and must keep working.
- `CONTEXT.md` rule: "Never access the history DB directly — always go through `HistoryStore`." So the fix belongs in `HistoryStore`/its caller, not a raw `indexedDB.deleteDatabase` in `index.ts`.

## Commands you will need

| Purpose   | Command | Expected on success |
|-----------|---------|---------------------|
| Typecheck | `npm run check` | exit 0 |
| Build     | `npx tsc -p tsconfig.json` | exit 0 (do NOT run `npm run build`) |

## Scope

**In scope**: `src/index.ts`, `src/HistoryStore.ts` (`clearAll` only), matching `dist/` output.

**Out of scope**: the `onupgradeneeded` logic, commit logic, any schema change, `DB.VERSION`.

## Git workflow

- Branch: `advisor/002-clean-wipes-history`
- Commit: `fix: open history store before clearing it on extension clean`
- Do NOT push.

## Steps

### Step 1: Have `clearAll()` open the store itself

In `src/HistoryStore.ts`, replace `if (!this.db) return;` in `clearAll()` with `await this.open();`. Also add `transaction.onabort = () => reject(transaction.error);` next to `onerror` so a quota/abort does not hang the promise.

**Verify**: `npm run check` → exit 0.

### Step 2: Close the connection after the wipe in `cleanLocalData`

In `src/index.ts`, keep the instance so it can be closed:

```ts
const store = new HistoryStore();
await store.clearAll();
store.close();
```

Add a `close(): void` method to `HistoryStore` that calls `this.db?.close(); this.db = null;`. (Closing avoids holding a connection open after the extension is gone.)

**Verify**: `npm run check` → exit 0.

### Step 3: Build and check in SillyTavern

`npx tsc -p tsconfig.json`, reload SillyTavern.

1. Open the editor, make and commit a history snapshot (History tab → Commit).
2. DevTools → Application → IndexedDB → `<NAME>:history` → `commits` has ≥1 row (`<NAME>` = `NAME` in `src/constants.ts`).
3. Console: `await import('/scripts/extensions/third-party/<folder>/dist/index.js').then(m => m.onClean())` where `<folder>` is this extension's directory name (`SillyTavern-EveryTextLineEditor`).
4. Refresh the IndexedDB view → `commits` and `sources` are empty.

**Verify**: step 4 shows zero rows in both stores.

## Done criteria

- [ ] `npm run check` exits 0
- [ ] `grep -n "if (!this.db) return;" src/HistoryStore.ts` no longer matches inside `clearAll`
- [ ] Manual Step 3 shows both stores empty after `onClean()`
- [ ] In-UI "clear history" still empties the stores (repeat step 1-2, use the settings button, check again)
- [ ] `plans/README.md` status row updated

## STOP conditions

- The import path in Step 3 fails because SillyTavern serves third-party extensions from a different URL. Report the URL you found in DevTools → Sources instead of guessing further.
- `open()` hangs (IndexedDB `blocked`) during `onClean` because another tab holds an old-version connection. Report; do not add version handling here.

## Maintenance notes

- `onupgradeneeded` (`HistoryStore.ts:23-28`) deletes and recreates the `sources` store on every version bump. That is a separate latent bug, tracked as "considered, not planned" in `plans/README.md`. Fix it before the next `DB.VERSION` bump.
