import '../lib/prism-code-editor/prism/languages/yaml.js';
import '../lib/prism-code-editor/prism/languages/markdown.js';
type IndentMode = typeof INDENT_MODES[number];
interface PromptOrderEntry {
    identifier?: string;
    enabled?: boolean;
    [key: string]: any;
}
interface TextSource {
    id: string;
    label: string;
    group: string;
    groupOrder?: number;
    order?: number;
    readonly?: boolean;
    selectable?: boolean;
    placeholder?: boolean;
    enabled?: boolean;
    toggleable?: boolean;
    promptOrderEntry?: PromptOrderEntry;
    meta?: string;
    read(): string;
    write(value: string): void;
    save?(): void | Promise<void>;
    toggle?(): void | Promise<void>;
}
interface PrismEditorLike {
    value: string;
    textarea: HTMLTextAreaElement;
    scrollContainer: HTMLElement;
    setOptions(options: Record<string, any>): void;
    update?(): void;
}
interface DomRefs {
    [key: string]: any;
    drawer?: HTMLDivElement;
    toggle?: HTMLDivElement;
    icon?: HTMLDivElement;
    root?: HTMLDivElement;
    sidebar?: HTMLElement;
    tree?: HTMLDivElement;
    currentGroup?: HTMLDivElement;
    currentTitle?: HTMLHeadingElement;
    currentMeta?: HTMLDivElement;
    diff?: HTMLButtonElement;
    revert?: HTMLButtonElement;
    apply?: HTMLButtonElement;
    workspace?: HTMLDivElement;
    oldEditorHost?: HTMLDivElement;
    editorHost?: HTMLDivElement;
}
declare global {
    interface Window {
        EveryTextLineEditor?: EveryTextLineEditor;
    }
}
export declare const NAME: string;
declare const INDENT_MODES: {
    id: string;
    label: string;
    insertSpaces: boolean;
    tabSize: number;
}[];
declare class EveryTextLineEditor {
    sources: TextSource[];
    selectedSource: TextSource | null;
    dirty: boolean;
    collapsedGroups: Set<string>;
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
    constructor();
    inject(): Promise<void>;
    renderDrawer(): void;
    handleDrawerToggle(event: any): void;
    handleDocumentClick(event: any): void;
    renderPanel(): HTMLDivElement;
    toggleDrawerClasses(): void;
    setUnsavedLock(isLocked: any): void;
    makeIconButton(icon: any, title: any, onClick: any): HTMLButtonElement;
    makeTextButton(text: any, icon: any, onClick: any): HTMLButtonElement;
    renderStatusBar(): HTMLElement;
    createCodeEditor(host: any): void;
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
    getCursorPosition(): {
        line: number;
        column: number;
    };
    getEditorStats(): {
        chars: number;
        lines: number;
        selection: number;
    };
    updateStatusBar(): void;
    apply(): Promise<void>;
    saveCurrentSource({ refresh, toast }?: {
        refresh?: boolean;
        toast?: boolean;
    }): Promise<boolean>;
    revert(): void;
    toggleDiff(): void;
    renderDiff(): void;
    highlightDiff(saved: any, unsaved: any): void;
    applyDiffMarks(editor: any, marks: any, activeMark: any): void;
    updateDirty(isDirty: any): void;
    open(): Promise<void>;
    close(): Promise<void>;
    startResize(event: any): void;
}
export {};
