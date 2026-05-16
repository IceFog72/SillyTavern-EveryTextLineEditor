// @ts-ignore
import { setSlashCommandAutoComplete } from '../../../../slash-commands.js';
// @ts-ignore
import { Popup, POPUP_RESULT } from '../../../../popup.js';
import { createEditor, languageMap, Prism } from './vendor/prism-code-editor/index.js';
import { defaultCommands } from './vendor/prism-code-editor/extensions/commands.js';
import { indentGuides } from './vendor/prism-code-editor/extensions/guides.js';
import { matchBrackets } from './vendor/prism-code-editor/extensions/matchBrackets/index.js';
import { highlightBracketPairs } from './vendor/prism-code-editor/extensions/matchBrackets/highlight.js';
import { searchWidget } from './vendor/prism-code-editor/extensions/search/index.js';
import './vendor/prism-code-editor/grammars/yaml.js';
import './vendor/prism-code-editor/grammars/markdown.js';

import { NAME, STORAGE, INDENT_MODES, LANGUAGES, SYNC_MODES } from './constants.js';
import { DomRefs, IndentMode, Language, PrismEditorLike, TextSource, SyncMode, SidebarTab } from './types.js';
import { getCollapsedGroups, getLineDiff, getSources, setCollapsedGroups } from './SourceManager.js';

// Disable tag highlighting to prevent misalignment issues
if (Prism.languages.markdown) {
    delete (Prism.languages.markdown as any).tag;
}

const getIndentMode = (): IndentMode => {
    const stored = localStorage.getItem(STORAGE.indentMode);
    return INDENT_MODES.find(mode => mode.id === stored) ?? INDENT_MODES[0];
};

declare global {
    interface Window {
        EveryTextLineEditor?: EveryTextLineEditor;
    }
}

export class EveryTextLineEditor {
    sources: TextSource[];
    selectedSource: TextSource | null;
    dirty: boolean;
    collapsedGroups: Set<string>;
    currentLanguage: Language = LANGUAGES[0];
    scrollSyncMode: SyncMode = SYNC_MODES[1];
    dom: DomRefs;
    editor: PrismEditorLike | null;
    oldEditor: PrismEditorLike | null;
    diffOpen: boolean;
    isSyncingScroll: boolean;
    scrollSyncFrame: number;
    pendingScrollSync: { from: HTMLElement; to: HTMLElement } | null;
    indentMode: IndentMode;
    selectedSidebarTab: SidebarTab;

    constructor() {
        this.sources = [];
        this.selectedSource = null;
        this.dirty = false;
        this.collapsedGroups = getCollapsedGroups();
        this.dom = {};
        this.editor = null;
        this.oldEditor = null;
        this.diffOpen = false;
        this.isSyncingScroll = false;
        this.scrollSyncFrame = 0;
        this.pendingScrollSync = null;
        this.indentMode = getIndentMode();
        this.selectedSidebarTab = 'sources';
        const storedSync = localStorage.getItem(STORAGE.scrollSync);
        this.scrollSyncMode = SYNC_MODES.find(m => m.id === storedSync) ?? SYNC_MODES[1];
    }

    async inject() {
        this.renderDrawer();
        await this.refreshSources();
    }

    renderDrawer() {
        const drawer = document.createElement('div');
        this.dom.drawer = drawer;
        drawer.id = 'etle--drawer';
        drawer.classList.add('drawer');

        const toggle = document.createElement('div');
        this.dom.toggle = toggle;
        toggle.classList.add('drawer-toggle', 'drawer-header');
        drawer.append(toggle);

        const icon = document.createElement('div');
        this.dom.icon = icon;
        icon.id = 'etle--drawerIcon';
        icon.classList.add('drawer-icon', 'fa-solid', 'fa-pen-to-square', 'fa-fw', 'closedIcon');
        icon.title = 'Every Text Line Editor';
        icon.tabIndex = 0;
        icon.setAttribute('role', 'button');
        toggle.append(icon);
        toggle.addEventListener('click', (event) => this.handleDrawerToggle(event), { capture: true });

        drawer.append(this.renderPanel());

        const anchor = document.querySelector('#extensions-settings-button');
        if (anchor) {
            anchor.insertAdjacentElement('afterend', drawer);
            const anchorToggle = anchor.querySelector('.drawer-toggle');
            const clickHandler = globalThis.$?._data?.(anchorToggle, 'events')?.click?.[0]?.handler;
            if (clickHandler) {
                globalThis.$(toggle).on('click', clickHandler);
            } else {
                toggle.addEventListener('click', () => this.toggleDrawerClasses());
            }
        } else {
            document.body.append(drawer);
            toggle.addEventListener('click', () => this.toggleDrawerClasses());
        }

        document.addEventListener('click', (event) => this.handleDocumentClick(event), { capture: true });
    }

    handleDrawerToggle(event) {
        if (!this.dirty || !this.dom.root.classList.contains('openDrawer')) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        this.close().catch((error) => console.error(`[${NAME}] Failed to close editor`, error));
    }

    handleDocumentClick(event) {
        if (!this.dirty || !this.dom.root.classList.contains('openDrawer')) return;
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (this.dom.drawer.contains(target)) return;
        if (target instanceof Element && target.closest?.('.popup, dialog, .dialogue_popup')) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        this.close().catch((error) => console.error(`[${NAME}] Failed to close editor`, error));
    }

