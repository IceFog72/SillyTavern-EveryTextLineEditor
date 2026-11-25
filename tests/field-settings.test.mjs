import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

test('textbox settings retain valid false values and reject malformed persisted overrides', async () => {
    const constantsSource = await readFile(new URL('../src/constants.ts', import.meta.url), 'utf8');
    const compiledConstants = ts.transpileModule(constantsSource, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText.replace(/import\.meta\.url/g, JSON.stringify(new URL('../src/constants.ts', import.meta.url).href));
    const constants = {};
    vm.runInNewContext(compiledConstants, { exports: constants, URL });
    const source = await readFile(new URL('../src/settings.ts', import.meta.url), 'utf8');
    const compiled = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const extension_settings = {};
    const exports = {};
    vm.runInNewContext(compiled, {
        exports,
        localStorage: { getItem: () => null },
        require: name => {
            if (name === '../../../../extensions.js') return { extension_settings };
            if (name === '../../../../../script.js') return { saveSettingsDebounced() {} };
            if (name === './constants.js') return constants;
            throw new Error(`Unexpected import: ${name}`);
        },
    });
    const key = constants.STORAGE.textFieldConfigs;
    for (const bad of [null, [], true, 'invalid']) {
        exports.setSetting(key, bad);
        assert.equal(Object.keys(exports.getTextFieldConfigs()).length, 0);
    }
    exports.setSetting(key, JSON.parse('{' +
        '"id:good":{"enabled":false,"wordWrap":false,"lineNumbers":true,"engine":"monaco","language":"json","fontId":"","indentMode":"spaces2","spellCheck":true,"minimap":false,"label":"Prompt"},' +
        '"id:bad":{"enabled":"false","engine":"unknown","language":"exe","indentMode":7,"label":false,"extra":"ignored"},' +
        '"id:null":null,"id:array":[],"__proto__":{"enabled":false}}'));
    const result = exports.getTextFieldConfigs();
    assert.equal(result['id:good'].enabled, false);
    assert.equal(result['id:good'].wordWrap, false);
    assert.equal(result['id:good'].engine, 'monaco');
    assert.equal(result['id:good'].fontId, '');
    assert.equal(result['id:good'].indentMode, 'spaces2');
    assert.deepEqual(Object.keys(result['id:bad']), []);
    assert.equal(Object.hasOwn(result, '__proto__'), false);
    assert.equal(Object.hasOwn(result, 'id:null'), false);
    assert.equal(Object.hasOwn(result, 'id:array'), false);
});
