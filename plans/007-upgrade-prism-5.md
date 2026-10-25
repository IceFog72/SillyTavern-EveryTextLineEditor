# Plan 007: Migrate prism-code-editor from 2.4.1 to 5.4.0 and remove dead build output

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 2908706..HEAD -- package.json src/EveryTextLineEditor.ts src/types.ts src/vendor style.css`
> Plans 003 and 006 are expected to have landed (see "Depends on"); their changes
> to these files are expected. Compare the "Current state" excerpts against the
> live code; on any other mismatch, STOP.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/003-listener-lifecycle.md (same scroll-sync code), plans/006-upgrade-monaco-typo.md (adds `rm -rf` to `copy-assets`, so stale Prism files are not left in `dist/vendor`)
- **Category**: migration
- **Planned at**: commit `2908706`, 2026-10-25

## Why this matters

Prism is the default editor engine. The vendored `prism-code-editor` is three
major versions behind (2.4.1, latest 5.4.0). Fixes since then include search
widget scroll bugs in Chrome, cursor colour configuration, and grammar fixes.
Every later upgrade gets harder the longer this waits. The repo also ships
309 unused files (`dist/grammars/`, `dist/themes/`, ~1.5 MB) left over from an
older vendoring layout. Nothing loads them, but every user downloads them.

## Current state

- `package.json`: `"prism-code-editor": "^2.4.1"`. Build copies `node_modules/prism-code-editor/dist/.` into `dist/vendor/prism-code-editor/` (`copy-assets` script). After plan 006 that script starts with `rm -rf dist/vendor/...`.
- Type shims live in `src/vendor/prism-code-editor/` and only re-export from `node_modules` so `tsc` can type the relative imports. Example `src/vendor/prism-code-editor/extensions/commands.d.ts`:
```ts
export * from '../../../../node_modules/prism-code-editor/dist/extensions/commands.js';
```
  Current shim files: `index.d.ts`, `grammars/{markdown,yaml,css,json}.d.ts` (each just `export {};`), `extensions/commands.d.ts`, `extensions/guides.d.ts`, `extensions/matchBrackets/index.d.ts`, `extensions/matchBrackets/highlight.d.ts`, `extensions/search/index.d.ts`.
- `src/EveryTextLineEditor.ts:9-19` imports:
```ts
import { createEditor, languageMap, Prism } from './vendor/prism-code-editor/index.js';
import { defaultCommands } from './vendor/prism-code-editor/extensions/commands.js';
import { indentGuides } from './vendor/prism-code-editor/extensions/guides.js';
import { matchBrackets } from './vendor/prism-code-editor/extensions/matchBrackets/index.js';
import { highlightBracketPairs } from './vendor/prism-code-editor/extensions/matchBrackets/highlight.js';
import { searchWidget } from './vendor/prism-code-editor/extensions/search/index.js';
...
import './vendor/prism-code-editor/grammars/yaml.js';
import './vendor/prism-code-editor/grammars/markdown.js';
import './vendor/prism-code-editor/grammars/json.js';
import './vendor/prism-code-editor/grammars/css.js';
```
- `src/EveryTextLineEditor.ts:30-33`:
```ts
// Disable tag highlighting to prevent misalignment issues
if (Prism.languages.markdown) {
    delete (Prism.languages.markdown as any).tag;
}
```
- `scrollContainer` appears 23 times (on 17 lines) in `src/EveryTextLineEditor.ts` and once in `src/types.ts:116` (`PrismEditorLike.scrollContainer: HTMLElement`). The Monaco adapter fakes it: `scrollContainer: container,` (~line 1274).
- `style.css:1-3`:
```css
@import url('./dist/vendor/prism-code-editor/layout.css');
@import url('./dist/vendor/prism-code-editor/search.css');
@import url('./dist/vendor/prism-code-editor/themes/vs-code-dark.css');
```
  `style.css:1296-1306` sets its own `--editor__caret` variable and `caret-color: var(--editor__caret, currentColor) !important` on the Prism textarea. No other Prism v2 CSS variables (`--editor__bg`, `--widget__*`, `--search__*`, `--bg-guide-indent`) are used in `style.css`.
- Diff marking relies on `.pce-line` elements: `applyDiffMarks` (`querySelectorAll('.pce-line')`, ~2732) and `applyScrollSync` (~1408). `docs/Diff-Alignment-Problem.md` constraint: never change the vertical layout of `.pce-line` rows in the editable (right) editor.
- Dead output: `git ls-files dist/grammars dist/themes | wc -l` → 309. Verified unreferenced: `src/` imports only `./vendor/prism-code-editor/...`, and the vendored `setups/index.js` imports `../themes/index.js`, which resolves inside `dist/vendor/prism-code-editor/`.

### Upstream breaking changes that affect this code (from GitHub release notes)

| Version | Change | Effect here |
|---|---|---|
| 3.0 | Prism moved to `prism-code-editor/prism`; grammars moved from `grammars/*` to `prism/languages/*` | Imports at lines 9, 16-19, 31-33 |
| 3.0 | Dropped CRLF in grammars | None: sources are normalised to `\n` |
| 4.0 | `editor.scrollContainer` renamed `editor.container` | 24 references |
| 4.0 | `indentGuides()` needs `prism-code-editor/guides.css` | add CSS import |
| 4.0 | Active guide class `active` → `active-indent`, search match class `match` → `pce-match` | none in `style.css` today (re-check in Step 6) |
| 4.0 | `matchBrackets(true, "([{", ")]}")` → `matchBrackets(true, "()[]{}")` | none: code calls `matchBrackets(true)` |
| 5.0 | CSS vars `--editor__*`/`--widget__*` renamed `--pce-*`; cursor colour is `--pce-cursor` | only the project's own `--editor__caret` (keeps working through `caret-color !important`) |
| 5.0 | Line numbers via CSS counters instead of `data-line` | none: `::before` colour rules still apply |
| 5.0 | `onUpdate(value, editor)` editor passed as arg, not `this` | none: arrow function ignores `this` |
| 5.0 | Undo history cleared after `setOptions({ value })` | acceptable: switching sources should reset undo |
| 5.x | `defaultCommands` moved to `extensions/commands/index.js` and marked deprecated (still exported) | import path change |

Verified in the 5.4.0 package: `dist/index.js` exports `createEditor`, `languageMap`; `dist/prism/index.js` exports `languages`; `dist/prism/languages/{json,yaml,markdown,css}.js` exist; `markdown` is `clone(languages.html)`, so `languages.markdown.tag` still exists to delete; `dist/themes/vs-code-dark.css`, `dist/search.css`, `dist/guides.css`, `dist/layout.css` exist.

## Commands you will need

| Purpose   | Command | Expected on success |
|-----------|---------|---------------------|
| Install   | `npm install prism-code-editor@^5.4.0` | exit 0 |
| Typecheck | `npm run check` | exit 0 |
| Build     | `npm run build` | exit 0 |
| Compare   | `diff -rq node_modules/prism-code-editor/dist dist/vendor/prism-code-editor` | no output |

## Scope

**In scope**: `package.json`, `package-lock.json`, `src/EveryTextLineEditor.ts`, `src/types.ts`, `src/vendor/prism-code-editor/**`, `style.css` (import lines only, plus class renames if Step 6 finds any), `dist/**` produced by the build, deletion of `dist/grammars/` and `dist/themes/`.

**Out of scope**: replacing `defaultCommands` with `editorCommands(defaultKeymap)` (follow-up), adding `editHistory()` or new extensions, changing the diff algorithm or `.pce-line` layout, Monaco code paths other than the `scrollContainer` → `container` rename in its adapter object, `CONTEXT.md` (mention follow-up only).

## Git workflow

- Branch: `advisor/007-upgrade-prism-5`
- Commits: one for the dependency + code migration (`chore: upgrade prism-code-editor to 5.4.0`), one for dead files (`chore: remove unused dist/grammars and dist/themes`).
- Do NOT push.

## Steps

### Step 1: Install

`npm install prism-code-editor@^5.4.0`

**Verify**: `node -p "require('./node_modules/prism-code-editor/package.json').version"` → `5.4.0`.

### Step 2: Replace the type shims

In `src/vendor/prism-code-editor/`:
- Delete `grammars/` (4 files) and `extensions/commands.d.ts`.
- Create `prism/index.d.ts`: `export * from '../../../../node_modules/prism-code-editor/dist/prism/index.js';`
- Create `prism/languages/{json,yaml,markdown,css}.d.ts`, each containing `export {};`
- Create `extensions/commands/index.d.ts`: `export * from '../../../../../node_modules/prism-code-editor/dist/extensions/commands/index.js';`
- Keep `index.d.ts`, `extensions/guides.d.ts`, `extensions/matchBrackets/*.d.ts`, `extensions/search/index.d.ts` as they are (their targets still exist in 5.4.0).

**Verify**: `ls node_modules/prism-code-editor/dist/prism/index.js node_modules/prism-code-editor/dist/extensions/commands/index.js` → both listed.

### Step 3: Update imports and the markdown tweak

In `src/EveryTextLineEditor.ts`:

```ts
import { createEditor, languageMap } from './vendor/prism-code-editor/index.js';
import { languages } from './vendor/prism-code-editor/prism/index.js';
import { defaultCommands } from './vendor/prism-code-editor/extensions/commands/index.js';
...
import './vendor/prism-code-editor/prism/languages/yaml.js';
import './vendor/prism-code-editor/prism/languages/markdown.js';
import './vendor/prism-code-editor/prism/languages/json.js';
import './vendor/prism-code-editor/prism/languages/css.js';
```

and lines 30-33:

```ts
// Disable tag highlighting to prevent misalignment issues
if (languages.markdown) {
    delete (languages.markdown as any).tag;
}
```

**Verify**: `grep -n "grammars/\|extensions/commands.js\|Prism\." src/EveryTextLineEditor.ts` → no matches.

### Step 4: Rename `scrollContainer` → `container`

- `src/types.ts`: in `PrismEditorLike`, rename the field to `container: HTMLElement;`.
- `src/EveryTextLineEditor.ts`: replace every `scrollContainer` with `container` (23 occurrences on 17 lines, including the Monaco adapter's `scrollContainer: container,` which becomes `container,`).

**Verify**: `grep -rn "scrollContainer" src/` → no output. `npm run check` → exit 0.

### Step 5: Add the guides stylesheet

In `style.css`, after the `layout.css` import, add:

```css
@import url('./dist/vendor/prism-code-editor/guides.css');
```

**Verify**: `grep -c "@import" style.css` → 4.

### Step 6: Check for renamed classes in project CSS and TS

**Verify**: `grep -nE "\.match\b|\.active\b[^-]|next-match|prev-match|tooltip-wrapper|data-line" style.css src/*.ts` → review each hit. Any selector that targets Prism's own elements (inside `.prism-code-editor`) must use the new names: `pce-match`, `active-indent`, `pce-next`, `pce-prev`, `pce-tooltip`. Hits on the project's own `etle--*` elements are unrelated and stay.

### Step 7: Build

`npm run build`.

**Verify**: exit 0. `diff -rq node_modules/prism-code-editor/dist dist/vendor/prism-code-editor` → no output. `ls dist/vendor/prism-code-editor/grammars 2>&1` → "No such file or directory" (stale v2 folder gone because of plan 006's `rm -rf`).

### Step 8: Remove dead build output

`git rm -r -q dist/grammars dist/themes`

**Verify**: `git ls-files dist/grammars dist/themes | wc -l` → 0. `grep -rn "dist/grammars\|dist/themes" src style.css index.js manifest.json` → no output.

### Step 9: Runtime check in SillyTavern

Hard-reload SillyTavern (Ctrl+Shift+R). Engine = Prism.

1. Open the editor, select a Markdown source with `<b>html</b>` in it. Text renders with syntax colours; the `<b>` tag is NOT coloured as a tag (markdown `tag` removal still works). No console errors.
2. Line numbers visible. Indent guides visible on an indented JSON source (switch language to `.json` via the status bar).
3. Ctrl+F opens the search widget; next/previous buttons work; matches highlight.
4. Typing, Tab indent, Alt+↑ line move work (`defaultCommands`).
5. Ctrl+S saves (project's own key handler).
6. Diff (Prism engine): open Diff, type changes → added lines green on the right, removed red on the left, placeholder rows striped. Wheel-scrolling either side keeps both aligned (Sync: Line and Sync: Ratio).
7. Word wrap toggle, readonly source (Prompt Inspector "previous" or any readonly) cannot be edited.
8. Switch Prism → Monaco → Prism: scroll position kept, no errors.
9. Caret is visible on the SillyTavern dark theme.

**Verify**: all nine checks hold.

## Test plan

No automated harness exists. Step 9 is the regression list. Record pass/fail per item in the PR description, with a screenshot of the Prism diff view (item 6).

## Done criteria

- [ ] `package.json` lists `prism-code-editor` `^5.4.0`
- [ ] `npm run check` and `npm run build` exit 0
- [ ] `grep -rn "scrollContainer\|grammars/" src/` → no output
- [ ] `diff -rq node_modules/prism-code-editor/dist dist/vendor/prism-code-editor` → no output
- [ ] `git ls-files dist/grammars dist/themes | wc -l` → 0
- [ ] Step 9 runtime checks pass
- [ ] `plans/README.md` status row updated

## STOP conditions

- `npm run check` reports type errors in Prism option names (`createEditor` options) that are not covered by this plan's table. Report the errors; do not cast them away with `any`.
- Diff highlighting (Step 9 item 6) is misaligned: highlighted rows do not match the changed text. This breaks the documented constraint in `docs/Diff-Alignment-Problem.md`. Report with a screenshot; do not add spacer rows or margins.
- `copy-assets` in `package.json` does NOT start with `rm -rf dist/vendor/` (plan 006 not landed). Do plan 006 Step 1 first or STOP.
- The search widget or line numbers look unstyled. That suggests a missing CSS file. Report which element and which CSS file you believe is missing.

## Maintenance notes

- `defaultCommands` is deprecated upstream. Follow-up: switch to `editorCommands(defaultKeymap)` plus `editHistory()` once someone confirms the keymap matches current behaviour.
- `CONTEXT.md` says Prism "uses `--editor__caret` CSS variable for the cursor colour". After this plan Prism itself uses `--pce-cursor`. The project still sets `--editor__caret` and applies it via `caret-color !important`. Update `CONTEXT.md` or move to `--pce-cursor` in a follow-up.
- Future Prism bumps: re-run the Step 6 grep and read the release notes for class/variable renames.
