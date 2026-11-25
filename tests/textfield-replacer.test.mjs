import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as constants from '../dist/constants.js';

async function loadReplacerModule() {
    const source = await readFile(new URL('../src/TextFieldReplacer.ts', import.meta.url), 'utf8');
    const compiled = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;

    const exports = {};
    class FakeNode {
        constructor(tag = 'DIV') {
            this.tagName = tag;
            this.parentElement = null;
            this.children = [];
            this.dataset = {};
            this.style = {};
            this.classList = {
                _set: new Set(),
                add(...cls) { cls.forEach(c => this._set.add(c)); },
                remove(...cls) { cls.forEach(c => this._set.delete(c)); },
                toggle(c, force) {
                    const next = force === undefined ? !this._set.has(c) : !!force;
                    if (next) this._set.add(c); else this._set.delete(c);
                    return next;
                },
                contains(c) { return this._set.has(c); },
            };
            this._listeners = new Map();
            this._attrs = new Map();
            this.id = '';
            this.name = '';
            this.title = '';
            this.isConnected = true;
        }
        get nextElementSibling() {
            if (!this.parentElement) return null;
            const idx = this.parentElement.children.indexOf(this);
            return idx >= 0 ? (this.parentElement.children[idx + 1] ?? null) : null;
        }
        set innerHTML(value) {
            for (const child of [...this.children]) child.remove();
            this._innerHTML = value;
        }
        getAttribute(name) {
            if (name === 'data-for') return this.dataset.for ?? null;
            return this._attrs.has(name) ? this._attrs.get(name) : null;
        }
        setAttribute(name, value) {
            if (name === 'data-for') this.dataset.for = String(value);
            this._attrs.set(name, String(value));
        }
        removeAttribute(name) {
            if (name === 'data-for') delete this.dataset.for;
            this._attrs.delete(name);
        }
        append(...nodes) {
            for (const n of nodes) {
                n.parentElement = this;
                n.isConnected = this.isConnected;
                this.children.push(n);
            }
        }
        insertAdjacentElement(pos, el) {
            if (pos === 'afterend' && this.parentElement) {
                const idx = this.parentElement.children.indexOf(this);
                el.parentElement = this.parentElement;
                el.isConnected = this.parentElement.isConnected;
                this.parentElement.children.splice(idx + 1, 0, el);
            }
            return el;
        }
        remove() {
            if (this.parentElement) {
                const idx = this.parentElement.children.indexOf(this);
                if (idx !== -1) this.parentElement.children.splice(idx, 1);
                this.parentElement = null;
            }
            this.isConnected = false;
        }
        addEventListener(type, fn) {
            if (!this._listeners.has(type)) this._listeners.set(type, new Set());
            this._listeners.get(type).add(fn);
        }
        removeEventListener(type, fn) {
            this._listeners.get(type)?.delete(fn);
        }
        dispatchEvent(event) {
            const set = this._listeners.get(event.type);
            if (set) for (const fn of [...set]) fn(event);
            return true;
        }
        matches(selector) {
            for (const part of selector.split(',').map(s => s.trim())) {
                if (part.startsWith('#') && this.id === part.slice(1)) return true;
                if (part.startsWith('.') && this.classList.contains(part.slice(1))) return true;
                if (part.toUpperCase() === this.tagName) return true;
            }
            return false;
        }
        closest(selector) {
            let cur = this;
            while (cur) {
                if (cur.matches(selector)) return cur;
                cur = cur.parentElement;
            }
            return null;
        }
        querySelectorAll(selector) {
            const out = [];
            const walk = (node) => {
                for (const child of node.children) {
                    if (child.matches(selector)) out.push(child);
                    walk(child);
                }
            };
            walk(this);
            return out;
        }
        getBoundingClientRect() {
            return { width: 300, height: 120 };
        }
    }

    class FakeTextAreaElement extends FakeNode {
        constructor({ id = '', name = '', value = '', rows = 4, readOnly = false, disabled = false, classes = [] } = {}) {
            super('TEXTAREA');
            this.id = id;
            this.name = name;
            this._value = value;
            this.rows = rows;
            this.readOnly = readOnly;
            this.disabled = disabled;
            classes.forEach(c => this.classList.add(c));
        }
        get value() {
            return this._value;
        }
        set value(v) {
            this._value = String(v ?? '');
        }
    }

    const body = new FakeNode('BODY');
    const document = {
        body,
        createElement: (tag) => new FakeNode(tag.toUpperCase()),
    };

    const modules = {
        './constants.js': constants,
        './FontManager.js': { MONACO_DEFAULT_FONT: '"Droid Sans Mono", "monospace", monospace' },
        './LanguageToolClient.js': {
            attachLanguageToolToPrism: () => ({ setEnabled() {}, notifyValueChanged() {}, dispose() {} }),
            attachLanguageToolToMonaco: () => ({ setEnabled() {}, notifyValueChanged() {}, dispose() {} }),
            isLanguageToolPluginAvailable: () => false,
        },
        './vendor/prism-code-editor/index.js': { createEditor: () => { throw new Error('unused in mock'); } },
        './vendor/prism-code-editor/extensions/commands/index.js': { defaultCommands: () => ({}) },
        './vendor/prism-code-editor/extensions/guides.js': { indentGuides: () => ({}) },
        './vendor/prism-code-editor/extensions/matchBrackets/index.js': { matchBrackets: () => ({}) },
        './vendor/prism-code-editor/extensions/matchBrackets/highlight.js': { highlightBracketPairs: () => ({}) },
    };

    vm.runInNewContext(compiled, {
        exports,
        document,
        Event,
        HTMLTextAreaElement: FakeTextAreaElement,
        HTMLElement: FakeNode,
        console,
        getComputedStyle: () => ({ height: '120px' }),
        requestAnimationFrame: (fn) => { fn(0); return 1; },
        require: (name) => {
            assert.ok(name in modules, `Unexpected import: ${name}`);
            return modules[name];
        },
    });

    return { ...exports, body, FakeNode, FakeTextAreaElement };
}

