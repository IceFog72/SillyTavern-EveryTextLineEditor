import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const constantsSource = await readFile(new URL('../src/constants.ts', import.meta.url), 'utf8');
const compiledConstants = ts.transpileModule(constantsSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

const sourceManagerSource = await readFile(new URL('../src/SourceManager.ts', import.meta.url), 'utf8');
const compiledSourceManager = ts.transpileModule(sourceManagerSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

class FakeTextAreaElement {
    constructor(id, value = '') {
        this.id = id;
        this.value = value;
        this.events = [];
    }
    dispatchEvent(event) {
        this.events.push(event.type);
        return true;
    }
}

class FakeInputElement extends FakeTextAreaElement {}

function loadConstants() {
    const exports = {};
    vm.runInNewContext(compiledConstants, {
        exports,
        URL,
        // Provide import.meta.url equivalent via patched source below if needed
    });
    return exports;
}

const patchedConstants = compiledConstants.replace(
    /import\.meta\.url/g,
    JSON.stringify(new URL('../src/constants.ts', import.meta.url).href),
);

function fixture() {
    const constantsExports = {};
    vm.runInNewContext(patchedConstants, { exports: constantsExports, URL });

    const elements = new Map();
    const addField = (selector, value = '') => {
        const el = new FakeTextAreaElement(selector.replace(/^#/, ''), value);
        elements.set(selector, el);
        return el;
    };

    const document = {
        querySelector: (selector) => {
            for (const part of selector.split(',').map(s => s.trim())) {
                if (elements.has(part)) return elements.get(part);
            }
            return null;
        },
        getElementById: (id) => elements.get(`#${id}`) ?? null,
        head: { append: () => {} },
        createElement: () => ({ id: '', type: '', innerHTML: '' }),
        querySelectorAll: () => [],
    };

    const alice = {
        avatar: 'alice.png',
        name: 'Alice',
        description: 'old desc',
        personality: 'old pers',
        scenario: 'old scen',
        first_mes: 'old first',
        mes_example: 'old ex',
        creatorcomment: 'old notes',
        tags: ['t1'],
        data: {
            name: 'Alice',
            description: 'old desc',
            personality: 'old pers',
            scenario: 'old scen',
            first_mes: 'old first',
            mes_example: 'old ex',
            creator_notes: 'old notes',
            system_prompt: 'old sys',
            post_history_instructions: 'old phi',
            tags: ['t1'],
            extensions: { depth_prompt: { prompt: 'old depth', depth: 4, role: 0 } },
        },
    };
    const bob = {
        avatar: 'bob.png',
        name: 'Bob',
        description: 'bob desc',
        data: { name: 'Bob', description: 'bob desc' },
    };
    const characters = [alice, bob];

    const oai_settings = {
        preset_settings_openai: 'Default',
        send_if_empty: 'old empty',
        wi_format: 'old wi',
        custom_include_body: 'old body',
        custom_exclude_body: 'old exclude',
        custom_include_headers: 'old headers',
    };
    const power_user = {
        theme: 'Dark',
        custom_css: 'body {}',
        persona_description: 'old persona',
        persona_descriptions: {
            'p1.png': { name: 'Hero', description: 'old persona' },
        },
        context: { preset: 'Ctx', story_string: 'old story', example_separator: '---', chat_start: '***' },
        instruct: { preset: 'Ins', input_sequence: 'User:', output_sequence: 'Bot:' },
        sysprompt: { name: 'Sys', content: 'old sysprompt', post_history: 'old post' },
    };
    const textgenerationwebui_settings = {
        preset: 'TG',
        negative_prompt: 'old neg',
    };

    // Populate DOM fields
    for (const [sel, val] of [
        ['#description_textarea', 'old desc'],
        ['#personality_textarea', 'old pers'],
        ['#scenario_pole', 'old scen'],
        ['#firstmessage_textarea', 'old first'],
        ['#mes_example_textarea', 'old ex'],
        ['#creator_notes_textarea', 'old notes'],
        ['#system_prompt_textarea', 'old sys'],
        ['#post_history_instructions_textarea', 'old phi'],
        ['#depth_prompt_prompt', 'old depth'],
        ['#tags_textarea', 't1'],
        ['#custom_include_body', 'old body'],
        ['#custom_exclude_body', 'old exclude'],
        ['#custom_include_headers', 'old headers'],
        ['#send_if_empty_textarea', 'old empty'],
        ['#wi_format_textarea', 'old wi'],
        ['#context_story_string', 'old story'],
        ['#instruct_input_sequence', 'User:'],
        ['#sysprompt_content', 'old sysprompt'],
        ['#sysprompt_post_history', 'old post'],
        ['#negative_prompt_textgenerationwebui', 'old neg'],
        ['#customCSS', 'body {}'],
        ['#persona_description', 'old persona'],
    ]) {
        addField(sel, val);
    }

    const extension_settings = {};
    const customExtensionFields = [];
    const modules = {
        '../../../../openai.js': { oai_settings, openai_setting_names: { Default: 'Default' } },
        '../../../../power-user.js': {
            power_user,
            context_presets: [{ name: 'Ctx' }],
            getThemeObject: (name) => ({ name, custom_css: power_user.custom_css }),
        },
        '../../../../instruct-mode.js': { instruct_presets: [{ name: 'Ins' }] },
        '../../../../sysprompt.js': { system_prompts: [{ name: 'Sys' }] },
        '../../../../preset-manager.js': { getPresetManager: () => ({ savePreset: async () => {} }) },
        '../../../../world-info.js': { world_names: [] },
        '../../../../textgen-settings.js': { textgenerationwebui_settings, textgenerationwebui_preset_names: ['TG'] },
        '../../../../extensions.js': { extension_settings, saveMetadataDebounced: () => {} },
        '../../../../../script.js': {
            characters,
            this_chid: 0,
            chat_metadata: {},
            getCharacters: async () => characters,
            getOneCharacter: async () => {},
            getRequestHeaders: () => ({}),
            printCharactersDebounced: () => {},
            saveSettingsDebounced: () => {},
        },
        '../../../../utils.js': { getStringHash: s => s.length, convertTextToBase64: s => s },
        '../../../../chats.js': { uploadFileAttachment: async () => '' },
        './constants.js': constantsExports,
        './settings.js': { getSetting: (_k, d) => d, setSetting: () => {}, getCustomExtensionFields: () => customExtensionFields },
        './vendor/diff/index.js': { diffLines: () => [] },
    };

    const exports = {};
    vm.runInNewContext(compiledSourceManager, {
        exports,
        document,
        Event,
        FormData,
        HTMLTextAreaElement: FakeTextAreaElement,
        HTMLInputElement: FakeInputElement,
        localStorage: { getItem: () => null, setItem: () => {} },
        fetch: async (url, options) => {
            if (url === '/api/characters/edit' && options?.body instanceof FormData) {
                const json = options.body.get('json_data');
                if (typeof json === 'string') {
                    const saved = JSON.parse(json);
                    const idx = characters.findIndex(c => c.avatar === saved.avatar);
                    if (idx !== -1) characters[idx] = saved;
                }
            }
            return { ok: true, text: async () => '' };
        },
        console,
        require: (name) => {
            assert.ok(name in modules, `Unexpected import: ${name}`);
            return modules[name];
        },
    });

    return { exports, elements, addField, extension_settings, customExtensionFields, alice, bob, oai_settings, power_user, textgenerationwebui_settings };
}

test('character card field write/save reloads current character DOM textareas only', async () => {
    const f = fixture();
    const sources = await f.exports.getSources();

    const currentDesc = sources.find(s => s.id === 'current-character-card:description');
    assert.ok(currentDesc);
    currentDesc.write('new alice desc');
    await currentDesc.save();
    assert.equal(f.elements.get('#description_textarea').value, 'new alice desc');
    assert.deepEqual(f.elements.get('#description_textarea').events, ['input', 'change']);

    const bobDesc = sources.find(s => s.id === 'character-card:bob.png:description');
    assert.ok(bobDesc);
    bobDesc.write('new bob desc');
    await bobDesc.save();
    assert.equal(f.elements.get('#description_textarea').value, 'new alice desc');
});

test('customOpenAi fields reload matching ST DOM textareas on write', async () => {
    const f = fixture();
    const sources = await f.exports.getSources();

    const bodySource = sources.find(s => s.id.startsWith('oai_settings:custom_include_body'));
    assert.ok(bodySource);
    bodySource.write('top_k: 40');
    assert.equal(f.elements.get('#custom_include_body').value, 'top_k: 40');
    assert.deepEqual(f.elements.get('#custom_include_body').events, ['input', 'change']);
});

test('Full JSON edits reload matching ST DOM textfields', async () => {
    const f = fixture();
    const sources = await f.exports.getSources();

    const ctxJson = sources.find(s => s.id.startsWith('power_user.context:json'));
    assert.ok(ctxJson);
    ctxJson.write(JSON.stringify({ preset: 'Ctx', story_string: 'updated story', example_separator: '---', chat_start: '***' }));
    await ctxJson.save();
    assert.equal(f.elements.get('#context_story_string').value, 'updated story');

    const cardJson = sources.find(s => s.id === 'current-character-card:json');
    assert.ok(cardJson);
    const updatedCard = structuredClone(f.alice);
    updatedCard.personality = 'bold';
    updatedCard.data.personality = 'bold';
    cardJson.write(JSON.stringify(updatedCard));
    await cardJson.save();
    assert.equal(f.elements.get('#personality_textarea').value, 'bold');

    const themeJson = sources.find(s => s.id.startsWith('power_user:theme_json'));
    assert.ok(themeJson);
    themeJson.write(JSON.stringify({ name: 'Dark', custom_css: 'body { color: red; }' }));
    await themeJson.save();
    assert.equal(f.elements.get('#customCSS').value, 'body { color: red; }');
});

test('reloadAllSourceTextFields syncs all mapped ST textfields and skips unchanged fields', () => {
    const f = fixture();
    assert.equal(typeof f.exports.reloadAllSourceTextFields, 'function');

    f.oai_settings.send_if_empty = 'changed empty';
    f.power_user.instruct.input_sequence = 'Human:';
    f.power_user.sysprompt.content = 'changed sys';
    f.textgenerationwebui_settings.negative_prompt = 'changed neg';
    f.alice.scenario = 'changed scen';
    f.alice.data.scenario = 'changed scen';

    f.exports.reloadAllSourceTextFields();

    assert.equal(f.elements.get('#send_if_empty_textarea').value, 'changed empty');
    assert.equal(f.elements.get('#instruct_input_sequence').value, 'Human:');
    assert.equal(f.elements.get('#sysprompt_content').value, 'changed sys');
    assert.equal(f.elements.get('#negative_prompt_textgenerationwebui').value, 'changed neg');
    assert.equal(f.elements.get('#scenario_pole').value, 'changed scen');
    assert.deepEqual(f.elements.get('#wi_format_textarea').events, []);
});

test('Custom Parameters sources are omitted when extension is absent and synced when present', async () => {
    const f = fixture();
    const withoutExt = await f.exports.getSources();
    assert.equal(withoutExt.filter(s => s.group === 'Custom Parameters').length, 0);

    f.addField('#advanced_runtime_p_text', 'old text');
    f.addField('#advanced_runtime_p_obj', '{"a":1}');
    f.extension_settings.advancedParameters = {
        enabled: true,
        collections: [{
            active: true,
            name: 'MyCol',
            parameters: [
                { id: 'p_slider', name: 'Temp', property: 'temperature', type: 'slider', value: 0.7 },
                { id: 'p_text', name: 'Grammar', property: 'grammar', type: 'textarea', textValue: 'old text' },
                { id: 'p_obj', name: 'Kwargs', property: 'chat_template_kwargs', type: 'object', objectValue: { a: 1 }, objectRaw: '{"a":1}' },
            ],
        }],
    };

    const withExt = await f.exports.getSources();
    const cpSources = withExt.filter(s => s.group === 'Custom Parameters');
    assert.equal(cpSources.length, 2);

    const textSrc = cpSources.find(s => s.id === 'custom-parameters:MyCol:p_text');
    assert.ok(textSrc);
    textSrc.write('new grammar');
    assert.equal(f.elements.get('#advanced_runtime_p_text').value, 'new grammar');

    const objSrc = cpSources.find(s => s.id === 'custom-parameters:MyCol:p_obj');
    assert.ok(objSrc);
    objSrc.write('{"a": 2}');
    assert.equal(f.elements.get('#advanced_runtime_p_obj').value, '{"a": 2}');
    assert.deepEqual({ ...f.extension_settings.advancedParameters.collections[0].parameters[2].objectValue }, { a: 2 });
});

test('saved custom extension fields become editable TextSources that sync back to DOM', async () => {
    const f = fixture();
    const extField = f.addField('#my_ext_prompt', 'initial ext text');
    f.customExtensionFields.push({ selector: '#my_ext_prompt', label: 'My Prompt', group: 'Extension: CoolExt' });

    const sources = await f.exports.getSources();
    const src = sources.find(s => s.id === 'ext-field:#my_ext_prompt');
    assert.ok(src);
    assert.equal(src.group, 'Extension: CoolExt');
    assert.equal(src.read(), 'initial ext text');

    src.write('edited ext text');
    assert.equal(extField.value, 'edited ext text');
    assert.deepEqual(extField.events, ['input', 'change']);
});

test('rejected Custom Parameters object writes preserve the last saved raw and parsed values', async () => {
    const f = fixture();
    const field = f.addField('#advanced_runtime_obj', '{"a":1}');
    const param = { id: 'obj', type: 'object', objectRaw: '{"a":1}', objectValue: { a: 1 } };
    f.extension_settings.advancedParameters = {
        collections: [{ name: 'Default', active: true, parameters: [param] }],
    };
    const sources = await f.exports.getSources();
    const source = sources.find(item => item.id === 'custom-parameters:Default:obj');
    for (const invalid of ['{', 'null', '42', '"text"']) {
        assert.throws(() => source.write(invalid));
        assert.equal(param.objectRaw, '{"a":1}');
        assert.deepEqual(param.objectValue, { a: 1 });
        assert.equal(source.read(), '{"a":1}');
        assert.equal(field.value, '{"a":1}');
        assert.deepEqual(field.events, []);
    }
    source.write('[1, 2]');
    assert.equal(param.objectRaw, '[1, 2]');
    assert.equal(JSON.stringify(param.objectValue), '[1,2]');
});
