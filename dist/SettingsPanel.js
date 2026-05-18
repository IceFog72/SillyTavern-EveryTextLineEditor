import { EDITOR_ENGINES, INDENT_MODES, NAME, STORAGE, SYNC_MODES } from './constants.js';
const isSpellCheckEnabled = () => JSON.parse(localStorage.getItem(STORAGE.spellCheck) || 'false');
const isMonacoMinimapEnabled = () => JSON.parse(localStorage.getItem(STORAGE.monacoMinimap) || 'false');
const isFullJsonHistoryIgnored = () => JSON.parse(localStorage.getItem(STORAGE.ignoreFullJsonHistory) || 'true');
export function renderSettingsPanel(host) {
    const settingsPanel = document.createElement('section');
    host.dom.settingsPanel = settingsPanel;
    settingsPanel.classList.add('etle--tabPanel', 'etle--settingsPanel');
    settingsPanel.dataset.tab = 'settings';
    const settingsHead = document.createElement('div');
    settingsHead.classList.add('etle--settingsHead');
    settingsHead.innerHTML = '<h4>Settings</h4>';
    settingsPanel.append(settingsHead);
    const settingsBody = document.createElement('div');
    settingsBody.classList.add('etle--settingsBody');
    settingsBody.append(renderSharedEditorSettings(host), renderCoreEditorSettings(host), renderPrismSettings(host), renderMonacoSettings(host), renderHistorySettings(host));
    settingsPanel.append(settingsBody);
    return settingsPanel;
}
function renderSharedEditorSettings(host) {
    const editorGroup = host.createPropGroup('Shared Editor');
    const wrapButton = host.makeTextButton('Word Wrap', 'fa-align-left', () => host.setWordWrap(!JSON.parse(localStorage.getItem(STORAGE.wordWrap) || 'true')));
    wrapButton.dataset.setting = 'wrap';
    const spellButton = host.makeTextButton('Spell Check', 'fa-spell-check', () => host.setSpellCheck(!isSpellCheckEnabled()));
    spellButton.dataset.setting = 'spell';
    const editorButtons = document.createElement('div');
    editorButtons.classList.add('etle--settingsButtonRow');
    editorButtons.append(wrapButton, spellButton);
    editorGroup.append(editorButtons);
    return editorGroup;
}
function renderCoreEditorSettings(host) {
    const editorSelects = document.createElement('div');
    editorSelects.classList.add('etle--settingsGrid');
    editorSelects.append(renderSelectGroup(host, 'Engine', EDITOR_ENGINES, host.editorEngine.id, (value, select) => {
        const engine = EDITOR_ENGINES.find(item => item.id === value) ?? EDITOR_ENGINES[0];
        host.setEditorEngine(engine).catch((error) => {
            console.error(`[${NAME}] Failed to switch editor engine`, error);
            select.value = host.editorEngine.id;
        });
    }, (select) => {
        host.dom.editorEngine = select;
    }), renderSelectGroup(host, 'Scroll Sync', SYNC_MODES, host.scrollSyncMode.id, (value) => {
        host.setScrollSync(SYNC_MODES.find(item => item.id === value) ?? SYNC_MODES[1]);
    }));
    return editorSelects;
}
function renderPrismSettings(host) {
    const prismGroup = host.createPropGroup('Prism');
    const prismGrid = document.createElement('div');
    prismGrid.classList.add('etle--settingsGrid');
    prismGrid.append(renderSelectGroup(host, 'Indentation', INDENT_MODES, host.indentMode.id, (value) => {
        host.setIndentMode(INDENT_MODES.find(item => item.id === value) ?? INDENT_MODES[0]);
    }));
    prismGroup.append(prismGrid);
    return prismGroup;
}
function renderMonacoSettings(host) {
    const monacoGroup = host.createPropGroup('Monaco');
    const monacoButtons = document.createElement('div');
    monacoButtons.classList.add('etle--settingsButtonRow');
    const minimapButton = host.makeTextButton('Minimap', 'fa-map', () => host.setMonacoMinimap(!isMonacoMinimapEnabled()));
    minimapButton.dataset.setting = 'minimap';
    monacoButtons.append(minimapButton);
    monacoGroup.append(monacoButtons);
    return monacoGroup;
}
function renderHistorySettings(host) {
    const historyGroup = host.createPropGroup('History');
    const historyGrid = document.createElement('div');
    historyGrid.classList.add('etle--settingsGrid');
    const limitGroup = host.createPropGroup('Commits per Source');
    const limitInput = document.createElement('input');
    limitInput.type = 'number';
    limitInput.value = '100';
    limitInput.disabled = true;
    limitInput.classList.add('text_pole');
    limitGroup.append(limitInput);
    historyGrid.append(limitGroup);
    const storageGroup = host.createPropGroup('Storage');
    const storageNote = document.createElement('small');
    storageNote.textContent = 'IndexedDB, local to this browser. Apply still controls SillyTavern saves.';
    storageGroup.append(storageNote);
    historyGrid.append(storageGroup);
    historyGroup.append(historyGrid);
    const historyActions = document.createElement('div');
    historyActions.classList.add('etle--settingsButtonRow');
    const ignoreJsonBtn = host.makeTextButton('Ignore Full JSON', 'fa-code', () => host.setIgnoreFullJsonHistory(!isFullJsonHistoryIgnored()));
    ignoreJsonBtn.dataset.setting = 'ignoreFullJsonHistory';
    const exportBtn = host.makeTextButton('Export History', 'fa-file-export', () => host.exportHistory().catch(error => {
        console.error(`[${NAME}] Failed to export history`, error);
        globalThis.toastr?.error?.('Failed to export history. See console for details.');
    }));
    const clearBtn = host.makeTextButton('Clear History', 'fa-trash', () => host.clearHistory().catch(error => {
        console.error(`[${NAME}] Failed to clear history`, error);
        globalThis.toastr?.error?.('Failed to clear history. See console for details.');
    }));
    clearBtn.classList.add('redWarningBG');
    historyActions.append(ignoreJsonBtn, exportBtn, clearBtn);
    historyGroup.append(historyActions);
    return historyGroup;
}
function renderSelectGroup(host, label, options, value, onChange, onCreate) {
    const group = host.createPropGroup(label);
    const select = document.createElement('select');
    select.classList.add('text_pole');
    for (const item of options) {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.label;
        select.append(option);
    }
    select.value = value;
    select.addEventListener('change', () => onChange(select.value, select));
    onCreate?.(select);
    group.append(select);
    return group;
}
//# sourceMappingURL=SettingsPanel.js.map