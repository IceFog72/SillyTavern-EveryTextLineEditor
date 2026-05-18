// @ts-ignore
import { setSlashCommandAutoComplete } from '../../../../slash-commands.js';
// @ts-ignore
import { Popup, POPUP_RESULT } from '../../../../popup.js';
// @ts-ignore
import { download } from '../../../../utils.js';
import { createEditor, languageMap, Prism } from './vendor/prism-code-editor/index.js';
import { defaultCommands } from './vendor/prism-code-editor/extensions/commands.js';
import { indentGuides } from './vendor/prism-code-editor/extensions/guides.js';
import { matchBrackets } from './vendor/prism-code-editor/extensions/matchBrackets/index.js';
import { highlightBracketPairs } from './vendor/prism-code-editor/extensions/matchBrackets/highlight.js';
import { searchWidget } from './vendor/prism-code-editor/extensions/search/index.js';
import { getSpellchecker } from './vendor/monaco-spellchecker/spellchecker.es.js';
import './vendor/prism-code-editor/grammars/yaml.js';
import './vendor/prism-code-editor/grammars/markdown.js';
import './vendor/prism-code-editor/grammars/json.js';
import './vendor/prism-code-editor/grammars/css.js';
import { NAME, STORAGE, EDITOR_ENGINES, INDENT_MODES, LANGUAGES, SYNC_MODES } from './constants.js';
import { getCollapsedGroups, getLineDiff, getSources } from './SourceManager.js';
import { HistoryStore } from './HistoryStore.js';
import { HistoryPanel } from './HistoryPanel.js';
import { renderSettingsPanel } from './SettingsPanel.js';
import { isLorebookGroup, openSourceControlDialog, renderSourceTree } from './SourcePanel.js';
// Disable tag highlighting to prevent misalignment issues
if (Prism.languages.markdown) {
    delete Prism.languages.markdown.tag;
}
const getIndentMode = () => {
    const stored = localStorage.getItem(STORAGE.indentMode);
    return INDENT_MODES.find(mode => mode.id === stored) ?? INDENT_MODES[0];
};
const getEditorEngine = () => {
    const stored = localStorage.getItem(STORAGE.editorEngine);
    return EDITOR_ENGINES.find(engine => engine.id === stored) ?? EDITOR_ENGINES[0];
};
const isSpellCheckEnabled = () => JSON.parse(localStorage.getItem(STORAGE.spellCheck) || 'false');
const isMonacoMinimapEnabled = () => JSON.parse(localStorage.getItem(STORAGE.monacoMinimap) || 'false');
const getStoredSourceLanguages = () => {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE.sourceLanguages) || '{}');
        return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
    }
    catch {
        return {};
    }
};
const getTrackedSourceGroups = () => {
    try {
        const value = JSON.parse(localStorage.getItem(STORAGE.trackedSources) || '[]');
        return Array.isArray(value) ? value.filter((group) => typeof group === 'string') : [];
    }
    catch {
        return [];
    }
};
let monacoLoadPromise = null;
let typoLoadPromise = null;
let englishDictionaryPromise = null;
const loadMonaco = async () => {
    if (globalThis.monaco?.editor)
        return globalThis.monaco;
    if (monacoLoadPromise)
        return monacoLoadPromise;
    monacoLoadPromise = new Promise((resolve, reject) => {
        const configure = () => {
            const requirejs = globalThis.require;
            if (!requirejs?.config) {
                reject(new Error('Monaco AMD loader did not initialize.'));
                return;
            }
            const vsPath = new URL('./vendor/monaco-editor/min/vs', import.meta.url).toString();
            requirejs.config({ paths: { vs: vsPath } });
            requirejs(['vs/editor/editor.main'], () => {
                if (globalThis.monaco?.editor)
                    resolve(globalThis.monaco);
                else
                    reject(new Error('Monaco editor API was not found after loading.'));
            }, reject);
        };
        if (globalThis.require?.config) {
            configure();
            return;
        }
        const loader = document.createElement('script');
        loader.src = new URL('./vendor/monaco-editor/min/vs/loader.js', import.meta.url).toString();
        loader.onload = configure;
        loader.onerror = () => reject(new Error('Failed to load Monaco AMD loader.'));
        document.head.append(loader);
    });
    return monacoLoadPromise;
};
const loadTypo = async () => {
    if (globalThis.Typo)
        return globalThis.Typo;
    if (typoLoadPromise)
        return typoLoadPromise;
    typoLoadPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = new URL('./vendor/typo-js/typo.js', import.meta.url).toString();
        script.onload = () => {
            if (globalThis.Typo)
                resolve(globalThis.Typo);
            else
                reject(new Error('Typo.js loaded, but window.Typo was not found.'));
        };
        script.onerror = () => reject(new Error('Failed to load Typo.js.'));
        document.head.append(script);
    });
    return typoLoadPromise;
};
const loadEnglishDictionary = async () => {
    if (englishDictionaryPromise)
        return englishDictionaryPromise;
    englishDictionaryPromise = (async () => {
        const Typo = await loadTypo();
        const baseUrl = new URL('./vendor/typo-js/dictionaries/en_US/', import.meta.url);
        const [affResponse, dicResponse] = await Promise.all([
            fetch(new URL('en_US.aff', baseUrl)),
            fetch(new URL('en_US.dic', baseUrl)),
        ]);
        if (!affResponse.ok || !dicResponse.ok) {
            throw new Error('Failed to load en_US spellcheck dictionary.');
        }
        const [affData, wordsData] = await Promise.all([
            affResponse.text(),
            dicResponse.text(),
        ]);
        return new Typo('en_US', affData, wordsData);
    })();
    return englishDictionaryPromise;
};
export class EveryTextLineEditor {
    sources;
    selectedSource;
    selectedSourceBaseline;
    selectedSourceChanged;
    dirty;
    collapsedGroups;
    currentLanguage = LANGUAGES[0];
    scrollSyncMode = SYNC_MODES[1];
    editorEngine = EDITOR_ENGINES[0];
    dom;
    editor;
    oldEditor;
    editorReady;
    monacoEditor;
    monacoSpellcheckers;
    monacoSpellcheckFrame;
    monacoUserDictionary;
    monacoIgnoredWords;
    monacoDiffEditor;
    monacoDiffOriginalModel;
    monacoDiffModifiedModel;
    diffOpen;
    isSyncingScroll;
    scrollSyncFrame;
    pendingScrollSync;
    pendingDiffScrollSync;
    indentMode;
    selectedSidebarTab;
    selectedHistoryGroup;
    historyStore;
    historyPanel;
    historyCommit;
    sourceLanguages;
    suppressEditorChange;
    trackedSourceGroups;
    sourceWatchTimer;
    sourceWatchInFlight;
    constructor() {
        this.sources = [];
        this.selectedSource = null;
        this.selectedSourceBaseline = '';
        this.selectedSourceChanged = false;
        this.dirty = false;
        this.collapsedGroups = getCollapsedGroups();
        this.dom = {};
        this.editor = null;
        this.oldEditor = null;
        this.editorReady = Promise.resolve();
        this.monacoEditor = null;
        this.monacoSpellcheckers = [];
        this.monacoSpellcheckFrame = null;
        this.monacoUserDictionary = new Set();
        this.monacoIgnoredWords = new Set();
        this.monacoDiffEditor = null;
        this.monacoDiffOriginalModel = null;
        this.monacoDiffModifiedModel = null;
        this.diffOpen = false;
        this.isSyncingScroll = false;
        this.scrollSyncFrame = 0;
        this.pendingScrollSync = null;
        this.pendingDiffScrollSync = null;
        this.indentMode = getIndentMode();
        this.editorEngine = getEditorEngine();
        this.selectedSidebarTab = 'sources';
        this.selectedHistoryGroup = '';
        this.historyStore = new HistoryStore();
        this.sourceLanguages = getStoredSourceLanguages();
        this.suppressEditorChange = false;
        this.trackedSourceGroups = new Set(getTrackedSourceGroups());
        this.sourceWatchTimer = null;
        this.sourceWatchInFlight = false;
        const storedSync = localStorage.getItem(STORAGE.scrollSync);
        this.scrollSyncMode = SYNC_MODES.find(m => m.id === storedSync) ?? SYNC_MODES[1];
    }
    async inject() {
        this.renderDrawer();
        await this.editorReady;
        await this.refreshSources();
        this.startSourceWatcher();
    }
    destroy() {
        this.stopSourceWatcher();
        this.closeMonacoDiff({ syncValue: true });
        this.disposeMonacoSpellcheckers();
        this.editor?.dispose?.();
        this.oldEditor?.dispose?.();
        this.dom.drawer?.remove();
        this.sources = [];
        this.selectedSource = null;
        this.selectedSourceBaseline = '';
        this.editor = null;
        this.oldEditor = null;
        this.monacoEditor = null;
        if (window.EveryTextLineEditor === this) {
            delete window.EveryTextLineEditor;
        }
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
            }
            else {
                toggle.addEventListener('click', () => this.toggleDrawerClasses());
            }
        }
        else {
            document.body.append(drawer);
            toggle.addEventListener('click', () => this.toggleDrawerClasses());
        }
        document.addEventListener('click', (event) => this.handleDocumentClick(event), { capture: true });
    }
    handleDrawerToggle(event) {
        if (!this.dirty || !this.dom.root.classList.contains('openDrawer'))
            return;
        event.preventDefault();
        event.stopImmediatePropagation();
        this.close().catch((error) => console.error(`[${NAME}] Failed to close editor`, error));
    }
    handleDocumentClick(event) {
        if (!this.dirty || !this.dom.root.classList.contains('openDrawer'))
            return;
        const target = event.target;
        if (!(target instanceof Node))
            return;
        if (this.dom.drawer.contains(target))
            return;
        if (this.dom.root?.contains(target))
            return;
        if (target instanceof Element && target.closest?.('.popup, dialog, .dialogue_popup'))
            return;
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
        root.classList.toggle('etle--sidebarCollapsed', localStorage.getItem(STORAGE.sidebarCollapsed) === 'true');
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
        const refresh = this.makeIconButton('fa-sync-alt', 'Refresh sources', () => this.refreshSources(true));
        sidebarHead.append(refresh);
        const collapseSidebar = this.makeIconButton('fa-angle-double-left', 'Collapse sidebar', () => this.setSidebarCollapsed(true));
        this.dom.sidebarCollapse = collapseSidebar;
        sidebarHead.append(collapseSidebar);
        const tabs = document.createElement('div');
        this.dom.sidebarTabs = tabs;
        tabs.classList.add('etle--sidebarTabs');
        sidebar.append(tabs);
        const tabDefs = [
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
        const sourcesToolbar = document.createElement('div');
        this.dom.sourcesToolbar = sourcesToolbar;
        sourcesToolbar.classList.add('etle--sourcesToolbar');
        const addSource = this.makeTextButton('Control', 'fa-filter', () => this.openSourceControlDialog());
        this.dom.addSource = addSource;
        const sourceSearch = document.createElement('input');
        this.dom.sourceSearch = sourceSearch;
        sourceSearch.classList.add('etle--sourceSearch');
        sourceSearch.type = 'search';
        sourceSearch.placeholder = 'Filter sources';
        sourceSearch.addEventListener('input', () => this.renderTree());
        const tree = document.createElement('div');
        this.dom.tree = tree;
        tree.classList.add('etle--tree');
        sourcesPanel.append(sourceSearch);
        sourcesPanel.append(tree);
        sourcesToolbar.append(addSource);
        sourcesPanel.append(sourcesToolbar);
        const historyPanel = document.createElement('section');
        this.dom.historyPanel = historyPanel;
        historyPanel.classList.add('etle--tabPanel', 'etle--historyPanel');
        historyPanel.dataset.tab = 'history';
        sidebarBody.append(historyPanel);
        sidebarBody.append(renderSettingsPanel(this));
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
        const restoreSidebar = this.makeIconButton('fa-angle-double-right', 'Show sidebar', () => this.setSidebarCollapsed(false));
        this.dom.sidebarRestore = restoreSidebar;
        restoreSidebar.classList.add('etle--sidebarRestore');
        header.append(restoreSidebar);
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
        this.dom.diff = this.makeTextButton('Diff', 'fa-code-branch', () => this.toggleDiff());
        this.dom.revert = this.makeTextButton('', 'fa-undo', () => this.revert());
        this.dom.apply = this.makeTextButton('', 'fa-check', () => this.apply());
        actionsRight.append(this.dom.diff, this.dom.revert, this.dom.apply, this.makeIconButton('fa-times', 'Close editor', () => this.close().catch((error) => console.error(`[${NAME}] Failed to close editor`, error))));
        const workspace = document.createElement('div');
        this.dom.workspace = workspace;
        workspace.classList.add('etle--workspace');
        main.append(workspace);
        const oldEditorHost = document.createElement('div');
        this.dom.oldEditorHost = oldEditorHost;
        oldEditorHost.classList.add('etle--oldEditorHost');
        const oldDiffLabel = document.createElement('div');
        this.dom.oldDiffLabel = oldDiffLabel;
        oldDiffLabel.classList.add('etle--diffSideLabel');
        oldEditorHost.append(oldDiffLabel);
        workspace.append(oldEditorHost);
        const editorHost = document.createElement('div');
        this.dom.editorHost = editorHost;
        editorHost.classList.add('etle--editorHost');
        const editorDiffLabel = document.createElement('div');
        this.dom.editorDiffLabel = editorDiffLabel;
        editorDiffLabel.classList.add('etle--diffSideLabel');
        editorHost.append(editorDiffLabel);
        workspace.append(editorHost);
        const monacoDiffHost = document.createElement('div');
        this.dom.monacoDiffHost = monacoDiffHost;
        monacoDiffHost.classList.add('etle--monacoDiffHost');
        const monacoDiffLabels = document.createElement('div');
        this.dom.monacoDiffLabels = monacoDiffLabels;
        monacoDiffLabels.classList.add('etle--monacoDiffLabels');
        const monacoDiffOriginalLabel = document.createElement('div');
        this.dom.monacoDiffOriginalLabel = monacoDiffOriginalLabel;
        monacoDiffOriginalLabel.classList.add('etle--diffSideLabel');
        const monacoDiffModifiedLabel = document.createElement('div');
        this.dom.monacoDiffModifiedLabel = monacoDiffModifiedLabel;
        monacoDiffModifiedLabel.classList.add('etle--diffSideLabel');
        monacoDiffLabels.append(monacoDiffOriginalLabel, monacoDiffModifiedLabel);
        const monacoDiffEditorHost = document.createElement('div');
        this.dom.monacoDiffEditorHost = monacoDiffEditorHost;
        monacoDiffEditorHost.classList.add('etle--monacoDiffEditorHost');
        monacoDiffHost.append(monacoDiffLabels, monacoDiffEditorHost);
        workspace.append(monacoDiffHost);
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
        if (this.dom.historyPanel) {
            this.historyPanel = new HistoryPanel(this.dom.historyPanel, {
                onDiffCommit: (commit) => this.diffHistoryCommit(commit),
                onLoadCommit: (commit) => this.loadHistoryCommit(commit),
                onInitialCommit: async () => {
                    const groupToCommit = this.selectedHistoryGroup || this.selectedSource?.group;
                    if (!groupToCommit)
                        return;
                    const sourcesInGroup = this.sources.filter(s => s.group === groupToCommit && !s.readonly && !s.placeholder);
                    const batchId = this.createHistoryBatchId();
                    const scope = this.getHistoryScope(sourcesInGroup[0]);
                    await Promise.all(sourcesInGroup.map(async (source) => {
                        try {
                            const value = source.read();
                            await this.historyStore.commit(source, value, 'initial', 'Initial commit', batchId, this.getHistoryScope(source, scope));
                        }
                        catch (err) {
                            console.warn(`[ETLE] Failed to commit initial state for ${source.id}`, err);
                        }
                    }));
                    await this.refreshHistory();
                },
                onManualCommit: async (message, changedSources) => {
                    const batchId = this.createHistoryBatchId();
                    await Promise.all(changedSources.map(async ({ source }) => {
                        try {
                            const value = source.read();
                            await this.historyStore.commit(source, value, 'manual', message || undefined, batchId, this.getHistoryScope(source));
                        }
                        catch (err) {
                            console.warn(`[ETLE] Failed to commit ${source.id}`, err);
                        }
                    }));
                    await this.refreshHistory();
                },
                onSelectCategory: async (groupName) => {
                    this.selectedHistoryGroup = groupName;
                    const firstSource = this.sources.find(s => s.group === groupName && !s.placeholder);
                    if (firstSource && (!this.selectedSource || this.selectedSource.group !== groupName)) {
                        await this.selectSource(firstSource.id, { force: true });
                    }
                    else {
                        await this.refreshHistory();
                    }
                },
                onSelectSource: async (sourceId) => {
                    await this.selectSource(sourceId, { force: true });
                },
                onCompareChanged: async (change) => {
                    await this.compareChangedSource(change);
                }
            });
        }
        this.historyStore.open().catch(err => console.error('[ETLE] History failed to open', err));
        this.updateDirty(false);
        this.updateStatusBar();
        return root;
    }
    createHistoryBatchId() {
        return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    }
    async exportHistory() {
        const data = await this.historyStore.exportAll();
        const payload = {
            schemaVersion: 1,
            exportedAt: new Date().toISOString(),
            extension: NAME,
            historyDbVersion: 2,
            ...data,
        };
        const stamp = new Date().toISOString().replace(/[:.]/g, '-');
        download(JSON.stringify(payload, null, 2), `${NAME}-history-${stamp}.json`, 'application/json');
        globalThis.toastr?.success?.(`Exported ${data.commits.length} history snapshots`);
    }
    async clearHistory() {
        const result = await Popup.show.confirm('Clear History', 'Delete all local ETLE history snapshots from this browser? SillyTavern settings and current prompt text will not be changed.', {
            okButton: 'Clear History',
            cancelButton: 'Cancel',
            defaultResult: POPUP_RESULT.CANCELLED,
        });
        if (result !== POPUP_RESULT.AFFIRMATIVE)
            return;
        await this.historyStore.clearAll();
        await this.refreshHistory();
        globalThis.toastr?.success?.('Local ETLE history cleared');
    }
    getHistoryScope(source, fallback) {
        if (!source)
            return fallback ?? { scopeId: 'global:global', scopeType: 'global', scopeLabel: 'global' };
        const currentBranch = source.branchManager?.getCurrentBranch?.();
        if (source.group.includes('Chat Completion') || source.group.includes('Utility') || source.group.includes('Formatting')) {
            const label = currentBranch || 'Default';
            return { scopeId: `openai-preset:${label}`, scopeType: 'openai-preset', scopeLabel: label };
        }
        if (source.group.includes('Custom OpenAI')) {
            const label = currentBranch || 'Default';
            return { scopeId: `openai-preset:${label}`, scopeType: 'openai-preset', scopeLabel: label };
        }
        if (source.group.includes('Text Completion')) {
            const label = currentBranch || 'Default';
            return { scopeId: `textgen-preset:${label}`, scopeType: 'textgen-preset', scopeLabel: label };
        }
        if (source.group.includes('Instruct')) {
            const label = currentBranch || 'Default';
            return { scopeId: `instruct-template:${label}`, scopeType: 'instruct-template', scopeLabel: label };
        }
        if (source.group.includes('Context')) {
            const label = currentBranch || 'Default';
            return { scopeId: `context-template:${label}`, scopeType: 'context-template', scopeLabel: label };
        }
        if (source.group.includes('System Prompt')) {
            const label = currentBranch || 'Default';
            return { scopeId: `sysprompt:${label}`, scopeType: 'sysprompt', scopeLabel: label };
        }
        if (source.group.startsWith('World/Lorebook: ')) {
            const label = source.group.replace('World/Lorebook: ', '');
            return { scopeId: `world:${label}`, scopeType: 'world', scopeLabel: label };
        }
        if (source.group.includes('Persona')) {
            return { scopeId: 'persona:active', scopeType: 'persona', scopeLabel: 'Active Persona' };
        }
        if (source.group.includes('Connection Profiles')) {
            const id = source.id.replace(/^connection-profile:/, '') || source.label || 'unknown';
            const label = source.label || currentBranch || id;
            return { scopeId: `connection-profile:${id}`, scopeType: 'connection-profile', scopeLabel: label };
        }
        return fallback ?? { scopeId: 'global:global', scopeType: 'global', scopeLabel: 'global' };
    }
    setSidebarTab(tab) {
        this.selectedSidebarTab = tab;
        this.dom.sidebarTabs?.querySelectorAll('.etle--sidebarTab').forEach(button => {
            button.classList.toggle('etle--activeTab', button.dataset.tab === tab);
        });
        this.dom.sidebarBody?.querySelectorAll('.etle--tabPanel').forEach(panel => {
            panel.hidden = panel.dataset.tab !== tab;
        });
        if (tab === 'history')
            this.refreshHistory();
    }
    setSidebarCollapsed(collapsed) {
        this.dom.root?.classList.toggle('etle--sidebarCollapsed', collapsed);
        localStorage.setItem(STORAGE.sidebarCollapsed, JSON.stringify(collapsed));
        requestAnimationFrame(() => {
            this.editor?.update?.();
            this.oldEditor?.update?.();
            this.updateMasterScrollbarHeight();
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
        const branch = document.createElement('select');
        this.dom.statusBranch = branch;
        branch.classList.add('etle--statusBranch', 'etle--statusItem', 'menu_button');
        branch.hidden = true;
        branch.addEventListener('change', async () => {
            const selectedBranch = branch.value;
            const branchManager = this.selectedSource?.branchManager;
            if (!branchManager || branchManager.getCurrentBranch() === selectedBranch)
                return;
            if (this.dirty) {
                const choice = await this.confirmUnsavedSourceChange('switch branch');
                if (choice === 'cancel') {
                    branch.value = branchManager.getCurrentBranch(); // Revert selection
                    return;
                }
                if (choice === 'save') {
                    const saved = await this.saveCurrentSource({ refresh: false, toast: true });
                    if (!saved) {
                        branch.value = branchManager.getCurrentBranch(); // Revert selection
                        return;
                    }
                }
                if (choice === 'discard') {
                    this.updateDirty(false);
                }
            }
            await branchManager.switchBranch(selectedBranch);
            // Give ST a moment to update globals before refreshing
            setTimeout(async () => {
                await this.refreshSources(true);
                if (this.selectedSidebarTab === 'history')
                    await this.refreshHistory();
            }, 100);
        });
        const branchWrapper = document.createElement('div');
        branchWrapper.classList.add('etle--statusBranchWrapper');
        branchWrapper.innerHTML = '<span class="fa-solid fa-code-branch etle--statusBranchIcon"></span>';
        branchWrapper.append(branch);
        left.append(branchWrapper);
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
        const spell = document.createElement('button');
        this.dom.statusSpellCheck = spell;
        spell.type = 'button';
        spell.classList.add('etle--statusButton');
        spell.title = 'Toggle spell check';
        spell.addEventListener('click', () => this.setSpellCheck(!isSpellCheckEnabled()));
        right.append(spell);
        const minimap = document.createElement('button');
        this.dom.statusMinimap = minimap;
        minimap.type = 'button';
        minimap.classList.add('etle--statusButton');
        minimap.title = 'Toggle Monaco minimap';
        minimap.addEventListener('click', () => this.setMonacoMinimap(!isMonacoMinimapEnabled()));
        right.append(minimap);
        const language = document.createElement('button');
        this.dom.statusLanguage = language;
        language.type = 'button';
        language.classList.add('etle--statusButton');
        language.title = 'Choose syntax language';
        language.addEventListener('click', (event) => {
            event.stopPropagation();
            this.toggleLanguageMenu();
        });
        right.append(language);
        const engine = document.createElement('button');
        this.dom.statusEngine = engine;
        engine.type = 'button';
        engine.classList.add('etle--statusButton');
        engine.title = 'Cycle editor engine';
        engine.addEventListener('click', () => this.cycleEditorEngine().catch((error) => console.error(`[${NAME}] Failed to cycle editor engine`, error)));
        right.append(engine);
        const sync = document.createElement('button');
        this.dom.statusScrollSync = sync;
        sync.type = 'button';
        sync.classList.add('etle--statusButton');
        sync.title = 'Cycle scroll sync mode';
        sync.addEventListener('click', () => this.cycleScrollSync());
        right.append(sync);
        return status;
    }
    async cycleEditorEngine() {
        const index = EDITOR_ENGINES.findIndex(engine => engine.id === this.editorEngine.id);
        await this.setEditorEngine(EDITOR_ENGINES[(index + 1) % EDITOR_ENGINES.length]);
    }
    async setEditorEngine(engine) {
        if (engine.id === this.editorEngine.id)
            return;
        const previousEngine = this.editorEngine;
        this.closeMonacoDiff({ syncValue: true });
        const currentValue = this.editor?.value ?? '';
        const currentScrollTop = this.editor?.scrollContainer?.scrollTop ?? 0;
        const readOnly = !!this.selectedSource?.readonly;
        try {
            const nextEditor = await this.createEditorForEngine(this.dom.editorHost, engine, currentValue, readOnly);
            this.editor?.dispose?.();
            this.editor?.scrollContainer?.remove();
            this.editor = nextEditor;
            this.editor.scrollContainer.scrollTop = currentScrollTop;
            this.editorEngine = engine;
            localStorage.setItem(STORAGE.editorEngine, engine.id);
            if (this.dom.editorEngine)
                this.dom.editorEngine.value = engine.id;
            this.bindDiffScrollSync();
            this.updateDirty(this.isCurrentEditorDirty());
            if (this.diffOpen && engine.id === 'monaco')
                await this.openMonacoDiff();
            else
                this.renderDiff();
            this.updateStatusBar();
            requestAnimationFrame(() => this.editor?.update?.());
        }
        catch (error) {
            this.editorEngine = previousEngine;
            if (this.dom.editorEngine)
                this.dom.editorEngine.value = previousEngine.id;
            globalThis.toastr?.error?.('Monaco editor is not available. Staying on Prism.');
            throw error;
        }
    }
    async createEditorForEngine(host, engine, value = '', readOnly = false) {
        if (engine.id === 'monaco') {
            return this.createMonacoEditor(host, value, readOnly);
        }
        return this.createPrismCodeEditor(host, value, readOnly);
    }
    createCodeEditor(host) {
        this.editorReady = this.createEditorForEngine(host, this.editorEngine, '', false).then((editor) => {
            this.editor = editor;
            this.bindDiffScrollSync();
        }).catch((error) => {
            console.warn(`[${NAME}] Failed to initialize ${this.editorEngine.label}; falling back to Prism`, error);
            this.editorEngine = EDITOR_ENGINES[0];
            localStorage.setItem(STORAGE.editorEngine, this.editorEngine.id);
            this.editor = this.createPrismCodeEditor(host, '', false);
            this.bindDiffScrollSync();
            this.updateStatusBar();
        });
    }
    createPrismCodeEditor(host, value = '', readOnly = false) {
        languageMap.markdown = languageMap.md = {
            comments: {
                block: ['<!--', '-->'],
            },
        };
        const editor = createEditor(host, {
            value,
            language: 'markdown',
            lineNumbers: true,
            readOnly,
            insertSpaces: this.indentMode.insertSpaces,
            tabSize: this.indentMode.tabSize,
            wordWrap: JSON.parse(localStorage.getItem(STORAGE.wordWrap) || 'true'),
            onUpdate: (value) => {
                if (this.suppressEditorChange)
                    return;
                if (!this.selectedSource)
                    return;
                this.updateDirty(this.isValueDirty(value));
                this.renderDiff();
                this.updateStatusBar();
            },
        }, searchWidget(), highlightBracketPairs(), matchBrackets(true), indentGuides(), defaultCommands());
        this.applySpellCheckToTextArea(editor.textarea);
        editor.textarea.addEventListener('keydown', (event) => this.handleEditorKeyDown(event), { capture: true });
        setSlashCommandAutoComplete(editor.textarea, true).then((autocomplete) => {
            editor.textarea.addEventListener('keydown', (event) => autocomplete.handleKeyDown(event), { capture: true });
        }).catch(() => { });
        const syncCaret = () => {
            this.updateStatusBar();
            this.scheduleDiffScrollSync();
        };
        editor.textarea.addEventListener('keydown', (event) => {
            if (this.isCaretNavigationKey(event))
                this.scheduleDiffScrollSync();
        });
        editor.textarea.addEventListener('keyup', syncCaret);
        editor.textarea.addEventListener('pointerup', syncCaret);
        editor.textarea.addEventListener('click', syncCaret);
        editor.textarea.addEventListener('select', syncCaret);
        editor.textarea.addEventListener('input', syncCaret);
        document.addEventListener('selectionchange', () => {
            if (document.activeElement === editor.textarea)
                syncCaret();
        });
        return editor;
    }
    async createMonacoEditor(host, value = '', readOnly = false) {
        const monaco = await loadMonaco();
        const container = document.createElement('div');
        container.classList.add('etle--monacoEditor');
        host.append(container);
        const focusProxy = document.createElement('textarea');
        focusProxy.classList.add('etle--monacoFocusProxy');
        focusProxy.tabIndex = -1;
        this.applySpellCheckToTextArea(focusProxy);
        container.append(focusProxy);
        const model = monaco.editor.createModel(value, this.getMonacoLanguageId());
        const monacoEditor = monaco.editor.create(container, {
            model,
            readOnly,
            automaticLayout: true,
            minimap: { enabled: isMonacoMinimapEnabled() && !(this.diffOpen && this.dom.root?.classList.contains('etle--monacoDiffMode')) },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: JSON.parse(localStorage.getItem(STORAGE.wordWrap) || 'true') ? 'on' : 'off',
            theme: 'vs-dark',
        });
        this.monacoEditor = monacoEditor;
        this.applySpellCheckToMonaco(container);
        this.observeMonacoSpellCheck(container);
        this.setupMonacoSpellchecker(monacoEditor).catch((error) => console.warn(`[${NAME}] Failed to start Monaco spellcheck`, error));
        focusProxy.addEventListener('focus', () => monacoEditor.focus());
        container.addEventListener('focusin', () => this.applySpellCheckToMonaco(container));
        container.addEventListener('keydown', (event) => this.handleEditorKeyDown(event), { capture: true });
        monacoEditor.onDidChangeModelContent(() => {
            if (this.suppressEditorChange)
                return;
            if (!this.selectedSource)
                return;
            this.updateDirty(this.isValueDirty(model.getValue()));
            this.renderDiff();
            this.updateStatusBar();
            this.scheduleMonacoSpellcheck();
        });
        monacoEditor.onDidChangeCursorPosition(() => {
            this.updateStatusBar();
            this.scheduleDiffScrollSync();
        });
        monacoEditor.onDidChangeCursorSelection(() => {
            this.updateStatusBar();
            this.scheduleDiffScrollSync();
        });
        monacoEditor.onDidScrollChange(() => {
            this.updateMasterScrollbarHeight();
        });
        const wrapper = {
            get value() {
                return model.getValue();
            },
            textarea: focusProxy,
            scrollContainer: container,
            wrapper: container,
            setOptions: (options) => {
                if (typeof options.value === 'string' && options.value !== model.getValue()) {
                    model.setValue(options.value);
                }
                if (typeof options.readOnly === 'boolean') {
                    monacoEditor.updateOptions({ readOnly: options.readOnly });
                }
                if (typeof options.wordWrap === 'boolean') {
                    monacoEditor.updateOptions({ wordWrap: options.wordWrap ? 'on' : 'off' });
                }
                if (typeof options.minimap === 'boolean') {
                    monacoEditor.updateOptions({ minimap: { enabled: options.minimap } });
                }
                if (typeof options.language === 'string') {
                    monaco.editor.setModelLanguage(model, options.language === 'text' ? 'plaintext' : options.language);
                }
                if (typeof options.spellCheck === 'boolean') {
                    this.applySpellCheckToTextArea(focusProxy);
                    this.applySpellCheckToMonaco(container);
                }
            },
            update: () => monacoEditor.layout(),
            focus: () => monacoEditor.focus(),
            getCursorPosition: () => {
                const position = monacoEditor.getPosition();
                return {
                    line: position?.lineNumber ?? 1,
                    column: position?.column ?? 1,
                };
            },
            getSelectionLength: () => {
                const selection = monacoEditor.getSelection();
                if (!selection || selection.isEmpty())
                    return 0;
                return model.getValueInRange(selection).length;
            },
            dispose: () => {
                this.disposeMonacoSpellcheckers();
                if (this.monacoEditor === monacoEditor)
                    this.monacoEditor = null;
                monacoEditor.dispose();
                model.dispose();
            },
        };
        return wrapper;
    }
    handleEditorKeyDown(event) {
        const isSave = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's';
        if (!isSave)
            return;
        event.preventDefault();
        event.stopImmediatePropagation();
        this.apply().catch((error) => console.error(`[${NAME}] Failed to save from keyboard shortcut`, error));
    }
    isCaretNavigationKey(event) {
        return [
            'ArrowUp',
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'PageUp',
            'PageDown',
            'Home',
            'End',
        ].includes(event.key);
    }
    createReadonlyEditor(host) {
        this.oldEditor = createEditor(host, {
            value: '',
            language: 'markdown',
            lineNumbers: true,
            readOnly: true,
            insertSpaces: this.indentMode.insertSpaces,
            tabSize: this.indentMode.tabSize,
            wordWrap: JSON.parse(localStorage.getItem(STORAGE.wordWrap) || 'true'),
        }, searchWidget(), highlightBracketPairs(), matchBrackets(true), indentGuides());
        this.bindDiffScrollSync();
    }
    bindDiffScrollSync() {
        if (!this.editor || !this.oldEditor || !this.dom.masterScrollbar)
            return;
        const syncFromMaster = () => {
            if (!this.diffOpen || this.scrollSyncMode.id === 'off' || this.isSyncingScroll)
                return;
            this.isSyncingScroll = true;
            const top = this.dom.masterScrollbar.scrollTop;
            this.editor.scrollContainer.scrollTop = top;
            this.oldEditor.scrollContainer.scrollTop = top;
            setTimeout(() => this.isSyncingScroll = false, 0);
        };
        const handleWheel = (event) => {
            if (!this.diffOpen || this.scrollSyncMode.id === 'off')
                return;
            event.preventDefault();
            this.dom.masterScrollbar.scrollTop += event.deltaY;
        };
        this.dom.masterScrollbar.addEventListener('scroll', syncFromMaster, { passive: true });
        this.editor.scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
        this.oldEditor.scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
        const syncFromEditor = (from, to) => {
            if (!this.diffOpen || this.scrollSyncMode.id === 'off' || this.isSyncingScroll)
                return;
            this.applyScrollSync(from, to);
            this.dom.masterScrollbar.scrollTop = from.scrollTop;
        };
        this.editor.scrollContainer.addEventListener('scroll', () => syncFromEditor(this.editor.scrollContainer, this.oldEditor.scrollContainer), { passive: true });
        this.oldEditor.scrollContainer.addEventListener('scroll', () => syncFromEditor(this.oldEditor.scrollContainer, this.editor.scrollContainer), { passive: true });
    }
    applyScrollSync(from, to) {
        this.isSyncingScroll = true;
        if (this.scrollSyncMode.id === 'line') {
            const fromLine = from.querySelector('.pce-line');
            const toLine = to.querySelector('.pce-line');
            if (fromLine && toLine) {
                const fromH = fromLine.offsetHeight;
                const toH = toLine.offsetHeight;
                const nextTop = (from.scrollTop / fromH) * toH;
                if (Math.abs(to.scrollTop - nextTop) > 0.5)
                    to.scrollTop = nextTop;
            }
        }
        else {
            const fromMax = from.scrollHeight - from.clientHeight;
            const toMax = to.scrollHeight - to.clientHeight;
            const nextTop = (from.scrollTop / Math.max(1, fromMax)) * toMax;
            if (Math.abs(to.scrollTop - nextTop) > 0.5)
                to.scrollTop = nextTop;
        }
        const fromMaxX = from.scrollWidth - from.clientWidth;
        const toMaxX = to.scrollWidth - to.clientWidth;
        const nextLeft = (from.scrollLeft / Math.max(1, fromMaxX)) * toMaxX;
        if (Math.abs(to.scrollLeft - nextLeft) > 0.5)
            to.scrollLeft = nextLeft;
        // Reset guard after current execution stack
        setTimeout(() => this.isSyncingScroll = false, 0);
    }
    syncDiffScroll() {
        if (!this.editor || !this.oldEditor || !this.diffOpen)
            return;
        this.applyScrollSync(this.editor.scrollContainer, this.oldEditor.scrollContainer);
        if (this.dom.masterScrollbar) {
            this.dom.masterScrollbar.scrollTop = this.editor.scrollContainer.scrollTop;
        }
    }
    scheduleDiffScrollSync() {
        if (!this.diffOpen || this.scrollSyncMode.id === 'off')
            return;
        if (this.pendingDiffScrollSync !== null)
            return;
        this.pendingDiffScrollSync = requestAnimationFrame(() => {
            this.pendingDiffScrollSync = null;
            this.syncDiffScroll();
        });
    }
    async refreshSources(keepSelection = false) {
        const previousId = keepSelection ? this.selectedSource?.id : localStorage.getItem(STORAGE.selectedSource);
        this.sources = await getSources();
        this.pruneTrackedSources();
        this.renderTree();
        this.updateStatusBar();
        const visibleSources = this.getTrackedSources();
        if (previousId && visibleSources.some(source => source.id === previousId)) {
            await this.selectSource(previousId, { force: true });
        }
        else if (visibleSources.length && (!this.selectedSource || !visibleSources.some(source => source.id === this.selectedSource?.id))) {
            await this.selectSource(visibleSources[0].id, { force: true });
        }
        else if (!visibleSources.length) {
            this.clearSelectedSource(this.sources.length
                ? 'No source categories selected'
                : 'No editable prompt sources found', this.sources.length
                ? 'Click Control to choose which categories stay in this list.'
                : 'Open Chat Completion settings once if PromptManager has not initialized yet.');
        }
        else if (!this.sources.length) {
            this.clearSelectedSource('No editable prompt sources found', 'Open Chat Completion settings once if PromptManager has not initialized yet.');
        }
    }
    async selectInitialSource() {
        const storedId = localStorage.getItem(STORAGE.selectedSource);
        const visibleSources = this.getTrackedSources();
        if (storedId && visibleSources.some(source => source.id === storedId)) {
            await this.selectSource(storedId, { force: true });
        }
        else if (visibleSources.length) {
            await this.selectSource(visibleSources[0].id, { force: true });
        }
    }
    renderTree() {
        renderSourceTree(this);
    }
    getTrackedSources() {
        return this.sources.filter(source => this.trackedSourceGroups.has(source.group));
    }
    persistTrackedSources() {
        localStorage.setItem(STORAGE.trackedSources, JSON.stringify([...this.trackedSourceGroups]));
    }
    pruneTrackedSources() {
        const availableGroups = new Set(this.sources.map(source => source.group));
        let changed = false;
        for (const group of [...this.trackedSourceGroups]) {
            if (!availableGroups.has(group)) {
                this.trackedSourceGroups.delete(group);
                changed = true;
            }
        }
        if (changed)
            this.persistTrackedSources();
    }
    async setTrackedSourceGroups(groups) {
        const availableGroups = new Set(this.sources.map(source => source.group));
        this.trackedSourceGroups = new Set(groups.filter(group => availableGroups.has(group)));
        this.persistTrackedSources();
        this.renderTree();
        this.updateStatusBar();
        const visibleSources = this.getTrackedSources();
        if (this.selectedSource && visibleSources.some(source => source.id === this.selectedSource?.id))
            return;
        const firstSelectable = visibleSources.find(source => source.selectable !== false);
        if (firstSelectable) {
            await this.selectSource(firstSelectable.id, { force: true });
        }
        else {
            this.clearSelectedSource('No source categories selected', 'Click Control to choose which categories stay in this list.');
        }
    }
    clearSelectedSource(title, detail) {
        this.selectedSource = null;
        this.selectedSourceBaseline = '';
        this.selectedSourceChanged = false;
        this.historyCommit = undefined;
        localStorage.removeItem(STORAGE.selectedSource);
        this.setEditorValue('');
        this.updateDirty(false);
        if (this.dom.currentTitle)
            this.dom.currentTitle.textContent = title;
        if (this.dom.currentGroup)
            this.dom.currentGroup.textContent = detail;
        if (this.dom.actionsLeft)
            this.dom.actionsLeft.innerHTML = '';
        if (this.editor)
            this.editor.setOptions({ readOnly: true });
        this.renderDiff();
        this.updateStatusBar();
    }
    openSourceControlDialog() {
        openSourceControlDialog(this);
    }
    getLanguageForSource(source) {
        if (!source)
            return this.currentLanguage;
        const stored = this.sourceLanguages[source.id];
        const storedLanguage = LANGUAGES.find(lang => lang.id === stored);
        if (storedLanguage)
            return storedLanguage;
        return this.guessLanguageForSource(source);
    }
    guessLanguageForSource(source) {
        const jsonLanguage = LANGUAGES.find(lang => lang.id === 'json') ?? LANGUAGES[0];
        const cssLanguage = LANGUAGES.find(lang => lang.id === 'css') ?? LANGUAGES[0];
        const markdownLanguage = LANGUAGES.find(lang => lang.id === 'markdown') ?? LANGUAGES[0];
        const textLanguage = LANGUAGES.find(lang => lang.id === 'text') ?? LANGUAGES[0];
        const id = source.id.toLowerCase();
        const label = source.label.toLowerCase();
        if (id.includes('custom_css') || label.includes('css'))
            return cssLanguage;
        if (source.group.includes('Connection Profiles'))
            return jsonLanguage;
        if (source.group.includes('Character Card') && label.includes('json'))
            return jsonLanguage;
        if (id.includes('custom_include_body') || id.includes('custom_exclude_body') || id.includes('custom_include_headers'))
            return jsonLanguage;
        if (label.includes('json'))
            return jsonLanguage;
        if (label.includes('grammar') || label.includes('tokens'))
            return textLanguage;
        return markdownLanguage;
    }
    setSourceLanguage(source, lang) {
        const guessed = this.guessLanguageForSource(source);
        if (lang.id === guessed.id) {
            delete this.sourceLanguages[source.id];
        }
        else {
            this.sourceLanguages[source.id] = lang.id;
        }
        localStorage.setItem(STORAGE.sourceLanguages, JSON.stringify(this.sourceLanguages));
    }
    async toggleSource(source) {
        if (!source?.toggle)
            return;
        try {
            await source.toggle();
            await this.refreshSources(true);
            globalThis.toastr?.success?.(source.enabled ? 'Prompt disabled' : 'Prompt enabled');
        }
        catch (error) {
            console.error(`[${NAME}] Failed to toggle source`, error);
            globalThis.toastr?.error?.('Failed to toggle prompt. See console for details.');
        }
    }
    async selectSource(id, { force = false } = {}) {
        if (!force && this.selectedSource?.id === id)
            return;
        if (!force && this.dirty) {
            const choice = await this.confirmUnsavedSourceChange('switch');
            if (choice === 'cancel')
                return;
            if (choice === 'save') {
                const saved = await this.saveCurrentSource({ refresh: false, toast: true });
                if (!saved)
                    return;
            }
            if (choice === 'discard') {
                this.updateDirty(false);
            }
        }
        const source = this.sources.find(item => item.id === id);
        if (!source || source.selectable === false)
            return;
        this.selectedSource = source;
        if (this.historyCommit?.sourceId !== source.id)
            this.historyCommit = undefined;
        localStorage.setItem(STORAGE.selectedSource, source.id);
        this.selectedSourceBaseline = source.read();
        this.selectedSourceChanged = false;
        this.currentLanguage = this.getLanguageForSource(source);
        this.updateHeader();
        this.editor?.setOptions({ readOnly: !!source.readonly });
        this.editor?.setOptions({ language: this.currentLanguage.id });
        this.oldEditor?.setOptions({ language: this.currentLanguage.id });
        this.setMonacoDiffLanguage();
        this.setEditorValue(this.selectedSourceBaseline);
        this.updateDirty(false);
        this.renderDiff();
        this.updateStatusBar();
        this.renderTree();
        if (this.selectedSidebarTab === 'history')
            this.refreshHistory();
    }
    async confirmUnsavedSourceChange(action = 'switch') {
        const actionText = action === 'close'
            ? 'closing the editor'
            : action === 'load'
                ? 'loading this version'
                : 'switching sources';
        const result = await Popup.show.confirm('Unsaved changes', `Save changes before ${actionText}?`, {
            okButton: 'Save Changes',
            cancelButton: 'Cancel',
            customButtons: [{
                    text: 'Discard Changes',
                    result: POPUP_RESULT.CUSTOM1,
                    icon: 'fa-trash-can',
                    classes: ['redWarningBG'],
                }],
            defaultResult: POPUP_RESULT.AFFIRMATIVE,
        });
        if (result === POPUP_RESULT.AFFIRMATIVE)
            return 'save';
        if (result === POPUP_RESULT.CUSTOM1)
            return 'discard';
        return 'cancel';
    }
    setEditorValue(value) {
        const nextValue = String(value ?? '');
        this.withSuppressedEditorChange(() => {
            this.editor?.setOptions({ value: nextValue });
            if (this.monacoDiffModifiedModel && this.monacoDiffModifiedModel.getValue() !== nextValue) {
                this.monacoDiffModifiedModel.setValue(nextValue);
            }
        });
        this.renderDiff();
        this.updateStatusBar();
    }
    withSuppressedEditorChange(callback) {
        this.suppressEditorChange = true;
        try {
            callback();
        }
        finally {
            this.suppressEditorChange = false;
        }
    }
    isValueDirty(value) {
        return !!this.selectedSource && String(value ?? '') !== this.selectedSourceBaseline;
    }
    isCurrentEditorDirty() {
        return this.isValueDirty(this.getCurrentEditorValue());
    }
    startSourceWatcher() {
        this.stopSourceWatcher();
        this.sourceWatchTimer = window.setInterval(() => {
            this.refreshSelectedSourceBaseline().catch((error) => console.warn(`[${NAME}] Failed to refresh selected source`, error));
        }, 500);
    }
    stopSourceWatcher() {
        if (this.sourceWatchTimer === null)
            return;
        window.clearInterval(this.sourceWatchTimer);
        this.sourceWatchTimer = null;
    }
    async refreshSelectedSourceBaseline() {
        if (!this.selectedSource || this.historyCommit?.sourceId === this.selectedSource.id)
            return;
        if (this.sourceWatchInFlight)
            return;
        let liveValue;
        try {
            this.sourceWatchInFlight = true;
            liveValue = String(await (this.selectedSource.readFresh?.() ?? this.selectedSource.read()));
        }
        catch (error) {
            console.warn(`[${NAME}] Failed to read selected source`, error);
            return;
        }
        finally {
            this.sourceWatchInFlight = false;
        }
        if (liveValue === this.selectedSourceBaseline)
            return;
        this.selectedSourceBaseline = liveValue;
        this.selectedSourceChanged = true;
        this.updateDirty(this.isCurrentEditorDirty());
        this.renderDiff();
    }
    setWordWrap(enabled) {
        localStorage.setItem(STORAGE.wordWrap, JSON.stringify(enabled));
        this.editor?.setOptions({ wordWrap: enabled });
        this.oldEditor?.setOptions({ wordWrap: enabled });
        this.applyMonacoDiffWordWrapOption();
        this.updateStatusBar();
    }
    setSpellCheck(enabled) {
        localStorage.setItem(STORAGE.spellCheck, JSON.stringify(enabled));
        this.applySpellCheckToTextArea(this.editor?.textarea);
        this.applySpellCheckToTextArea(this.oldEditor?.textarea);
        this.applySpellCheckToMonaco(this.editor?.scrollContainer);
        this.applySpellCheckToMonaco(this.dom.monacoDiffHost);
        this.editor?.setOptions({ spellCheck: enabled });
        if (enabled) {
            this.rebuildMonacoSpellcheckers().catch((error) => console.warn(`[${NAME}] Failed to start Monaco spellcheck`, error));
        }
        else {
            this.disposeMonacoSpellcheckers();
        }
        this.updateStatusBar();
    }
    setMonacoMinimap(enabled) {
        localStorage.setItem(STORAGE.monacoMinimap, JSON.stringify(enabled));
        this.applyMonacoMinimapOption();
        this.updateStatusBar();
        requestAnimationFrame(() => {
            this.editor?.update?.();
            this.layoutMonacoDiff();
        });
    }
    isMonacoMinimapEffectivelyEnabled() {
        return this.editorEngine.id === 'monaco'
            && isMonacoMinimapEnabled()
            && !(this.diffOpen && this.dom.root?.classList.contains('etle--monacoDiffMode'));
    }
    applyMonacoMinimapOption() {
        const enabled = this.isMonacoMinimapEffectivelyEnabled();
        this.editor?.setOptions({ minimap: enabled });
        this.monacoDiffEditor?.updateOptions?.({ minimap: { enabled } });
        this.monacoDiffEditor?.getOriginalEditor?.()?.updateOptions?.({ minimap: { enabled } });
        this.monacoDiffEditor?.getModifiedEditor?.()?.updateOptions?.({ minimap: { enabled } });
    }
    applyMonacoDiffWordWrapOption() {
        const wordWrap = JSON.parse(localStorage.getItem(STORAGE.wordWrap) || 'true') ? 'on' : 'off';
        this.monacoDiffEditor?.updateOptions?.({ wordWrap });
        this.monacoDiffEditor?.getOriginalEditor?.()?.updateOptions?.({ wordWrap });
        this.monacoDiffEditor?.getModifiedEditor?.()?.updateOptions?.({ wordWrap });
    }
    applySpellCheckToTextArea(textarea) {
        if (!textarea)
            return;
        const enabled = isSpellCheckEnabled();
        textarea.spellcheck = enabled;
        textarea.setAttribute('spellcheck', String(enabled));
        textarea.setAttribute('autocomplete', enabled ? 'on' : 'off');
        textarea.setAttribute('autocorrect', enabled ? 'on' : 'off');
        textarea.setAttribute('autocapitalize', 'sentences');
    }
    applySpellCheckToMonaco(root) {
        if (!root)
            return;
        root.querySelectorAll('textarea, .inputarea').forEach(textarea => this.applySpellCheckToTextArea(textarea));
    }
    observeMonacoSpellCheck(root) {
        if (!root || root.dataset.etleSpellObserver === '1')
            return;
        root.dataset.etleSpellObserver = '1';
        const observer = new MutationObserver(() => this.applySpellCheckToMonaco(root));
        observer.observe(root, { childList: true, subtree: true });
    }
    async setupMonacoSpellchecker(monacoEditor) {
        if (!isSpellCheckEnabled() || !monacoEditor?.getModel)
            return;
        const monaco = globalThis.monaco ?? await loadMonaco();
        const dictionary = await loadEnglishDictionary();
        const spellchecker = getSpellchecker(monaco, monacoEditor, {
            languageSelector: ['markdown', 'plaintext', 'json', 'yaml', 'css'],
            severity: monaco.MarkerSeverity.Info,
            check: (word) => {
                const normalized = word.toLowerCase();
                if (this.shouldIgnoreSpellWord(normalized))
                    return true;
                return this.monacoUserDictionary.has(normalized) || dictionary.check(word);
            },
            suggest: (word) => dictionary.suggest(word).slice(0, 8),
            ignore: (word) => {
                this.monacoIgnoredWords.add(word.toLowerCase());
                this.scheduleMonacoSpellcheck();
            },
            addWord: (word) => {
                this.monacoUserDictionary.add(word.toLowerCase());
                this.scheduleMonacoSpellcheck();
            },
            tokenize: (line) => this.tokenizeSpellcheckLine(line),
            messageBuilder: (type, word) => {
                if (type === 'hover-message')
                    return `"${word}" may be misspelled.`;
                if (type === 'ignore')
                    return `Ignore "${word}"`;
                if (type === 'add-word')
                    return `Add "${word}" to this session`;
                return `Replace with "${word}"`;
            },
        });
        this.monacoSpellcheckers.push(spellchecker);
        await spellchecker.process();
    }
    async rebuildMonacoSpellcheckers() {
        this.disposeMonacoSpellcheckers();
        if (!isSpellCheckEnabled())
            return;
        await this.setupMonacoSpellchecker(this.monacoEditor);
        await this.setupMonacoSpellchecker(this.monacoDiffEditor?.getOriginalEditor?.());
        await this.setupMonacoSpellchecker(this.monacoDiffEditor?.getModifiedEditor?.());
    }
    disposeMonacoSpellcheckers() {
        if (this.monacoSpellcheckFrame !== null) {
            cancelAnimationFrame(this.monacoSpellcheckFrame);
            this.monacoSpellcheckFrame = null;
        }
        this.monacoSpellcheckers.forEach(spellchecker => spellchecker.dispose());
        this.monacoSpellcheckers = [];
    }
    scheduleMonacoSpellcheck() {
        if (!isSpellCheckEnabled() || !this.monacoSpellcheckers.length || this.monacoSpellcheckFrame !== null)
            return;
        this.monacoSpellcheckFrame = requestAnimationFrame(() => {
            this.monacoSpellcheckFrame = null;
            setTimeout(() => {
                this.monacoSpellcheckers.forEach(spellchecker => spellchecker.process());
            }, 250);
        });
    }
    *tokenizeSpellcheckLine(line) {
        const withoutMacros = line.replace(/\{\{[^}]+\}\}/g, match => ' '.repeat(match.length));
        const matcher = /\b[A-Za-z][A-Za-z']{2,}\b/g;
        let match;
        while ((match = matcher.exec(withoutMacros)) !== null) {
            yield { word: match[0], pos: match.index };
        }
    }
    shouldIgnoreSpellWord(word) {
        return this.monacoIgnoredWords.has(word)
            || [
                'api',
                'css',
                'json',
                'yaml',
                'npc',
                'npcs',
                'stscript',
                'sysprompt',
                'user',
            ].includes(word);
    }
    cycleIndentMode() {
        const index = INDENT_MODES.findIndex(mode => mode.id === this.indentMode.id);
        this.setIndentMode(INDENT_MODES[(index + 1) % INDENT_MODES.length]);
    }
    setIndentMode(mode) {
        this.indentMode = mode;
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
    setLanguage(lang) {
        this.currentLanguage = lang;
        if (this.selectedSource)
            this.setSourceLanguage(this.selectedSource, lang);
        this.editor?.setOptions({ language: lang.id });
        this.oldEditor?.setOptions({ language: lang.id });
        this.setMonacoDiffLanguage();
        this.updateStatusBar();
        this.renderTree();
    }
    toggleLanguageMenu() {
        if (this.dom.statusLanguageMenu) {
            this.closeLanguageMenu();
            return;
        }
        this.openLanguageMenu();
    }
    openLanguageMenu() {
        const anchor = this.dom.statusLanguage;
        if (!anchor)
            return;
        const menu = document.createElement('div');
        this.dom.statusLanguageMenu = menu;
        menu.classList.add('etle--statusDropup');
        for (const lang of LANGUAGES) {
            const item = document.createElement('button');
            item.type = 'button';
            item.classList.add('etle--statusDropupItem');
            item.textContent = lang.label;
            item.classList.toggle('etle--active', lang.id === this.currentLanguage.id);
            item.addEventListener('click', (event) => {
                event.stopPropagation();
                this.setLanguage(lang);
                this.closeLanguageMenu();
            });
            menu.append(item);
        }
        document.body.append(menu);
        this.positionLanguageMenu();
        const close = (event) => {
            if (event.target instanceof Node && (menu.contains(event.target) || anchor.contains(event.target)))
                return;
            this.closeLanguageMenu();
        };
        menu.dataset.closeListener = '1';
        setTimeout(() => document.addEventListener('click', close, { once: true }), 0);
    }
    positionLanguageMenu() {
        const menu = this.dom.statusLanguageMenu;
        const anchor = this.dom.statusLanguage;
        if (!menu || !anchor)
            return;
        const rect = anchor.getBoundingClientRect();
        const menuRect = menu.getBoundingClientRect();
        const left = Math.min(window.innerWidth - menuRect.width - 6, Math.max(6, rect.right - menuRect.width));
        const top = Math.max(6, rect.top - menuRect.height - 6);
        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
    }
    closeLanguageMenu() {
        this.dom.statusLanguageMenu?.remove();
        this.dom.statusLanguageMenu = undefined;
    }
    cycleScrollSync() {
        const index = SYNC_MODES.findIndex(m => m.id === this.scrollSyncMode.id);
        const next = SYNC_MODES[(index + 1) % SYNC_MODES.length];
        this.setScrollSync(next);
    }
    setScrollSync(mode) {
        this.scrollSyncMode = mode;
        localStorage.setItem(STORAGE.scrollSync, mode.id);
        this.updateStatusBar();
        if (mode.id !== 'off')
            this.syncDiffScroll();
    }
    getCursorPosition() {
        const modifiedEditor = this.monacoDiffEditor?.getModifiedEditor?.();
        if (modifiedEditor) {
            const position = modifiedEditor.getPosition();
            return {
                line: position?.lineNumber ?? 1,
                column: position?.column ?? 1,
            };
        }
        if (this.editor?.getCursorPosition)
            return this.editor.getCursorPosition();
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
        const value = this.getCurrentEditorValue();
        const modifiedEditor = this.monacoDiffEditor?.getModifiedEditor?.();
        const selection = modifiedEditor?.getSelection?.();
        const adapterSelection = selection && !selection.isEmpty()
            ? this.monacoDiffModifiedModel?.getValueInRange(selection).length
            : this.editor?.getSelectionLength?.();
        const selectionStart = this.editor?.textarea?.selectionStart ?? 0;
        const selectionEnd = this.editor?.textarea?.selectionEnd ?? selectionStart;
        return {
            chars: value.length,
            lines: value.length ? value.split('\n').length : 1,
            selection: adapterSelection ?? Math.abs(selectionEnd - selectionStart),
        };
    }
    updateHeader() {
        const source = this.selectedSource;
        if (!source)
            return;
        if (this.dom.currentGroup)
            this.dom.currentGroup.textContent = source.group;
        if (this.dom.currentTitle)
            this.dom.currentTitle.textContent = source.label;
        if (this.dom.editName)
            this.dom.editName.hidden = !source.metadata?.name;
        if (this.dom.actionsLeft) {
            if (globalThis.$?.fn?.select2) {
                globalThis.$(this.dom.actionsLeft).find('select.etle--triggerSelect').each((_, element) => {
                    globalThis.$(element).select2('destroy');
                });
            }
            this.dom.actionsLeft.innerHTML = '';
            this.dom.actionsLeft.hidden = isLorebookGroup(source.group);
            if (this.dom.actionsLeft.hidden)
                return;
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
    renderTriggerControl(meta) {
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
            if (!select.isConnected || !globalThis.$?.fn?.select2)
                return;
            globalThis.$(select).select2({
                placeholder: meta.emptyLabel ? `${meta.emptyLabel} (default)` : 'All types (default)',
                width: 'style',
                closeOnSelect: false,
            });
        });
        return wrap;
    }
    toggleNameEdit() {
        if (!this.selectedSource?.metadata?.name || !this.dom.currentTitle)
            return;
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
            if (e.key === 'Enter')
                finish();
            if (e.key === 'Escape')
                this.updateHeader();
        });
        input.addEventListener('blur', finish);
        input.focus();
        input.select();
    }
    createPropGroup(label) {
        const div = document.createElement('div');
        div.classList.add('etle--propGroup');
        const span = document.createElement('span');
        span.textContent = label;
        div.append(span);
        return div;
    }
    updateStatusBar() {
        const wrapEnabled = JSON.parse(localStorage.getItem(STORAGE.wordWrap) || 'true');
        const spellCheckEnabled = isSpellCheckEnabled();
        const minimapWanted = isMonacoMinimapEnabled();
        const minimapEnabled = this.isMonacoMinimapEffectivelyEnabled();
        const minimapForcedOff = this.editorEngine.id === 'monaco' && minimapWanted && !minimapEnabled;
        const stats = this.getEditorStats();
        if (this.dom.statusBranch) {
            const branchManager = this.selectedSource?.branchManager;
            if (branchManager) {
                const branches = branchManager.getBranches();
                const current = branchManager.getCurrentBranch();
                // Only reconstruct options if they changed to prevent losing focus
                const currentOptions = Array.from(this.dom.statusBranch.options).map(o => o.value);
                if (currentOptions.join(',') !== branches.join(',')) {
                    this.dom.statusBranch.innerHTML = '';
                    for (const b of branches) {
                        const option = document.createElement('option');
                        option.value = b;
                        option.textContent = b;
                        this.dom.statusBranch.append(option);
                    }
                }
                this.dom.statusBranch.value = current;
                this.dom.statusBranch.hidden = false;
                this.dom.statusBranch.parentElement.hidden = false;
            }
            else {
                this.dom.statusBranch.hidden = true;
                if (this.dom.statusBranch.parentElement?.classList.contains('etle--statusBranchWrapper')) {
                    this.dom.statusBranch.parentElement.hidden = true;
                }
            }
        }
        if (this.dom.statusDirty) {
            this.dom.statusDirty.textContent = this.selectedSourceChanged
                ? (this.dirty ? 'Source changed; draft differs' : 'Source changed')
                : this.dirty ? 'Unsaved changes' : 'All changes saved';
            this.dom.statusDirty.classList.toggle('etle--statusDirty', this.dirty);
            this.dom.statusDirty.classList.toggle('etle--statusSourceChanged', this.selectedSourceChanged);
        }
        if (this.dom.statusSourceCount) {
            this.dom.statusSourceCount.textContent = `${this.trackedSourceGroups.size}/${new Set(this.sources.map(source => source.group)).size} categories`;
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
            this.dom.statusIndent.hidden = this.editorEngine.id !== 'prism';
            this.dom.statusIndent.textContent = this.indentMode.label;
        }
        if (this.dom.statusWrap) {
            this.dom.statusWrap.textContent = wrapEnabled ? 'Wrap: On' : 'Wrap: Off';
            this.dom.statusWrap.classList.toggle('etle--statusActive', wrapEnabled);
        }
        if (this.dom.statusSpellCheck) {
            this.dom.statusSpellCheck.textContent = spellCheckEnabled ? 'Spell: On' : 'Spell: Off';
            this.dom.statusSpellCheck.classList.toggle('etle--statusActive', spellCheckEnabled);
        }
        if (this.dom.statusMinimap) {
            this.dom.statusMinimap.hidden = this.editorEngine.id !== 'monaco';
            this.dom.statusMinimap.textContent = minimapForcedOff ? 'Map: Off (Diff)' : minimapEnabled ? 'Map: On' : 'Map: Off';
            this.dom.statusMinimap.classList.toggle('etle--statusActive', minimapEnabled);
            this.dom.statusMinimap.title = minimapForcedOff
                ? 'Monaco minimap is enabled in settings, but hidden while diff mode is open.'
                : 'Toggle Monaco minimap';
        }
        if (this.dom.statusLanguage) {
            this.dom.statusLanguage.textContent = this.currentLanguage.label;
        }
        if (this.dom.statusEngine) {
            this.dom.statusEngine.textContent = this.editorEngine.label;
            this.dom.statusEngine.classList.toggle('etle--statusActive', this.editorEngine.id !== 'prism');
        }
        if (this.dom.editorEngine) {
            this.dom.editorEngine.value = this.editorEngine.id;
        }
        if (this.dom.statusScrollSync) {
            this.dom.statusScrollSync.hidden = !this.diffOpen;
            this.dom.statusScrollSync.textContent = this.scrollSyncMode.label;
            this.dom.statusScrollSync.classList.toggle('etle--statusActive', this.scrollSyncMode.id !== 'off');
        }
        this.dom.root?.classList.toggle('etle--syncOff', this.scrollSyncMode.id === 'off');
        this.dom.settingsPanel?.querySelector('[data-setting="wrap"]')?.classList.toggle('etle--activeButton', wrapEnabled);
        this.dom.settingsPanel?.querySelector('[data-setting="spell"]')?.classList.toggle('etle--activeButton', spellCheckEnabled);
        const minimapSetting = this.dom.settingsPanel?.querySelector('[data-setting="minimap"]');
        minimapSetting?.classList.toggle('etle--activeButton', minimapEnabled);
        if (minimapSetting) {
            minimapSetting.textContent = minimapForcedOff ? 'Monaco Minimap: Off in Diff' : 'Monaco Minimap';
            minimapSetting.title = minimapForcedOff
                ? 'Minimap is saved as on, but disabled while Monaco diff is open.'
                : 'Toggle Monaco minimap';
        }
    }
    async apply() {
        await this.saveCurrentSource({ refresh: true, toast: true });
    }
    async saveCurrentSource({ refresh = true, toast = true } = {}) {
        if (!this.selectedSource || this.selectedSource.readonly)
            return;
        const value = this.getCurrentEditorValue();
        try {
            this.selectedSource.write(value);
            await this.selectedSource.save?.();
            this.historyCommit = undefined;
            this.selectedSourceBaseline = this.selectedSource.read();
            this.selectedSourceChanged = false;
            this.updateDirty(false);
            if (refresh)
                await this.refreshSources(true);
            this.renderDiff();
            if (toast)
                globalThis.toastr?.success?.('Saved prompt text');
            return true;
        }
        catch (error) {
            console.error(`[${NAME}] Failed to save source`, error);
            globalThis.toastr?.error?.('Failed to save prompt text. See console for details.');
            return false;
        }
    }
    revert() {
        if (!this.selectedSource)
            return;
        this.selectedSourceBaseline = this.selectedSource.read();
        this.selectedSourceChanged = false;
        this.setEditorValue(this.selectedSourceBaseline);
        this.updateDirty(false);
        this.renderDiff();
    }
    toggleDiff() {
        this.diffOpen = !this.diffOpen;
        this.dom.root.classList.toggle('etle--showDiff', this.diffOpen);
        this.dom.diff.classList.toggle('etle--activeButton', this.diffOpen);
        this.updateDiffSideLabels();
        if (this.diffOpen && this.editorEngine.id === 'monaco') {
            this.dom.root.classList.add('etle--monacoDiffMode');
            this.applyMonacoMinimapOption();
            this.openMonacoDiff().catch((error) => {
                console.error(`[${NAME}] Failed to open Monaco diff`, error);
                globalThis.toastr?.error?.('Failed to open Monaco diff. Falling back to Prism diff.');
                this.dom.root.classList.remove('etle--monacoDiffMode');
                this.applyMonacoMinimapOption();
                this.renderDiff();
            });
        }
        else if (!this.diffOpen) {
            this.closeMonacoDiff({ syncValue: true });
            this.applyMonacoMinimapOption();
            this.renderDiff();
        }
        else {
            this.renderDiff();
        }
        this.editor?.update?.();
        this.oldEditor?.update?.();
        if (this.diffOpen) {
            requestAnimationFrame(() => this.updateMasterScrollbarHeight());
        }
        this.updateStatusBar();
    }
    updateMasterScrollbarHeight() {
        if (!this.dom.masterScrollContent || !this.editor || !this.oldEditor)
            return;
        if (this.dom.root?.classList.contains('etle--monacoDiffMode')) {
            this.dom.masterScrollContent.style.height = '1px';
            return;
        }
        const height = Math.max(this.editor.scrollContainer.scrollHeight, this.oldEditor.scrollContainer.scrollHeight);
        this.dom.masterScrollContent.style.height = `${height}px`;
        this.dom.masterScrollbar.scrollTop = this.editor.scrollContainer.scrollTop;
    }
    renderDiff() {
        if (!this.oldEditor)
            return;
        this.updateDiffSideLabels();
        if (this.diffOpen && this.editorEngine.id === 'monaco') {
            this.updateMonacoDiffModels();
            return;
        }
        const saved = this.getDiffOriginalValue();
        const unsaved = this.getCurrentEditorValue();
        const diff = getLineDiff(saved, unsaved);
        this.oldEditor.setOptions({ value: diff.oldDisplayText });
        requestAnimationFrame(() => this.highlightDiff(diff));
    }
    getDiffOriginalValue() {
        if (this.historyCommit?.sourceId === this.selectedSource?.id)
            return this.historyCommit.content;
        return this.selectedSource ? this.selectedSourceBaseline : '';
    }
    getDiffSideLabels() {
        const sourceLabel = this.selectedSource?.label ?? 'No source';
        if (this.historyCommit?.sourceId === this.selectedSource?.id) {
            const message = this.historyCommit.meta?.message || this.historyCommit.reason || 'snapshot';
            const date = new Date(this.historyCommit.createdAt).toLocaleString();
            return {
                left: `${sourceLabel} ; Snapshot: ${message} (${date}) (read-only)`,
                right: `${sourceLabel} ; Working draft`,
            };
        }
        return {
            left: `${sourceLabel} ; Current source (read-only)`,
            right: `${sourceLabel} ; Working draft`,
        };
    }
    updateDiffSideLabels() {
        const labels = this.getDiffSideLabels();
        if (this.dom.oldDiffLabel)
            this.dom.oldDiffLabel.textContent = labels.left;
        if (this.dom.editorDiffLabel)
            this.dom.editorDiffLabel.textContent = labels.right;
        if (this.dom.monacoDiffOriginalLabel)
            this.dom.monacoDiffOriginalLabel.textContent = labels.left;
        if (this.dom.monacoDiffModifiedLabel)
            this.dom.monacoDiffModifiedLabel.textContent = labels.right;
    }
    highlightDiff(diff) {
        this.applyDiffMarks(this.oldEditor, diff.oldMarks, 'removed');
        this.applyDiffMarks(this.editor, diff.newMarks, 'added');
        this.updateMasterScrollbarHeight();
    }
    applyDiffMarks(editor, marks, activeMark) {
        if (!editor)
            return;
        const lines = [...editor.wrapper.querySelectorAll('.pce-line')];
        lines.forEach((line, index) => {
            line.classList.remove('etle--diffAdded', 'etle--diffRemoved', 'etle--diffPlaceholder');
            if (!this.diffOpen)
                return;
            if (marks[index] === activeMark) {
                line.classList.add(activeMark === 'added' ? 'etle--diffAdded' : 'etle--diffRemoved');
            }
            if (marks[index] === 'placeholder') {
                line.classList.add('etle--diffPlaceholder');
            }
        });
    }
    getCurrentEditorValue() {
        return this.monacoDiffModifiedModel?.getValue?.() ?? this.editor?.value ?? '';
    }
    getMonacoLanguageId() {
        if (this.currentLanguage.id === 'text')
            return 'plaintext';
        return this.currentLanguage.id;
    }
    async openMonacoDiff() {
        if (!this.dom.monacoDiffEditorHost || !this.selectedSource)
            return;
        this.dom.root?.classList.add('etle--monacoDiffMode');
        this.disposeMonacoDiff({ syncValue: false, clearHost: true });
        const monaco = await loadMonaco();
        this.dom.root?.classList.add('etle--monacoDiffMode');
        this.dom.monacoDiffEditorHost.innerHTML = '';
        const originalValue = this.getDiffOriginalValue();
        const modifiedValue = this.editor?.value ?? '';
        const language = this.getMonacoLanguageId();
        this.monacoDiffOriginalModel = monaco.editor.createModel(originalValue, language);
        this.monacoDiffModifiedModel = monaco.editor.createModel(modifiedValue, language);
        this.monacoDiffEditor = monaco.editor.createDiffEditor(this.dom.monacoDiffEditorHost, {
            automaticLayout: true,
            originalEditable: false,
            readOnly: !!this.selectedSource.readonly,
            renderSideBySide: true,
            minimap: { enabled: isMonacoMinimapEnabled() },
            scrollBeyondLastLine: false,
            wordWrap: JSON.parse(localStorage.getItem(STORAGE.wordWrap) || 'true') ? 'on' : 'off',
        });
        this.applyMonacoMinimapOption();
        this.monacoDiffEditor.setModel({
            original: this.monacoDiffOriginalModel,
            modified: this.monacoDiffModifiedModel,
        });
        this.applySpellCheckToMonaco(this.dom.monacoDiffEditorHost);
        this.observeMonacoSpellCheck(this.dom.monacoDiffEditorHost);
        const modifiedEditor = this.monacoDiffEditor.getModifiedEditor();
        modifiedEditor.onDidChangeModelContent(() => {
            if (this.suppressEditorChange)
                return;
            const value = this.monacoDiffModifiedModel.getValue();
            this.withSuppressedEditorChange(() => this.editor?.setOptions({ value }));
            this.updateDirty(this.isValueDirty(value));
            this.updateStatusBar();
            this.scheduleMonacoSpellcheck();
        });
        modifiedEditor.onDidChangeCursorPosition(() => this.updateStatusBar());
        modifiedEditor.onDidChangeCursorSelection(() => this.updateStatusBar());
        this.rebuildMonacoSpellcheckers().catch((error) => console.warn(`[${NAME}] Failed to start Monaco diff spellcheck`, error));
        this.layoutMonacoDiff();
        requestAnimationFrame(() => this.layoutMonacoDiff(true));
    }
    updateMonacoDiffModels() {
        if (!this.monacoDiffEditor || !this.selectedSource)
            return;
        const originalValue = this.getDiffOriginalValue();
        const modifiedValue = this.editor?.value ?? '';
        this.withSuppressedEditorChange(() => {
            if (this.monacoDiffOriginalModel?.getValue() !== originalValue) {
                this.monacoDiffOriginalModel.setValue(originalValue);
            }
            if (this.monacoDiffModifiedModel?.getValue() !== modifiedValue) {
                this.monacoDiffModifiedModel.setValue(modifiedValue);
            }
        });
    }
    setMonacoDiffLanguage() {
        const monaco = globalThis.monaco;
        if (!monaco?.editor)
            return;
        const language = this.getMonacoLanguageId();
        if (this.monacoDiffOriginalModel)
            monaco.editor.setModelLanguage(this.monacoDiffOriginalModel, language);
        if (this.monacoDiffModifiedModel)
            monaco.editor.setModelLanguage(this.monacoDiffModifiedModel, language);
    }
    closeMonacoDiff({ syncValue = true } = {}) {
        this.disposeMonacoDiff({ syncValue, clearHost: true });
        this.dom.root?.classList.remove('etle--monacoDiffMode');
        this.applyMonacoMinimapOption();
        if (isSpellCheckEnabled()) {
            this.setupMonacoSpellchecker(this.monacoEditor).catch((error) => console.warn(`[${NAME}] Failed to restart Monaco spellcheck`, error));
        }
    }
    disposeMonacoDiff({ syncValue = true, clearHost = false } = {}) {
        if (syncValue && this.monacoDiffModifiedModel) {
            const value = this.monacoDiffModifiedModel.getValue();
            this.withSuppressedEditorChange(() => this.editor?.setOptions({ value }));
        }
        this.disposeMonacoSpellcheckers();
        this.monacoDiffEditor?.dispose?.();
        this.monacoDiffOriginalModel?.dispose?.();
        this.monacoDiffModifiedModel?.dispose?.();
        this.monacoDiffEditor = null;
        this.monacoDiffOriginalModel = null;
        this.monacoDiffModifiedModel = null;
        if (clearHost && this.dom.monacoDiffEditorHost)
            this.dom.monacoDiffEditorHost.innerHTML = '';
    }
    layoutMonacoDiff(focus = false) {
        if (!this.monacoDiffEditor || !this.dom.monacoDiffEditorHost)
            return;
        const rect = this.dom.monacoDiffEditorHost.getBoundingClientRect();
        this.monacoDiffEditor.layout({
            width: Math.max(1, Math.floor(rect.width)),
            height: Math.max(1, Math.floor(rect.height)),
        });
        if (focus)
            this.monacoDiffEditor.getModifiedEditor?.()?.focus?.();
    }
    updateDirty(isDirty) {
        this.dirty = !!isDirty;
        this.dom.root?.classList.toggle('etle--dirty', this.dirty);
        this.dom.root?.classList.toggle('etle--sourceChanged', this.selectedSourceChanged);
        this.setUnsavedLock(this.dirty);
        if (this.dom.diff)
            this.dom.diff.disabled = !this.selectedSource;
        if (this.dom.apply)
            this.dom.apply.disabled = !this.dirty || this.selectedSource?.readonly;
        if (this.dom.revert)
            this.dom.revert.disabled = !this.dirty;
        this.updateStatusBar();
        if (this.selectedSidebarTab === 'history')
            this.refreshHistory();
    }
    async open() {
        await this.refreshSources(true);
        if (!this.dom.root.classList.contains('openDrawer')) {
            this.dom.toggle.click();
        }
        this.editor?.update?.();
        this.editor?.focus?.();
        this.editor?.textarea?.focus();
    }
    async close() {
        if (this.dirty) {
            const choice = await this.confirmUnsavedSourceChange('close');
            if (choice === 'cancel')
                return;
            if (choice === 'save') {
                const saved = await this.saveCurrentSource({ refresh: false, toast: true });
                if (!saved)
                    return;
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
    async refreshHistory() {
        if (!this.historyPanel)
            return;
        const activeGroup = this.selectedHistoryGroup || this.selectedSource?.group;
        if (!activeGroup) {
            this.historyPanel.render('', [], [], [], []);
            return;
        }
        const sourceTabGroups = Array.from(new Set(this.getTrackedSources().map(source => source.group))).sort();
        const groupSources = this.sources.filter(s => s.group === activeGroup);
        const scope = this.getHistoryScope(groupSources[0] ?? this.selectedSource ?? undefined);
        // 1. Detect Changes
        const changedSources = [];
        await Promise.all(groupSources.map(async (source) => {
            if (source.readonly || source.placeholder)
                return;
            const latest = await this.historyStore.getLatestSource(source.id, this.getHistoryScope(source, scope).scopeId);
            const currentValue = source.read();
            const hash = await this.historyStore.hashContent(currentValue);
            if (!latest) {
                // If no history exists, it's technically "Added" in terms of version control
                changedSources.push({ source, status: 'A' });
            }
            else if (latest.latestHash !== hash) {
                const commit = latest.latestCommitId ? await this.historyStore.getCommit(latest.latestCommitId) : null;
                changedSources.push({ source, status: 'M', latest: commit });
            }
        }));
        const finalCommits = await this.historyStore.listCommitsByScope(scope.scopeId, 200);
        this.historyPanel.render(activeGroup, sourceTabGroups, this.sources, finalCommits, changedSources);
    }
    async diffHistoryCommit(commit) {
        const source = this.sources.find(item => item.id === commit.sourceId);
        if (!source) {
            globalThis.toastr?.warning?.('This historical source is not available in the current SillyTavern state.');
            return;
        }
        if (source && this.selectedSource?.id !== source.id) {
            await this.selectSource(source.id);
            if (this.selectedSource?.id !== source.id)
                return;
        }
        this.historyCommit = commit;
        if (!this.diffOpen)
            this.toggleDiff();
        this.renderDiff();
    }
    async compareChangedSource(change) {
        if (this.selectedSource?.id !== change.source.id) {
            await this.selectSource(change.source.id);
            if (this.selectedSource?.id !== change.source.id)
                return;
        }
        if (change.latest) {
            this.historyCommit = change.latest;
        }
        else {
            this.historyCommit = {
                id: 'empty',
                sourceId: change.source.id,
                sourceLabel: change.source.label,
                sourceGroup: change.source.group,
                ...this.getHistoryScope(change.source),
                createdAt: Date.now(),
                parentId: null,
                reason: 'initial',
                content: '',
                hash: '',
            };
        }
        if (!this.diffOpen)
            this.toggleDiff();
        this.renderDiff();
    }
    async loadHistoryCommit(commit) {
        const source = this.sources.find(item => item.id === commit.sourceId);
        if (!source) {
            globalThis.toastr?.warning?.('This historical source is not available in the current SillyTavern state.');
            return;
        }
        if (this.dirty) {
            const choice = await this.confirmUnsavedSourceChange('load');
            if (choice === 'cancel')
                return;
            if (choice === 'save') {
                const saved = await this.saveCurrentSource({ refresh: false, toast: true });
                if (!saved)
                    return;
            }
            if (choice === 'discard')
                this.updateDirty(false);
        }
        if (this.selectedSource?.id !== commit.sourceId) {
            await this.selectSource(commit.sourceId, { force: true });
            if (this.selectedSource?.id !== commit.sourceId)
                return;
        }
        this.setEditorValue(commit.content);
        this.historyCommit = commit;
        this.updateDirty(true);
    }
}
//# sourceMappingURL=EveryTextLineEditor.js.map