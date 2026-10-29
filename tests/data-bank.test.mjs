import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as constants from '../dist/constants.js';

// Load the complete SourceManager through its public getSources API.
// Only SillyTavern/browser dependencies are replaced.
const source = await readFile(new URL('../src/SourceManager.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function deferred() {
    let resolve;
    const promise = new Promise(done => { resolve = done; });
    return { promise, resolve };
}

function fixture() {
    const global = { url: '/files/global.txt', name: 'Global notes', size: 3 };
    const chat = { url: '/files/chat.txt', name: 'Chat notes', size: 3 };
    const alice = { url: '/files/alice.txt', name: 'Alice notes', size: 3 };
    const bob = { url: '/files/bob.txt', name: 'Bob notes', size: 3 };
    const extension_settings = {
        attachments: [global],
        character_attachments: { 'alice.png': [alice], 'bob.png': [bob] },
        disabled_attachments: [bob.url],
    };
    const chat_metadata = { attachments: [chat] };
    const files = new Map([global, chat, alice, bob].map(file => [file.url, 'old']));
    const cache = new Map(files);
    const vectors = new Set([...files.keys()].map(url => `file_${url.length}`));
    const calls = [];
    const controls = { uploadOK: true, purgeOK: true, reloadOK: true };
    let settingsSaves = 0;
    let metadataSaves = 0;
    const getStringHash = url => url.length;
    const modules = {
        '../../../../openai.js': {},
        '../../../../power-user.js': {},
        '../../../../instruct-mode.js': {},
        '../../../../sysprompt.js': {},
        '../../../../preset-manager.js': {},
        '../../../../world-info.js': {},
        '../../../../textgen-settings.js': {},
        '../../../../extensions.js': {
            extension_settings,
            saveMetadataDebounced: () => { metadataSaves++; },
        },
        '../../../../../script.js': {
            characters: [],
            this_chid: undefined,
            chat_metadata,
            getRequestHeaders: () => ({ 'X-CSRF-Token': 'test-token' }),
            saveSettingsDebounced: () => { settingsSaves++; },
        },
        '../../../../utils.js': {
            getStringHash,
            convertTextToBase64: text => Buffer.from(text).toString('base64'),
        },
        '../../../../chats.js': {
            uploadFileAttachment: async (name, base64) => {
                const text = Buffer.from(base64, 'base64').toString();
                calls.push({ upload: name, text });
                controls.uploadStarted?.resolve();
                await controls.uploadGate?.promise;
                if (!controls.uploadOK) return undefined;
                files.set(`/files/${name}`, text);
                return `/files/${name}`;
            },
        },
        './constants.js': constants,
        './settings.js': { getSetting: (_key, fallback) => fallback },
        './vendor/diff/index.js': {},
    };
    const exports = {};
    vm.runInNewContext(compiled, {
        exports, TextEncoder, console,
        localStorage: { getItem: () => null },
        require: name => {
            assert.ok(name in modules, `Unexpected import: ${name}`);
            return modules[name];
        },
        fetch: async (url, options) => {
            calls.push({ url, ...options });
            assert.equal(options.headers['X-CSRF-Token'], 'test-token');
            if (url === '/api/vector/purge') {
                assert.equal(options.method, 'POST');
                if (controls.purgeOK) vectors.delete(JSON.parse(options.body).collectionId);
                return { ok: controls.purgeOK, status: controls.purgeOK ? 200 : 500 };
            }
            const text = options.cache === 'default' ? cache.get(url) : files.get(url);
            const gate = options.cache === 'no-store' ? controls.readGate : undefined;
            await gate?.promise;
            if (options.cache === 'reload') {
                if (!controls.reloadOK) return { ok: false, status: 503 };
                cache.set(url, text);
            }
            return { ok: true, text: async () => text };
        },
    });
    const list = async () => (await exports.getSources()).filter(item => item.id.startsWith('data-bank:'));
    return {
        global, chat, alice, bob, extension_settings, files, cache, vectors, calls, controls, list,
        settingsSaves: () => settingsSaves,
        metadataSaves: () => metadataSaves,
    };
}

test('group chats expose every character bank and preserve scope and disabled state on save', async () => {
    const f = fixture();
    const sources = await f.list();
    assert.equal(sources.length, 4);
    assert.equal(sources.filter(item => item.group.startsWith('Data Bank (Character)')).length, 2);
    const disabled = sources.find(item => item.label === 'Bob notes');
    assert.match(disabled.meta, /disabled/);

    for (const source of sources) {
        const value = `${source.label}: Привіт 🌍`;
        const id = source.id;
        source.write(value);
        assert.equal(source.read(), 'old');
        await source.save();
        assert.equal(source.id, id);
        assert.equal(source.read(), value);
        const attachment = [f.global, f.chat, f.alice, f.bob].find(file => file.name === source.label);
        assert.equal(f.files.get(attachment.url), value);
        assert.equal(f.cache.get(attachment.url), value);
        assert.equal(attachment.size, Buffer.byteLength(value));
        assert.equal(f.vectors.has(`file_${attachment.url.length}`), false);
    }
    assert.equal(f.settingsSaves(), 3);
    assert.equal(f.metadataSaves(), 1);
    assert.deepEqual(f.extension_settings.disabled_attachments, [f.bob.url]);
    assert.equal(f.extension_settings.character_attachments['bob.png'][0], f.bob);
    const sideEffects = f.calls.filter(call => call.upload || call.cache === 'reload' || call.url === '/api/vector/purge');
    assert.equal(sideEffects.length, 12);
    for (let i = 0; i < sideEffects.length; i += 3) {
        assert.ok(sideEffects[i].upload);
        assert.equal(sideEffects[i + 1].cache, 'reload');
        assert.equal(sideEffects[i + 2].url, '/api/vector/purge');
    }
});

for (const finishReadAfterSave of [false, true]) {
    test(`stale watcher reads cannot replace a save (${finishReadAfterSave ? 'after' : 'during'} upload)`, async () => {
        const f = fixture();
        const source = (await f.list()).find(item => item.label === 'Alice notes');
        const rebound = (await f.list()).find(item => item.id === source.id);
        f.controls.readGate = deferred();
        const reading = rebound.readFresh();
        f.controls.uploadGate = deferred();
        f.controls.uploadStarted = deferred();
        source.write('new content 🌍');
        const saving = source.save();
        await f.controls.uploadStarted.promise;
        assert.equal(await source.readFresh(), 'old');
        if (!finishReadAfterSave) {
            f.controls.readGate.resolve();
            await reading;
        }
        f.controls.uploadGate.resolve();
        await saving;
        if (finishReadAfterSave) {
            f.controls.readGate.resolve();
            assert.equal(await reading, 'new content 🌍');
        }
        assert.equal(source.read(), 'new content 🌍');
        assert.equal(rebound.read(), 'new content 🌍');
        assert.equal((await f.list()).find(item => item.id === source.id).read(), 'new content 🌍');
        const uploaded = f.calls.find(call => call.upload);
        assert.equal(f.files.get(`/files/${uploaded.upload}`), 'new content 🌍');
        assert.equal(f.alice.size, Buffer.byteLength('new content 🌍'));
    });
}

test('an upload failure preserves the old file, cache, metadata, and draft for retry', async () => {
    const f = fixture();
    const source = (await f.list()).find(item => item.label === 'Alice notes');
    source.write('retry this edit');
    f.controls.uploadOK = false;
    await assert.rejects(source.save(), /could not be saved/);
    assert.equal(source.read(), 'old');
    assert.equal(f.files.get(f.alice.url), 'old');
    assert.equal(f.cache.get(f.alice.url), 'old');
    assert.equal(f.alice.size, 3);
    assert.equal(f.settingsSaves(), 0);
    assert.equal(f.calls.some(call => call.url === '/api/vector/purge'), false);
    f.controls.uploadOK = true;
    await source.save();
    assert.equal(source.read(), 'retry this edit');
});

for (const failure of ['purgeOK', 'reloadOK']) {
    test(`${failure} failure rejects the save and permits a complete retry`, async () => {
        const f = fixture();
        const source = (await f.list()).find(item => item.label === 'Alice notes');
        source.write('saved on disk');
        f.controls[failure] = false;
        await assert.rejects(source.save(), failure === 'purgeOK' ? /vectors could not be cleared/ : /could not be read/);
        assert.equal(f.files.get(f.alice.url), 'saved on disk');
        // The editor must keep Apply enabled until retrieval invalidation succeeds.
        assert.equal(source.read(), 'old');
        assert.equal(await source.readFresh(), 'old');
        assert.equal((await f.list()).find(item => item.id === source.id).read(), 'old');
        assert.equal(f.vectors.has(`file_${f.alice.url.length}`), true);
        f.controls[failure] = true;
        await source.save();
        assert.equal(f.cache.get(f.alice.url), 'saved on disk');
        assert.equal(f.vectors.has(`file_${f.alice.url.length}`), false);
    });
}

test('save snapshots remain stable and overlapping saves of the same file are rejected', async () => {
    const f = fixture();
    const source = (await f.list()).find(item => item.label === 'Alice notes');
    const alias = (await f.list()).find(item => item.id === source.id);
    f.controls.uploadGate = deferred();
    f.controls.uploadStarted = deferred();
    source.write('first snapshot');
    const saving = source.save();
    await f.controls.uploadStarted.promise;
    source.write('next edit');
    await assert.rejects(alias.save(), /already being saved/);
    f.controls.uploadGate.resolve();
    await saving;
    assert.equal(source.read(), 'first snapshot');
    assert.equal(f.files.get(f.alice.url), 'first snapshot');
    await source.save();
    assert.equal(f.files.get(f.alice.url), 'next edit');
    f.files.set(f.alice.url, 'external change');
    assert.equal(await source.readFresh(), 'external change');
});
