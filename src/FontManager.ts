import { NAME } from './constants.js';

export interface FontOption {
    id: string;
    label: string;
    family: string;
    url?: string;
}

export const FONT_FILE_PATTERN = /\.(woff2?|ttf|otf)$/i;

export const MONACO_DEFAULT_FONT = '"Droid Sans Mono", "monospace", monospace';

export const BUILTIN_FONTS: readonly FontOption[] = [
    { id: '', label: 'Default (Theme)', family: '' },
    { id: 'monospace', label: 'System Monospace', family: 'monospace' },
    { id: 'sans-serif', label: 'Sans-serif', family: 'sans-serif' },
    { id: 'serif', label: 'Serif', family: 'serif' },
    // Cross-platform / developer fonts
    { id: 'JetBrains Mono', label: 'JetBrains Mono', family: '"JetBrains Mono", "JetBrainsMono Nerd Font", monospace' },
    { id: 'Fira Code', label: 'Fira Code', family: '"Fira Code", "FiraCode Nerd Font", monospace' },
    { id: 'Cascadia Code', label: 'Cascadia Code', family: '"Cascadia Code", "Cascadia Mono", "CaskaydiaCove Nerd Font Mono", "CaskaydiaCove NF", monospace' },
    { id: 'Source Code Pro', label: 'Source Code Pro', family: '"Source Code Pro", monospace' },
    { id: 'IBM Plex Mono', label: 'IBM Plex Mono', family: '"IBM Plex Mono", monospace' },
    { id: 'MesloLGS', label: 'MesloLGS Nerd Font', family: '"MesloLGS Nerd Font Mono", "MesloLGS NF", monospace' },
    // Windows
    { id: 'Consolas', label: 'Consolas', family: 'Consolas, monospace' },
    { id: 'Courier New', label: 'Courier New', family: '"Courier New", monospace' },
    // macOS
    { id: 'SF Mono', label: 'SF Mono', family: '"SF Mono", monospace' },
    { id: 'Menlo', label: 'Menlo', family: 'Menlo, monospace' },
    { id: 'Monaco', label: 'Monaco', family: 'Monaco, monospace' },
    // Linux
    { id: 'DejaVu Sans Mono', label: 'DejaVu Sans Mono', family: '"DejaVu Sans Mono", monospace' },
    { id: 'Liberation Mono', label: 'Liberation Mono', family: '"Liberation Mono", monospace' },
    { id: 'Noto Sans Mono', label: 'Noto Sans Mono', family: '"Noto Sans Mono", monospace' },
    { id: 'Ubuntu Mono', label: 'Ubuntu Mono', family: '"Ubuntu Mono", monospace' },
    { id: 'Adwaita Mono', label: 'Adwaita Mono', family: '"Adwaita Mono", monospace' },
];

const GENERIC_FONT_IDS = new Set(['', 'monospace', 'sans-serif', 'serif']);

export const isFontAvailableLocally = (family: string): boolean => {
    if (!family || typeof document === 'undefined') return true;
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext?.('2d');
        if (!ctx) return true;
        const sample = 'mmmmmmmmmmlli10OQWw@#&';
        const bases = ['monospace', 'sans-serif', 'serif'] as const;
        const candidates = family
            .split(',')
            .map(part => part.trim())
            .filter(part => part && !['monospace', 'sans-serif', 'serif'].includes(part.toLowerCase()));
        if (!candidates.length) return true;
        for (const base of bases) {
            ctx.font = `48px ${base}`;
            const baseWidth = ctx.measureText(sample).width;
            for (const candidate of candidates) {
                ctx.font = `48px ${candidate}, ${base}`;
                if (Math.abs(ctx.measureText(sample).width - baseWidth) > 0.1) return true;
            }
        }
        return false;
    } catch {
        return true;
    }
};

export const getAvailableBuiltinFonts = (keepId = ''): FontOption[] =>
    BUILTIN_FONTS.filter(font =>
        GENERIC_FONT_IDS.has(font.id)
        || font.id === keepId
        || isFontAvailableLocally(font.family),
    );

export const fontLabelFromPath = (path: string): string => {
    const fileName = String(path).split('/').pop() ?? path;
    const base = fileName.replace(FONT_FILE_PATTERN, '');
    return base.replace(/[_-]+/g, ' ').trim() || fileName;
};

export const makeFontFamilyName = (label: string): string => {
    const safe = label.replace(/[^A-Za-z0-9 _-]/g, '').trim() || 'Custom';
    return `ETLE-${safe}`;
};

export const makeUrlFontOption = (idPrefix: string, relativePath: string): FontOption => {
    const normalized = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    const label = fontLabelFromPath(normalized);
    const familyName = makeFontFamilyName(label);
    return {
        id: `${idPrefix}:${normalized}`,
        label,
        family: `"${familyName}", monospace`,
        url: encodeURI(normalized),
    };
};

export const extractAssetFonts = (payload: Record<string, unknown> | null | undefined): FontOption[] => {
    if (!payload || typeof payload !== 'object') return [];
    const seen = new Set<string>();
    const out: FontOption[] = [];

    const visitList = (list: unknown) => {
        if (!Array.isArray(list)) return;
        for (const item of list) {
            if (typeof item !== 'string' || !FONT_FILE_PATTERN.test(item)) continue;
            const option = makeUrlFontOption('asset', item);
            if (seen.has(option.id)) continue;
            seen.add(option.id);
            out.push(option);
        }
    };

    // Prioritize dedicated fonts/font folders first, then any other asset folder containing font files.
    visitList(payload.fonts);
    visitList(payload.font);
    for (const [key, value] of Object.entries(payload)) {
        if (key === 'fonts' || key === 'font') continue;
        visitList(value);
    }

    return out.sort((a, b) => a.label.localeCompare(b.label));
};

export const discoverAssetFonts = async (getHeaders: () => Record<string, string>): Promise<FontOption[]> => {
    try {
        const response = await fetch('/api/assets/get', {
            method: 'POST',
            headers: getHeaders(),
        });
        if (!response.ok) return [];
        const data = await response.json();
        return extractAssetFonts(data);
    } catch (error) {
        console.warn(`[${NAME}] Could not list asset fonts`, error);
        return [];
    }
};

const loadedFontUrls = new Set<string>();

export const ensureFontLoaded = async (option: FontOption | null | undefined): Promise<void> => {
    if (!option?.url || loadedFontUrls.has(option.url)) return;
    if (typeof FontFace === 'undefined' || typeof document === 'undefined' || !document.fonts) return;

    const familyName = option.family.split(',')[0].replace(/^["']|["']$/g, '').trim();
    if (!familyName) return;

    const face = new FontFace(familyName, `url("${option.url}")`);
    await face.load();
    document.fonts.add(face);
    loadedFontUrls.add(option.url);
    (globalThis as any).monaco?.editor?.remeasureFonts?.();
};

export const sanitizeUploadFontName = (fileName: string): string => {
    const cleaned = String(fileName ?? '')
        .trim()
        .replace(/[^a-zA-Z0-9_\-.]+/g, '_')
        .replace(/^\.+/, '');
    return cleaned || 'custom_font.woff2';
};

export const readFileAsBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
        const result = String(reader.result ?? '');
        const comma = result.indexOf(',');
        resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read font file.'));
    reader.readAsDataURL(file);
});
