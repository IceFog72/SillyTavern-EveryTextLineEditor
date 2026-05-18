import { DomRefs, Language, TextSource } from './types.js';
export declare const isLorebookGroup: (group: string) => boolean;
export declare const isCardGroup: (group: string) => boolean;
interface SourcePanelHost {
    dom: DomRefs;
    sources: TextSource[];
    selectedSource: TextSource | null;
    trackedSourceGroups: Set<string>;
    collapsedGroups: Set<string>;
    getTrackedSources(): TextSource[];
    getLanguageForSource(source?: TextSource | null): Language;
    toggleSource(source: TextSource): Promise<void>;
    selectSource(id: string, options?: {
        force?: boolean;
    }): Promise<void>;
    setTrackedSourceGroups(groups: string[]): Promise<void>;
    makeTextButton(label: string, icon: string, onClick: () => void): HTMLButtonElement;
}
export declare function renderSourceTree(host: SourcePanelHost): void;
export declare function openSourceControlDialog(host: SourcePanelHost): void;
export {};