test('replaces eligible ST textareas, honors editable exception list, and always excludes ETLE internals', async () => {
    const env = await loadReplacerModule();
    const send = new env.FakeTextAreaElement({ id: 'send_textarea', value: 'chat input' });
    const desc = new env.FakeTextAreaElement({ id: 'description_textarea', value: 'initial desc' });
    const notes = new env.FakeTextAreaElement({ id: 'creator_notes_textarea', value: 'initial notes' });

    const etlePanel = new env.FakeNode('DIV');
    etlePanel.id = 'etle--panel';
    const etleInner = new env.FakeTextAreaElement({ id: 'internal_ta', value: 'etle' });
    etlePanel.append(etleInner);

    env.body.append(send, desc, notes, etlePanel);

    const mounted = new Map();
    let engine = { id: 'prism', label: 'Prism' };
    const replacer = new env.TextFieldReplacer({
        root: env.body,
        getEngine: () => engine,
        getWordWrap: () => true,
        getIndentMode: () => ({ id: 'tabs', label: 'Tabs: 4', insertSpaces: false, tabSize: 4 }),
        getSpellCheck: () => false,
        getMonacoMinimap: () => false,
        createEditor: (ctx) => {
            let val = ctx.value;
            let ro = ctx.readOnly;
            const inst = {
                engineId: ctx.engine.id,
                language: ctx.language,
                ctx,
                disposed: false,
                getValue: () => val,
                setValue: (next) => { val = next; },
                setReadOnly: (next) => { ro = next; },
                getReadOnly: () => ro,
                setWordWrap: () => {},
                setIndentMode: () => {},
                setSpellCheck: () => {},
                setMinimap: () => {},
                dispose: () => { inst.disposed = true; },
            };
            mounted.set(ctx.textarea, inst);
            return inst;
        },
    });

    await replacer.setExceptions('#send_textarea');
    await replacer.setEnabled(true);

    // send_textarea and ETLE internal textarea must not be replaced
    assert.equal(mounted.has(send), false);
    assert.equal(mounted.has(etleInner), false);
    assert.equal(mounted.has(desc), true);
    assert.equal(mounted.has(notes), true);
    assert.equal(desc.classList.contains('etle--replacedSourceTextarea'), true);
    assert.equal(mounted.get(desc).engineId, 'prism');

    // Editing exception list to add creator_notes_textarea restores it immediately
    await replacer.setExceptions('#send_textarea\ncreator_notes_textarea');
    assert.equal(mounted.get(notes).disposed, true);
    assert.equal(notes.classList.contains('etle--replacedSourceTextarea'), false);

    // Removing send_textarea from exceptions replaces it
    await replacer.setExceptions('creator_notes_textarea');
    assert.equal(mounted.has(send), true);
    assert.equal(send.classList.contains('etle--replacedSourceTextarea'), true);

    // Switching engine from Prism to Monaco rebuilds mounted editors with Monaco
    engine = { id: 'monaco', label: 'Monaco' };
    await replacer.setEngine(engine);
    assert.equal(mounted.get(desc).engineId, 'monaco');
    assert.equal(mounted.get(desc).getValue(), 'initial desc');

    // Disabling restores all textareas cleanly
    await replacer.setEnabled(false);
    assert.equal(desc.classList.contains('etle--replacedSourceTextarea'), false);
    assert.equal(send.classList.contains('etle--replacedSourceTextarea'), false);
});

