# Every Text Line Editor Build Plan

## Summary
Build `SillyTavern-EveryTextLineEditor` as an in-SillyTavern prompt explorer/editor. The first screen should be a working editor UI, not a landing page: a left tree of editable SillyTavern prompt/text sources and a right editor pane using the same Prism editor approach already proven in `SillyTavern-QuickRepliesDrawer`.

The first implementation should also write this plan into `docs/Plan.md`.

## Key Changes
- Update `manifest.json` so the extension loads an `index.js` entrypoint and `style.css`.
- Add an extension shell that:
  - Detects whether the extension is disabled via `extension_settings.disabledExtensions`.
  - Injects a toolbar/settings entry for opening the editor.
  - Opens a docked or popup editor panel inside SillyTavern.
- Reuse/copy QuickRepliesDrawer's bundled `prism-code-editor` assets and editor setup patterns for:
  - Line numbers.
  - Search-capable code editing.
  - Word wrap toggle.
  - STscript-friendly text editing where useful.
- Implement a left tree with v1 source groups:
  - Chat Completion PromptManager prompts from `promptManager.serviceSettings.prompts`.
  - Active PromptManager prompt order/status where available through `promptManager.activeCharacter` and `getPromptOrderForCharacter`.
  - Power-user context fields such as story string, example separator, and chat start from `power_user.context`.
  - Power-user instruct fields from `power_user.instruct`.
  - System/persona prompt-facing fields available from frontend state, including `power_user.sysprompt` and persona description data where safely writable.
- Implement explicit apply behavior:
  - Selecting a tree node loads its current text into the editor.
  - Editing marks the node dirty.
  - `Apply` writes back to the exact source object and calls the appropriate save function.
  - `Revert` reloads the current source value without saving.
- Persist only small extension UI preferences in `extension_settings` or `accountStorage`:
  - Last selected source.
  - Word wrap.
  - Panel size/layout.
  - Tree collapsed state.

## Interfaces
- Add a local source adapter shape used internally by the extension:
  - `id`: stable unique id.
  - `label`: display name in the tree.
  - `group`: tree group label.
  - `read()`: returns current text.
  - `write(value)`: updates the backing SillyTavern object.
  - `save()`: persists using SillyTavern's existing save path.
  - `readonly`: true for discovered text that should be inspected but not edited.
- For PromptManager prompts, update prompt `content`, then call `promptManager.saveServiceSettings()` and refresh `promptManager.render(false)` when available.
- For power-user fields, update the relevant `power_user` path, mirror any visible DOM field when needed, then call `saveSettingsDebounced()`.

## Test Plan
- Load SillyTavern with the extension enabled and confirm no console errors on startup.
- Open the editor and confirm the tree populates when Chat Completion PromptManager exists.
- Edit a PromptManager prompt, click `Apply`, reload SillyTavern, and confirm the prompt persists.
- Edit a power-user context/instruct field, click `Apply`, reload, and confirm persistence.
- Confirm `Revert` restores unsaved text.
- Confirm dirty state is visible and changing tree selection warns or prevents accidental loss.
- Confirm disabled/missing sources are hidden or shown readonly without breaking the panel.
- Confirm the UI fits desktop and mobile widths without overlapping text or controls.

## Assumptions
- V1 targets core SillyTavern prompt sources, not every text-like object in the app.
- Character cards, lorebooks/world info, regex scripts, quick replies, and third-party extension prompts are future source adapters.
- The editor should use explicit `Apply`, not live sync.
- QuickRepliesDrawer's Prism editor bundle may be reused locally in this extension.
- The active initial target is the current message/prompt context, but the product direction is a broader tree-based prompt editor.