    renderPanel() {
        const root = document.createElement('div');
        this.dom.root = root;
        root.id = 'etle--panel';
        root.classList.add('drawer-content', 'closedDrawer');
        root.style.setProperty('--etle-sidebar-width', localStorage.getItem(STORAGE.panelWidth) || '320px');

        const shell = document.createElement('div');
        shell.classList.add('etle--shell');
        root.append(shell);

        const sidebar = document.createElement('aside');
        this.dom.sidebar = sidebar;
        sidebar.classList.add('etle--sidebar');
        shell.append(sidebar);

        const sidebarHead = document.createElement('div');
        sidebarHead.classList.add('etle--sidebarHead');
        sidebar.append(sidebarHead);

        const sidebarTitle = document.createElement('h3');
        sidebarTitle.textContent = 'Every Text Line Editor';
        sidebarHead.append(sidebarTitle);

        const refresh = this.makeIconButton('fa-rotate', 'Refresh sources', () => this.refreshSources(true));
        sidebarHead.append(refresh);

        const tabs = document.createElement('div');
        this.dom.sidebarTabs = tabs;
        tabs.classList.add('etle--sidebarTabs');
        sidebar.append(tabs);

        const tabDefs: Array<[SidebarTab, string, string]> = [
            ['sources', 'Sources', 'fa-list'],
            ['history', 'History', 'fa-code-branch'],
            ['settings', 'Settings', 'fa-gear'],
        ];
        for (const [id, label, icon] of tabDefs) {
            const tab = document.createElement('button');
            tab.type = 'button';
            tab.classList.add('etle--sidebarTab', 'menu_button');
            tab.dataset.tab = id;
            tab.innerHTML = `<span class="fa-solid fa-fw ${icon}"></span><span></span>`;
            tab.children[1].textContent = label;
            tab.addEventListener('click', () => this.setSidebarTab(id));
            tabs.append(tab);
        }

        const sidebarBody = document.createElement('div');
        this.dom.sidebarBody = sidebarBody;
        sidebarBody.classList.add('etle--sidebarBody');
        sidebar.append(sidebarBody);

        const sourcesPanel = document.createElement('section');
        this.dom.sourcesPanel = sourcesPanel;
        sourcesPanel.classList.add('etle--tabPanel', 'etle--sourcesPanel');
        sourcesPanel.dataset.tab = 'sources';
        sidebarBody.append(sourcesPanel);

        const tree = document.createElement('div');
        this.dom.tree = tree;
        tree.classList.add('etle--tree');
        sourcesPanel.append(tree);

        const historyPanel = document.createElement('section');
        this.dom.historyPanel = historyPanel;
        historyPanel.classList.add('etle--tabPanel', 'etle--historyPanel');
        historyPanel.dataset.tab = 'history';
        historyPanel.append(this.renderHistoryShell());
        sidebarBody.append(historyPanel);

        const settingsPanel = document.createElement('section');
        this.dom.settingsPanel = settingsPanel;
        settingsPanel.classList.add('etle--tabPanel', 'etle--settingsPanel');
        settingsPanel.dataset.tab = 'settings';
        sidebarBody.append(settingsPanel);

        this.setSidebarTab(this.selectedSidebarTab);

        const resize = document.createElement('div');
        resize.classList.add('etle--resize');
        resize.addEventListener('pointerdown', (event) => this.startResize(event));
        shell.append(resize);

        const main = document.createElement('main');
        main.classList.add('etle--main');
        shell.append(main);

        const header = document.createElement('header');
        header.classList.add('etle--header');
        main.append(header);

        const current = document.createElement('div');
        this.dom.current = current;
        current.classList.add('etle--current');

        const headerTitle = document.createElement('h3');
        this.dom.currentTitle = headerTitle;
        headerTitle.textContent = 'No source selected';
        const titleRow = document.createElement('div');
        this.dom.currentTitleRow = titleRow;
        titleRow.classList.add('etle--currentTitleRow');
        titleRow.append(headerTitle);

        const editBtn = document.createElement('button');
        this.dom.editName = editBtn;
        editBtn.classList.add('etle--editNameBtn', 'menu_button', 'fa-solid', 'fa-fw', 'fa-edit');
        editBtn.title = 'Rename source';
        editBtn.type = 'button';
        editBtn.addEventListener('click', () => this.toggleNameEdit());
        titleRow.append(editBtn);
        current.append(titleRow);

        const currentGroup = document.createElement('div');
        this.dom.currentGroup = currentGroup;
        currentGroup.classList.add('etle--currentGroup');
        current.append(currentGroup);

        header.append(current);

        const actionsLeft = document.createElement('div');
        this.dom.actionsLeft = actionsLeft;
        actionsLeft.classList.add('etle--actions', 'etle--actions-left');
        header.append(actionsLeft);

        const actionsRight = document.createElement('div');
        this.dom.actionsRight = actionsRight;
        actionsRight.classList.add('etle--actions', 'etle--actions-right');
        header.append(actionsRight);

        this.dom.diff = this.makeTextButton('Diff', 'fa-code-compare', () => this.toggleDiff());
        this.dom.revert = this.makeTextButton('Revert', 'fa-rotate-left', () => this.revert());
        this.dom.apply = this.makeTextButton('Apply', 'fa-check', () => this.apply());

        actionsRight.append(this.dom.diff, this.dom.revert, this.dom.apply, this.makeIconButton('fa-xmark', 'Close editor', () => this.close().catch((error) => console.error(`[${NAME}] Failed to close editor`, error))));

        const workspace = document.createElement('div');
        this.dom.workspace = workspace;
        workspace.classList.add('etle--workspace');
        main.append(workspace);

        const oldEditorHost = document.createElement('div');
        this.dom.oldEditorHost = oldEditorHost;
        oldEditorHost.classList.add('etle--oldEditorHost');
        workspace.append(oldEditorHost);

        const editorHost = document.createElement('div');
        this.dom.editorHost = editorHost;
        editorHost.classList.add('etle--editorHost');
        workspace.append(editorHost);

        const masterScrollbar = document.createElement('div');
        this.dom.masterScrollbar = masterScrollbar;
        masterScrollbar.classList.add('etle--masterScrollbar');
        const masterContent = document.createElement('div');
        this.dom.masterScrollContent = masterContent;
        masterContent.classList.add('etle--masterScrollContent');
        masterScrollbar.append(masterContent);
        workspace.append(masterScrollbar);

        this.createCodeEditor(editorHost);
        this.createReadonlyEditor(oldEditorHost);
        root.append(this.renderStatusBar());
        this.updateDirty(false);
        this.updateStatusBar();

        return root;
    }

