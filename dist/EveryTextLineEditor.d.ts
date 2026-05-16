import './vendor/prism-code-editor/grammars/yaml.js';
import './vendor/prism-code-editor/grammars/markdown.js';
import { DomRefs, IndentMode, Language, PrismEditorLike, TextSource, SyncMode, SidebarTab } from './types.js';
declare global {
    interface Window {
        EveryTextLineEditor?: EveryTextLineEditor;
    }
}
export declare class EveryTextLineEditor {
    sources: TextSource[];
    selectedSource: TextSource | null;
    dirty: boolean;
    collapsedGroups: Set<string>;
    currentLanguage: Language;
    scrollSyncMode: SyncMode;
    dom: DomRefs;
    editor: PrismEditorLike | null;
    oldEditor: PrismEditorLike | null;
    diffOpen: boolean;
    isSyncingScroll: boolean;
    scrollSyncFrame: number;
    pendingScrollSync: {
        from: HTMLElement;
        to: HTMLElement;
    } | null;
    indentMode: IndentMode;
    selectedSidebarTab: SidebarTab;
    constructor();
    inject(): Promise<void>;
    renderDrawer(): void;
    handleDrawerToggle(event: any): void;
    handleDocumentClick(event: any): void;
    renderPanel(): HTMLDivElement;
    renderHistoryShell(): HTMLDivElement;
    setSidebarTab(tab: SidebarTab): void;
    toggleDrawerClasses(): void;
    setUnsavedLock(isLocked: any): void;
    makeIconButton(icon: any, title: any, onClick: any): HTMLButtonElement;
    makeTextButton(text: any, icon: any, onClick: any): HTMLButtonElement;
    renderStatusBar(): HTMLElement;
    createCodeEditor(host: any): void;
    handleEditorKeyDown(event: KeyboardEvent): void;
    createReadonlyEditor(host: any): void;
    bindDiffScrollSync(): void;
    applyScrollSync(from: any, to: any): void;
    syncDiffScroll(): void;
    refreshSources(keepSelection?: boolean): Promise<void>;
    selectInitialSource(): Promise<void>;
    renderTree(): void;
    toggleSource(source: any): Promise<void>;
    selectSource(id: any, { force }?: {
        force?: boolean;
    }): Promise<void>;
    confirmUnsavedSourceChange(action?: string): Promise<"save" | "discard" | "cancel">;
    setEditorValue(value: any): void;
    setWordWrap(enabled: any): void;
    cycleIndentMode(): void;
    cycleLanguage(): void;
    setLanguage(lang: Language): void;
    cycleScrollSync(): void;
    setScrollSync(mode: SyncMode): void;
    getCursorPosition(): {
        line: number;
        column: number;
    };
    getEditorStats(): {
        chars: number;
        lines: number;
        selection: number;
    };
    updateHeader(): void;
    renderTriggerControl(meta: NonNullable<TextSource['metadata']>['triggers']): HTMLButtonElement | HTMLLabelElement;
    toggleNameEdit(): void;
    createPropGroup(label: string): HTMLDivElement;
    updateStatusBar(): void;
    apply(): Promise<void>;
    saveCurrentSource({ refresh, toast }?: {
        refresh?: boolean;
        toast?: boolean;
    }): Promise<boolean>;
    revert(): void;
    toggleDiff(): void;
    updateMasterScrollbarHeight(): void;
    renderDiff(): void;
    highlightDiff(saved: any, unsaved: any): void;
    applyDiffMarks(editor: any, marks: any, activeMark: any, spacers: any): void;
    updateDirty(isDirty: any): void;
    open(): Promise<void>;
    close(): Promise<void>;
    startResize(event: any): void;
}
