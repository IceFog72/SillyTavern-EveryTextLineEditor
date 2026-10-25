# Plan 003: Stop leaking document listeners and stacking scroll-sync listeners

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 2908706..HEAD -- src/EveryTextLineEditor.ts`
> Compare the "Current state" excerpts against the live code; on a mismatch, STOP.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none (must land BEFORE plan 007, which edits the same scroll-sync code)
- **Category**: bug
- **Planned at**: commit `2908706` + uncommitted working tree, 2026-10-25

## Why this matters

Three leaks in the main editor class (`EveryTextLineEditor`):

1. `destroy()` (called on extension disable) never removes the capture-phase
   `document` click listener. While a draft is dirty that listener calls
   `preventDefault()` + `stopImmediatePropagation()` on clicks outside the editor,
   so a disabled extension can keep swallowing clicks across SillyTavern.
2. Every Prism/Monaco engine switch calls `bindDiffScrollSync()` again, which adds
   another scroll listener on the shared master scrollbar and another wheel/scroll
   pair on the left (old) diff editor. After N switches, one wheel tick scrolls the
   diff N+1 times as far.
3. Each Prism editor creation adds a `document` `selectionchange` listener that is
   never removed. If `destroy()` runs in fullscreen ("popup") mode, the panel and its
   backdrop are left on `document.body`.

## Current state

File: `src/EveryTextLineEditor.ts` (class `EveryTextLineEditor`, ~3000 lines, vanilla DOM).

- Line 336 (end of `renderDrawer()`):
```ts
        document.addEventListener('click', (event) => this.handleDocumentClick(event), { capture: true });
```
- Lines 272-296, `destroy()`:
```ts
    destroy() {
        this.stopSourceWatcher();
        this.stopSourceEventListeners();
        ...
        this.closeMonacoDiff({ syncValue: true });
        this.disposeMonacoSpellcheckers();
        this.panelResizeObserver?.disconnect();
        this.panelResizeObserver = null;
        this.editor?.dispose?.();
        this.oldEditor?.dispose?.();
        this.dom.drawer?.remove();
        this.dom.wandButton?.remove();
        ...
    }
```
- Lines 1109-1132, `setEditorEngine()` — creates the next editor, disposes the old one, then calls `this.bindDiffScrollSync();` (line 1127).
- Lines 1363-1394, `bindDiffScrollSync()`:
```ts
    bindDiffScrollSync() {
        if (!this.editor || !this.oldEditor || !this.dom.masterScrollbar) return;
        const syncFromMaster = () => { ... };
        const handleWheel = (event: WheelEvent) => { ... };
        this.dom.masterScrollbar.addEventListener('scroll', syncFromMaster, { passive: true });
        this.editor.scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
        this.oldEditor.scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
        const syncFromEditor = (from, to) => { ... };
        this.editor.scrollContainer.addEventListener('scroll', () => syncFromEditor(this.editor.scrollContainer, this.oldEditor.scrollContainer), { passive: true });
        this.oldEditor.scrollContainer.addEventListener('scroll', () => syncFromEditor(this.oldEditor.scrollContainer, this.editor.scrollContainer), { passive: true });
    }
```
  It is called from `createCodeEditor` (1151, 1157), `createReadonlyEditor` (1360) and `setEditorEngine` (1127).
- Lines 1162-1216, `createPrismCodeEditor()` — ends with:
```ts
        document.addEventListener('selectionchange', () => {
            if (document.activeElement === editor.textarea) syncCaret();
        });

        return editor;