    renderHistoryShell() {
        const root = document.createElement('div');
        root.classList.add('etle--historyShell');

        const changes = document.createElement('section');
        changes.classList.add('etle--historySection');
        changes.innerHTML = `
            <button type="button" class="etle--historySectionHeader">
                <span class="fa-solid fa-fw fa-chevron-down"></span>
                <span>Changes</span>
                <small>8</small>
            </button>
            <textarea class="text_pole etle--commitMessage" placeholder="Message (Ctrl+Enter to commit on...)"></textarea>
            <button type="button" class="menu_button etle--commitButton">
                <span class="fa-solid fa-fw fa-check"></span>
                <span>Commit</span>
                <span class="fa-solid fa-fw fa-chevron-down"></span>
            </button>
            <div class="etle--changeList" aria-label="Pending changes"></div>
        `;
        root.append(changes);

        const changeList = changes.querySelector('.etle--changeList');
        const dummyChanges = [
            ['#', 'style.css', '', 'M'],
            ['TS', 'EveryTextLineEditor.d.ts', 'dist', 'M'],
            ['JS', 'EveryTextLineEditor.js', 'dist', 'M'],
            ['JS', 'EveryTextLineEditor.js.map', 'dist', 'M'],
            ['TS', 'types.d.ts', 'dist', 'M'],
            ['MD', 'Browser-History-Plan.md', 'docs', 'U'],
            ['TS', 'EveryTextLineEditor.ts', 'src', 'M'],
            ['TS', 'types.ts', 'src', 'M'],
        ];
        for (const [kind, name, folder, status] of dummyChanges) {
            const row = document.createElement('div');
            row.classList.add('etle--historyRow');
            row.innerHTML = `
                <span class="etle--fileKind">${kind}</span>
                <span class="etle--fileName"></span>
                <small></small>
                <span class="etle--historyActions">
                    <span class="fa-solid fa-fw fa-file-arrow-up"></span>
                    <span class="fa-solid fa-fw fa-rotate-left"></span>
                    <span class="fa-solid fa-fw fa-plus"></span>
                </span>
                <span class="etle--fileStatus"></span>
            `;
            row.querySelector('.etle--fileName').textContent = name;
            row.querySelector('small').textContent = folder;
            row.querySelector('.etle--fileStatus').textContent = status;
            changeList.append(row);
        }

        const graph = document.createElement('section');
        graph.classList.add('etle--historySection', 'etle--graphSection');
        graph.innerHTML = `
            <button type="button" class="etle--historySectionHeader">
                <span class="fa-solid fa-fw fa-chevron-down"></span>
                <span>History</span>
                <small>3</small>
            </button>
            <div class="etle--commitTree" aria-label="History tree"></div>
        `;
        root.append(graph);

        const graphList = graph.querySelector('.etle--commitTree');
        const dummyCommits = [
            {
                title: 'Refactor code structure for implementation',
                time: '2 min ago',
                files: [
                    ['TS', 'EveryTextLineEditor.ts', 'src', 'M'],
                    ['TS', 'types.ts', 'src', 'M'],
                    ['#', 'style.css', '', 'M'],
                ],
            },
            {
                title: 'Add initial TypeScript configuration',
                time: '18 min ago',
                files: [
                    ['TS', 'index.ts', 'src', 'A'],
                    ['{}', 'tsconfig.json', '', 'A'],
                    ['{}', 'package.json', '', 'M'],
                ],
            },
            {
                title: 'Update manifest for editor entrypoint',
                time: '34 min ago',
                files: [
                    ['{}', 'manifest.json', '', 'M'],
                    ['JS', 'index.js', '', 'A'],
                ],
            },
        ];
        for (const commit of dummyCommits) {
            const item = document.createElement('details');
            item.classList.add('etle--commitItem');
            item.open = true;
            item.innerHTML = `
                <summary class="etle--commitRow">
                    <span class="fa-solid fa-fw fa-chevron-right etle--commitChevron"></span>
                    <span class="etle--commitTitle"></span>
                    <small></small>
                </summary>
                <div class="etle--commitFiles"></div>
            `;
            item.querySelector('.etle--commitTitle').textContent = commit.title;
            item.querySelector('small').textContent = commit.time;
            const files = item.querySelector('.etle--commitFiles');
            for (const [kind, name, folder, status] of commit.files) {
                const file = document.createElement('div');
                file.classList.add('etle--commitFile');
                file.innerHTML = `
                    <span class="etle--fileKind"></span>
                    <span class="etle--fileName"></span>
                    <small></small>
                    <span class="etle--fileStatus"></span>
                `;
                file.querySelector('.etle--fileKind').textContent = kind;
                file.querySelector('.etle--fileName').textContent = name;
                file.querySelector('small').textContent = folder;
                file.querySelector('.etle--fileStatus').textContent = status;
                files.append(file);
            }
            graphList.append(item);
        }

        return root;
    }

    setSidebarTab(tab: SidebarTab) {
        this.selectedSidebarTab = tab;
        this.dom.sidebarTabs?.querySelectorAll<HTMLButtonElement>('.etle--sidebarTab').forEach(button => {
            button.classList.toggle('etle--activeTab', button.dataset.tab === tab);
        });
        this.dom.sidebarBody?.querySelectorAll<HTMLElement>('.etle--tabPanel').forEach(panel => {
            panel.hidden = panel.dataset.tab !== tab;
        });
    }

    toggleDrawerClasses() {
        this.dom.icon.classList.toggle('openIcon');
        this.dom.icon.classList.toggle('closedIcon');
        this.dom.root.classList.toggle('openDrawer');
        this.dom.root.classList.toggle('closedDrawer');
    }

    setUnsavedLock(isLocked) {
        this.dom.root?.classList.toggle('pinnedOpen', !!isLocked);
        this.dom.icon?.classList.toggle('drawerPinnedOpen', !!isLocked);
    }

