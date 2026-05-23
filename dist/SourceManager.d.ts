import { AlignedDiff, TextSource } from './types.js';
export declare const getCollapsedGroups: () => Set<string>;
export declare const setCollapsedGroups: (groups: Set<string>) => void;
export declare const setPromptInspectorSnapshot: (value: string) => void;
export declare const getPromptInspectorSourceId: () => string;
export declare const getPromptInspectorPreviousValue: () => string;
export declare const getLineDiff: (oldText: string, newText: string) => AlignedDiff;
export declare const getSources: () => Promise<TextSource[]>;
