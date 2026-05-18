import { EDITOR_ENGINES, INDENT_MODES, LANGUAGES, SYNC_MODES } from './constants.js';
export type Language = typeof LANGUAGES[number];
export type SyncMode = typeof SYNC_MODES[number];
export type EditorEngine = typeof EDITOR_ENGINES[number];
export type SidebarTab = 'sources' | 'history' | 'settings';
export type TextField = readonly [property: string, label: string, selector?: string];
export type DiffMark = '' | 'added' | 'removed' | 'placeholder';
export interface AlignedDiff {
    oldMarks: DiffMark[];
    newMarks: DiffMark[];
    oldDisplayText: string;
}
export type IndentMode = typeof INDENT_MODES[number];
export interface ChangedSource {
    source: TextSource;
    status: 'A' | 'M' | 'D';
    latest?: HistoryCommit | null;
}
export interface HistoryCommit {
    id: string;
    sourceId: string;
    sourceLabel: string;
    sourceGroup: string;
    scopeId: string;
    scopeType: string;
    scopeLabel: string;
    createdAt: number;
    parentId: string | null;
    reason: 'manual' | 'initial' | 'load';
    content: string;
    hash: string;
    meta?: {
        app?: string;
        extensionVersion?: string;
        sourceMeta?: string;
        message?: string;
        batchId?: string;
    };
}
export interface HistorySource {
    sourceKey: string;
    sourceId: string;
    scopeId: string;
    scopeType: string;
    scopeLabel: string;
    latestCommitId: string | null;
    latestHash: string | null;
    updatedAt: number;
    label: string;
    group: string;
}
export interface HistoryScope {
    scopeId: string;
    scopeType: string;
    scopeLabel: string;
}
export interface BranchManager {
    getBranches(): string[];
    getCurrentBranch(): string;
    switchBranch(branchName: string): Promise<void> | void;
}
export interface PromptOrderEntry {
    identifier?: string;
    enabled?: boolean;
    [key: string]: any;
}
export interface TextSource {
    id: string;
    label: string;
    group: string;
    groupOrder?: number;
    order?: number;
    readonly: boolean;
    selectable?: boolean;
    placeholder?: boolean;
    enabled?: boolean;
    toggleable?: boolean;
    promptOrderEntry?: PromptOrderEntry;
    branchManager?: BranchManager;
    meta?: string;
    read: () => string;
    readFresh?: () => string | Promise<string>;
    write: (value: string) => void;
    save: () => void | Promise<void>;
    metadata?: {
        name?: {
            get: () => string;
            set: (v: string) => void;
        };
        role?: {
            get: () => string;
            set: () => void;
            label: () => string;
        };
        triggers?: {
            get: () => string;
            set: (v: string) => void;
            label?: () => string;
            editHint?: string;
            emptyLabel?: string;
            options?: readonly {
                id: string;
                label: string;
            }[];
        };
        position?: {
            get: () => number;
            set: (delta: number) => void;
            label: () => string;
        };
        depth?: {
            get: () => number;
            set: (v: number) => void;
        };
        order?: {
            get: () => number;
            set: (v: number) => void;
        };
    };
    toggle?(): void | Promise<void>;
}
export interface PrismEditorLike {
    value: string;
    textarea: HTMLTextAreaElement;
    scrollContainer: HTMLElement;
    wrapper: HTMLElement;
    setOptions(options: Record<string, any>): void;
    update?(): void;
    focus?(): void;
    getCursorPosition?(): CursorPosition;
    getSelectionLength?(): number;
    dispose?(): void;
}
export interface DomRefs {
    [key: string]: any;
    drawer?: HTMLDivElement;
    toggle?: HTMLDivElement;
    icon?: HTMLDivElement;
    root?: HTMLDivElement;
    sidebar?: HTMLElement;
    sidebarCollapse?: HTMLButtonElement;
    sidebarRestore?: HTMLButtonElement;
    sidebarTabs?: HTMLDivElement;
    sidebarBody?: HTMLDivElement;
    sourcesPanel?: HTMLElement;
    sourcesToolbar?: HTMLDivElement;
    addSource?: HTMLButtonElement;
    historyPanel?: HTMLElement;
    settingsPanel?: HTMLElement;
    tree?: HTMLDivElement;
    currentGroup?: HTMLDivElement;
    currentTitleRow?: HTMLDivElement;
    currentTitle?: HTMLHeadingElement;
    editName?: HTMLButtonElement;
    actionsLeft?: HTMLDivElement;
    actionsRight?: HTMLDivElement;
    diff?: HTMLButtonElement;
    revert?: HTMLButtonElement;
    apply?: HTMLButtonElement;
    workspace?: HTMLDivElement;
    oldEditorHost?: HTMLDivElement;
    editorHost?: HTMLDivElement;
    monacoDiffHost?: HTMLDivElement;
    oldDiffLabel?: HTMLDivElement;
    editorDiffLabel?: HTMLDivElement;
    monacoDiffLabels?: HTMLDivElement;
    monacoDiffOriginalLabel?: HTMLDivElement;
    monacoDiffModifiedLabel?: HTMLDivElement;
    monacoDiffEditorHost?: HTMLDivElement;
    statusDirty?: HTMLElement;
    statusSourceCount?: HTMLElement;
    statusStats?: HTMLElement;
    statusCursor?: HTMLElement;
    statusSelection?: HTMLElement;
    statusIndent?: HTMLButtonElement;
    statusWrap?: HTMLButtonElement;
    statusSpellCheck?: HTMLButtonElement;
    statusMinimap?: HTMLButtonElement;
    statusLanguage?: HTMLButtonElement;
    statusLanguageMenu?: HTMLDivElement;
    statusEngine?: HTMLButtonElement;
    statusScrollSync?: HTMLButtonElement;
    editorEngine?: HTMLSelectElement;
    statusBranch?: HTMLSelectElement;
    masterScrollbar?: HTMLDivElement;
    masterScrollContent?: HTMLDivElement;
    currentProps?: HTMLDivElement;
}
export interface EditorStats {
    chars: number;
    lines: number;
    selection: number;
}
export interface CursorPosition {
    line: number;
    column: number;
}