    makeIconButton(icon, title, onClick) {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('etle--iconButton', 'menu_button', 'fa-solid', 'fa-fw', icon);
        button.title = title;
        button.addEventListener('click', onClick);
        return button;
    }

    makeTextButton(text, icon, onClick) {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('etle--textButton', 'menu_button');
        const iconEl = document.createElement('span');
        iconEl.classList.add('fa-solid', 'fa-fw', icon);
        const label = document.createElement('span');
        label.textContent = text;
        button.append(iconEl, label);
        button.addEventListener('click', onClick);
        return button;
    }

    renderStatusBar() {
        const status = document.createElement('footer');
        status.classList.add('etle--statusBar');

        const left = document.createElement('div');
        left.classList.add('etle--statusLeft');
        status.append(left);

        const dirty = document.createElement('span');
        this.dom.statusDirty = dirty;
        dirty.classList.add('etle--statusItem', 'etle--dirtyStatus');
        left.append(dirty);

        const sourceCount = document.createElement('span');
        this.dom.statusSourceCount = sourceCount;
        sourceCount.classList.add('etle--statusItem');
        left.append(sourceCount);

        const stats = document.createElement('span');
        this.dom.statusStats = stats;
        stats.classList.add('etle--statusItem');
        left.append(stats);

        const right = document.createElement('div');
        right.classList.add('etle--statusRight');
        status.append(right);

        const cursor = document.createElement('span');
        this.dom.statusCursor = cursor;
        cursor.classList.add('etle--statusItem');
        right.append(cursor);

        const selection = document.createElement('span');
        this.dom.statusSelection = selection;
        selection.classList.add('etle--statusItem');
        right.append(selection);

        const indent = document.createElement('button');
        this.dom.statusIndent = indent;
        indent.type = 'button';
        indent.classList.add('etle--statusButton');
        indent.title = 'Cycle indentation';
        indent.addEventListener('click', () => this.cycleIndentMode());
        right.append(indent);

        const wrap = document.createElement('button');
        this.dom.statusWrap = wrap;
        wrap.type = 'button';
        wrap.classList.add('etle--statusButton');
        wrap.title = 'Toggle word wrap';
        wrap.addEventListener('click', () => this.setWordWrap(!JSON.parse(localStorage.getItem(STORAGE.wordWrap) || 'true')));
        right.append(wrap);

        const language = document.createElement('button');
        this.dom.statusLanguage = language;
        language.type = 'button';
        language.classList.add('etle--statusButton');
        language.title = 'Cycle language';
        language.addEventListener('click', () => this.cycleLanguage());
        right.append(language);

        const sync = document.createElement('button');
        this.dom.statusScrollSync = sync;
        sync.type = 'button';
        sync.classList.add('etle--statusButton');
        sync.title = 'Cycle scroll sync mode';
        sync.addEventListener('click', () => this.cycleScrollSync());
        right.append(sync);

        return status;
    }

    createCodeEditor(host) {
        languageMap.markdown = languageMap.md = {
            comments: {
                block: ['<!--', '-->'],
            },
        };

        this.editor = createEditor(
            host,
            {
                value: '',
                language: 'markdown',
                lineNumbers: true,
                readOnly: false,
                insertSpaces: this.indentMode.insertSpaces,
                tabSize: this.indentMode.tabSize,
                wordWrap: JSON.parse(localStorage.getItem(STORAGE.wordWrap) || 'true'),
                onUpdate: (value) => {
                    if (!this.selectedSource) return;
                    this.updateDirty(value !== this.selectedSource.read());
                    this.renderDiff();
                    this.updateStatusBar();
                },
            },
            searchWidget(),
            highlightBracketPairs(),
            matchBrackets(true),
            indentGuides(),
            defaultCommands(),
        );

        this.editor.textarea.addEventListener('keydown', (event) => this.handleEditorKeyDown(event), { capture: true });
        setSlashCommandAutoComplete(this.editor.textarea, true).then((autocomplete) => {
            this.editor.textarea.addEventListener('keydown', (event) => autocomplete.handleKeyDown(event), { capture: true });
        }).catch(() => { });
        this.editor.textarea.addEventListener('keyup', () => this.updateStatusBar());
        this.editor.textarea.addEventListener('click', () => this.updateStatusBar());
        this.editor.textarea.addEventListener('select', () => this.updateStatusBar());
        this.editor.textarea.addEventListener('input', () => this.updateStatusBar());
    }

    handleEditorKeyDown(event: KeyboardEvent) {
        const isSave = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's';
        if (!isSave) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        this.apply().catch((error) => console.error(`[${NAME}] Failed to save from keyboard shortcut`, error));
    }

    createReadonlyEditor(host) {
        this.oldEditor = createEditor(
            host,
            {
                value: '',
                language: 'markdown',
                lineNumbers: true,
                readOnly: true,
                insertSpaces: this.indentMode.insertSpaces,
                tabSize: this.indentMode.tabSize,
                wordWrap: JSON.parse(localStorage.getItem(STORAGE.wordWrap) || 'true'),
            },
            searchWidget(),
            highlightBracketPairs(),
            matchBrackets(true),
            indentGuides(),
        );
        this.bindDiffScrollSync();
    }

