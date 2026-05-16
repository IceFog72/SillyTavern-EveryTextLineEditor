# TypeScript Practices

This extension is loaded by SillyTavern as browser ES modules. TypeScript is only the source/build layer. The browser should never need `node_modules`.

## Good Patterns

- Keep editable source in `src/`.
- Keep SillyTavern's manifest pointed at compiled files in `dist/`.
- Run `npm run check` before `npm run build` when changing types or module boundaries.
- Treat `dist/` as generated output, but verify it when changing import paths because SillyTavern loads it directly.
- Put shared constants in `src/constants.ts`.
- Put shared data shapes in `src/types.ts`.
- Keep SillyTavern source adapters separate from UI code. `SourceManager.ts` should know how to read/write ST objects; `EveryTextLineEditor.ts` should know how to display and edit them.
- Use narrow interfaces for local adapter contracts, such as `TextSource`, instead of passing arbitrary SillyTavern objects through the UI.
- Keep runtime imports relative to the emitted `dist/` layout in mind. If `src/Foo.ts` imports `./Bar.js`, the emitted `dist/Foo.js` will import `./Bar.js`.
- Use local vendor paths for browser runtime dependencies. Current pattern: source imports `./vendor/prism-code-editor/...`, and the build copies npm Prism files to `dist/vendor/prism-code-editor`.
- Keep type-only shim files small when an npm package is copied into `dist/` for runtime. The shim may point TypeScript at `node_modules`, but emitted JS should point at `dist/vendor`.

## Avoid

- Do not import browser runtime code from `node_modules` in emitted extension modules. SillyTavern will load `dist/index.js`; it should not depend on `../node_modules/...`.
- Do not copy vendor files directly into `dist/` root if their names can collide with app files. `prism-code-editor/dist/index.js` can overwrite or confuse our own `dist/index.js` shape. Use `dist/vendor/prism-code-editor`.
- Do not leave stale generated assets in old locations after changing the copy path. They hide broken imports and make debugging weird.
- Do not make `style.css` point to a path that only exists during development. CSS imports must resolve in the installed extension.
- Do not make generic metadata mutate the wrong field. Example: a source adapter for a text value should not expose `metadata.name` if renaming would actually overwrite the edited prompt text.
- Do not remove DOM refs from render code while other methods still write to them. If a header element goes away, move every write to the remaining title/group/action surfaces in the same change.
- Do not replace persistent DOM nodes with `innerHTML` unless you restore the stored refs. The rename input temporarily replaces the title row, so `updateHeader()` must put `currentTitle` and the edit button back.
- Do not add UI states without making them true in behavior. Example: `Sync: Off` must stop wheel, master-scroll, and horizontal sync handlers.
- Do not let status labels drift from actual editor state. If the status says `.md`, the editor should use Markdown grammar.
- Do not use broad `any` as the default escape hatch. Use it only at SillyTavern or third-party boundaries where there are no local declarations.
- Do not change source order or prompt toggles by guessing object shapes. If the source is not safely writable, show it readonly or non-selectable.

## Build Checklist

Run after TS, import, or vendor changes:

```bash
npm run check
npm run build
node --check dist/index.js
node --check dist/EveryTextLineEditor.js
node --check dist/SourceManager.js
```

Also check these paths exist after build:

```bash
test -f dist/vendor/prism-code-editor/index.js
test -f dist/vendor/prism-code-editor/layout.css
test -f dist/vendor/prism-code-editor/themes/vs-code-dark.css
test -f dist/vendor/prism-code-editor/grammars/markdown.js
```

## Refactor Rule

When splitting a working file into modules, move one boundary at a time:

1. Move types/constants first.
2. Move pure helpers next.
3. Move source adapters.
4. Move UI class last.
5. Build and run syntax checks after each step.

This keeps mistakes local. If something breaks, the last moved boundary is probably the reason.