test('per-textbox settings stay independent, inherit defaults, and persist across replacement lifecycles', async () => {
    const env = await loadReplacerModule();
    const first = new env.FakeTextAreaElement({ id: 'first', value: 'first draft' });
    const second = new env.FakeTextAreaElement({ id: 'second', value: 'second draft' });
    env.body.append(first, second);
    let wrap = true;
    let engine = constants.EDITOR_ENGINES[0];
    let saved = {};
    const mounted = new Map();
    const options = {
        root: env.body,
        getEngine: () => engine,
        getWordWrap: () => wrap,
        getLineNumbers: () => true,
        getFontId: () => '',
        getFontFamily: () => '',
        getFonts: () => [{ id: 'code', label: 'Code font', family: 'Code Font' }],
        getIndentMode: () => constants.INDENT_MODES[0],
        getSpellCheck: () => false,
        getMonacoMinimap: () => false,
        onFieldConfigsChange: configs => { saved = configs; },
        createEditor: ctx => {
            let value = ctx.value;
            const state = { engine: ctx.engine.id };
            const instance = {
                getValue: () => value, setValue: next => { value = next; },
                setReadOnly() {}, setWordWrap: next => { state.wordWrap = next; },
                setLineNumbers: next => { state.lineNumbers = next; },
                setLanguage: next => { state.language = next; },
                setFontFamily: next => { state.fontFamily = next; },
                setIndentMode: next => { state.indentMode = next.id; },
                setSpellCheck: next => { state.spellCheck = next; },
                setMinimap: next => { state.minimap = next; }, dispose() {}, state,
            };
            mounted.set(ctx.textarea, instance);
            return instance;
        },
    };
    const replacer = new env.TextFieldReplacer(options);
    await replacer.setEnabled(true);
    await replacer.setFieldConfig('id:first', { wordWrap: false, lineNumbers: false, language: 'json', engine: 'monaco', fontId: 'code', indentMode: 'spaces2', spellCheck: true, minimap: true });
    assert.equal(mounted.get(first).state.engine, 'monaco');
    assert.equal(mounted.get(first).state.wordWrap, false);
    assert.equal(mounted.get(first).state.language, 'json');
    assert.equal(mounted.get(first).state.fontFamily, 'Code Font');
    assert.equal(mounted.get(first).state.indentMode, 'spaces2');
    assert.equal(mounted.get(first).state.spellCheck, true);
    assert.equal(mounted.get(first).state.minimap, true);
    assert.equal(mounted.get(second).state.wordWrap, true);
    assert.equal(mounted.get(second).state.engine, 'prism');
    wrap = false;
    await replacer.updateOptions();
    assert.equal(mounted.get(second).state.wordWrap, false);
    wrap = true;
    engine = constants.EDITOR_ENGINES[1];
    await replacer.setEngine(engine);
    assert.equal(mounted.get(first).state.wordWrap, false);
    assert.equal(mounted.get(second).state.wordWrap, true);
    assert.equal(mounted.get(second).state.engine, 'monaco');
    await replacer.setFieldConfig('id:first', { enabled: false });
    assert.equal(first.value, 'first draft');
    assert.equal(first.classList.contains('etle--replacedSourceTextarea'), false);
    assert.equal(replacer.getManagedCount(), 1);
    await replacer.scan();
    assert.equal(replacer.getManagedCount(), 1);
    assert.equal(replacer.listFields().find(field => field.key === 'id:first').state, 'Disabled for this textbox');
    replacer.destroy();
    const restored = new env.TextFieldReplacer({ ...options, initialFieldConfigs: saved });
    await restored.setEnabled(true);
    assert.equal(restored.getManagedCount(), 1);
    await restored.setFieldConfig('id:first', { enabled: undefined });
    assert.equal(restored.getManagedCount(), 2);
    assert.equal(mounted.get(first).state.wordWrap, false);
    await restored.setFieldConfig('id:first', null);
    assert.equal(mounted.get(first).state.wordWrap, true);
    assert.equal(saved['id:first'], undefined);
    restored.destroy();
});

