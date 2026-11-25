import { EDITOR_ENGINES, INDENT_MODES, NAME, SYNC_MODES } from './constants.js';
import { getReplaceTextFieldExceptions, isAutoCollapseSidebarEnabled, isFullJsonHistoryIgnored, isHideNonEditableSourcesEnabled, isMonacoMinimapEnabled, isReplaceTextFieldLineNumbersEnabled, isReplaceTextFieldWordWrapEnabled, isReplaceTextFieldsEnabled, isSpellCheckEnabled, isWordWrapEnabled, } from './settings.js';
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
    settingsBody.append(renderSettingsSection('main', 'Main Editor', 'fa-pen-to-square', 'Settings for the Every Text Line Editor drawer.', [
        renderCoreEditorSettings(host),
        renderFontSettings(host),
        renderSharedEditorSettings(host),
        renderPrismSettings(host),
        renderMonacoSettings(host),
    ]), renderSettingsSection('replacement', 'ST Textfield Replacement', 'fa-i-cursor', 'Defaults for replaced textboxes. Each textbox can override these in its status bar or the list.', [
        renderTextFieldReplacementSettings(host),
    ]), renderSettingsSection('history', 'History', 'fa-code-branch', '', [
        renderHistorySettings(host),
    ]), renderSettingsSection('info', 'Info & Feedback', 'fa-circle-info', '', [
        renderInfoFeedbackSection(),
    ]));
    settingsPanel.append(settingsBody);
    return settingsPanel;
}
function renderSettingsSection(id, title, icon, subtitle, children) {
    const section = document.createElement('section');
    section.classList.add('etle--settingsSection');
    section.dataset.settingsSection = id;
    const header = document.createElement('div');
    header.classList.add('etle--settingsSectionHead');
    header.innerHTML = `<span class="fa-solid fa-fw ${icon}"></span><h5></h5>`;
    header.children[1].textContent = title;
    section.append(header);
    if (subtitle) {
        const note = document.createElement('small');
        note.classList.add('etle--settingsSectionNote');
        note.textContent = subtitle;
        section.append(note);
    }
    const body = document.createElement('div');
    body.classList.add('etle--settingsSectionBody');
    body.append(...children);
    section.append(body);
    return section;
}
function renderFontSettings(host) {
    const group = host.createPropGroup('Editor Font');
    const row = document.createElement('div');
    row.classList.add('etle--fontRow');
    const select = document.createElement('select');
    select.classList.add('text_pole');
    host.dom.editorFont = select;
    for (const font of host.availableFonts) {
        const option = document.createElement('option');
        option.value = font.id;
        option.textContent = font.label;
        select.append(option);
    }
    select.value = host.selectedFontId;
    select.addEventListener('change', () => {
        host.setEditorFont(select.value).catch((error) => {
            console.error(`[${NAME}] Failed to apply editor font`, error);
        });
    });
    const refreshBtn = host.makeIconButton('fa-sync-alt', 'Rescan data/<user>/assets/fonts/ folder', () => {
        host.refreshFonts().catch((error) => console.error(`[${NAME}] Failed to refresh fonts`, error));
    });
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.woff2,.woff,.ttf,.otf';
    fileInput.hidden = true;
    fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        fileInput.value = '';
        if (!file)
            return;
        host.uploadFontFile(file).catch((error) => console.error(`[${NAME}] Failed to upload font`, error));
    });
    const uploadBtn = host.makeIconButton('fa-upload', 'Upload font file (.woff2, .woff, .ttf, .otf)', () => fileInput.click());
    row.addEventListener('dragover', (event) => {
        event.preventDefault();
        row.classList.add('etle--fontDropActive');
    });
    row.addEventListener('dragleave', () => row.classList.remove('etle--fontDropActive'));
    row.addEventListener('drop', (event) => {
        event.preventDefault();
        row.classList.remove('etle--fontDropActive');
        const file = event.dataTransfer?.files?.[0];
        if (!file)
            return;
        host.uploadFontFile(file).catch((error) => console.error(`[${NAME}] Failed to upload dropped font`, error));
    });
    row.append(select, refreshBtn, uploadBtn, fileInput);
    const note = document.createElement('small');
    note.textContent = 'Drop .woff2/.woff/.ttf/.otf here, upload, or place fonts in data/<user>/assets/fonts/ and refresh.';
    group.append(row, note);
    return group;
}
function renderSharedEditorSettings(host) {
    const editorGroup = host.createPropGroup('Behavior');
    const wrapButton = host.makeTextButton('Word Wrap', 'fa-align-left', () => host.setWordWrap(!isWordWrapEnabled()));
    wrapButton.dataset.setting = 'wrap';
    const spellButton = host.makeTextButton('Spell Check', 'fa-spell-check', () => host.setSpellCheck(!isSpellCheckEnabled()));
    spellButton.dataset.setting = 'spell';
    const autoCollapseButton = host.makeTextButton('Auto-Collapse Sidebar', 'fa-table-columns', () => host.setAutoCollapseSidebar(!isAutoCollapseSidebarEnabled()));
    autoCollapseButton.dataset.setting = 'autoCollapseSidebar';
    autoCollapseButton.title = 'Automatically collapse the sidebar when the panel width is below 800 px';
    const hideNonEditableButton = host.makeTextButton('Hide Non-Editable', 'fa-eye-slash', () => host.setHideNonEditableSources(!isHideNonEditableSourcesEnabled()));
    hideNonEditableButton.dataset.setting = 'hideNonEditable';
    hideNonEditableButton.title = 'Hide read-only and non-editable placeholder items in the source list';
    const editorButtons = document.createElement('div');
    editorButtons.classList.add('etle--settingsButtonRow');
    editorButtons.append(wrapButton, spellButton, autoCollapseButton, hideNonEditableButton);
    const ltNote = document.createElement('small');
    ltNote.innerHTML = 'LanguageTool grammar checking requires the <a href="https://github.com/IceFog72/SillyTavern-LanguageToolPlugin" target="_blank" rel="noopener noreferrer">SillyTavern LanguageTool server plugin</a>; its status bar toggle appears automatically when the plugin is installed.';
    editorGroup.append(editorButtons, ltNote);
    return editorGroup;
}
function renderTextFieldReplacementSettings(host) {
    const container = document.createElement('div');
    container.classList.add('etle--settingsSectionBody');
    const row = document.createElement('div');
    row.classList.add('etle--settingsButtonRow');
    const replaceButton = host.makeTextButton('Replace ST Textfields', 'fa-i-cursor', () => {
        host.setReplaceTextFields(!isReplaceTextFieldsEnabled()).catch((error) => {
            console.error(`[${NAME}] Failed to toggle SillyTavern textfield replacement`, error);
        });
    });
    replaceButton.dataset.setting = 'replaceTextFields';
    replaceButton.title = 'Replace SillyTavern textareas with the selected replacement editor (Prism or Monaco)';
    const replacementEnabled = isReplaceTextFieldsEnabled();
    const lineNumbersButton = host.makeTextButton('Line Numbers', 'fa-list-ol', () => {
        host.setReplaceTextFieldLineNumbers(!isReplaceTextFieldLineNumbersEnabled());
    });
    lineNumbersButton.dataset.setting = 'replaceTextFieldLineNumbers';
    lineNumbersButton.dataset.requiresReplacement = '1';
    lineNumbersButton.disabled = !replacementEnabled;
    lineNumbersButton.title = 'Show or hide line numbers in replaced SillyTavern textfields';
    const wrapButton = host.makeTextButton('Word Wrap', 'fa-align-left', () => {
        host.setReplaceTextFieldWordWrap(!isReplaceTextFieldWordWrapEnabled());
    });
    wrapButton.dataset.setting = 'replaceTextFieldWordWrap';
    wrapButton.dataset.requiresReplacement = '1';
    wrapButton.disabled = !replacementEnabled;
    wrapButton.title = 'Toggle word wrap in replaced SillyTavern textfields';
    row.append(replaceButton, lineNumbersButton, wrapButton);
    const engineGrid = document.createElement('div');
    engineGrid.classList.add('etle--settingsGrid');
    engineGrid.append(renderSelectGroup(host, 'Replacement Engine', EDITOR_ENGINES, host.replaceTextFieldEngine.id, (value, select) => {
        const engine = EDITOR_ENGINES.find(item => item.id === value) ?? EDITOR_ENGINES[0];
        host.setReplaceTextFieldEngine(engine).catch((error) => {
            console.error(`[${NAME}] Failed to switch replacement editor engine`, error);
            select.value = host.replaceTextFieldEngine.id;
        });
    }, (select) => {
        select.dataset.requiresReplacement = '1';
        select.disabled = !replacementEnabled;
        host.dom.replaceTextFieldEngine = select;
    }));
    const exceptionsGroup = host.createPropGroup('Excluded Textfields');
    const exceptionsInput = document.createElement('textarea');
    exceptionsInput.classList.add('text_pole', 'etle--exceptionList');
    exceptionsInput.dataset.etleInternal = '1';
    exceptionsInput.dataset.requiresReplacement = '1';
    exceptionsInput.disabled = !replacementEnabled;
    exceptionsInput.rows = 3;
    exceptionsInput.placeholder = '#send_textarea';
    exceptionsInput.value = getReplaceTextFieldExceptions();
    let debounceTimer = null;
    const commitExceptions = () => {
        if (debounceTimer !== null) {
            window.clearTimeout(debounceTimer);
            debounceTimer = null;
        }
        host.setReplaceTextFieldExceptions(exceptionsInput.value).catch((error) => {
            console.error(`[${NAME}] Failed to update textfield exceptions`, error);
        });
    };
    exceptionsInput.addEventListener('input', () => {
        if (debounceTimer !== null)
            window.clearTimeout(debounceTimer);
        debounceTimer = window.setTimeout(commitExceptions, 250);
    });
    exceptionsInput.addEventListener('change', commitExceptions);
    const note = document.createElement('small');
    note.textContent = 'CSS selectors or IDs, one per line or comma-separated. ETLE editors are always excluded.';
    exceptionsGroup.append(exceptionsInput, note);
    container.append(row, engineGrid, exceptionsGroup);
    return container;
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
    const historyGroup = document.createElement('div');
    historyGroup.classList.add('etle--settingsSectionBody');
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
function renderInfoFeedbackSection() {
    const blockquote = document.createElement('blockquote');
    blockquote.classList.add('etle--infoBlockquote');
    const note = document.createElement('p');
    note.innerHTML = '<strong>Note:</strong> Every Text Line Editor and my other extensions are currently in maintenance mode, updated only as I run into issues myself. Ongoing features and active development depend on community support. If you find these extensions useful, consider donating — or at least starring on GitHub — to help keep them moving.';
    const links = document.createElement('div');
    links.classList.add('etle--supportLinks');
    const discord = document.createElement('a');
    discord.href = 'https://discord.gg/2tJcWeMjFQ';
    discord.target = '_blank';
    discord.rel = 'noopener noreferrer';
    discord.classList.add('etle--supportLink');
    discord.innerHTML = '<i class="fa-brands fa-discord" aria-hidden="true"></i><span>Discord (IceFog\'s AI Brew Bar)</span>';
    const paypal = document.createElement('a');
    paypal.href = 'https://www.paypal.com/ncp/payment/ABWFG6Y3SRGE6';
    paypal.target = '_blank';
    paypal.rel = 'noopener noreferrer';
    paypal.classList.add('etle--supportLink');
    paypal.innerHTML = '<i class="fa-solid fa-piggy-bank" aria-hidden="true"></i><span>Support my projects (PayPal)</span>';
    const issues = document.createElement('a');
    issues.href = 'https://github.com/IceFog72/SillyTavern-EveryTextLineEditor/issues';
    issues.target = '_blank';
    issues.rel = 'noopener noreferrer';
    issues.classList.add('etle--supportLink');
    issues.innerHTML = '<i class="fa-brands fa-github" aria-hidden="true"></i><span>Issues &amp; Feedback</span>';
    const stars = document.createElement('a');
    stars.href = 'https://github.com/IceFog72/SillyTavern-EveryTextLineEditor';
    stars.target = '_blank';
    stars.rel = 'noopener noreferrer';
    stars.classList.add('etle--supportBadge');
    const starsImg = document.createElement('img');
    starsImg.src = 'https://img.shields.io/github/stars/IceFog72/SillyTavern-EveryTextLineEditor?style=social';
    starsImg.alt = 'GitHub stars';
    stars.append(starsImg);
    links.append(discord, paypal, issues, stars);
    blockquote.append(note, links);
    return blockquote;
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