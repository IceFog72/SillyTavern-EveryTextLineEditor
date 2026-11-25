// @ts-ignore
import { extension_settings } from '../../../../extensions.js';
// @ts-ignore
import { saveSettingsDebounced } from '../../../../../script.js';
import { DEFAULT_TEXTFIELD_EXCEPTIONS, EDITOR_ENGINES, INDENT_MODES, LANGUAGES, NAME, STORAGE } from './constants.js';
import { CustomExtensionField, EditorEngine, TextFieldConfig, TextFieldConfigs } from './types.js';
import { FontOption } from './FontManager.js';

// Legacy localStorage values stored as plain strings, not JSON.
const RAW_STRING_KEYS = new Set<string>([
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

export function getSetting<T>(key: string, defaultValue: T): T {
    initExtensionSettings();

    if (key in extension_settings[NAME]) {
        return extension_settings[NAME][key] as T;
    }

    // Migrate once from localStorage, then drop the old copy.
    const localValue = localStorage.getItem(key);
    if (localValue === null) return defaultValue;

    let value: unknown = localValue;
    if (!RAW_STRING_KEYS.has(key)) {
        try {
            value = JSON.parse(localValue);
        } catch {
            value = localValue;
        }
    }
    extension_settings[NAME][key] = value;
    localStorage.removeItem(key);
    saveSettingsDebounced();
    return value as T;
}

export function setSetting<T>(key: string, value: T): void {
    initExtensionSettings();
    if (key in extension_settings[NAME] && Object.is(extension_settings[NAME][key], value)) {
        return;
    }
    extension_settings[NAME][key] = value;
    saveSettingsDebounced();
}

export function clearSettings(): void {
    extension_settings[NAME] = {};
    saveSettingsDebounced();
}

export const isWordWrapEnabled = (): boolean => getSetting<boolean>(STORAGE.wordWrap, true);
export const isLineNumbersEnabled = (): boolean => getSetting<boolean>(STORAGE.lineNumbers, true);
export const isSpellCheckEnabled = (): boolean => getSetting<boolean>(STORAGE.spellCheck, false);
export const isLanguageToolEnabled = (): boolean => getSetting<boolean>(STORAGE.languageTool, false);
export const isMonacoMinimapEnabled = (): boolean => getSetting<boolean>(STORAGE.monacoMinimap, false);
export const isFullJsonHistoryIgnored = (): boolean => getSetting<boolean>(STORAGE.ignoreFullJsonHistory, true);
export const isAutoCollapseSidebarEnabled = (): boolean => getSetting<boolean>(STORAGE.autoCollapseSidebar, true);
export const isHideNonEditableSourcesEnabled = (): boolean => getSetting<boolean>(STORAGE.hideNonEditableSources, true);
export const isReplaceTextFieldsEnabled = (): boolean => getSetting<boolean>(STORAGE.replaceTextFields, false);
export const isReplaceTextFieldLineNumbersEnabled = (): boolean => getSetting<boolean>(STORAGE.replaceTextFieldLineNumbers, true);
export const isReplaceTextFieldWordWrapEnabled = (): boolean => getSetting<boolean>(STORAGE.replaceTextFieldWordWrap, true);
export const getReplaceTextFieldEngine = (): EditorEngine => {
    const stored = getSetting<string>(STORAGE.replaceTextFieldEngine, '');
    return EDITOR_ENGINES.find(engine => engine.id === stored) ?? EDITOR_ENGINES[0];
};
export const getReplaceTextFieldExceptions = (): string => getSetting<string>(STORAGE.replaceTextFieldExceptions, DEFAULT_TEXTFIELD_EXCEPTIONS);

export const getEditorFontId = (): string => getSetting<string>(STORAGE.editorFont, '');

export const getTextFieldConfigs = (): TextFieldConfigs => {
    const raw = getSetting<unknown>(STORAGE.textFieldConfigs, {});
    const result: TextFieldConfigs = {};
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return result;
    for (const [key, value] of Object.entries(raw)) {
        if (!key || key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
        if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
        const config: TextFieldConfig = {};
        for (const property of ['enabled', 'wordWrap', 'lineNumbers', 'spellCheck', 'languageTool', 'minimap'] as const) {
            if (typeof value[property] === 'boolean') config[property] = value[property];
        }
        for (const property of ['label', 'fontId'] as const) {
            if (typeof value[property] === 'string') config[property] = value[property];
        }
        if (EDITOR_ENGINES.some(item => item.id === value.engine)) config.engine = value.engine;
        if (LANGUAGES.some(item => item.id === value.language)) config.language = value.language;
        if (INDENT_MODES.some(item => item.id === value.indentMode)) config.indentMode = value.indentMode;
        result[key] = config;
    }
    return result;
};

export const getUploadedFonts = (): FontOption[] => {
    const raw = getSetting<unknown>(STORAGE.uploadedFonts, []);
    if (!Array.isArray(raw)) return [];
    return raw.filter((item): item is FontOption =>
        !!item
        && typeof item === 'object'
        && typeof (item as FontOption).id === 'string'
        && typeof (item as FontOption).label === 'string'
        && typeof (item as FontOption).family === 'string',
    );
};

export const getCustomExtensionFields = (): CustomExtensionField[] => {
    const raw = getSetting<unknown>(STORAGE.customExtensionFields, []);
    if (!Array.isArray(raw)) return [];
    return raw.filter((item): item is CustomExtensionField =>
        !!item
        && typeof item === 'object'
        && typeof (item as CustomExtensionField).selector === 'string'
        && Boolean((item as CustomExtensionField).selector.trim())
        && typeof (item as CustomExtensionField).label === 'string'
        && typeof (item as CustomExtensionField).group === 'string',
    );
};