test('status bars keep Open in ETLE, per-box controls, settings, and disable through remounts', async () => {
    const env = await loadReplacerModule();
    const field = new env.FakeTextAreaElement({ id: 'field', value: 'draft' });
    env.body.append(field);
    const opened = [];
    const settings = [];
    const ltStates = [];
    let ltAvailable = false;
    const replacer = new env.TextFieldReplacer({
        root: env.body, getEngine: () => constants.EDITOR_ENGINES[0], getWordWrap: () => true,
        getIndentMode: () => constants.INDENT_MODES[0], getSpellCheck: () => false, getMonacoMinimap: () => false,
        isLanguageToolAvailable: () => ltAvailable,
        onOpenField: textarea => opened.push(textarea), onOpenSettings: key => settings.push(key),
        createEditor: ctx => ({
            getValue: () => ctx.value, setValue() {}, setReadOnly() {}, setWordWrap() {},
            setLineNumbers() {}, setIndentMode() {}, setSpellCheck() {}, setLanguageTool(v) { ltStates.push(v); }, setMinimap() {}, dispose() {},
        }),
    });
    await replacer.setEnabled(true);
    const bar = () => field.nextElementSibling.querySelectorAll('.etle--inlineStatusBar')[0];
    const control = setting => bar().children.find(child => child.dataset.inlineSetting === setting);
    assert.deepEqual(bar().children.map(child => child.dataset.inlineSetting || 'spacer'), [
        'disable', 'open', 'settings', 'spacer', 'wordWrap', 'lineNumbers', 'spellCheck', 'language', 'engine',
    ]);
    ltAvailable = true;
    await replacer.updateOptions();
    assert.deepEqual(bar().children.map(child => child.dataset.inlineSetting || 'spacer'), [
        'disable', 'open', 'settings', 'spacer', 'wordWrap', 'lineNumbers', 'spellCheck', 'languageTool', 'language', 'engine',
    ]);
    assert.equal(control('wordWrap').children[0].classList.contains('fa-align-left'), true);
    assert.equal(control('lineNumbers').children[0].classList.contains('fa-list-ol'), true);
    assert.equal(control('spellCheck').children[0].classList.contains('fa-spell-check'), true);
    assert.equal(control('languageTool').children[0].classList.contains('fa-language'), true);
    assert.equal(control('languageTool').getAttribute('aria-pressed'), 'false');
    assert.equal(ltStates.at(-1), false);
    control('open').dispatchEvent(new Event('click'));
    control('settings').dispatchEvent(new Event('click'));
    assert.deepEqual(opened, [field]);
    assert.deepEqual(settings, ['id:field']);
    control('wordWrap').dispatchEvent(new Event('click'));
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(replacer.listFields()[0].config.wordWrap, false);
    control('spellCheck').dispatchEvent(new Event('click'));
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(replacer.listFields()[0].config.spellCheck, true);
    control('languageTool').dispatchEvent(new Event('click'));
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(replacer.listFields()[0].config.languageTool, true);
    assert.equal(ltStates.at(-1), true);
    control('engine').dispatchEvent(new Event('click'));
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(field.nextElementSibling.querySelectorAll('.etle--inlineStatusBar').length, 1);
    assert.equal(control('engine').textContent, 'Monaco');
    assert.equal(control('engine').classList.contains('etle--statusActive'), true);
    assert.equal(control('minimap').children[0].classList.contains('fa-map'), true);
    control('minimap').dispatchEvent(new Event('click'));
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(replacer.listFields()[0].config.minimap, true);
    control('disable').dispatchEvent(new Event('click'));
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(replacer.getManagedCount(), 0);
    assert.equal(field.value, 'draft');
    assert.equal(field.classList.contains('etle--replacedSourceTextarea'), false);
    replacer.destroy();
});

