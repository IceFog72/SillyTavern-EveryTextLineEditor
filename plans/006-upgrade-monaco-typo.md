# Plan 006: Upgrade Monaco to 0.57.0 and typo-js to 1.4.0, and make vendor copies clean

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 2908706..HEAD -- package.json package-lock.json src/EveryTextLineEditor.ts`
> Then `node -p "require('./node_modules/monaco-editor/package.json').version"` → `0.55.1`. If it is already ≥ 0.57.0, mark this plan REJECTED (done independently).

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: migration
- **Planned at**: commit `2908706`, 2026-10-25

## Why this matters

The extension ships vendored copies of its editor libraries in `dist/vendor/`
(SillyTavern loads extensions straight from git, so `dist/` is committed).
Monaco is two minor versions behind (0.55.1 → 0.57.0, editor-core fixes and a
DOMPurify bump to 3.4.15). typo-js is 1.3.2 → 1.4.0. Both are drop-in for how
this code uses them. Separately, the `copy-assets` script copies over the
existing vendor folders without deleting first. Monaco's `min/` build uses
content-hashed file names, so old chunks would pile up in `dist/` and in git.

## Current state

- `package.json` dependencies: `"monaco-editor": "^0.55.1"`, `"typo-js": "^1.3.2"`, `"monaco-spellchecker": "^0.6.0"` (already latest; has no `peerDependencies` on Monaco).
- `package.json` script (one line):
```
"copy-assets": "mkdir -p dist/vendor/prism-code-editor dist/vendor/diff dist/vendor/monaco-editor/min dist/vendor/monaco-spellchecker dist/vendor/typo-js/dictionaries/en_US && cp -R node_modules/prism-code-editor/dist/. dist/vendor/prism-code-editor/ && cp -R node_modules/diff/libesm/. dist/vendor/diff/ && cp -R node_modules/monaco-editor/min/. dist/vendor/monaco-editor/min/ && cp node_modules/monaco-spellchecker/lib/spellchecker.es.js dist/vendor/monaco-spellchecker/spellchecker.es.js && cp node_modules/typo-js/typo.js dist/vendor/typo-js/typo.js && cp node_modules/typo-js/dictionaries/en_US/en_US.aff dist/vendor/typo-js/dictionaries/en_US/en_US.aff && cp node_modules/typo-js/dictionaries/en_US/en_US.dic dist/vendor/typo-js/dictionaries/en_US/en_US.dic"
```
- Monaco is loaded at runtime through its **AMD** build (`src/EveryTextLineEditor.ts:102-131`): it injects `vendor/monaco-editor/min/vs/loader.js`, then `require(['vs/editor/editor.main'])`, and reads `globalThis.monaco`. Verified: `monaco-editor@0.57.0` still ships `min/vs/loader.js` and `min/vs/editor/editor.main.js`.
- Monaco breaking changes since 0.55 (from the official CHANGELOG): 0.56 reorganised **ESM** entry points (not used here), renamed `IOverlayWidgetPosition.stackOridinal` → `stackOrdinal`, removed `IMirrorModel`/`IWorkerContext`. `grep -n "stackOridinal\|IMirrorModel\|IWorkerContext" src/*.ts` → no matches today.
- typo-js is loaded as a classic script (`src/EveryTextLineEditor.ts:136-149`) and read from `globalThis.Typo`. Verified: 1.4.0's `typo.js` still declares a top-level `var Typo`, and its `en_US.dic` is byte-identical to 1.3.2.
- Root `.gitignore` ignores `/node_modules` but not `dist/`; `dist/vendor/monaco-editor` has 121 tracked files today.
- Repo commit style: conventional commits (`feat:`, `refactor:`, `fix:`), see `git log --oneline -5`.

## Commands you will need

| Purpose   | Command | Expected on success |
|-----------|---------|---------------------|
| Install   | `npm install monaco-editor@^0.57.0 typo-js@^1.4.0` | exit 0; `package.json` + `package-lock.json` updated |
| Typecheck | `npm run check` | exit 0 |
| Build     | `npm run build` | exit 0 (compiles TS and copies vendor assets) |
| Compare   | `diff -rq node_modules/monaco-editor/min dist/vendor/monaco-editor/min` | no output |

## Scope

**In scope**: `package.json`, `package-lock.json`, `dist/vendor/monaco-editor/**`, `dist/vendor/typo-js/**`, and `dist/*.js` changes that `npm run build` produces.

**Out of scope**: `prism-code-editor` (plan 007 — do NOT bump it here, even though `npm outdated` lists it), `diff`, `typescript` (7.x is a different compiler, separate decision), any switch from the AMD build to ESM, `src/` code changes.

## Git workflow

- Branch: `advisor/006-upgrade-monaco-typo`
- Commit: `chore: upgrade monaco-editor to 0.57.0 and typo-js to 1.4.0`
- Do NOT push.

## Steps

### Step 1: Make `copy-assets` delete stale vendor folders first

In `package.json`, prefix the `copy-assets` script with:

```
rm -rf dist/vendor/monaco-editor dist/vendor/typo-js dist/vendor/prism-code-editor dist/vendor/diff dist/vendor/monaco-spellchecker && 
```

(keep the existing `mkdir -p … && cp …` chain after it unchanged).

**Verify**: `node -e "const s=require('./package.json').scripts['copy-assets']; process.exit(s.startsWith('rm -rf dist/vendor/') ? 0 : 1)"` → exit 0.

### Step 2: Install the new versions

Run `npm install monaco-editor@^0.57.0 typo-js@^1.4.0`.

**Verify**: `node -p "require('./node_modules/monaco-editor/package.json').version + ' ' + require('./node_modules/typo-js/package.json').version"` → `0.57.0 1.4.0`.

### Step 3: Typecheck and build

`npm run check` then `npm run build`.

**Verify**:
- both exit 0
- `diff -rq node_modules/monaco-editor/min dist/vendor/monaco-editor/min` → no output
- `cmp node_modules/typo-js/typo.js dist/vendor/typo-js/typo.js` → no output
- `git status --short dist/vendor/prism-code-editor dist/vendor/diff` → no output (re-copied identical files; if not empty, STOP)

### Step 4: Runtime check in SillyTavern

Reload SillyTavern (hard reload, Ctrl+Shift+R).

1. Open the editor, select any source, switch engine to Monaco (status bar). Editor renders, typing works, no console errors from `vs/`.
2. Settings → enable Spell check. Type `teh wrold` → both words get spellcheck squiggles. Right-click / quick-fix offers suggestions.
3. Open Diff with Monaco → side-by-side diff renders; edits on the right update the diff.
4. Switch back to Prism → works as before.
5. DevTools → Network: `loader.js` and `editor.main.js` load from `.../dist/vendor/monaco-editor/min/vs/` with status 200. No 404s.

**Verify**: all five checks hold.

## Done criteria

- [ ] `package.json` lists `monaco-editor` `^0.57.0` and `typo-js` `^1.4.0`
- [ ] `npm run check` and `npm run build` exit 0
- [ ] `diff -rq node_modules/monaco-editor/min dist/vendor/monaco-editor/min` prints nothing
- [ ] Step 4 runtime checks pass
- [ ] `git status` shows changes only in `package.json`, `package-lock.json`, `dist/vendor/monaco-editor/`, `dist/vendor/typo-js/`, and possibly `dist/*.js(.map)` with no semantic change
- [ ] `plans/README.md` status row updated

## STOP conditions

- `min/vs/loader.js` is missing after install (Monaco dropped the AMD build). Report; the fix is an ESM migration, which is a separate design decision.
- Monaco loads but `globalThis.monaco` is undefined after `require(['vs/editor/editor.main'])`. Report the console output.
- Step 3's `git status` on prism/diff vendor folders is non-empty (the `rm -rf` exposed files that were in git but not in `node_modules`). Report the file list; do not commit deletions of them in this plan.

## Maintenance notes

- Monaco's AMD build has been officially unsupported since 0.53 ("will still be shipped for a while"). Each future bump must re-check that `min/vs/loader.js` exists. The long-term path is the ESM build, listed as a direction item in `plans/README.md`.
- `npm run build` now wipes `dist/vendor/*`. Never hand-edit files under `dist/vendor/`.
- `monaco-spellchecker@0.6.0` has no Monaco peer range. If spellcheck breaks after a future Monaco bump, check its `getSpellchecker(monaco, editor, ...)` API first.