    bindDiffScrollSync() {
        if (!this.editor || !this.oldEditor || !this.dom.masterScrollbar) return;

        const syncFromMaster = () => {
            if (!this.diffOpen || this.scrollSyncMode.id === 'off' || this.isSyncingScroll) return;
            this.isSyncingScroll = true;
            const top = this.dom.masterScrollbar.scrollTop;
            this.editor.scrollContainer.scrollTop = top;
            this.oldEditor.scrollContainer.scrollTop = top;
            setTimeout(() => this.isSyncingScroll = false, 0);
        };

        const handleWheel = (event: WheelEvent) => {
            if (!this.diffOpen || this.scrollSyncMode.id === 'off') return;
            event.preventDefault();
            this.dom.masterScrollbar.scrollTop += event.deltaY;
        };

        this.dom.masterScrollbar.addEventListener('scroll', syncFromMaster, { passive: true });
        this.editor.scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
        this.oldEditor.scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

        // Sync horizontal scroll as before
        const syncHorizontal = (from, to) => {
            if (!this.diffOpen || this.scrollSyncMode.id === 'off' || this.isSyncingScroll) return;
            this.isSyncingScroll = true;
            to.scrollLeft = from.scrollLeft;
            setTimeout(() => this.isSyncingScroll = false, 0);
        };
        this.editor.scrollContainer.addEventListener('scroll', () => syncHorizontal(this.editor.scrollContainer, this.oldEditor.scrollContainer), { passive: true });
        this.oldEditor.scrollContainer.addEventListener('scroll', () => syncHorizontal(this.oldEditor.scrollContainer, this.editor.scrollContainer), { passive: true });
    }

    applyScrollSync(from, to) {
        this.isSyncingScroll = true;

        if (this.scrollSyncMode.id === 'line') {
            const fromLine = from.querySelector('.pce-line') as HTMLElement;
            const toLine = to.querySelector('.pce-line') as HTMLElement;
            if (fromLine && toLine) {
                const fromH = fromLine.offsetHeight;
                const toH = toLine.offsetHeight;
                const nextTop = (from.scrollTop / fromH) * toH;
                if (Math.abs(to.scrollTop - nextTop) > 0.5) to.scrollTop = nextTop;
            }
        } else {
            const fromMax = from.scrollHeight - from.clientHeight;
            const toMax = to.scrollHeight - to.clientHeight;
            const nextTop = (from.scrollTop / Math.max(1, fromMax)) * toMax;
            if (Math.abs(to.scrollTop - nextTop) > 0.5) to.scrollTop = nextTop;
        }

        const fromMaxX = from.scrollWidth - from.clientWidth;
        const toMaxX = to.scrollWidth - to.clientWidth;
        const nextLeft = (from.scrollLeft / Math.max(1, fromMaxX)) * toMaxX;
        if (Math.abs(to.scrollLeft - nextLeft) > 0.5) to.scrollLeft = nextLeft;

        // Reset guard after current execution stack
        setTimeout(() => this.isSyncingScroll = false, 0);
    }

    syncDiffScroll() {
        if (!this.editor || !this.oldEditor || !this.diffOpen) return;
        this.applyScrollSync(this.editor.scrollContainer, this.oldEditor.scrollContainer);
    }

    async refreshSources(keepSelection = false) {
        const previousId = keepSelection ? this.selectedSource?.id : localStorage.getItem(STORAGE.selectedSource);
        this.sources = await getSources();
        this.renderTree();
        this.updateStatusBar();

        if (previousId && this.sources.some(source => source.id === previousId)) {
            await this.selectSource(previousId, { force: true });
        } else if (!this.selectedSource && this.sources.length) {
            await this.selectSource(this.sources[0].id, { force: true });
        } else if (!this.sources.length) {
            this.setEditorValue('');
            this.dom.currentTitle.textContent = 'No editable prompt sources found';
            this.dom.currentGroup.textContent = 'Open Chat Completion settings once if PromptManager has not initialized yet.';
            this.dom.actionsLeft.innerHTML = '';
        }
    }

    async selectInitialSource() {
        const storedId = localStorage.getItem(STORAGE.selectedSource);
        if (storedId && this.sources.some(source => source.id === storedId)) {
            await this.selectSource(storedId, { force: true });
        } else if (this.sources.length) {
            await this.selectSource(this.sources[0].id, { force: true });
        }
    }

    renderTree() {
        this.dom.tree.innerHTML = '';
        const groups = new Map();
        for (const source of this.sources) {
            if (!groups.has(source.group)) groups.set(source.group, []);
            groups.get(source.group).push(source);
        }

        if (!groups.size) {
            const empty = document.createElement('div');
            empty.classList.add('etle--empty');
            empty.textContent = 'No sources available';
            this.dom.tree.append(empty);
            return;
        }

        for (const [group, sources] of groups) {
            const section = document.createElement('section');
            section.classList.add('etle--group');
            if (this.collapsedGroups.has(group)) section.classList.add('etle--collapsed');

            const header = document.createElement('button');
            header.type = 'button';
            header.classList.add('etle--groupHeader');
            header.innerHTML = `<span class="fa-solid fa-fw fa-chevron-down"></span><span></span><small></small>`;
            header.children[1].textContent = group;
            header.children[2].textContent = String(sources.length);
            header.addEventListener('click', () => {
                if (this.collapsedGroups.has(group)) this.collapsedGroups.delete(group);
                else this.collapsedGroups.add(group);
                setCollapsedGroups(this.collapsedGroups);
                this.renderTree();
            });
            section.append(header);

            const list = document.createElement('div');
            list.classList.add('etle--sourceList');
            for (const source of sources) {
                const item = document.createElement('div');
                item.classList.add('etle--source');
                item.dataset.sourceId = source.id;
                if (this.selectedSource?.id === source.id) item.classList.add('etle--active');
                if (source.readonly) item.classList.add('etle--readonly');
                if (source.placeholder) item.classList.add('etle--placeholder');

                if (source.toggleable) {
                    const toggle = document.createElement('button');
                    toggle.type = 'button';
                    toggle.classList.add('etle--promptToggle', 'menu_button', 'fa-solid', 'fa-fw');
                    toggle.classList.add(source.enabled ? 'fa-toggle-on' : 'fa-toggle-off');
                    toggle.title = source.enabled ? 'Disable prompt' : 'Enable prompt';
                    toggle.addEventListener('click', async (event) => {
                        event.stopPropagation();
                        await this.toggleSource(source);
                    });
                    item.append(toggle);
                } else {
                    const spacer = document.createElement('span');
                    spacer.classList.add('etle--sourceSpacer');
                    item.append(spacer);
                }

                const select = document.createElement('button');
                select.type = 'button';
                select.classList.add('etle--sourceSelect');
                select.disabled = source.selectable === false;
                select.innerHTML = '<span class="fa-solid fa-fw fa-file-lines"></span><span></span>';
                select.children[1].textContent = source.label;
                item.title = source.label;
                select.addEventListener('click', () => this.selectSource(source.id).catch((error) => console.error(`[${NAME}] Failed to select source`, error)));
                item.append(select);
                list.append(item);
            }
            section.append(list);
            this.dom.tree.append(section);
        }
    }

