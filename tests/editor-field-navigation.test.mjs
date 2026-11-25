import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as constants from '../dist/constants.js';

async function fixture(choice) {
    class TextArea {
        tagName = 'TEXTAREA';
        id = 'memory_contents';
        value = 'saved memory';
        getAttribute() { return null; }
    }
    const field = new TextArea();
    const document = {
        getElementById: id => id === field.id ? field : null,
        querySelector: () => null,
    };
    const modules = {
        './constants.js': constants,
        './FontManager.js': {},
        './LanguageToolClient.js': {
            attachLanguageToolToPrism: () => ({ setEnabled() {}, notifyValueChanged() {}, dispose() {} }),
            attachLanguageToolToMonaco: () => ({ setEnabled() {}, notifyValueChanged() {}, dispose() {} }),
            isLanguageToolPluginAvailable: () => false,
            probeLanguageToolPlugin: async () => false,
            subscribeLanguageToolAvailability: () => () => {},
        },
        './HistoryStore.js': {},
        './HistoryPanel.js': {},
        './SettingsPanel.js': {},
        './SettingsWindow.js': {},
        './SourcePanel.js': {},
        './SourceManager.js': {},
        './settings.js': { setSetting() {} },
    };
    async function load(name) {
        const source = await readFile(new URL(`../src/${name}.ts`, import.meta.url), 'utf8');
        const compiled = ts.transpileModule(source, {
            compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
        }).outputText.replace(/import\.meta\.url/g, JSON.stringify(import.meta.url));
        const exports = {};
        vm.runInNewContext(compiled, {
            exports, document, HTMLTextAreaElement: TextArea, HTMLInputElement: TextArea,
            require: name => {
                if (name in modules) return modules[name];
                if (name === './vendor/prism-code-editor/prism/index.js') return { languages: {} };
                if (name.startsWith('./vendor/') || name.startsWith('../../')) return {};
                throw new Error(`Unexpected import: ${name}`);
            },
        });
        return exports;
    }
    modules['./TextFieldReplacer.js'] = await load('TextFieldReplacer');
    const { EveryTextLineEditor } = await load('EveryTextLineEditor');
    const editor = Object.create(EveryTextLineEditor.prototype);
    const original = { id: 'original', group: 'Prompts', read: () => 'saved prompt' };
    let value = 'unsaved prompt';
    let prompts = 0;
    let saves = 0;
    Object.assign(editor, {
        sources: [original], selectedSource: original, selectedSourceBaseline: 'saved prompt',
        dirty: true, trackedSourceGroups: new Set(['Prompts']), dom: {},
        open: async () => {},
        confirmUnsavedSourceChange: async () => { prompts++; return choice; },
        saveCurrentSource: async () => { saves++; return choice !== 'failed-save'; },
        getLanguageForSource: () => constants.LANGUAGES[0],
        setActiveLanguage() {}, updateHeader() {}, renderDiff() {}, updateStatusBar() {}, renderTree() {},
        setEditorValue: next => { value = next; },
        updateDirty: next => { editor.dirty = next; },
    });
    return { editor, field, value: () => value, prompts: () => prompts, saves: () => saves };
}

test('Open in ETLE supports a textbox without an ID', async () => {
    const f = await fixture('discard');
    f.field.id = '';
    await f.editor.openForFieldId('', f.field);
    assert.equal(f.editor.selectedSource.id, 'dom-field:path:textarea:nth-of-type(1)');
    assert.equal(f.value(), 'saved memory');
    assert.equal(f.prompts(), 1);
});

test('the Settings button opens the popup without replacing the active sidebar tab', async () => {
    const f = await fixture('cancel');
    f.editor.selectedSidebarTab = 'sources';
    let opened = 0;
    f.editor.openSettingsWindow = () => { opened++; };
    f.editor.setSidebarTab('settings');
    assert.equal(opened, 1);
    assert.equal(f.editor.selectedSidebarTab, 'sources');
});

for (const choice of ['cancel', 'save', 'discard', 'failed-save']) {
    test(`opening an unmapped field respects unsaved changes: ${choice}`, async () => {
        const f = await fixture(choice);
        // A failed save follows the same choice path as Save Changes.
        if (choice === 'failed-save') f.editor.confirmUnsavedSourceChange = async () => 'save';
        await f.editor.openForFieldId(f.field.id);
        if (choice !== 'failed-save') assert.equal(f.prompts(), 1);
        assert.equal(f.saves(), choice === 'save' || choice === 'failed-save' ? 1 : 0);
        if (choice === 'cancel' || choice === 'failed-save') {
            assert.equal(f.editor.selectedSource.id, 'original');
            assert.equal(f.value(), 'unsaved prompt');
            assert.equal(f.editor.dirty, true);
        } else {
            assert.equal(f.editor.selectedSource.id, 'dom-field:memory_contents');
            assert.equal(f.value(), 'saved memory');
        }
    });
}
