export interface SpellcheckerRange {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
}

export interface SpellcheckerOptions {
    check(word: string): boolean | Promise<boolean>;
    suggest(word: string): string[] | Promise<string[]>;
    ignore?(word: string): void | Promise<void>;
    addWord?(word: string): void | Promise<void>;
    severity?: number;
    languageSelector?: string | string[];
    tokenize?(line: string): Iterable<{ word: string; pos: number }>;
    messageBuilder?(type: string, word: string, range: SpellcheckerRange, options: SpellcheckerOptions): string;
}

export interface MonacoSpellchecker {
    process(): void | Promise<void>;
    dispose(): void;
}

export function getSpellchecker(monaco: any, editor: any, options: SpellcheckerOptions): MonacoSpellchecker;
