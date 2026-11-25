// @ts-ignore
import { extension_settings } from '../../../../extensions.js';
// @ts-ignore
import { saveSettingsDebounced } from '../../../../../script.js';
import { DEFAULT_TEXTFIELD_EXCEPTIONS, EDITOR_ENGINES, INDENT_MODES, LANGUAGES, NAME, STORAGE } from './constants.js';
// Legacy localStorage values stored as plain strings, not JSON.
const RAW_STRING_KEYS = new Set([
    STORAGE.selectedSource,
    STORAGE.indentMode,
    STORAGE.scrollSync,
    STORAGE.editorEngine,
    STORAGE.editorFont,
    STORAGE.panelWidth,
    STORAGE.replaceTextFieldEngine,
    STORAGE.replaceTextFieldExceptions,
    'promptInspectorFormat',
]);
// Prompt snapshots hold whole prompts and live in localStorage; an earlier build leaked them here.
const LEGACY_SNAPSHOT_KEYS = [
    STORAGE.promptInspectorCurrent,
    STORAGE.promptInspectorPrevious,
    STORAGE.promptInspectorUpdatedAt,
];
export function initExtensionSettings() {
    if (!extension_settings[NAME]) {
        extension_settings[NAME] = {};
    }
    const settings = extension_settings[NAME];
    const leaked = LEGACY_SNAPSHOT_KEYS.filter(key => key in settings);
    if (leaked.length) {
        leaked.forEach(key => delete settings[key]);
        saveSettingsDebounced();
    }
}
export function getSetting(key, defaultValue) {
    initExtensionSettings();
    if (key in extension_settings[NAME]) {
        return extension_settings[NAME][key];
    }
    // Migrate once from localStorage, then drop the old copy.
    const localValue = localStorage.getItem(key);
    if (localValue === null)
        return defaultValue;
    let value = localValue;
    if (!RAW_STRING_KEYS.has(key)) {
        try {
            value = JSON.parse(localValue);
        }
        catch {
            value = localValue;
        }
    }
    extension_settings[NAME][key] = value;
    localStorage.removeItem(key);
    saveSettingsDebounced();
    return value;
}
export function setSetting(key, value) {
    initExtensionSettings();
    if (key in extension_settings[NAME] && Object.is(extension_settings[NAME][key], value)) {
        return;
    }
    extension_settings[NAME][key] = value;
    saveSettingsDebounced();
}
export function clearSettings() {
    extension_settings[NAME] = {};
    saveSettingsDebounced();
}
export const isWordWrapEnabled = () => getSetting(STORAGE.wordWrap, true);
export const isLineNumbersEnabled = () => getSetting(STORAGE.lineNumbers, true);
export const isSpellCheckEnabled = () => getSetting(STORAGE.spellCheck, false);
export const isLanguageToolEnabled = () => getSetting(STORAGE.languageTool, false);
export const isMonacoMinimapEnabled = () => getSetting(STORAGE.monacoMinimap, false);
export const isFullJsonHistoryIgnored = () => getSetting(STORAGE.ignoreFullJsonHistory, true);
export const isAutoCollapseSidebarEnabled = () => getSetting(STORAGE.autoCollapseSidebar, true);
export const isHideNonEditableSourcesEnabled = () => getSetting(STORAGE.hideNonEditableSources, true);
export const isReplaceTextFieldsEnabled = () => getSetting(STORAGE.replaceTextFields, false);
export const isReplaceTextFieldLineNumbersEnabled = () => getSetting(STORAGE.replaceTextFieldLineNumbers, true);
export const isReplaceTextFieldWordWrapEnabled = () => getSetting(STORAGE.replaceTextFieldWordWrap, true);
export const getReplaceTextFieldEngine = () => {
    const stored = getSetting(STORAGE.replaceTextFieldEngine, '');
    return EDITOR_ENGINES.find(engine => engine.id === stored) ?? EDITOR_ENGINES[0];
};
export const getReplaceTextFieldExceptions = () => getSetting(STORAGE.replaceTextFieldExceptions, DEFAULT_TEXTFIELD_EXCEPTIONS);
export const getEditorFontId = () => getSetting(STORAGE.editorFont, '');
export const getTextFieldConfigs = () => {
    const raw = getSetting(STORAGE.textFieldConfigs, {});
    const result = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw))
        return result;
    for (const [key, value] of Object.entries(raw)) {
        if (!key || key === '__proto__' || key === 'constructor' || key === 'prototype')
            continue;
        if (!value || typeof value !== 'object' || Array.isArray(value))
            continue;
        const config = {};
        for (const property of ['enabled', 'wordWrap', 'lineNumbers', 'spellCheck', 'languageTool', 'minimap']) {
            if (typeof value[property] === 'boolean')
                config[property] = value[property];
        }
        for (const property of ['label', 'fontId']) {
            if (typeof value[property] === 'string')
                config[property] = value[property];
        }
        if (EDITOR_ENGINES.some(item => item.id === value.engine))
            config.engine = value.engine;
        if (LANGUAGES.some(item => item.id === value.language))
            config.language = value.language;
        if (INDENT_MODES.some(item => item.id === value.indentMode))
            config.indentMode = value.indentMode;
        result[key] = config;
    }
    return result;
};
export const getUploadedFonts = () => {
    const raw = getSetting(STORAGE.uploadedFonts, []);
    if (!Array.isArray(raw))
        return [];
    return raw.filter((item) => !!item
        && typeof item === 'object'
        && typeof item.id === 'string'
        && typeof item.label === 'string'
        && typeof item.family === 'string');
};
export const getCustomExtensionFields = () => {
    const raw = getSetting(STORAGE.customExtensionFields, []);
    if (!Array.isArray(raw))
        return [];
    return raw.filter((item) => !!item
        && typeof item === 'object'
        && typeof item.selector === 'string'
        && Boolean(item.selector.trim())
        && typeof item.label === 'string'
        && typeof item.group === 'string');
};
//# sourceMappingURL=settings.js.map