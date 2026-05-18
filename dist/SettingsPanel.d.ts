import { DomRefs, EditorEngine, IndentMode, SyncMode } from './types.js';
export interface SettingsPanelHost {
    dom: DomRefs;
    editorEngine: EditorEngine;
    scrollSyncMode: SyncMode;
    indentMode: IndentMode;
    createPropGroup(label: string): HTMLDivElement;
    makeTextButton(label: string, icon: string, onClick: () => void): HTMLButtonElement;
    setWordWrap(enabled: boolean): void;
    setSpellCheck(enabled: boolean): void;
    setMonacoMinimap(enabled: boolean): void;
    setIgnoreFullJsonHistory(enabled: boolean): void;
    setEditorEngine(engine: EditorEngine): Promise<void>;
    setScrollSync(mode: SyncMode): void;
    setIndentMode(mode: IndentMode): void;
    exportHistory(): Promise<void>;
    clearHistory(): Promise<void>;
}
export declare function renderSettingsPanel(host: SettingsPanelHost): HTMLElement;
