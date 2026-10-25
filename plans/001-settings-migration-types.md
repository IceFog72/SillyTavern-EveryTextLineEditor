# Plan 001: Keep settings types stable across the localStorage → extension_settings migration, and keep prompt snapshots out of settings.json

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 2908706..HEAD -- src/settings.ts src/SourceManager.ts src/index.ts src/constants.ts`
> This plan was written against commit `2908706` **plus the uncommitted
> working tree** that introduced `src/settings.ts`. Expect that diff to show
> the settings refactor. Compare every "Current state" excerpt below against the
> live code. On any mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `2908706` + uncommitted settings refactor, 2026-10-25

## Why this matters

The extension is moving its preferences from `localStorage` into SillyTavern's
`extension_settings` (saved to the server's `settings.json`). The new
`getSetting()` migrates any old localStorage value by running `JSON.parse` on it.
Several keys were stored as **raw strings**, not JSON. The worst case is the Prompt
Inspector snapshot: it is usually a JSON array of chat messages, so after migration
`getSetting<string>()` returns an **array/object**, and the inspector source shows
`[object Object]` or breaks. Separately, the refactor now writes two complete
generated prompts into `settings.json` on every generation. That bloats every
settings save and copies whole chats into the server settings file and its backups.
Snapshots belong in browser storage.

## Current state

- `src/settings.ts` — new settings helper (uncommitted). Lines 13-36:

```ts
export function getSetting<T>(key: string, defaultValue: T): T {
    initExtensionSettings();
    
    // 1. Check if key is in extension_settings[NAME]
    if (key in extension_settings[NAME]) {
        return extension_settings[NAME][key] as T;
    }
    
    // 2. Try migrating/reading from localStorage
    const localValue = localStorage.getItem(key);
    if (localValue !== null) {
        try {
            const parsed = JSON.parse(localValue);
            extension_settings[NAME][key] = parsed;
            saveSettingsDebounced();
            return parsed as T;
        } catch {
            extension_settings[NAME][key] = localValue;
            saveSettingsDebounced();
            return localValue as unknown as T;
        }
    }
    
    return defaultValue;
}
```

- `src/SourceManager.ts:93-102` — Prompt Inspector snapshot storage, now via settings:

```ts
const getPromptInspectorCurrent = () => getSetting<string>(STORAGE.promptInspectorCurrent, '');
const getPromptInspectorPrevious = () => getSetting<string>(STORAGE.promptInspectorPrevious, '');
const isPromptInspectorEnabled = () => getSetting<boolean>(STORAGE.promptInspectorEnabled, false);