test('anonymous textbox identities stay distinct and stable when replacement hosts are inserted', async () => {
    const env = await loadReplacerModule();
    const first = new env.FakeTextAreaElement();
    const wrapper = new env.FakeNode();
    const second = new env.FakeTextAreaElement();
    wrapper.append(second);
    env.body.append(first, wrapper);
    const firstKey = env.getTextFieldKey(first);
    const secondKey = env.getTextFieldKey(second);
    const host = new env.FakeNode();
    host.classList.add('etle--inlineEditorHost');
    first.insertAdjacentElement('afterend', host);
    assert.notEqual(firstKey, secondKey);
    assert.equal(env.getTextFieldKey(second), secondKey);
});

test('pending mounts apply the latest box options and discarded mounts cannot overwrite native text', async () => {
    const env = await loadReplacerModule();
    const field = new env.FakeTextAreaElement({ id: 'slow', value: 'original' });
    env.body.append(field);
    const pending = [];
    const instances = [];
    const replacer = new env.TextFieldReplacer({
        root: env.body, getEngine: () => constants.EDITOR_ENGINES[0], getWordWrap: () => true,
        getIndentMode: () => constants.INDENT_MODES[0], getSpellCheck: () => false, getMonacoMinimap: () => false,
        createEditor: ctx => new Promise(resolve => {
            const state = { ctx, disposed: false, wrap: undefined };
            const instance = {
                getValue: () => ctx.value, setValue() {}, setReadOnly() {},
                setWordWrap: value => { state.wrap = value; }, setLineNumbers() {},
                setIndentMode() {}, setSpellCheck() {}, setMinimap() {},
                dispose: () => { state.disposed = true; },
            };
            pending.push(() => resolve(instance));
            instances.push(state);
        }),
    });
    const enabling = replacer.setEnabled(true);
    await replacer.setFieldConfig('id:slow', { wordWrap: false });
    field.value = 'latest native value';
    pending[0]();
    await enabling;
    assert.equal(instances[0].wrap, false);
    const switching = replacer.setFieldConfig('id:slow', { engine: 'monaco' });
    await new Promise(resolve => setImmediate(resolve));
    await replacer.setFieldConfig('id:slow', { enabled: false });
    instances[0].ctx.onChange('stale original editor');
    instances[1].ctx.onChange('stale pending editor');
    pending[1]();
    await switching;
    assert.equal(field.value, 'latest native value');
    assert.equal(instances[1].disposed, true);
    assert.equal(field.classList.contains('etle--replacedSourceTextarea'), false);
    replacer.destroy();
});

