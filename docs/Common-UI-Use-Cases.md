# Common UI and Logic Use Cases

This document tracks common user flows, UI states, and the shared logic required to support them in the Every Text Line Editor.

## 1. Initializing History (The "No History Yet" State)

**Scenario:** A user installs the extension or adds a new prompt source. They open the History tab, but there are no commits yet. To use features like diffing and restoring effectively, a baseline commit is needed.

**UI State (`HistoryPanel`):**
- When `listCommits` returns an empty array, display an empty state message: *"No history for this source yet."*
- Provide a clear call-to-action or automatic mechanism to establish the baseline.

**Logic & Implementation Options ("Commit Everything"):**

To start using history, we need to capture the current state as a baseline. There are a few ways we could implement "committing everything":

1. **Global "Commit All Initial States" (Best for existing users):**
   - **Trigger:** A button in the Settings tab or a global command (e.g., "Create Baseline for All Sources").
   - **Logic:** Iterate through `this.sources`. For each writable source, check if `listCommits` is empty. If it is, call `historyStore.commit(source, source.read(), 'manual')`.
   - **Pros:** Establishes history for all existing SillyTavern prompts at once, so the user doesn't have to visit each source individually to start tracking.

2. **Per-Source "Commit Current State" Button:**
   - **Trigger:** A button rendered in the empty History panel (next to "No history for this source yet").
   - **Logic:** Calls `historyStore.commit(selectedSource, editor.value, 'manual')` and re-renders the list.
   - **Pros:** Explicit user intent, very clear.

3. **Automatic Baseline on First View/Edit:**
   - **Trigger:** When a source is first selected, or the first time the editor is dirtied, automatically commit the baseline if no history exists.
   - **Logic:** Silently call `historyStore.commit(source, source.read(), 'manual')` in the background.
   - **Pros:** Zero friction for the user.

*Note: The `historyStore.commit` method already checks `latestHash` to skip duplicates, making repeated baseline attempts safe.*

---
*(Add more use cases here as needed)*
