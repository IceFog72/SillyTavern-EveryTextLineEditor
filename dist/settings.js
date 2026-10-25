// @ts-ignore
import { extension_settings } from '../../../../extensions.js';
// @ts-ignore
import { saveSettingsDebounced } from '../../../../../script.js';
import { NAME, STORAGE } from './constants.js';
// Legacy localStorage values stored as plain strings, not JSON.
const RAW_STRING_KEYS = new Set([
    STORAGE.selectedSource,
    STORAGE.indentMode,
    STORAGE.scrollSync,
    STORAGE.editorEngine,
    STORAGE.panelWidth,
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
    extension_settings[NAME][key] = value;
    saveSettingsDebounced();
}
export function clearSettings() {
    extension_settings[NAME] = {};
    saveSettingsDebounced();
}
//# sourceMappingURL=settings.js.map