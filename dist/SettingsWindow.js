import { EDITOR_ENGINES, INDENT_MODES, LANGUAGES, NAME } from './constants.js';
import { isLanguageToolPluginAvailable, subscribeLanguageToolAvailability } from './LanguageToolClient.js';
import { renderSettingsPanel } from './SettingsPanel.js';
export function createSettingsWindow(host) {
    const dialog = document.createElement('dialog');
    dialog.classList.add('etle--settingsDialog');
    dialog.setAttribute('aria-label', 'Every Text Line Editor settings');
    dialog.addEventListener('keydown', event => {
        if (event.key === 'Escape')
            event.stopPropagation();
    });
    const header = document.createElement('header');
    header.classList.add('etle--settingsDialogHeader');
    const title = document.createElement('h3');
    title.textContent = 'Every Text Line Editor · Settings';
    const close = host.makeTextButton('Close', 'fa-xmark', () => dialog.close());
    header.append(title, close);
    const layout = document.createElement('div');
    layout.classList.add('etle--settingsDialogLayout');
    const sidebar = document.createElement('nav');
    sidebar.classList.add('etle--settingsNavigation');
    sidebar.setAttribute('aria-label', 'Settings sections and textboxes');
    const panel = renderSettingsPanel(host);
    const fieldPanel = document.createElement('section');
    fieldPanel.classList.add('etle--fieldSettings');
    const content = document.createElement('div');
    content.classList.add('etle--settingsDialogContent');
    content.append(panel, fieldPanel);
    let selected = 'main';
    let selectedField;
    const sectionButtons = [];
    for (const [id, label, icon] of [
        ['main', 'Main editor', 'fa-sliders'],
        ['replacement', 'Replacement defaults', 'fa-i-cursor'],
        ['history', 'History', 'fa-code-branch'],
        ['info', 'Info / Feedback', 'fa-circle-info'],
    ]) {
        const button = host.makeTextButton(label, icon, () => {
            selected = id;
            selectedField = undefined;
            renderSelection();
        });
        button.dataset.section = id;
        sidebar.append(button);
        sectionButtons.push(button);
    }
    const listTitle = document.createElement('h4');
    listTitle.textContent = 'Textboxes';
    const search = document.createElement('input');
    search.type = 'search';
    search.placeholder = 'Find a textbox';
    search.setAttribute('aria-label', 'Search textboxes');
    search.classList.add('text_pole');
    const list = document.createElement('div');
    list.classList.add('etle--fieldSettingsList');
    sidebar.append(listTitle, search, list);
    layout.append(sidebar, content);
    dialog.append(header, layout);
    document.body.append(dialog);
    const updateConfig = (key, patch) => {
        host.textFieldReplacer.setFieldConfig(key, patch).then(renderSelection).catch(error => {
            console.error(`[${NAME}] Failed to update textbox settings`, error);
            globalThis.toastr?.error?.('Could not update textbox settings.');
        });
    };
    const hasFieldOverrides = (field) => Object.entries(field.config)
        .some(([property, value]) => property !== 'label' && value !== undefined);
    function renderList(fields = host.textFieldReplacer.listFields()) {
        const focusedKey = document.activeElement?.closest('.etle--fieldSettingsItem')?.dataset.fieldKey;
        list.replaceChildren();
        const query = search.value.trim().toLowerCase();
        const visible = fields.filter(field => (hasFieldOverrides(field) || field.key === selectedField)
            && `${field.label} ${field.key} ${field.state}`.toLowerCase().includes(query));
        for (const field of visible) {
            const button = document.createElement('button');
            button.type = 'button';
            button.classList.add('etle--fieldSettingsItem');
            button.dataset.fieldKey = field.key;
            button.setAttribute('aria-current', String(selectedField === field.key));
            button.title = field.key;
            const label = document.createElement('span');
            label.textContent = field.label;
            const state = document.createElement('small');
            state.textContent = field.state;
            button.append(label, state);
            button.addEventListener('click', () => {
                selectedField = field.key;
                renderSelection();
            });
            list.append(button);
            if (focusedKey === field.key)
                button.focus({ preventScroll: true });
        }
        if (!visible.length) {
            const empty = document.createElement('p');
            empty.textContent = query
                ? 'No customized textboxes match your search.'
                : 'No customized textboxes. Others follow replacement defaults.';
            list.append(empty);
        }
    }
    function renderField(field) {
        const focusedSetting = fieldPanel.contains(document.activeElement)
            ? document.activeElement?.dataset.fieldSetting : undefined;
        fieldPanel.replaceChildren();
        const heading = document.createElement('h3');
        heading.textContent = field.label;
        const identity = document.createElement('small');
        identity.classList.add('etle--fieldIdentity');
        identity.textContent = field.key.startsWith('id:') ? `#${field.key.slice(3)}` : field.key.slice(5);
        const note = document.createElement('p');
        note.textContent = `${field.state}. Changes save immediately. Unset options follow replacement defaults.`;
        fieldPanel.append(heading, identity, note);
        const grid = document.createElement('div');
        grid.classList.add('etle--fieldSettingsGrid');
        const replacementOff = field.config.enabled === false
            || (!host.textFieldReplacer.isEnabled() && field.config.enabled !== true);
        function select(property, label, options, inherited, decode) {
            const row = document.createElement('label');
            const text = document.createElement('span');
            text.textContent = label;
            const control = document.createElement('select');
            control.classList.add('text_pole');
            control.dataset.fieldSetting = property;
            if (property !== 'enabled' && replacementOff) {
                control.disabled = true;
            }
            const defaultOption = document.createElement('option');
            defaultOption.value = '__inherit__';
            defaultOption.textContent = `Use default (${inherited})`;
            control.append(defaultOption);
            for (const item of options) {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.label;
                control.append(option);
            }
            const value = field.config[property];
            control.value = value === undefined ? '__inherit__' : String(value);
            control.addEventListener('change', () => updateConfig(field.key, {
                [property]: control.value === '__inherit__' ? undefined : decode(control.value),
            }));
            row.append(text, control);
            grid.append(row);
        }
        const bools = [{ id: 'true', label: 'On' }, { id: 'false', label: 'Off' }];
        const bool = (value) => value === 'true';
        select('enabled', 'Replacement', bools, 'follow global switch and exclusions', bool);
        select('engine', 'Editor engine', EDITOR_ENGINES, host.replaceTextFieldEngine.label, value => value);
        select('language', 'Language', LANGUAGES, 'detect from textbox', value => value);
        select('wordWrap', 'Word wrap', bools, 'global word wrap', bool);
        select('lineNumbers', 'Line numbers', bools, 'global line numbers', bool);
        const fonts = [...host.availableFonts];
        if (field.config.fontId !== undefined && !fonts.some(font => font.id === field.config.fontId)) {
            fonts.push({ id: field.config.fontId, label: `${field.config.fontId} (unavailable)`, family: '' });
        }
        select('fontId', 'Font', fonts, 'global font', value => value);
        select('indentMode', 'Indentation', INDENT_MODES, host.indentMode.label, value => value);
        select('spellCheck', 'Spell check', bools, 'global spell check', bool);
        const ltAvailable = isLanguageToolPluginAvailable();
        select('languageTool', ltAvailable ? 'LanguageTool' : 'LanguageTool (requires LanguageTool server plugin)', bools, 'off', bool);
        if (!ltAvailable) {
            const ltSelect = grid.querySelector('[data-field-setting="languageTool"]');
            if (ltSelect)
                ltSelect.disabled = true;
        }
        select('minimap', 'Monaco minimap', bools, 'global minimap', bool);
        fieldPanel.append(grid);
        const reset = host.makeTextButton('Use defaults for this textbox', 'fa-rotate-left', () => updateConfig(field.key, null));
        reset.dataset.fieldSetting = 'reset';
        fieldPanel.append(reset);
        if (focusedSetting)
            fieldPanel.querySelector(`[data-field-setting="${focusedSetting}"]`)?.focus({ preventScroll: true });
    }
    function renderSelection() {
        const fields = host.textFieldReplacer.listFields();
        const field = fields.find(item => item.key === selectedField);
        if (!field)
            selectedField = undefined;
        panel.hidden = !!field;
        fieldPanel.hidden = !field;
        panel.querySelectorAll('[data-settings-section]').forEach(section => {
            section.hidden = section.dataset.settingsSection !== selected;
        });
        sectionButtons.forEach(button => button.setAttribute('aria-current', String(!field && button.dataset.section === selected)));
        if (field)
            renderField(field);
        renderList(fields);
    }
    search.addEventListener('input', () => renderList());
    const unsubscribe = host.textFieldReplacer.subscribe(() => {
        if (dialog.open)
            renderSelection();
    });
    const unsubscribeLt = subscribeLanguageToolAvailability(() => {
        if (dialog.open)
            renderSelection();
    });
    return {
        show(fieldKey) {
            selectedField = fieldKey;
            search.value = '';
            renderSelection();
            if (!dialog.open)
                dialog.showModal();
        },
        destroy() {
            unsubscribe();
            unsubscribeLt();
            if (dialog.open)
                dialog.close();
            dialog.remove();
        },
    };
}
//# sourceMappingURL=SettingsWindow.js.map