    async toggleSource(source) {
        if (!source?.toggle) return;
        try {
            await source.toggle();
            await this.refreshSources(true);
            globalThis.toastr?.success?.(source.enabled ? 'Prompt disabled' : 'Prompt enabled');
        } catch (error) {
            console.error(`[${NAME}] Failed to toggle source`, error);
            globalThis.toastr?.error?.('Failed to toggle prompt. See console for details.');
        }
    }

    async selectSource(id, { force = false } = {}) {
        if (!force && this.selectedSource?.id === id) return;
        if (!force && this.dirty) {
            const choice = await this.confirmUnsavedSourceChange('switch');
            if (choice === 'cancel') return;
            if (choice === 'save') {
                const saved = await this.saveCurrentSource({ refresh: false, toast: true });
                if (!saved) return;
            }
            if (choice === 'discard') {
                this.updateDirty(false);
            }
        }
        const source = this.sources.find(item => item.id === id);
        if (!source || source.selectable === false) return;

        this.selectedSource = source;
        localStorage.setItem(STORAGE.selectedSource, source.id);
        this.updateHeader();
        this.editor.setOptions({ readOnly: !!source.readonly });
        this.setEditorValue(source.read());
        this.updateDirty(false);
        this.renderDiff();
        this.updateStatusBar();
        this.renderTree();
    }

    async confirmUnsavedSourceChange(action = 'switch') {
        const actionText = action === 'close' ? 'closing the editor' : 'switching sources';
        const result = await Popup.show.confirm(
            'Unsaved changes',
            `Save changes before ${actionText}?`,
            {
                okButton: 'Save Changes',
                cancelButton: 'Cancel',
                customButtons: [{
                    text: 'Discard Changes',
                    result: POPUP_RESULT.CUSTOM1,
                    icon: 'fa-trash-can',
                    classes: ['redWarningBG'],
                }],
                defaultResult: POPUP_RESULT.AFFIRMATIVE,
            },
        );

        if (result === POPUP_RESULT.AFFIRMATIVE) return 'save';
        if (result === POPUP_RESULT.CUSTOM1) return 'discard';
        return 'cancel';
    }

    setEditorValue(value) {
        this.editor.setOptions({ value: String(value ?? '') });
        this.renderDiff();
        this.updateStatusBar();
    }

    setWordWrap(enabled) {
        localStorage.setItem(STORAGE.wordWrap, JSON.stringify(enabled));
        this.editor.setOptions({ wordWrap: enabled });
        this.oldEditor?.setOptions({ wordWrap: enabled });
        this.updateStatusBar();
    }

    cycleIndentMode() {
        const index = INDENT_MODES.findIndex(mode => mode.id === this.indentMode.id);
        this.indentMode = INDENT_MODES[(index + 1) % INDENT_MODES.length];
        localStorage.setItem(STORAGE.indentMode, this.indentMode.id);
        this.editor?.setOptions({
            insertSpaces: this.indentMode.insertSpaces,
            tabSize: this.indentMode.tabSize,
        });
        this.oldEditor?.setOptions({
            insertSpaces: this.indentMode.insertSpaces,
            tabSize: this.indentMode.tabSize,
        });
        this.updateStatusBar();
    }

    cycleLanguage() {
        const index = LANGUAGES.findIndex(lang => lang.id === this.currentLanguage.id);
        const nextIndex = (index + 1) % LANGUAGES.length;
        this.setLanguage(LANGUAGES[nextIndex]);
    }

    setLanguage(lang: Language) {
        this.currentLanguage = lang;
        this.editor?.setOptions({ language: lang.id });
        this.oldEditor?.setOptions({ language: lang.id });
        this.updateStatusBar();
    }

    cycleScrollSync() {
        const index = SYNC_MODES.findIndex(m => m.id === this.scrollSyncMode.id);
        const next = SYNC_MODES[(index + 1) % SYNC_MODES.length];
        this.setScrollSync(next);
    }

    setScrollSync(mode: SyncMode) {
        this.scrollSyncMode = mode;
        localStorage.setItem(STORAGE.scrollSync, mode.id);
        this.updateStatusBar();
        if (mode.id !== 'off') this.syncDiffScroll();
    }

    getCursorPosition() {
        const value = this.editor?.value ?? '';
        const position = this.editor?.textarea?.selectionStart ?? 0;
        const before = value.slice(0, position);
        const lines = before.split('\n');
        return {
            line: lines.length,
            column: lines.at(-1).length + 1,
        };
    }

    getEditorStats() {
        const value = this.editor?.value ?? '';
        const selectionStart = this.editor?.textarea?.selectionStart ?? 0;
        const selectionEnd = this.editor?.textarea?.selectionEnd ?? selectionStart;
        return {
            chars: value.length,
            lines: value.length ? value.split('\n').length : 1,
            selection: Math.abs(selectionEnd - selectionStart),
        };
    }