test('live-syncs text bidirectionally on editor edit, programmatic .value write, and reloadAll', async () => {
    const env = await loadReplacerModule();
    const desc = new env.FakeTextAreaElement({ id: 'description_textarea', value: 'v1' });
    env.body.append(desc);

    const events = [];
    desc.addEventListener('input', () => events.push('input'));
    desc.addEventListener('change', () => events.push('change'));

    let inst;
    let showLineNumbers = false;
    const replacer = new env.TextFieldReplacer({
        root: env.body,
        getEngine: () => ({ id: 'prism', label: 'Prism' }),
        getWordWrap: () => true,
        getLineNumbers: () => showLineNumbers,
        getIndentMode: () => ({ id: 'tabs', label: 'Tabs: 4', insertSpaces: false, tabSize: 4 }),
        getSpellCheck: () => false,
        getMonacoMinimap: () => false,
        createEditor: (ctx) => {
            let val = ctx.value;
            let ro = ctx.readOnly;
            let ln = ctx.lineNumbers;
            inst = {
                ctx,
                getValue: () => val,
                setValue: (next) => { val = next; },
                setReadOnly: (next) => { ro = next; },
                getReadOnly: () => ro,
                setWordWrap: () => {},
                setLineNumbers: (next) => { ln = next; },
                getLineNumbers: () => ln,
                setIndentMode: () => {},
                setSpellCheck: () => {},
                setMinimap: () => {},
                dispose: () => {},
            };
            return inst;
        },
    });

    await replacer.setEnabled(true);
    assert.equal(inst.getValue(), 'v1');
    assert.equal(inst.getLineNumbers(), false);
    showLineNumbers = true;
    replacer.updateOptions();
    assert.equal(inst.getLineNumbers(), true);

    // 0. No-op update with identical value (e.g. Prism init onUpdate) must NOT dispatch input
    inst.ctx.onChange('v1');
    assert.deepEqual(events, []);

    // 1. User types in replaced editor -> updates underlying textarea & fires input; blur fires change
    inst.ctx.onChange('v2 from editor');
    assert.equal(desc.value, 'v2 from editor');
    assert.deepEqual(events, ['input']);
    inst.ctx.onBlur();
    assert.deepEqual(events, ['input', 'change']);

    // 2. ST sets textarea.value programmatically -> replaced editor reloads immediately without extra input events
    desc.value = 'v3 from ST';
    assert.equal(inst.getValue(), 'v3 from ST');
    assert.deepEqual(events, ['input', 'change']);

    // 3. Direct underlying mutation + reloadAll() reloads editor and readOnly state
    desc._value = 'v4 forced';
    desc.readOnly = true;
    replacer.reloadAll();
    assert.equal(inst.getValue(), 'v4 forced');
    assert.equal(inst.getReadOnly(), true);

    // 4. Clean restore removes .value interceptor
    await replacer.setEnabled(false);
    assert.equal(Object.prototype.hasOwnProperty.call(desc, 'value'), false);
});

