import { INDENT_MODES, LANGUAGES, SYNC_MODES } from './constants.js';
export type Language = typeof LANGUAGES[number];
export type SyncMode = typeof SYNC_MODES[number];
export type SidebarTab = 'sources' | 'history' | 'settings';
export type TextField = readonly [property: string, label: string, selector?: string];
export type DiffMark = '' | 'added' | 'removed';
export interface AlignedDiff {
    oldMarks: DiffMark[];
    newMarks: DiffMark[];
    oldSpacers: number[];
    newSpacers: number[];
}
export type IndentMode = typeof INDENT_MODES[number];
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
    meta?: string;
    read: () => string;
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
    setOptions(options: Record<string, any>): void;
    update?(): void;
}
export interface DomRefs {
    [key: string]: any;
    drawer?: HTMLDivElement;
    toggle?: HTMLDivElement;
    icon?: HTMLDivElement;
    root?: HTMLDivElement;
    sidebar?: HTMLElement;
    sidebarTabs?: HTMLDivElement;
    sidebarBody?: HTMLDivElement;
    sourcesPanel?: HTMLElement;
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
    statusDirty?: HTMLElement;
    statusSourceCount?: HTMLElement;
    statusStats?: HTMLElement;
    statusCursor?: HTMLElement;
    statusSelection?: HTMLElement;
    statusIndent?: HTMLButtonElement;
    statusWrap?: HTMLButtonElement;
    statusLanguage?: HTMLButtonElement;
    statusScrollSync?: HTMLButtonElement;
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