```
  The Prism editor object has no `dispose`; `setEditorEngine` calls `this.editor?.dispose?.()` then `this.editor?.scrollContainer?.remove()`. The Monaco adapter (`createMonacoEditor`, 1218-1320) already returns a `dispose()`.
- Lines 779-830, `toggleFullscreen()` — entering popup mode moves `this.dom.root` to `document.body`, appends `this.dom.backdrop`, and adds `this._popupEscHandler` on `document`. Calling it again (when `root.classList.contains('etle--popup')`) undoes all three.
- Type `PrismEditorLike` in `src/types.ts:113-124` already has optional `dispose?(): void`.
- Convention: state lives as typed fields declared at the top of the class (lines ~180-220) and initialised in the constructor. Follow that for new fields.

## Commands you will need

| Purpose   | Command | Expected on success |
|-----------|---------|---------------------|
| Typecheck | `npm run check` | exit 0 |
| Build     | `npx tsc -p tsconfig.json` | exit 0 (do NOT run `npm run build`) |

## Scope

**In scope**: `src/EveryTextLineEditor.ts`, matching `dist/EveryTextLineEditor.*`.

**Out of scope**: `src/SourceManager.ts`, Monaco spellchecker lifecycle, the language-menu one-shot listener (already `{ once: true }`), the MutationObserver in `observeMonacoSpellCheck` (it observes a node that is removed with the editor). Do not rename `scrollContainer` (plan 007 does that).

## Git workflow

- Branch: `advisor/003-listener-lifecycle`
- Commit: `fix: release document and scroll-sync listeners on teardown`
- Do NOT push.

## Steps

### Step 1: One lifecycle AbortController for document-level listeners

Add field `lifecycle: AbortController;` and initialise `this.lifecycle = new AbortController();` in the constructor. Change line 336 to pass `signal: this.lifecycle.signal` alongside `capture: true`. In `destroy()`, call `this.lifecycle.abort();` first.

**Verify**: `npm run check` → exit 0.

### Step 2: Rebind scroll sync instead of stacking it

Add field `diffScrollBindings: AbortController | null;` (init `null`). At the top of `bindDiffScrollSync()`, after the guard:

```ts
this.diffScrollBindings?.abort();
this.diffScrollBindings = new AbortController();
const { signal } = this.diffScrollBindings;
```

Add `signal` to the options object of all six `addEventListener` calls in that method. In `destroy()`, call `this.diffScrollBindings?.abort();`.

**Verify**: `grep -c "signal" src/EveryTextLineEditor.ts` increased by at least 8 vs. before. `npm run check` → exit 0.

### Step 3: Give the Prism adapter a dispose that drops its document listener

In `createPrismCodeEditor`, create `const listeners = new AbortController();`, pass `{ signal: listeners.signal }` to the `selectionchange` listener, and before `return editor;` attach:

```ts
(editor as PrismEditorLike).dispose = () => listeners.abort();
```

(Element-level listeners on `editor.textarea` die with the element; only the `document` one needs this.)

**Verify**: `npm run check` → exit 0.

### Step 4: Leave popup mode and clear dirty state in destroy()

In `destroy()`, before `this.dom.drawer?.remove()`:

```ts
if (this.dom.root?.classList.contains('etle--popup')) this.toggleFullscreen();
this.dirty = false;
```

`toggleFullscreen()` returns the root into the drawer, removes the backdrop, and removes the Esc handler, so `this.dom.drawer.remove()` then removes everything.

**Verify**: `npm run check` → exit 0.

### Step 5: Build and check in SillyTavern

`npx tsc -p tsconfig.json`, reload SillyTavern, open the editor, pick a source.

1. Wheel test: open Diff, set Sync to Line. Switch engine Prism→Monaco→Prism three times (status bar engine control). Close and reopen Diff, scroll one wheel tick over the left pane. The left and right panes move together by one normal step (not 4×).
2. Teardown test: type in the editor (draft dirty), press the fullscreen button, then disable the extension in Extensions → Manage extensions. Expected: `document.getElementById('etle--backdrop')` → `null`, `document.querySelector('.etle--popup')` → `null`, and clicking elsewhere in SillyTavern opens no "Unsaved changes" popup.
3. Chrome DevTools console only: with the extension enabled note `getEventListeners(document).click.length` = A. Disable the extension, read it again = B. Expected: B = A − 1.

**Verify**: all three checks hold.

## Done criteria

- [ ] `npm run check` exits 0
- [ ] `grep -n "diffScrollBindings" src/EveryTextLineEditor.ts` shows field, abort+new in `bindDiffScrollSync`, abort in `destroy`
- [ ] `grep -n "lifecycle.signal" src/EveryTextLineEditor.ts` matches the document click listener
- [ ] Step 5 manual checks pass
- [ ] `git status` shows only `src/EveryTextLineEditor.ts` and `dist/EveryTextLineEditor.*` changed
- [ ] `plans/README.md` status row updated

## STOP conditions

- `toggleFullscreen` no longer restores the root/backdrop as described (excerpt mismatch).
- Assigning `dispose` onto the Prism editor object fails typecheck because the object is frozen/readonly in the vendored types. Report the error text.
- After Step 2, Diff scroll sync stops working entirely. Most likely the abort happens after rebinding; report rather than restructure.

## Maintenance notes

- Any future `document`/`window` listener added by this class should take `signal: this.lifecycle.signal`.
- Plan 007 renames `scrollContainer` → `container` inside `bindDiffScrollSync`; it assumes this plan's `signal` wiring is present.
- `startResize()` adds window listeners per drag and removes them on pointerup. That is correct and out of scope.
