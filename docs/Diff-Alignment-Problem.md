# Diff Alignment Problem

## Summary

The split diff view has a hard constraint: the right editor must stay editable. Because ETLE uses `prism-code-editor`, the visible highlighted code is not the editing surface. Editing, caret movement, selection, and keyboard navigation are controlled by a hidden transparent `<textarea>` that must stay geometrically aligned with the visible `.pce-line` layer.

Any solution that inserts fake spacer rows into the visible Prism line layer breaks that contract.

## What Went Wrong

We tried to align added/removed lines by inserting blank spacer elements into the visible editor DOM:

```text
old editor visible lines + spacer rows
new editor visible lines + spacer rows
```

This made the visible text look aligned at first, but the hidden textarea did not know those spacer rows existed.

Result:

- visible highlighted text appeared at one vertical position,
- the hidden textarea text/caret existed at another vertical position,
- mouse selection selected text based on the textarea flow, not the visible spacer-padded flow,
- arrow-key navigation could scroll the focused editor into a position that no longer matched the other editor,
- scroll sync could correct scrollTop, but it could not make the textarea and visible DOM share the same line geometry.

This is why the bug persisted even after syncing scroll on:

- wheel,
- scroll events,
- arrow-key navigation,
- pointer/caret movement,
- `selectionchange`.

Those fixes can keep two scroll containers closer together, but they cannot fix a broken internal editor layout model.

## Important Prism Constraint

In `prism-code-editor`, the editable text model is roughly:

```text
transparent textarea: real editable text, caret, selection, keyboard input
visible code layer: highlighted rendering of the same text
```

For editing to feel correct, these two layers must have the same vertical flow.

This means:

- do not insert visual-only rows into `.pce-line` flow,
- do not add `margin-top` to real `.pce-line` rows,
- do not add spacer nodes before/after `.pce-line` rows,
- do not make one side visually taller than its backing textarea text unless that side is readonly and never used for caret/selection.

Even on the readonly side, spacer rows are risky because scroll sync compares two editor scroll containers. If only one side has fake rows, line numbers and scroll proportions can still become confusing.

## Current Safe Behavior

Current safe behavior should be:

- use `diffLines()` from the `diff` package to compute line changes,
- highlight removed lines on the old side,
- highlight added lines on the new side,
- do not insert spacer rows into the right editable editor,
- only insert visual spacer rows into the left readonly editor when the right side has added lines,
- keep the right editor fully editable in diff mode,
- keep Prism’s visible code and hidden textarea layout identical.

The diff is less visually aligned than a dedicated code-compare widget, but the editor remains trustworthy.

## What Not To Do

Do not reintroduce layout changes on the right editable editor:

```ts
line.style.marginTop = ...
line.before(spacer)
line.after(spacer)
```

Readonly left-side spacer rows are allowed for right-side additions because the left editor is not used for editing. Do not add those spacers to the right editor.

Do not use CSS-only tricks that affect right-side visible `.pce-line` vertical layout without applying the same layout to the textarea.

Do not disable the textarea in diff mode just to make visual selection work. That makes the right editor non-editable, which violates the main requirement.

Do not attempt to fix this only with scroll sync. The bug is not just scroll position; it is a mismatch between visible text geometry and textarea geometry.

## Better Future Solutions

### Option 1: Dedicated Diff Viewer Mode

Use a readonly diff viewer for aligned comparison.

Flow:

```text
Diff button opens readonly aligned compare view
Edit button/close diff returns to normal editable editor
```

Pros:

- can add spacer rows freely,
- can select visible text accurately,
- simpler alignment,
- no hidden textarea mismatch.

Cons:

- right side is not editable while in aligned diff viewer,
- user must leave diff mode to edit.

### Option 2: Two-Model Editable Diff

Build a true editable diff model where the right textarea value also includes placeholder spacer lines, then map edits back to the real source text.

Pros:

- editable aligned diff is possible.

Cons:

- complex and fragile,
- cursor positions must be translated,
- search/replace, selection, undo/redo, line numbers, and save must all understand virtual spacer lines,
- easy to corrupt user text if mapping is wrong.

This is not recommended for V1.

### Option 3: Use A Real Code Editor With Diff Support

Use an editor designed for diff views, such as Monaco’s diff editor or CodeMirror merge/diff extensions.

Pros:

- proper diff alignment,
- mature caret/selection behavior,
- better long-term editor foundation.

Cons:

- larger dependency,
- styling and integration work,
- may be heavier than this extension needs.

### Option 4: Keep Prism For Editing, Add Separate Lightweight Diff Preview

Keep Prism as the actual editor. Add a separate readonly HTML diff preview above, below, or in a modal/panel.

Pros:

- avoids touching the editable Prism layout,
- can align lines in the preview,
- keeps current editor stable.

Cons:

- not a true editable side-by-side diff,
- more UI surface.

This is probably the best medium-term compromise.

## Recommendation

For now:

```text
Prism editor = editing surface
Diff highlighting = line colors only
No spacer alignment inside Prism
```

If aligned side-by-side diff is important later, implement it as a separate readonly diff preview or replace the editor foundation with a diff-capable editor.
