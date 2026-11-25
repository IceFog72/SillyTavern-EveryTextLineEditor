import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../src/FontManager.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

const fontManager = {};
vm.runInNewContext(compiled, {
    exports: fontManager,
    console,
    require: (name) => {
        if (name === './constants.js') return { NAME: 'ETLE' };
        throw new Error(`Unexpected import: ${name}`);
    },
});

test('extractAssetFonts discovers woff2/woff/ttf/otf files from assets/fonts and ignores non-font files', () => {
    const fonts = fontManager.extractAssetFonts({
        fonts: [
            'assets/fonts/JetBrainsMono-Regular.woff2',
            'assets/fonts/Iosevka_Term.ttf',
            'assets/fonts/README.txt',
        ],
        font: [
            'assets/font/Custom Font.otf',
        ],
        bgm: ['assets/bgm/theme.mp3'],
    });

    assert.equal(fonts.length, 3);
    assert.deepEqual([...fonts.map(f => f.label)], ['Custom Font', 'Iosevka Term', 'JetBrainsMono Regular']);
    assert.equal(fonts[0].url, '/assets/font/Custom%20Font.otf');
    assert.equal(fonts[2].url, '/assets/fonts/JetBrainsMono-Regular.woff2');
    assert.match(fonts[2].family, /^"ETLE-JetBrainsMono Regular", monospace$/);
});

test('makeUrlFontOption builds clean id, label, family, and encoded url for uploaded user fonts', () => {
    const opt = fontManager.makeUrlFontOption('user-file', '/user/files/My_Code-Font.woff2');
    assert.equal(opt.id, 'user-file:/user/files/My_Code-Font.woff2');
    assert.equal(opt.label, 'My Code Font');
    assert.equal(opt.family, '"ETLE-My Code Font", monospace');
    assert.equal(opt.url, '/user/files/My_Code-Font.woff2');
});

test('sanitizeUploadFontName strips spaces and illegal characters for ST validateAssetFileName', () => {
    assert.equal(fontManager.sanitizeUploadFontName('JetBrains Mono Regular (v2).ttf'), 'JetBrains_Mono_Regular_v2_.ttf');
    assert.equal(fontManager.sanitizeUploadFontName('..hidden font.woff2'), 'hidden_font.woff2');
});