    updateHeader() {
        const source = this.selectedSource;
        if (!source) return;
        if (this.dom.currentGroup) this.dom.currentGroup.textContent = source.group;
        if (this.dom.currentTitle) this.dom.currentTitle.textContent = source.label;
        if (this.dom.editName) this.dom.editName.hidden = !source.metadata?.name;

        if (this.dom.actionsLeft) {
            if (globalThis.$?.fn?.select2) {
                globalThis.$(this.dom.actionsLeft).find('select.etle--triggerSelect').each((_, element) => {
                    globalThis.$(element).select2('destroy');
                });
            }
            this.dom.actionsLeft.innerHTML = '';
            const meta = source.metadata;
            if (meta) {
                if (meta.role) {
                    const btn = this.makeTextButton(meta.role.label(), 'fa-user-tag', () => {
                        meta.role.set();
                        this.updateHeader();
                    });
                    btn.classList.add('etle--dynamicAction');
                    this.dom.actionsLeft.append(btn);
                }
                if (meta.position) {
                    const btn = this.makeTextButton(meta.position.label(), 'fa-location-dot', () => {
                        meta.position.set(0);
                        this.updateHeader();
                    });
                    btn.classList.add('etle--dynamicAction');
                    this.dom.actionsLeft.append(btn);
                }

                // Only show Depth and Order for In-chat (Absolute) position
                const isInChat = meta.position?.label() === 'In-chat';
                if (isInChat && meta.depth) {
                    const btn = this.makeTextButton(`Depth: ${meta.depth.get()}`, 'fa-layer-group', () => {
                        const val = prompt('Enter injection depth (0 = end of chat):', String(meta.depth.get()));
                        if (val !== null) {
                            meta.depth.set(parseInt(val, 10) || 0);
                            this.updateHeader();
                        }
                    });
                    btn.classList.add('etle--dynamicAction');
                    this.dom.actionsLeft.append(btn);
                }
                if (isInChat && meta.order) {
                    const btn = this.makeTextButton(`Order: ${meta.order.get()}`, 'fa-sort', () => {
                        const val = prompt('Enter execution order:', String(meta.order.get()));
                        if (val !== null) {
                            meta.order.set(parseInt(val, 10) || 0);
                            this.updateHeader();
                        }
                    });
                    btn.classList.add('etle--dynamicAction');
                    this.dom.actionsLeft.append(btn);
                }

                if (meta.triggers) {
                    const control = this.renderTriggerControl(meta.triggers);
                    control.classList.add('etle--dynamicAction');
                    this.dom.actionsLeft.append(control);
                }
            }
        }
    }

    renderTriggerControl(meta: NonNullable<TextSource['metadata']>['triggers']) {
        if (!meta?.options?.length) {
            const triggerText = meta?.label?.() ?? meta?.get() ?? '';
            const label = triggerText ? `Triggers: ${triggerText}` : 'Triggers';
            const btn = this.makeTextButton(label, 'fa-bolt', () => {
                const val = prompt(meta?.editHint ?? 'Edit triggers (comma separated):', meta?.get() ?? '');
                if (val !== null) {
                    meta?.set(val);
                    this.updateHeader();
                }
            });
            btn.title = meta?.editHint ?? triggerText ?? 'Edit triggers';
            return btn;
        }

        const wrap = document.createElement('label');
        wrap.classList.add('etle--triggerSelectWrap');
        wrap.title = 'Triggers';

        const icon = document.createElement('span');
        icon.classList.add('fa-solid', 'fa-fw', 'fa-bolt');
        wrap.append(icon);

        const select = document.createElement('select');
        select.classList.add('etle--triggerSelect', 'text_pole');
        select.multiple = true;
        const selected = new Set(meta.get().split(',').map(item => item.trim()).filter(Boolean));
        for (const option of meta.options) {
            const optionEl = document.createElement('option');
            optionEl.value = option.id;
            optionEl.textContent = option.label;
            optionEl.selected = selected.has(option.id);
            select.append(optionEl);
        }
        wrap.append(select);

        select.addEventListener('change', () => {
            meta.set(Array.from(select.selectedOptions).map(option => option.value).join(', '));
            this.updateHeader();
        });

        queueMicrotask(() => {
            if (!select.isConnected || !globalThis.$?.fn?.select2) return;
            globalThis.$(select).select2({
                placeholder: meta.emptyLabel ? `${meta.emptyLabel} (default)` : 'All types (default)',
                width: 'style',
                closeOnSelect: false,
            });
        });

        return wrap;
    }

    toggleNameEdit() {
        if (!this.selectedSource?.metadata?.name || !this.dom.currentTitle) return;
        const meta = this.selectedSource.metadata.name;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = meta.get();
        input.classList.add('etle--nameEditInput');

        const title = this.dom.currentTitle;
        const originalDisplay = title.style.display;
        title.style.display = 'none';
        title.insertAdjacentElement('afterend', input);

        const finish = () => {
            if (input.value && input.value !== meta.get()) {
                meta.set(input.value);
                this.refreshSources();
            }
            input.remove();
            title.style.display = originalDisplay;
            this.updateHeader();
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') finish();
            if (e.key === 'Escape') this.updateHeader();
        });
        input.addEventListener('blur', finish);

