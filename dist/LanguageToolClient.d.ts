export interface LanguageToolMatch {
    offset: number;
    length: number;
    message?: string;
    shortMessage?: string;
    replacements?: Array<{
        value?: string;
    }>;
    rule?: {
        id?: string;
        issueType?: string;
    };
}
export interface LanguageToolConfig {
    languages: string[];
    checkDelay: number;
    ignoreProtected: boolean;
    ignoredWords: string[];
    ignoredRules: string[];
}
export interface LanguageToolEditorAdapter {
    getValue(): string;
    applyReplacement(offset: number, length: number, replacement: string): void;
    renderMatches(text: string, matches: LanguageToolMatch[], activeIndex: number | null): void;
    getAnchorHost(): HTMLElement;
    getViewportElement(): HTMLElement;
    getMatchRect?(matchIndex: number, match: LanguageToolMatch): DOMRect | null;
    onChange(listener: () => void): () => void;
    onCaretClick(listener: (offset: number) => void): () => void;
    dispose?(): void;
}
export interface LanguageToolAttachment {
    setEnabled(enabled: boolean): void;
    notifyValueChanged(): void;
    dispose(): void;
}
export interface LanguageToolClientOptions {
    getRequestHeaders?: () => Record<string, string>;
    fetchImpl?: typeof fetch;
}
export declare function isLanguageToolPluginAvailable(): boolean;
export declare function subscribeLanguageToolAvailability(listener: (available: boolean) => void): () => void;
export declare function probeLanguageToolPlugin(force?: boolean, fetchImpl?: typeof fetch): Promise<boolean>;
export declare function filterLanguageToolMatches(text: string, matches: LanguageToolMatch[], config: LanguageToolConfig): LanguageToolMatch[];
export declare function rebaseLanguageToolMatches(matches: LanguageToolMatch[], oldText: string, newText: string): LanguageToolMatch[];
export declare function attachLanguageToolToPrism(editor: {
    textarea: HTMLTextAreaElement;
    container: HTMLElement;
}, anchorHost: HTMLElement, options?: LanguageToolClientOptions): LanguageToolAttachment;
export declare function attachLanguageToolToMonaco(monaco: any, editor: any, anchorHost: HTMLElement, options?: LanguageToolClientOptions): LanguageToolAttachment;