test('CustomParameters compatibility: language detection, restored height, invalid state mirroring, and focus forwarding', async () => {
    const env = await loadReplacerModule();
    const preview = new env.FakeTextAreaElement({ id: 'advanced_params_preview_inline', value: 'temp: 1', classes: ['monospace'] });
    const objParam = new env.FakeTextAreaElement({ id: 'advanced_runtime_obj1', value: '{"a": 1}', classes: ['monospace', 'invalid'] });
    objParam.style.height = '240px';
    objParam.setAttribute('aria-invalid', 'true');
    objParam.title = 'Invalid JSON';
    env.body.append(preview, objParam);

    const mounted = new Map();
    let focusedCount = 0;
    const replacer = new env.TextFieldReplacer({
        root: env.body,
        getEngine: () => ({ id: 'monaco', label: 'Monaco' }),
        getWordWrap: () => true,
        getIndentMode: () => ({ id: 'tabs', label: 'Tabs: 4', insertSpaces: false, tabSize: 4 }),
        getSpellCheck: () => false,
        getMonacoMinimap: () => false,
        createEditor: (ctx) => {
            let val = ctx.value;
            const inst = {
                ctx,
                getValue: () => val,
                setValue: (next) => { val = next; },
                setReadOnly: () => {},
                setWordWrap: () => {},
                setIndentMode: () => {},
                setSpellCheck: () => {},
                setMinimap: () => {},
                focus: () => { focusedCount++; },
                dispose: () => {},
            };
            mounted.set(ctx.textarea, inst);
            return inst;
        },
    });

    await replacer.setEnabled(true);

    assert.equal(mounted.get(preview).ctx.language, 'yaml');
    assert.equal(mounted.get(objParam).ctx.language, 'json');
    assert.equal(objParam.nextElementSibling.style.height, '240px');
    assert.equal(objParam.nextElementSibling.classList.contains('invalid'), true);
    assert.equal(objParam.nextElementSibling.getAttribute('aria-invalid'), 'true');
    assert.equal(objParam.nextElementSibling.title, 'Invalid JSON');

    // Focus on hidden textarea forwards to mounted editor
    objParam.dispatchEvent(new Event('focus'));
    assert.equal(focusedCount, 1);

    // Clearing invalid state updates host on reloadAll
    objParam.classList.remove('invalid');
    objParam.setAttribute('aria-invalid', 'false');
    objParam.title = '';
    replacer.reloadAll();
    assert.equal(objParam.nextElementSibling.classList.contains('invalid'), false);
    assert.equal(objParam.nextElementSibling.getAttribute('aria-invalid'), 'false');
    assert.equal(objParam.nextElementSibling.title, '');

    await replacer.setEnabled(false);
});

test('resolveSourceIdForField maps ST fields', async () => {
    const env = await loadReplacerModule();
    const sources = [
        { id: 'current-character-card:description' },
        { id: 'power_user:custom_css' },
        { id: 'power_user.context:story_string@Default' },
        { id: 'prompt:main@Default' },
        { id: 'oai_settings:custom_include_body@Default' },
        { id: 'world:MyWorld:42:content' },
    ];
    assert.equal(env.resolveSourceIdForField('description_textarea', sources), 'current-character-card:description');
    assert.equal(env.resolveSourceIdForField('customCSS', sources), 'power_user:custom_css');
    assert.equal(env.resolveSourceIdForField('context_story_string', sources), 'power_user.context:story_string@Default');
    assert.equal(env.resolveSourceIdForField('main_prompt_quick_edit_textarea', sources), 'prompt:main@Default');
    assert.equal(env.resolveSourceIdForField('custom_include_body', sources), 'oai_settings:custom_include_body@Default');
    assert.equal(env.resolveSourceIdForField('content_42', sources, 'MyWorld'), 'world:MyWorld:42:content');
    assert.equal(env.resolveSourceIdForField('advanced_runtime_p1', [...sources, { id: 'custom-parameters:Default:p1' }]), 'custom-parameters:Default:p1');

});