        input.focus();
        input.select();
    }

    createPropGroup(label: string) {
        const div = document.createElement('div');
        div.classList.add('etle--propGroup');
        const span = document.createElement('span');
        span.textContent = label;
        div.append(span);
        return div;
    }

    updateStatusBar() {
        const wrapEnabled = JSON.parse(localStorage.getItem(STORAGE.wordWrap) || 'true');
        const stats = this.getEditorStats();
        if (this.dom.statusDirty) {
            this.dom.statusDirty.textContent = this.dirty ? 'Unsaved changes' : 'All changes saved';
            this.dom.statusDirty.classList.toggle('etle--statusDirty', this.dirty);
        }
        if (this.dom.statusSourceCount) {
            this.dom.statusSourceCount.textContent = `${this.sources.length} sources`;
        }
        if (this.dom.statusStats) {
            this.dom.statusStats.textContent = `${stats.lines.toLocaleString()} lines, ${stats.chars.toLocaleString()} chars`;
        }
        if (this.dom.statusCursor) {
            const cursor = this.getCursorPosition();
            this.dom.statusCursor.textContent = `Ln ${cursor.line}, Col ${cursor.column}`;
        }
        if (this.dom.statusSelection) {
            this.dom.statusSelection.textContent = stats.selection ? `${stats.selection.toLocaleString()} selected` : '';
            this.dom.statusSelection.hidden = !stats.selection;
        }
        if (this.dom.statusIndent) {
            this.dom.statusIndent.textContent = this.indentMode.label;
        }
        if (this.dom.statusWrap) {
            this.dom.statusWrap.textContent = wrapEnabled ? 'Wrap: On' : 'Wrap: Off';
            this.dom.statusWrap.classList.toggle('etle--statusActive', wrapEnabled);
        }
        if (this.dom.statusLanguage) {
            this.dom.statusLanguage.textContent = this.currentLanguage.label;
        }
        if (this.dom.statusScrollSync) {
            this.dom.statusScrollSync.hidden = !this.diffOpen;
            this.dom.statusScrollSync.textContent = this.scrollSyncMode.label;
            this.dom.statusScrollSync.classList.toggle('etle--statusActive', this.scrollSyncMode.id !== 'off');
        }
        this.dom.root?.classList.toggle('etle--syncOff', this.scrollSyncMode.id === 'off');
    }

    async apply() {
        await this.saveCurrentSource({ refresh: true, toast: true });
    }

    async saveCurrentSource({ refresh = true, toast = true } = {}) {
        if (!this.selectedSource || this.selectedSource.readonly) return;
        const value = this.editor.value;
        try {
            this.selectedSource.write(value);
            await this.selectedSource.save?.();
            this.updateDirty(false);
            if (refresh) await this.refreshSources(true);
            this.renderDiff();
            if (toast) globalThis.toastr?.success?.('Saved prompt text');
            return true;
        } catch (error) {
            console.error(`[${NAME}] Failed to save source`, error);
            globalThis.toastr?.error?.('Failed to save prompt text. See console for details.');
            return false;
        }
    }

    revert() {
        if (!this.selectedSource) return;
        this.setEditorValue(this.selectedSource.read());
        this.updateDirty(false);
        this.renderDiff();
    }

    toggleDiff() {
        this.diffOpen = !this.diffOpen;
        this.dom.root.classList.toggle('etle--showDiff', this.diffOpen);
        this.dom.diff.classList.toggle('etle--activeButton', this.diffOpen);
        this.renderDiff();
        this.editor.update();
        this.oldEditor?.update();
        if (this.diffOpen) {
            requestAnimationFrame(() => this.updateMasterScrollbarHeight());
        }
        this.updateStatusBar();
    }

    updateMasterScrollbarHeight() {
        if (!this.dom.masterScrollContent || !this.editor || !this.oldEditor) return;
        const height = Math.max(this.editor.scrollContainer.scrollHeight, this.oldEditor.scrollContainer.scrollHeight);
        this.dom.masterScrollContent.style.height = `${height}px`;
        this.dom.masterScrollbar.scrollTop = this.editor.scrollContainer.scrollTop;
    }

    renderDiff() {
        if (!this.oldEditor) return;
        const saved = this.selectedSource ? this.selectedSource.read() : '';
        const unsaved = this.editor?.value ?? '';
        this.oldEditor.setOptions({ value: saved || '' });
        requestAnimationFrame(() => this.highlightDiff(saved, unsaved));
    }

    highlightDiff(saved, unsaved) {
        const diff = getLineDiff(saved, unsaved);
        this.applyDiffMarks(this.oldEditor, diff.oldMarks, 'removed', diff.oldSpacers);
        this.applyDiffMarks(this.editor, diff.newMarks, 'added', diff.newSpacers);
        this.updateMasterScrollbarHeight();
    }

    applyDiffMarks(editor, marks, activeMark, spacers) {
        if (!editor) return;
        const lines = [...editor.wrapper.querySelectorAll('.pce-line')] as HTMLElement[];
        lines.forEach((line, index) => {
            line.classList.remove('etle--diffAdded', 'etle--diffRemoved');
            line.style.marginTop = '';
            if (!this.diffOpen) return;

            const spacerCount = spacers[index] || 0;
            if (spacerCount > 0) {
                const height = line.offsetHeight || 20; // Default to 20 if not rendered
                line.style.marginTop = `${spacerCount * height}px`;
            }

            if (marks[index] === activeMark) {
                line.classList.add(activeMark === 'added' ? 'etle--diffAdded' : 'etle--diffRemoved');
            }
        });
    }

    updateDirty(isDirty) {
        this.dirty = !!isDirty;
        this.dom.root?.classList.toggle('etle--dirty', this.dirty);
        this.setUnsavedLock(this.dirty);
        if (this.dom.diff) this.dom.diff.disabled = !this.selectedSource;
        if (this.dom.apply) this.dom.apply.disabled = !this.dirty || this.selectedSource?.readonly;
        if (this.dom.revert) this.dom.revert.disabled = !this.dirty;
        this.updateStatusBar();
    }

    async open() {
        await this.refreshSources(true);
        if (!this.dom.root.classList.contains('openDrawer')) {
            this.dom.toggle.click();
        }
        this.editor.update();
        this.editor.textarea.focus();
    }

    async close() {
        if (this.dirty) {
            const choice = await this.confirmUnsavedSourceChange('close');
            if (choice === 'cancel') return;
            if (choice === 'save') {
                const saved = await this.saveCurrentSource({ refresh: false, toast: true });
                if (!saved) return;
            }
            if (choice === 'discard') {
                this.updateDirty(false);
            }
        }
        if (this.dom.root.classList.contains('openDrawer')) {
            this.dom.toggle.click();
        }
    }

    startResize(event) {
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = parseInt(getComputedStyle(this.dom.root).getPropertyValue('--etle-sidebar-width')) || 320;
        const onMove = (moveEvent) => {
            const width = Math.min(560, Math.max(220, startWidth + moveEvent.clientX - startX));
            this.dom.root.style.setProperty('--etle-sidebar-width', `${width}px`);
            localStorage.setItem(STORAGE.panelWidth, `${width}px`);
        };
        const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    }
}
