# SillyTavern-EveryTextLineEditor

An in-SillyTavern prompt and text source editor.

## Development

The editable source lives in `src/index.ts`. SillyTavern loads the compiled ES module from `dist/index.js`.

```bash
npm install
npm run build
```

Useful scripts:

- `npm run build` emits `dist/index.js`, related module files, source maps, and the local Prism vendor copy under `dist/vendor/prism-code-editor`.
- `npm run check` runs TypeScript without emitting files.
- `npm run watch` rebuilds while editing.