test('Monaco LRU cap evicts oldest inline Monaco instances and createDomFieldSource wraps unmapped fields', async () => {
    const env = await loadReplacerModule();
    const t1 = new env.FakeTextAreaElement({ id: 'ta1', value: 'one' });
    const t2 = new env.FakeTextAreaElement({ id: 'ta2', value: 'two' });
    const t3 = new env.FakeTextAreaElement({ id: 'ta3', value: 'three' });
    env.body.append(t1, t2, t3);

    const instances = new Map();
    const replacer = new env.TextFieldReplacer({
        root: env.body,
        maxMonacoInstances: 2,
        getEngine: () => ({ id: 'monaco', label: 'Monaco' }),
        getWordWrap: () => true,
        getIndentMode: () => ({ id: 'tabs', label: 'Tabs: 4', insertSpaces: false, tabSize: 4 }),
        getSpellCheck: () => false,
        getMonacoMinimap: () => false,
        createEditor: (ctx) => {
            let val = ctx.value;
            const inst = {
                disposed: false,
                getValue: () => val,
                setValue: (next) => { val = next; },
                setReadOnly: () => {},
                setWordWrap: () => {},
                setIndentMode: () => {},
                setSpellCheck: () => {},
                setMinimap: () => {},
                dispose: () => { inst.disposed = true; },
            };
            instances.set(ctx.textarea.id, inst);
            return inst;
        },
    });

    await replacer.setEnabled(true);
    assert.equal(instances.get('ta1').disposed, true);
    assert.equal(instances.get('ta2').disposed, false);
    assert.equal(instances.get('ta3').disposed, false);
    // An evicted field must remain editable even without another intersection event.
    assert.equal(t1.classList.contains('etle--replacedSourceTextarea'), false);
    assert.equal(t1.nextElementSibling.style.display, 'none');
    t1.value = 'edited while evicted';
    t1.dispatchEvent(new Event('focus'));
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(instances.get('ta1').disposed, false);
    assert.equal(instances.get('ta1').getValue(), 'edited while evicted');
    assert.equal(t1.classList.contains('etle--replacedSourceTextarea'), true);
    assert.equal([...instances.values()].filter(instance => !instance.disposed).length, 2);
    await replacer.setEnabled(false);

    // Ad-hoc DOM source for unmapped textarea
    const mem = new env.FakeTextAreaElement({ id: 'memory_contents', value: 'summary' });
    const memEvents = [];
    mem.addEventListener('input', () => memEvents.push('input'));
    mem.addEventListener('change', () => memEvents.push('change'));
    const domSource = env.createDomFieldSource(mem);
    assert.equal(domSource.id, 'dom-field:memory_contents');
    assert.equal(domSource.read(), 'summary');
    domSource.write('updated summary');
    assert.equal(mem.value, 'updated summary');
    assert.deepEqual(memEvents, ['input', 'change']);
});

for (const engineId of ['prism', 'monaco']) {
    test(`failed ${engineId} inline editor mounts restore the native textarea and allow a focus retry`, async () => {
        const env = await loadReplacerModule();
        const field = new env.FakeTextAreaElement({ id: 'prompt', value: 'original' });
        env.body.append(field);
        let attempts = 0;
        const replacer = new env.TextFieldReplacer({
            root: env.body,
            getEngine: () => ({ id: engineId, label: engineId }),
            getWordWrap: () => true,
            getIndentMode: () => ({ insertSpaces: false, tabSize: 4 }),
            getSpellCheck: () => false,
            getMonacoMinimap: () => false,
            // Monaco loading and its Prism fallback both fail in the default factory.
            ...(engineId === 'monaco'
                ? { loadMonaco: async () => { attempts++; throw new Error('load failed'); } }
                : { createEditor: () => { attempts++; throw new Error('mount failed'); } }),
        });
        await replacer.setEnabled(true);
        assert.equal(field.classList.contains('etle--replacedSourceTextarea'), false);
        assert.equal(field.nextElementSibling.style.display, 'none');
        assert.equal(field.value, 'original');
        field.dispatchEvent(new Event('focus'));
        await new Promise(resolve => setImmediate(resolve));
        assert.equal(attempts, 2);
        assert.equal(field.classList.contains('etle--replacedSourceTextarea'), false);
        replacer.destroy();
    });
}
