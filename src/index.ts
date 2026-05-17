// SillyTavern runtime modules live outside this extension package and do not ship local .d.ts files.
// @ts-ignore
import { extension_settings } from '../../../../extensions.js';
import { EveryTextLineEditor } from './EveryTextLineEditor.js';
import { NAME, STORAGE } from './constants.js';
import { HistoryStore } from './HistoryStore.js';

declare global {
    interface Window {
        EveryTextLineEditor?: EveryTextLineEditor;
    }
}

let app: EveryTextLineEditor | null = null;

const init = (force = false) => {
    if (app) return app;
    if (!force && extension_settings.disabledExtensions.includes(`third-party/${NAME}`)) return null;
    app = new EveryTextLineEditor();
    app.inject().catch((error) => console.error(`[${NAME}] Failed to initialize`, error));
    window.EveryTextLineEditor = app;
    return app;
};

const destroy = () => {
    app?.destroy();
    app = null;
};

const cleanLocalData = async () => {
    destroy();
    Object.values(STORAGE).forEach(key => localStorage.removeItem(key));
    await new HistoryStore().clearAll();
};

export function onActivate() {
    init();
}

export async function onInstall() {
    console.info(`[${NAME}] Installed`);
}

export async function onUpdate() {
    console.info(`[${NAME}] Updated`);
}

export async function onDelete() {
    await cleanLocalData();
}

export function onEnable() {
    init(true);
}

export function onDisable() {
    destroy();
}

export async function onClean() {
    await cleanLocalData();
};

init();
