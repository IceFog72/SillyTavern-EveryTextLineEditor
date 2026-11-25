export interface FontOption {
    id: string;
    label: string;
    family: string;
    url?: string;
}
export declare const FONT_FILE_PATTERN: RegExp;
export declare const MONACO_DEFAULT_FONT = "\"Droid Sans Mono\", \"monospace\", monospace";
export declare const BUILTIN_FONTS: readonly FontOption[];
export declare const isFontAvailableLocally: (family: string) => boolean;
export declare const getAvailableBuiltinFonts: (keepId?: string) => FontOption[];
export declare const fontLabelFromPath: (path: string) => string;
export declare const makeFontFamilyName: (label: string) => string;
export declare const makeUrlFontOption: (idPrefix: string, relativePath: string) => FontOption;
export declare const extractAssetFonts: (payload: Record<string, unknown> | null | undefined) => FontOption[];
export declare const discoverAssetFonts: (getHeaders: () => Record<string, string>) => Promise<FontOption[]>;
export declare const ensureFontLoaded: (option: FontOption | null | undefined) => Promise<void>;
export declare const sanitizeUploadFontName: (fileName: string) => string;
export declare const readFileAsBase64: (file: File) => Promise<string>;
