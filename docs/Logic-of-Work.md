# Every Text Line Editor: Logic of Work

This document describes the core operational logic of the Every Text Line Editor (ETLE) extension, including its handling of sources, branches, history, and state management.

## 1. Source Discovery & Mapping (`SourceManager.ts`)

ETLE acts as a unified interface for multiple disparate SillyTavern data sources.

### Discovery Logic
- **Iterative Scanning:** On every load or refresh, `getSources()` scans global ST objects (`promptManager`, `oai_settings`, `power_user`, `world_names`).
- **Object Field Mapping:** Individual text properties in ST objects are converted into a standardized `TextSource` interface.
- **Group Aggregation:** Sources are grouped (e.g., "Chat Completion Prompts", "Power User Context") to organize the tree UI.

### Profiles as Branches
- **Mapping:** Specific groups (Context, Instruct, Chat Completion) are mapped to ST's Preset/Profile systems.
- **Dynamic Identity:** If a source belongs to a Preset-governed group, its `sourceId` is dynamically suffixed with the active branch name (e.g., `@Default`).
- **Branch Isolation:** This ensures that history and settings for "Preset A" never bleed into "Preset B".

## 2. History & Persistence (`HistoryStore.ts`)

History is implemented as a local, browser-side append-only log using IndexedDB.

### Storage Strategy
- **Full Snapshots:** Each "commit" stores the full text of the source.
- **Deduplication:** A SHA-256 hash of the content is computed before every commit. If the hash matches the `latestHash` for that source, the commit is skipped to save space.
- **Metadata:** Commits capture not just text, but also labels, groups, timestamps, and optional user-provided commit messages.

### Pruning Logic
- **Per-Source Limit:** To prevent IndexedDB from growing indefinitely, ETLE keeps a maximum of 100 commits per unique source ID.
- **Trigger:** Pruning runs automatically after every successful commit.

## 3. UI State & Lifecycle (`EveryTextLineEditor.ts`)

The main editor class manages the complex interaction between the tree, the editor, and the history panel.

### The "Dirty" State
- **Change Detection:** The editor is marked "dirty" when the current text differs from the `selectedSource.read()` value.
- **Unsaved Changes Lock:** When dirty, a SillyTavern unsaved-change lock is acquired to prevent the user from accidentally navigating away or closing the browser.
- **Confirmation Flow:** Switching sources or branches while dirty triggers a "Save/Discard/Cancel" modal.

### The History Flow
1. **Category-Level Navigation:** The History tab dropdown lists **Categories** (Groups/Branches). Selecting a category allows you to see history and pending changes for all files in that group simultaneously.
2. **Category-Wide Baseline:** If a category has no history, the user can "Create Initial Commit". This performs a **Batch Snapshot** of every writable source in that category at once.
3. **Decoupled Commits:** Clicking **Apply** in the editor only saves the text to SillyTavern's memory. It does **not** create a history commit.
4. **Manual Multi-File Commits:** The History tab monitors all files in the selected category. Any file that differs from its latest history snapshot appears in the **"Changes"** section. Clicking **Commit** snapshots all currently modified files in that category with a single message.
5. **Restore:** Loading a history commit puts the old text into the editor and marks it dirty. It does **not** overwrite the ST source until the user clicks "Apply".

## 4. UI Patterns & Styling (`style.css`)

### Sidebar Tabs
- Uses a flex-based layout with a "PTMT-style" aesthetic.
- Active tabs feature a top-border radius and connect visually to the content panel by overriding the container's bottom border.

### Git-Like Interface
- The History tab mimics a Git sidebar (like VS Code).
- **Changes Section:** Shows all pending edits across the entire category with a commit input.
- **History Section:** Uses an expandable tree (`details/summary`) to show the log. Each commit can contain multiple files if they were committed together.
- **Navigator:** An inline dropdown allows switching between different **Categories** directly within the History tab.