export const setPromptInspectorSnapshot = (value: string) => {
    const current = getPromptInspectorCurrent();
    if (current && current !== value) setSetting(STORAGE.promptInspectorPrevious, current);
    setSetting(STORAGE.promptInspectorCurrent, value);
    setSetting(STORAGE.promptInspectorUpdatedAt, String(Date.now()));
};
```

  and `src/SourceManager.ts:1162-1163` reads `STORAGE.promptInspectorUpdatedAt` with `getSetting<string>`.

- `src/constants.ts:5-24` — `STORAGE` key map (all keys are `${NAME}:<name>`).
- `src/index.ts:31-36` — `cleanLocalData()` removes every `STORAGE` key from localStorage and calls `clearSettings()`.
- How each key was stored **before** the refactor (from `git show 2908706:src/EveryTextLineEditor.ts` / `SourceManager.ts`):
  - **Raw strings (must NOT be JSON-parsed)**: `selectedSource`, `indentMode`, `scrollSync`, `editorEngine`, `panelWidth` (e.g. `"320px"`), `promptInspectorCurrent`, `promptInspectorPrevious`, `promptInspectorUpdatedAt`, and the un-namespaced key `'promptInspectorFormat'` (`"yaml"`/`"json"`).
  - **JSON (`JSON.stringify` / `'true'`/`'false'`)**: `wordWrap`, `spellCheck`, `monacoMinimap`, `sidebarCollapsed`, `collapsedGroups`, `sourceLanguages`, `trackedSources`, `ignoreFullJsonHistory`, `promptInspectorEnabled`, `autoCollapseSidebar`.
- Convention: settings access goes only through `getSetting`/`setSetting` in `src/settings.ts`. Keep that single owner.

## Commands you will need

| Purpose   | Command | Expected on success |
|-----------|---------|---------------------|
| Typecheck | `npm run check` | exit 0, no output after the npm notice lines |
| Build     | `npx tsc -p tsconfig.json` | exit 0 (updates `dist/*.js`; do NOT run `npm run build` — it recopies vendor assets) |

There is no test suite. Runtime verification is manual in SillyTavern (steps below).

## Scope

**In scope**: `src/settings.ts`, `src/SourceManager.ts` (only lines ~93-102 and ~1162-1163), the compiled `dist/settings.js`, `dist/SourceManager.js` (+ `.map`, `.d.ts`) produced by `tsc`.

**Out of scope**: `src/EveryTextLineEditor.ts` (its `getSetting` calls are fine once the migration is fixed); `style.css`; `dist/vendor/`; any renaming of `STORAGE` keys.

## Git workflow

- Branch: `advisor/001-settings-migration-types`
- Commit style: conventional commits, e.g. `fix: keep raw string settings as strings during migration`.
- Do NOT push.

## Steps

### Step 1: Make the localStorage migration type-aware

In `src/settings.ts`, add a module-level set of keys whose legacy localStorage value is a raw string. Import `STORAGE` from `./constants.js` (the file already imports `NAME` from there):

```ts
const RAW_STRING_KEYS = new Set<string>([
    STORAGE.selectedSource,
    STORAGE.indentMode,
    STORAGE.scrollSync,
    STORAGE.editorEngine,
    STORAGE.panelWidth,
    'promptInspectorFormat',
]);
```

In `getSetting`, when reading `localValue`, return it unparsed (and store it unparsed) if `RAW_STRING_KEYS.has(key)`. Otherwise keep the current `JSON.parse` + fallback. After a successful migration, call `localStorage.removeItem(key)` so the value is migrated once, not re-read forever.

**Verify**: `npm run check` → exit 0.

### Step 2: Move Prompt Inspector snapshots back to localStorage

In `src/SourceManager.ts`, revert only the three snapshot keys to direct localStorage access (as they were at `2908706`):

```ts
const getPromptInspectorCurrent = () => localStorage.getItem(STORAGE.promptInspectorCurrent) ?? '';
const getPromptInspectorPrevious = () => localStorage.getItem(STORAGE.promptInspectorPrevious) ?? '';
```

`setPromptInspectorSnapshot` uses `localStorage.setItem` for `promptInspectorPrevious`, `promptInspectorCurrent`, `promptInspectorUpdatedAt`. Change the `meta:` read at ~1162-1163 to `localStorage.getItem(STORAGE.promptInspectorUpdatedAt)`. Leave `isPromptInspectorEnabled` on `getSetting` (it is a small preference).

Add a one-line comment above the getters: `// Snapshots hold whole prompts; keep them in browser storage, not settings.json.`

`index.ts` `cleanLocalData()` already removes all `STORAGE` keys from localStorage, so cleanup still works.

**Verify**: `grep -n "setSetting(STORAGE.promptInspector\(Current\|Previous\|UpdatedAt\)" src/SourceManager.ts` → no output. `npm run check` → exit 0.

### Step 3: Purge snapshot keys that already leaked into extension_settings

Users (at least the author) who ran the uncommitted build already have the snapshot keys inside `extension_settings[NAME]`. In `src/settings.ts` `initExtensionSettings()`, after ensuring the object exists, delete these keys if present and call `saveSettingsDebounced()` only when something was deleted:

```ts
const LEGACY_SNAPSHOT_KEYS = [STORAGE.promptInspectorCurrent, STORAGE.promptInspectorPrevious, STORAGE.promptInspectorUpdatedAt];
```

**Verify**: `npm run check` → exit 0.

### Step 4: Build and check in SillyTavern

Run `npx tsc -p tsconfig.json`. Then in SillyTavern (reload the page):

1. In DevTools console, before reload, simulate a legacy user: `localStorage.setItem('<NAME>:panelWidth','300px'); localStorage.setItem('promptInspectorFormat','json')` where `<NAME>` is the value of `NAME` in `src/constants.ts`. Also `delete SillyTavern.getContext().extensionSettings['<NAME>']?.['<NAME>:panelWidth']`.
2. Reload. Console: `SillyTavern.getContext().extensionSettings['<NAME>']['<NAME>:panelWidth']` → `"300px"` (a string). `localStorage.getItem('<NAME>:panelWidth')` → `null`.
3. Enable the Prompt Inspector (wand menu), send a chat-completion message. The inspector source shows readable YAML/JSON text, not `[object Object]`.
4. Console: `Object.keys(SillyTavern.getContext().extensionSettings['<NAME>']).filter(k => k.includes('promptInspectorCurrent'))` → `[]`.

**Verify**: all four checks hold.

## Test plan

No automated test harness exists. The manual checks in Step 4 cover: raw-string migration, localStorage removal after migration, inspector rendering, and snapshot keys absent from settings.

## Done criteria

- [ ] `npm run check` exits 0
- [ ] `grep -n "RAW_STRING_KEYS" src/settings.ts` shows the set and its use in `getSetting`
- [ ] `grep -n "setSetting(STORAGE.promptInspector\(Current\|Previous\|UpdatedAt\)" src/` returns nothing
- [ ] Step 4 manual checks pass
- [ ] `git status` shows only in-scope `src/` and matching `dist/` files changed
- [ ] `plans/README.md` status row updated

## STOP conditions

- `src/settings.ts` does not exist or `getSetting` differs from the excerpt (refactor was reverted or changed).
- You find a STORAGE key not listed in either bucket above. Report it with how `git show 2908706` stored it.
- `promptInspectorFormat` turns out to be written by another extension (e.g. the official Prompt Inspector) under the same key. Report; do not rename it here.

## Maintenance notes

- Any new setting stored as a plain string that previously lived in localStorage must be added to `RAW_STRING_KEYS`. New settings that never lived in localStorage need nothing.
- The un-namespaced `'promptInspectorFormat'` key is not in `STORAGE`, so `cleanLocalData()` does not clear it. Follow-up candidate: add it to `STORAGE` with the `${NAME}:` prefix and migrate.
- Reviewer: confirm no large text ends up in `extension_settings`.
