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

export function getSetting<T>(key: string, defaultValue: T): T {
    initExtensionSettings();
    
    // 1. Check if key is in extension_settings[NAME]
    if (key in extension_settings[NAME]) {
        return extension_settings[NAME][key] as T;
    }
    
    // 2. Try migrating/reading from localStorage
    const localValue = localStorage.getItem(key);
    if (localValue !== null) {
        try {
            const parsed = JSON.parse(localValue);
            extension_settings[NAME][key] = parsed;
            saveSettingsDebounced();
            return parsed as T;
        } catch {
            extension_settings[NAME][key] = localValue;
            saveSettingsDebounced();
            return localValue as unknown as T;
        }
    }
    
    return defaultValue;
}

export function setSetting<T>(key: string, value: T): void {
    initExtensionSettings();
    extension_settings[NAME][key] = value;
    saveSettingsDebounced();
}

export function clearSettings(): void {
    initExtensionSettings();
    extension_settings[NAME] = {};
    saveSettingsDebounced();
}

