# Monaco Editor Integration Plan

## Goal

Add Monaco as a second editor engine alongside the current Prism editor without breaking existing Prism behavior. Prism is only the default selected engine. Both engines must edit the same current source value and use the same save/revert/dirty logic.

Editor switching must be user-controlled:

- Settings tab option: `Editor engine: Prism / Monaco`.
- Bottom status bar cycle button may also switch engines.
- Switching engines must preserve the selected source, unsaved text, dirty state, word wrap, language, scroll position when practical, and focus.
- Switching engines copies the current unsaved value into the newly active engine before the old engine is hidden or destroyed.

## Hard Rules

- Do not replace Prism in one large rewrite.
- Do not create separate Prism text and Monaco text sources. There is one selected source value; the active editor engine is only the UI used to edit it.
- Do not rewrite source adapters, history, or prompt save logic for Monaco. All of them should work through the shared editor adapter.
- Save must always use the real editor text, not display-only diff text.

## Architecture

Create a small editor adapter interface used by `EveryTextLineEditor`:

```ts
interface TextEditorAdapter {
    engine: 'prism' | 'monaco';
    value(): string;
    setValue(value: string): void;
    setReadOnly(readonly: boolean): void;
    setWordWrap(enabled: boolean): void;
    setLanguage(language: string): void;
    focus(): void;
    updateLayout(): void;
    destroy(): void;
    onChange(callback: (value: string) => void): void;
    getScrollTop(): number;
    setScrollTop(value: number): void;
}
```

Keep two adapter implementations:

- `PrismEditorAdapter`: wraps the existing Prism editor setup.
- `MonacoEditorAdapter`: wraps Monaco only after it is loaded.

`EveryTextLineEditor` should talk to adapters instead of direct Prism objects where possible. Migrate gradually: first isolate current editor creation and value/readOnly/wrap/language APIs, then move diff-specific logic.

The extension should keep one canonical in-memory editor value owned by `EveryTextLineEditor`:

- On source select, read the source once and set that value into the active engine.
- On editor change, update dirty state against `selectedSource.read()`.
- On engine switch, read the outgoing engine value and set that exact value into the incoming engine.
- On apply, save the active engine value through the existing selected source adapter.
- On revert, set `selectedSource.read()` into the active engine.

## Monaco Loading

Prefer local vendored Monaco assets if this extension can bundle them. Do not require CDN/network access at runtime.

Implementation options:

1. Bundle Monaco through the TypeScript/build pipeline if SillyTavern extension loading supports it cleanly.
2. Vendor Monaco ESM files into `dist/vendor/monaco-editor/`.
3. Lazy-load Monaco only when the user selects it.

The extension manifest should not depend on Monaco global state. The Monaco adapter should own loading and report failure.

## Diff Direction

Prism diff should remain simple and stable:

- Left readonly pane can use placeholder display rows.
- Right editable pane must stay real text only.
- Right-side marks must be indexed to real unsaved lines only.

Monaco can provide a better diff path:

- Use Monaco DiffEditor for old/new view.
- Original model is readonly saved text.
- Modified model is editable unsaved text.
- Apply/revert still call existing extension functions.
- Word wrap, language, theme, and layout sync through Monaco options.

Investigate `davidKolar175/fast-compare` for diff data generation if Monaco DiffEditor is not enough or if we need fast custom line/word ranges for Prism overlays. Treat it as optional research, not a required dependency.

## UI

Settings tab:

- Add `Editor engine` segmented control or select.
- Show `Prism` and `Monaco`.

Bottom status bar:

- Add/cycle editor engine after language, or merge with language/status controls.
- Text example: `Prism` -> click -> `Monaco`.
- Tooltip: `Cycle editor engine`.

No landing page, no modal required.

## Migration Steps

1. Add `STORAGE.editorEngine`.
2. Add editor adapter interface and Prism adapter using existing Prism code.
3. Replace direct `this.editor` calls in normal edit/save paths with adapter calls.
4. Keep the old readonly Prism diff editor unchanged at first.
5. Add settings/status UI for engine selection. Prism is selected by default.
6. Add Monaco loader and Monaco adapter behind a feature flag.
7. Enable switching for the main editor only, copying the same current unsaved value between engines and preserving dirty state.
8. Add Monaco readonly/diff adapter.
9. Route diff mode:
   - Prism engine uses existing split Prism panes.
   - Monaco engine uses Monaco DiffEditor when available.
10. Test reload, switching, saving, dirty prompts, source changes, mobile sizing.

## Tests

- Extension loads with no Monaco files present.
- Prism remains default and unchanged.
- Prism and Monaco show the same text for the same selected source.
- Switching editor engine preserves unsaved text.
- Dirty state remains correct after switching.
- Apply saves the same text shown in the active editor.
- Revert restores saved source text.
- Source switching unsaved prompt still works.
- Word wrap setting applies to both engines.
- Diff mode with Prism does not highlight shifted right-side lines.
- Monaco DiffEditor can edit the modified side and leaves original side readonly.
- If Monaco load fails, extension falls back to Prism without losing edits.
