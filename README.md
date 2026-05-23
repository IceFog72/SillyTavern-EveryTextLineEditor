# SillyTavern - Every Text Line Editor

An in-SillyTavern editor for prompts, preset text, lorebook entries, personas, connection profiles, and other text sources that are normally scattered across different menus.


<img width="2560" height="1402" alt="image" src="https://github.com/user-attachments/assets/797c479d-7502-4b38-8a5c-0cb44d0d3857" />

* *You don't need to use [ProbablyTooManyTabs](https://github.com/IceFog72/SillyTavern-ProbablyTooManyTabs) to use EveryTextLineEditor*

---

## Features

* Central source list: choose which prompt/source categories stay visible
* Lorebook support: add whole lorebooks and edit entries from the same editor
* Prism and Monaco editors: switch between a lightweight editor and Monaco
* Diff mode: compare the current working draft with the saved baseline or history snapshots
* Source history: save local snapshots, compare changed sources, and load older versions
* Syntax selection: choose Markdown, JSON, YAML, or plain text per source
* Word wrap, spell check, minimap, and scroll-sync controls
* Prompt controls: toggle enabled prompts and edit supported prompt metadata
* Local-first storage: history is stored in browser IndexedDB

---

## Installation

1. Install via SillyTavern's extension installer, or
2. Clone into `SillyTavern/data/default-user/extensions/`

```bash
git clone https://github.com/IceFog72/SillyTavern-EveryTextLineEditor
```

Then reload SillyTavern and enable **Every Text Line Editor**.

---

## Requirements

* SillyTavern `1.12.0` or newer
* Modern Chromium/Firefox-based browser


---

## Quick Start

### Basic Usage

1. Open **Every Text Line Editor** from the top panel.
2. Click **Sources -> Control**.
3. Select the categories or lorebooks you want in the source list.
4. Pick a source from the sidebar.
5. Edit the text, then click **Apply** to save back to SillyTavern.

### Diff and History

1. Click **Diff** to compare your draft against the saved baseline.
2. Use **History** to commit snapshots for a source or category.
3. Load or compare previous snapshots when experimenting with prompt changes.

---

## Editor Notes

* **Prism** is the default lightweight editor.
* **Monaco** is available for users who prefer a full code-editor feel.
* Indentation settings apply to Prism only.
* Monaco minimap is hidden while Monaco diff mode is open.
* Language selection is per source and available from the status bar.

---

## Project Structure

```text
SillyTavern-EveryTextLineEditor/
├── index.js                  # SillyTavern entry shim
├── manifest.json             # Extension manifest
├── style.css                 # Extension UI and editor styling
├── src/
│   ├── EveryTextLineEditor.ts # Main editor shell and editor adapters
│   ├── SourceManager.ts      # SillyTavern source discovery and save logic
│   ├── SourcePanel.ts        # Source tree and source control dialog
│   ├── SettingsPanel.ts      # Settings UI
│   ├── HistoryPanel.ts       # History sidebar UI
│   ├── HistoryStore.ts       # IndexedDB snapshot storage
│   ├── constants.ts          # Storage keys and option lists
│   └── types.ts              # Shared TypeScript types
└── dist/                     # Compiled runtime files loaded by SillyTavern
```

---


## Support

- **Discord**: [https://discord.gg/2tJcWeMjFQ](https://discord.gg/2tJcWeMjFQ)
- **SillyTavern Discord**: Find me on the official server
- **GitHub Issues**: Bug reports and feature requests

---

## Support Development

- **Patreon**: No more Patreon because they scam.

---

## Credits

* **[SillyTavern Prompt Inspector](https://github.com/SillyTavern/Extension-PromptInspector)**: Inspiration and core design patterns for prompt inspection features, including dynamic JSON/YAML formatting toggles, prompt interception workflows, and wand menu integration.
* **[SillyTavern Quick Replies Drawer](https://github.com/LenAnderson/SillyTavern-QuickRepliesDrawer)**: Baseline exemplar and inspiration.

---

## License

GNU License - See [LICENSE](LICENSE) for details.
