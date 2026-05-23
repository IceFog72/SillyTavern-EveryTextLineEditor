# CONTEXT.md — EveryTextLineEditor Domain Language

This document defines the shared vocabulary of this project. **Every AI agent must read this before working in the codebase.** It prevents token waste on re-learning jargon and ensures consistent naming across sessions and across different AI tools.

---

## What This Project Is

**EveryTextLineEditor** is a SillyTavern browser extension that provides an in-app text and prompt editor. It embeds either a **Prism** or **Monaco** code editor inside a SillyTavern drawer panel. It lets users view, edit, diff, and restore any text source that SillyTavern exposes (system prompts, world info entries, instruct templates, etc.) without leaving the UI.

---

## Core Domain Terms

| Term | Meaning |
|---|---|
| **TextSource** | The fundamental unit of editable content. Represents one piece of SillyTavern text (a prompt, a WI entry, an instruct field, etc.). Has `id`, `label`, `group`, and `read()`/`write()`/`save()` methods. |
| **SourceManager** | The module (`src/SourceManager.ts`) responsible for discovering, grouping, registering, and managing all active `TextSource` objects. It is the single source of truth for what sources exist. |
| **EveryTextLineEditor** | The root class (`src/EveryTextLineEditor.ts`) that orchestrates the entire UI — the drawer, sidebar, editor panels, and status bar. The global `window.EveryTextLineEditor` instance. |
| **HistoryStore** | The IndexedDB-backed module (`src/HistoryStore.ts`) that stores `HistoryCommit` snapshots of every source edit. Works like a local Git object store. |
| **HistoryCommit** | A snapshot record in IndexedDB. Has `id`, `sourceId`, `content`, `hash`, `parentId`, `reason`, and `meta`. The equivalent of a Git commit object. |
| **HistorySource** | A pointer record in IndexedDB tracking the latest commit for a given source. The equivalent of a Git branch HEAD. |
| **HistoryPanel** | The sidebar UI component (`src/HistoryPanel.ts`) that renders commit history, diffs, and restore controls. |
| **SourcePanel** | The sidebar UI component (`src/SourcePanel.ts`) that renders the tree of available sources and lets users select one to edit. |
| **SettingsPanel** | The sidebar UI component (`src/SettingsPanel.ts`) for extension-level preferences. |
| **Scope** | The context in which a source lives — e.g., the current character card, a global setting, a World Info book. Represented by `scopeId`, `scopeType`, `scopeLabel`. |
| **Group** | A logical grouping of sources shown in the source tree (e.g., "System Prompt", "World Info"). Controlled by `TextSource.group`. |
| **EditorEngine** | Either `'prism'` (lightweight, fast, syntax-only) or `'monaco'` (VS Code engine, full IDE features including spell-check). Switchable at runtime. |
| **DiffMark** | Annotation on an aligned diff line: `''`, `'added'`, `'removed'`, or `'placeholder'`. Used for side-by-side diff rendering. |
| **AlignedDiff** | A computed diff structure containing two aligned arrays of `DiffMark` values plus the old display text. Produced by the diff library. |
| **SidebarTab** | One of `'sources'`, `'history'`, or `'settings'`. Controls which panel is visible in the left sidebar. |
| **BranchManager** | An optional interface on `TextSource` for sources that support named branches (e.g., system prompt presets). Implements `getBranches()`, `getCurrentBranch()`, `switchBranch()`. |
| **TEXT_FIELDS** | A static map in `constants.ts` listing all SillyTavern text fields the extension can expose, grouped by category: `context`, `instruct`, `sysprompt`, `textgen`, `customOpenAi`, `utility`, `formatting`. |
| **STORAGE** | A namespaced map of `localStorage` keys used for persisting UI state (selected source, word wrap, sidebar width, etc.). |
| **DB** | The IndexedDB configuration constant: `DB.NAME` (namespaced db name) and `DB.VERSION` (schema version). |
| **inject()** | The `EveryTextLineEditor` method that mounts the full UI into the SillyTavern DOM. Called once on `onActivate`. |
| **destroy()** | Tears down the entire UI and cleans up event listeners. Called on `onDisable`. |
| **Prism** | `prism-code-editor` — a lightweight editor library used as the default engine. Has its own CSS theming layer and uses `--editor__caret` CSS variable for the cursor color. |
| **Monaco** | `monaco-editor` — the VS Code editor engine, used when full IDE features are needed. Has `monaco-spellchecker` and `typo-js` integration. |
| **MCP** | Model Context Protocol. The server mode used by CodeGraph to expose the codebase symbol graph to AI agents. |

---

## Important Architectural Constraints

1. **No framework.** This is a vanilla TypeScript extension — no React, no Vue, no Svelte. All DOM is imperative.
2. **SillyTavern CSS variables.** Never use hardcoded colors. Always use SillyTavern's CSS custom properties (e.g., `--body-color`, `--accent-color`, `--shadow-color`). Extension-specific variables (e.g., `--editor__caret`) must be defined in `style.css`.
3. **SillyTavern module imports.** SillyTavern runtime modules (`extensions.js`, `characters.js`, etc.) are imported via relative paths (`../../../../`) and are `@ts-ignore`d — they have no local `.d.ts` files.
4. **IndexedDB isolation.** `HistoryStore` manages its own IndexedDB schema. Schema migrations are version-gated via `DB.VERSION`. Never access the history DB directly — always go through `HistoryStore`.
5. **Build pipeline.** TypeScript compiles to `dist/`. Assets (vendor libraries) are copied by `npm run copy-assets`. The entry point for SillyTavern is `index.js` (which re-exports from `dist/`).
6. **ESM only.** `"type": "module"` in `package.json`. All imports must use `.js` extensions (even for `.ts` source files) per the TypeScript ESM convention.
