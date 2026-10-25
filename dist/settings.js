// @ts-ignore
import { extension_settings } from '../../../../extensions.js';
// @ts-ignore
import { saveSettingsDebounced } from '../../../../../script.js';
import { NAME } from './constants.js';
export function initExtensionSettings() {
    if (!extension_settings[NAME]) {
        extension_settings[NAME] = {};
    }
}
export function getSetting(key, defaultValue) {
    initExtensionSettings();
    // 1. Check if key is in extension_settings[NAME]
    if (key in extension_settings[NAME]) {
        return extension_settings[NAME][key];
    }
    // 2. Try migrating/reading from localStorage
    const localValue = localStorage.getItem(key);
    if (localValue !== null) {
        try {
            const parsed = JSON.parse(localValue);
            extension_settings[NAME][key] = parsed;
            saveSettingsDebounced();
            return parsed;
        }
        catch {
            extension_settings[NAME][key] = localValue;
            saveSettingsDebounced();
            return localValue;
        }
    }
    return defaultValue;
}
export function setSetting(key, value) {
    initExtensionSettings();
    extension_settings[NAME][key] = value;
    saveSettingsDebounced();
}
export function clearSettings() {
    initExtensionSettings();
    extension_settings[NAME] = {};
    saveSettingsDebounced();
}
//# sourceMappingURL=settings.js.map