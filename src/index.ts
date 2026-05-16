// SillyTavern runtime modules live outside this extension package and do not ship local .d.ts files.
// @ts-ignore
import { extension_settings } from '../../../../extensions.js';
import { EveryTextLineEditor } from './EveryTextLineEditor.js';
import { NAME } from './constants.js';

declare global {
    interface Window {
        EveryTextLineEditor?: EveryTextLineEditor;
    }
}

const init = () => {
    if (extension_settings.disabledExtensions.includes(`third-party/${NAME}`)) return;
    const app = new EveryTextLineEditor();
    app.inject().catch((error) => console.error(`[${NAME}] Failed to initialize`, error));
    window.EveryTextLineEditor = app;
};

init();
