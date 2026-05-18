// @ts-ignore
import { oai_settings, promptManager, openai_setting_names } from '../../../../openai.js';
// @ts-ignore
import { power_user, context_presets, getThemeObject } from '../../../../power-user.js';
// @ts-ignore
import { selectContextPreset, selectInstructPreset, instruct_presets } from '../../../../instruct-mode.js';
// @ts-ignore
import { system_prompts } from '../../../../sysprompt.js';
// @ts-ignore
import { getPresetManager } from '../../../../preset-manager.js';
// @ts-ignore
import { loadWorldInfo, reloadEditor, saveWorldInfo, world_names } from '../../../../world-info.js';
// @ts-ignore
import { textgenerationwebui_preset_names, textgenerationwebui_settings } from '../../../../textgen-settings.js';
// @ts-ignore
import { extension_settings } from '../../../../extensions.js';
// @ts-ignore
import { characters, getCharacters, getOneCharacter, getRequestHeaders, printCharactersDebounced, saveSettingsDebounced } from '../../../../../script.js';
import { diffLines } from './vendor/diff/index.js';
import { GENERATION_TRIGGERS, NAME, STORAGE, TEXT_FIELDS } from './constants.js';
const GROUP_ORDER = {
    'Chat Completion Prompts': 10,
    'Utility Prompts': 20,
    'Text Completion Parameters': 30,
    'Formatting Prompts': 40,
    'Custom OpenAI Parameters': 50,
    'Power User Context': 60,
    'Power User Instruct': 70,
    'System Prompt': 80,
    'Power User Customization': 90,
    'Connection Profiles': 100,
    'Personas': 110,
    'Character Cards': 120,
};
export const getCollapsedGroups = () => {
    try {
        return new Set(JSON.parse(localStorage.getItem(STORAGE.collapsedGroups) || '[]'));
    }
    catch {
        return new Set();
    }
};
export const setCollapsedGroups = (groups) => {
    localStorage.setItem(STORAGE.collapsedGroups, JSON.stringify([...groups]));
};
const splitLines = (text) => String(text ?? '').split('\n');
const GENERATION_TRIGGER_IDS = new Set(GENERATION_TRIGGERS.map(trigger => trigger.id));
const GENERATION_TRIGGER_LABELS = new Map(GENERATION_TRIGGERS.map(trigger => [trigger.id, trigger.label]));
const getPromptInjectionTriggers = (prompt) => (Array.isArray(prompt.injection_trigger)
    ? prompt.injection_trigger.filter((trigger) => typeof trigger === 'string')
    : []);
const formatPromptInjectionTriggers = (prompt) => {
    const triggers = getPromptInjectionTriggers(prompt);
    if (!triggers.length)
        return 'All types (default)';
    return triggers.map(trigger => GENERATION_TRIGGER_LABELS.get(trigger) ?? trigger).join(', ');
};
const parsePromptInjectionTriggers = (value) => (value
    .split(',')
    .map(trigger => trigger.trim().toLowerCase())
    .filter(trigger => GENERATION_TRIGGER_IDS.has(trigger)));
export const getLineDiff = (oldText, newText) => {
    const oldLines = splitLines(oldText);
    const newLines = splitLines(newText);
    const oldDisplayLines = [];
    const oldMarks = [];
    const newMarks = Array(newLines.length).fill('');
    const changes = diffLines(String(oldText ?? ''), String(newText ?? ''), { ignoreNewlineAtEof: true });
    let oldIdx = 0;
    let newIdx = 0;
    for (let index = 0; index < changes.length; index++) {
        const change = changes[index];
        const next = changes[index + 1];
        if (change.removed && next?.added) {
            alignChangedBlocks(change, next);
            index++;
            continue;
        }
        if (change.added && next?.removed) {
            alignChangedBlocks(next, change);
            index++;
            continue;
        }
        if (change.removed) {
            appendOldLines(change.count, 'removed');
            oldIdx += change.count;
            continue;
        }
        if (change.added) {
            markNewLines(change.count, 'added');
            appendOldBlankLines(change.count);
            newIdx += change.count;
            continue;
        }
        appendOldLines(change.count, '');
        oldIdx += change.count;
        newIdx += change.count;
    }
    return {
        oldMarks,
        newMarks,
        oldDisplayText: oldDisplayLines.join('\n'),
    };
    function alignChangedBlocks(removed, added) {
        appendOldLines(removed.count, 'removed');
        markNewLines(added.count, 'added');
        appendOldBlankLines(Math.max(0, added.count - removed.count));
        oldIdx += removed.count;
        newIdx += added.count;
    }
    function appendOldLines(count = 0, mark) {
        for (let index = 0; index < count && oldIdx + index < oldLines.length; index++) {
            oldDisplayLines.push(oldLines[oldIdx + index]);
            oldMarks.push(mark);
        }
    }
    function appendOldBlankLines(count = 0) {
        for (let index = 0; index < count; index++) {
            oldDisplayLines.push('');
            oldMarks.push('placeholder');
        }
    }
    function markNewLines(count = 0, mark) {
        for (let index = 0; index < count && newIdx + index < newLines.length; index++) {
            newMarks[newIdx + index] = mark;
        }
    }
};
const savePowerUserField = (selector, value) => {
    const field = document.querySelector(selector);
    if (field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement) {
        field.value = value;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
    }
    saveSettingsDebounced();
};
const makeObjectFieldSource = ({ id, label, group, object, property, selector = null }) => {
    const branchManager = getBranchManager(group);
    const branchSuffix = branchManager ? `@${branchManager.getCurrentBranch()}` : '';
    return {
        id: `${id}${branchSuffix}`,
        label,
        group,
        readonly: false,
        branchManager,
        read: () => String(object?.[property] ?? ''),
        write: (value) => {
            object[property] = value;
            if (selector)
                savePowerUserField(selector, value);
        },
        save: () => saveSettingsDebounced(),
    };
};
const applyCustomCss = (value) => {
    let style = document.getElementById('custom-style');
    if (!style) {
        style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'custom-style';
        document.head.append(style);
    }
    style.innerHTML = value;
};
const getThemeBranches = () => {
    const themes = Array.from(document.querySelectorAll('#themes option'))
        .map(option => option.value || option.textContent || '')
        .filter(Boolean);
    const current = power_user?.theme;
    if (current && !themes.includes(current))
        themes.unshift(current);
    return themes;
};
const getThemeBranchManager = () => ({
    getBranches: getThemeBranches,
    getCurrentBranch: () => power_user?.theme ?? 'Default',
    switchBranch: async (branchName) => {
        const select = document.querySelector('#themes');
        if (select) {
            select.value = branchName;
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
        else if (power_user) {
            power_user.theme = branchName;
            saveSettingsDebounced();
        }
    },
});
const ensureThemeOption = (themeName) => {
    const select = document.querySelector('#themes');
    if (!select)
        return;
    let option = Array.from(select.options).find(item => item.value === themeName);
    if (!option) {
        option = document.createElement('option');
        option.value = themeName;
        option.textContent = themeName;
        select.append(option);
    }
    select.value = themeName;
};
const saveThemeJson = async (theme) => {
    const response = await fetch('/api/themes/save', {
        method: 'POST',
        headers: getRequestHeaders(),
        body: JSON.stringify(theme),
    });
    if (!response.ok) {
        throw new Error(`Theme could not be saved (${response.status}).`);
    }
};
const makeThemeJsonSource = () => {
    const branchManager = getThemeBranchManager();
    const themeName = branchManager.getCurrentBranch();
    let pendingTheme = null;
    return {
        id: `power_user:theme_json@${themeName}`,
        label: 'Theme JSON',
        group: 'Power User Customization',
        groupOrder: GROUP_ORDER['Power User Customization'],
        order: 5,
        readonly: false,
        branchManager,
        read: () => JSON.stringify(getThemeObject(themeName), null, 2),
        write: (value) => {
            const parsed = JSON.parse(value);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                throw new Error('Theme JSON must be an object.');
            }
            if (typeof parsed.name !== 'string' || !parsed.name.trim()) {
                throw new Error('Theme JSON must include a non-empty "name".');
            }
            pendingTheme = parsed;
        },
        save: async () => {
            const theme = pendingTheme ?? getThemeObject(themeName);
            const nextThemeName = String(theme.name);
            await saveThemeJson(theme);
            ensureThemeOption(nextThemeName);
            if (power_user) {
                Object.assign(power_user, theme);
                power_user.theme = nextThemeName;
            }
            if (typeof theme.custom_css === 'string')
                applyCustomCss(theme.custom_css);
            saveSettingsDebounced();
            pendingTheme = null;
        },
        meta: `Theme preset: ${themeName}`,
    };
};
const makeCustomCssSource = () => ({
    id: 'power_user:custom_css',
    label: 'Custom CSS',
    group: 'Power User Customization',
    groupOrder: GROUP_ORDER['Power User Customization'],
    order: 10,
    readonly: false,
    branchManager: getThemeBranchManager(),
    read: () => String(power_user?.custom_css ?? ''),
    write: (value) => {
        power_user.custom_css = value;
        const field = document.querySelector('#customCSS');
        if (field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement) {
            field.value = value;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
        }
        else {
            applyCustomCss(value);
            saveSettingsDebounced();
        }
    },
    save: () => {
        applyCustomCss(String(power_user?.custom_css ?? ''));
        saveSettingsDebounced();
    },
    meta: 'Power User Custom CSS',
});
const getSystemPromptFieldSelector = (property) => {
    switch (property) {
        case 'content':
            return '#sysprompt_content';
        case 'post_history':
            return '#sysprompt_post_history';
        default:
            return null;
    }
};
const saveInstructPreset = async () => {
    saveSettingsDebounced();
    const name = power_user?.instruct?.preset;
    const presetManager = getPresetManager?.('instruct');
    if (!name || !presetManager?.savePreset)
        return;
    await presetManager.savePreset(name, {
        ...power_user.instruct,
        name,
    }, { skipUpdate: true });
};
const makeInstructFieldSource = (property, label) => {
    const branchManager = getBranchManager('Power User Instruct');
    const branchSuffix = branchManager ? `@${branchManager.getCurrentBranch()}` : '';
    return {
        id: `power_user.instruct:${property}${branchSuffix}`,
        label,
        group: 'Power User Instruct',
        groupOrder: GROUP_ORDER['Power User Instruct'],
        readonly: false,
        branchManager,
        read: () => String(power_user?.instruct?.[property] ?? ''),
        write: (value) => {
            power_user.instruct[property] = value;
            savePowerUserField(`#instruct_${property}`, value);
        },
        save: saveInstructPreset,
        meta: power_user?.instruct?.preset ? `Instruct template: ${power_user.instruct.preset}` : 'Instruct template',
    };
};
const saveSystemPromptPreset = async () => {
    saveSettingsDebounced();
    const name = power_user?.sysprompt?.name;
    const presetManager = getPresetManager?.('sysprompt');
    if (!name || !presetManager?.savePreset)
        return;
    await presetManager.savePreset(name, {
        ...power_user.sysprompt,
        name,
    }, { skipUpdate: true });
};
const makeSystemPromptFieldSource = (property, label) => {
    const branchManager = getBranchManager('System Prompt');
    const branchSuffix = branchManager ? `@${branchManager.getCurrentBranch()}` : '';
    const selector = getSystemPromptFieldSelector(property);
    return {
        id: `power_user.sysprompt:${property}${branchSuffix}`,
        label,
        group: 'System Prompt',
        groupOrder: GROUP_ORDER['System Prompt'],
        readonly: false,
        branchManager,
        read: () => String(power_user?.sysprompt?.[property] ?? ''),
        write: (value) => {
            power_user.sysprompt[property] = value;
            if (selector)
                savePowerUserField(selector, value);
        },
        save: saveSystemPromptPreset,
        meta: power_user?.sysprompt?.name ? `System prompt preset: ${power_user.sysprompt.name}` : 'System prompt preset',
    };
};
const saveTextGenPreset = async () => {
    saveSettingsDebounced();
    const name = textgenerationwebui_settings?.preset;
    const presetManager = getPresetManager?.('textgenerationwebui');
    if (!name || !presetManager?.savePreset)
        return;
    await presetManager.savePreset(name, {
        ...textgenerationwebui_settings,
        name,
    }, { skipUpdate: true });
};
const makeTextGenFieldSource = (property, label) => {
    const branchManager = getBranchManager('Text Completion Parameters');
    const branchSuffix = branchManager ? `@${branchManager.getCurrentBranch()}` : '';
    return {
        id: `textgenerationwebui_settings:${property}${branchSuffix}`,
        label,
        group: 'Text Completion Parameters',
        groupOrder: GROUP_ORDER['Text Completion Parameters'],
        readonly: false,
        branchManager,
        read: () => {
            const value = textgenerationwebui_settings?.[property];
            return typeof value === 'string' ? value : JSON.stringify(value ?? '', null, 2);
        },
        write: (value) => {
            textgenerationwebui_settings[property] = value;
            const field = document.querySelector(`#${property}_textgenerationwebui, #${property}, #textgen_${property}`);
            if (field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement) {
                field.value = value;
                field.dispatchEvent(new Event('input', { bubbles: true }));
                field.dispatchEvent(new Event('change', { bubbles: true }));
            }
        },
        save: saveTextGenPreset,
        meta: textgenerationwebui_settings?.preset ? `Text Completion preset: ${textgenerationwebui_settings.preset}` : 'Text Completion preset',
    };
};
const getConnectionManagerProfiles = () => {
    const profiles = extension_settings?.connectionManager?.profiles;
    return Array.isArray(profiles) ? profiles : [];
};
const getSelectedConnectionProfile = () => {
    const selected = extension_settings?.connectionManager?.selectedProfile;
    return getConnectionManagerProfiles().find(profile => profile.id === selected) ?? null;
};
const getCharacterByAvatar = (avatar) => ((characters || []).find((character) => character?.avatar === avatar) ?? null);
const getFreshCharacter = async (avatar) => {
    await getOneCharacter?.(avatar);
    const character = getCharacterByAvatar(avatar);
    if (!character)
        throw new Error(`Character "${avatar}" was not found.`);
    return character;
};
const makeCharacterFormData = (character) => {
    const data = character.data ?? {};
    const extensions = data.extensions ?? {};
    const formData = new FormData();
    formData.set('avatar_url', String(character.avatar ?? ''));
    formData.set('ch_name', String(character.name ?? data.name ?? ''));
    formData.set('description', String(character.description ?? data.description ?? ''));
    formData.set('personality', String(character.personality ?? data.personality ?? ''));
    formData.set('scenario', String(character.scenario ?? data.scenario ?? ''));
    formData.set('first_mes', String(character.first_mes ?? data.first_mes ?? ''));
    formData.set('mes_example', String(character.mes_example ?? data.mes_example ?? ''));
    formData.set('creator_notes', String(data.creator_notes ?? character.creatorcomment ?? ''));
    formData.set('system_prompt', String(data.system_prompt ?? ''));
    formData.set('post_history_instructions', String(data.post_history_instructions ?? ''));
    formData.set('tags', Array.isArray(data.tags ?? character.tags) ? (data.tags ?? character.tags).join(', ') : String(data.tags ?? character.tags ?? ''));
    formData.set('creator', String(data.creator ?? character.creator ?? ''));
    formData.set('character_version', String(data.character_version ?? character.character_version ?? ''));
    formData.set('talkativeness', String(extensions.talkativeness ?? character.talkativeness ?? 0.5));
    formData.set('fav', String(extensions.fav ?? character.fav ?? false));
    formData.set('world', String(extensions.world ?? ''));
    formData.set('chat', String(character.chat ?? `${character.name ?? data.name ?? 'Character'} - Chat`));
    formData.set('create_date', String(character.create_date ?? ''));
    formData.set('json_data', JSON.stringify(character));
    const depthPrompt = extensions.depth_prompt ?? {};
    formData.set('depth_prompt_prompt', String(depthPrompt.prompt ?? character.depth_prompt_prompt ?? ''));
    formData.set('depth_prompt_depth', String(depthPrompt.depth ?? character.depth_prompt_depth ?? 4));
    formData.set('depth_prompt_role', String(depthPrompt.role ?? character.depth_prompt_role ?? 0));
    const alternateGreetings = Array.isArray(data.alternate_greetings) ? data.alternate_greetings : [];
    for (const greeting of alternateGreetings)
        formData.append('alternate_greetings', String(greeting));
    return formData;
};
const saveCharacterCard = async (character) => {
    const response = await fetch('/api/characters/edit', {
        method: 'POST',
        headers: getRequestHeaders({ omitContentType: true }),
        body: makeCharacterFormData(character),
        cache: 'no-cache',
    });
    if (!response.ok)
        throw new Error(`Character could not be saved (${response.status}).`);
    await getOneCharacter?.(character.avatar);
    printCharactersDebounced?.();
};
const CHARACTER_CARD_FIELDS = [
    { key: 'description', label: 'Description', get: (card) => card.description ?? card.data?.description, set: (card, value) => { card.description = value; (card.data ??= {}).description = value; } },
    { key: 'personality', label: 'Personality', get: (card) => card.personality ?? card.data?.personality, set: (card, value) => { card.personality = value; (card.data ??= {}).personality = value; } },
    { key: 'scenario', label: 'Scenario', get: (card) => card.scenario ?? card.data?.scenario, set: (card, value) => { card.scenario = value; (card.data ??= {}).scenario = value; } },
    { key: 'first_mes', label: 'First Message', get: (card) => card.first_mes ?? card.data?.first_mes, set: (card, value) => { card.first_mes = value; (card.data ??= {}).first_mes = value; } },
    { key: 'mes_example', label: 'Example Dialogue', get: (card) => card.mes_example ?? card.data?.mes_example, set: (card, value) => { card.mes_example = value; (card.data ??= {}).mes_example = value; } },
    { key: 'creator_notes', label: 'Creator Notes', get: (card) => card.data?.creator_notes ?? card.creatorcomment, set: (card, value) => { (card.data ??= {}).creator_notes = value; card.creatorcomment = value; } },
    { key: 'system_prompt', label: 'System Prompt', get: (card) => card.data?.system_prompt, set: (card, value) => { (card.data ??= {}).system_prompt = value; } },
    { key: 'post_history_instructions', label: 'Post-History Instructions', get: (card) => card.data?.post_history_instructions, set: (card, value) => { (card.data ??= {}).post_history_instructions = value; } },
    { key: 'depth_prompt_prompt', label: "Character's Note", get: (card) => card.data?.extensions?.depth_prompt?.prompt ?? card.depth_prompt_prompt, set: (card, value) => { ((card.data ??= {}).extensions ??= {}).depth_prompt ??= {}; card.data.extensions.depth_prompt.prompt = value; card.depth_prompt_prompt = value; } },
    { key: 'tags', label: 'Tags to Embed', get: (card) => Array.isArray(card.data?.tags ?? card.tags) ? (card.data?.tags ?? card.tags).join(', ') : card.data?.tags ?? card.tags, set: (card, value) => { const tags = value.split(',').map(tag => tag.trim()).filter(Boolean); card.tags = tags; (card.data ??= {}).tags = tags; } },
];
const makeCharacterCardSources = (character) => {
    const avatar = String(character.avatar ?? character.name ?? '');
    let activeCharacter = character;
    const cardName = String(character.name ?? character.data?.name ?? avatar);
    const group = `Character Card: ${cardName}`;
    const refresh = async () => {
        activeCharacter = await getFreshCharacter(avatar);
        return activeCharacter;
    };
    const save = async () => {
        await saveCharacterCard(activeCharacter);
        activeCharacter = await getFreshCharacter(String(activeCharacter.avatar ?? avatar));
    };
    const sources = CHARACTER_CARD_FIELDS.map((field, index) => ({
        id: `character-card:${avatar}:${field.key}`,
        label: field.label,
        group,
        groupOrder: GROUP_ORDER['Character Cards'],
        order: index,
        readonly: false,
        read: () => String(field.get(activeCharacter) ?? ''),
        readFresh: async () => String(field.get(await refresh()) ?? ''),
        write: (value) => {
            field.set(activeCharacter, value);
        },
        save,
        meta: `Character card: ${avatar}`,
    }));
    sources.push({
        id: `character-card:${avatar}:json`,
        label: 'Full JSON',
        group,
        groupOrder: GROUP_ORDER['Character Cards'],
        order: 999,
        readonly: false,
        read: () => JSON.stringify(activeCharacter, null, 2),
        readFresh: async () => JSON.stringify(await refresh(), null, 2),
        write: (value) => {
            const parsed = JSON.parse(value);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
                throw new Error('Character card must be a JSON object.');
            if (!parsed.avatar)
                parsed.avatar = avatar;
            activeCharacter = parsed;
        },
        save,
        meta: `Character card JSON: ${avatar}`,
    });
    return sources;
};
const makeConnectionProfileSource = (profile) => {
    const branchManager = getBranchManager('Connection Profiles');
    const profileId = String(profile.id ?? profile.name ?? 'unknown');
    return {
        id: `connection-profile:${profileId}`,
        label: String(profile.name ?? profileId),
        group: 'Connection Profiles',
        groupOrder: GROUP_ORDER['Connection Profiles'],
        readonly: false,
        branchManager,
        read: () => JSON.stringify(profile, null, 2),
        write: (value) => {
            const parsed = JSON.parse(value);
            if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
                throw new Error('Connection profile must be a JSON object.');
            }
            for (const key of Object.keys(profile))
                delete profile[key];
            Object.assign(profile, parsed);
        },
        save: () => saveSettingsDebounced(),
        meta: 'Connection Manager profile JSON',
    };
};
const getWorldInfoEntry = async (worldName, uid) => {
    const freshData = await loadWorldInfo(worldName);
    const entries = Array.isArray(freshData?.entries)
        ? freshData.entries.map((entry) => [entry?.uid, entry])
        : Object.entries(freshData?.entries ?? {});
    return {
        data: freshData,
        entry: entries.find(([entryKey, entry]) => String(entry?.uid ?? entryKey) === String(uid))?.[1],
    };
};
const getWorldInfoEntryTitle = (entry, uid) => {
    if (entry.comment)
        return String(entry.comment);
    if (entry.memo)
        return String(entry.memo);
    if (Array.isArray(entry.key))
        return entry.key.join(', ');
    return `Entry ${uid}`;
};
const getBranchManager = (group) => {
    switch (group) {
        case 'Chat Completion Prompts':
        case 'Utility Prompts':
        case 'Formatting Prompts':
        case 'Custom OpenAI Parameters':
            return {
                getBranches: () => Object.keys(openai_setting_names || {}),
                getCurrentBranch: () => oai_settings?.preset_settings_openai ?? 'Default',
                switchBranch: async (branchName) => {
                    if (oai_settings) {
                        oai_settings.preset_settings_openai = branchName;
                        const value = openai_setting_names[branchName];
                        const select = document.querySelector('#settings_preset_openai');
                        if (select) {
                            select.value = value;
                            select.dispatchEvent(new Event('change', { bubbles: true }));
                        }
                    }
                }
            };
        case 'Text Completion Parameters':
            return {
                getBranches: () => textgenerationwebui_preset_names || [],
                getCurrentBranch: () => textgenerationwebui_settings?.preset ?? 'Default',
                switchBranch: async (branchName) => {
                    textgenerationwebui_settings.preset = branchName;
                    const select = document.querySelector('#settings_preset_textgenerationwebui');
                    if (select) {
                        select.value = branchName;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            };
        case 'Connection Profiles':
            return {
                getBranches: () => getConnectionManagerProfiles().map(profile => String(profile.name ?? profile.id)),
                getCurrentBranch: () => {
                    const profile = getSelectedConnectionProfile();
                    return String(profile?.name ?? profile?.id ?? 'None');
                },
                switchBranch: async (branchName) => {
                    const profile = getConnectionManagerProfiles().find(item => item.name === branchName || item.id === branchName);
                    if (!profile)
                        return;
                    extension_settings.connectionManager.selectedProfile = profile.id;
                    const select = document.querySelector('#connection_profiles');
                    if (select) {
                        select.value = profile.id;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    else {
                        saveSettingsDebounced();
                    }
                }
            };
        case 'Power User Context':
            return {
                getBranches: () => (context_presets || []).map(p => p.name),
                getCurrentBranch: () => power_user?.context?.preset ?? 'Default',
                switchBranch: async (branchName) => {
                    selectContextPreset?.(branchName, { isAuto: true });
                }
            };
        case 'Power User Instruct':
            return {
                getBranches: () => (instruct_presets || []).map(p => p.name),
                getCurrentBranch: () => power_user?.instruct?.preset ?? 'Default',
                switchBranch: async (branchName) => {
                    selectInstructPreset?.(branchName, { isAuto: true });
                }
            };
        case 'System Prompt':
            return {
                getBranches: () => (system_prompts || []).map(preset => preset.name).filter(Boolean),
                getCurrentBranch: () => power_user?.sysprompt?.name ?? 'Default',
                switchBranch: async (branchName) => {
                    const select = document.querySelector('#sysprompt_select');
                    if (select) {
                        select.value = branchName;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                        return;
                    }
                    const prompt = (system_prompts || []).find(preset => preset.name === branchName);
                    if (!prompt || !power_user?.sysprompt)
                        return;
                    power_user.sysprompt.name = prompt.name;
                    power_user.sysprompt.content = prompt.content || '';
                    power_user.sysprompt.post_history = prompt.post_history || '';
                    saveSettingsDebounced();
                }
            };
        default:
            return undefined;
    }
};
export const getSources = async () => {
    const sources = [];
    if ((!Array.isArray(characters) || !characters.length) && typeof getCharacters === 'function') {
        try {
            await getCharacters();
        }
        catch (error) {
            console.warn(`[${NAME}] Could not load character cards`, error);
        }
    }
    if (promptManager?.serviceSettings?.prompts) {
        const branchManager = getBranchManager('Chat Completion Prompts');
        const branchSuffix = branchManager ? `@${branchManager.getCurrentBranch()}` : '';
        const activeOrder = promptManager.activeCharacter
            ? promptManager.getPromptOrderForCharacter(promptManager.activeCharacter)
            : [];
        const enabledById = new Map(activeOrder.map((entry, index) => [entry.identifier, { enabled: !!entry.enabled, index }]));
        const promptById = new Map(promptManager.serviceSettings.prompts.map(prompt => [prompt?.identifier, prompt]));
        const addPromptSource = (prompt, index, state) => {
            const orderLabel = state ? ` #${state.index + 1}` : '';
            const enabledLabel = state ? (state.enabled ? ' enabled' : ' disabled') : '';
            sources.push({
                id: `prompt:${prompt.identifier}${branchSuffix}`,
                label: `${prompt.name || prompt.identifier}${orderLabel}${enabledLabel}`,
                group: 'Chat Completion Prompts',
                groupOrder: GROUP_ORDER['Chat Completion Prompts'],
                order: state?.index ?? (10000 + index),
                readonly: false,
                enabled: state?.enabled,
                toggleable: !!state,
                branchManager,
                promptOrderEntry: state?.entry,
                read: () => String(prompt.content ?? ''),
                write: (value) => {
                    prompt.content = value;
                },
                save: async () => {
                    await promptManager.saveServiceSettings?.();
                    promptManager.render?.(false);
                },
                toggle: async () => {
                    if (!state?.entry)
                        return;
                    const counts = promptManager.tokenHandler?.getCounts?.();
                    if (counts)
                        counts[prompt.identifier] = null;
                    state.entry.enabled = !state.entry.enabled;
                    promptManager.render?.(false);
                    await promptManager.saveServiceSettings?.();
                },
                meta: state ? `Prompt order ${state.index + 1}${prompt.role ? ` - ${prompt.role}` : ''}` : `Unordered prompt ${index + 1}${prompt.role ? ` - ${prompt.role}` : ''}`,
                metadata: {
                    name: {
                        get: () => prompt.name || prompt.identifier,
                        set: (v) => {
                            prompt.name = v;
                            promptManager.saveServiceSettings?.();
                            promptManager.render?.(false);
                        }
                    },
                    role: {
                        get: () => prompt.role || 'system',
                        label: () => prompt.role || 'system',
                        set: () => {
                            const roles = ['system', 'user', 'assistant'];
                            const idx = roles.indexOf(prompt.role || 'system');
                            prompt.role = roles[(idx + 1) % roles.length];
                            promptManager.saveServiceSettings?.();
                            promptManager.render?.(false);
                        }
                    },
                    position: state ? {
                        get: () => prompt.injection_position ?? 0,
                        label: () => {
                            const pos = prompt.injection_position ?? 0;
                            return pos === 0 ? 'Relative' : 'In-chat';
                        },
                        set: () => {
                            const pos = prompt.injection_position ?? 0;
                            prompt.injection_position = pos === 0 ? 1 : 0;
                            promptManager.saveServiceSettings?.();
                            promptManager.render?.(false);
                        }
                    } : undefined,
                    depth: {
                        get: () => prompt.injection_depth ?? 0,
                        set: (v) => {
                            prompt.injection_depth = v;
                            promptManager.saveServiceSettings?.();
                        }
                    },
                    order: {
                        get: () => prompt.injection_order ?? 0,
                        set: (v) => {
                            prompt.injection_order = v;
                            promptManager.saveServiceSettings?.();
                        }
                    },
                    triggers: {
                        get: () => getPromptInjectionTriggers(prompt).join(', '),
                        label: () => formatPromptInjectionTriggers(prompt),
                        emptyLabel: 'All types',
                        options: GENERATION_TRIGGERS,
                        set: (v) => {
                            prompt.injection_trigger = parsePromptInjectionTriggers(v);
                            promptManager.saveServiceSettings?.();
                            promptManager.render?.(false);
                        }
                    }
                }
            });
        };
        activeOrder.forEach((entry, index) => {
            const prompt = promptById.get(entry.identifier);
            const state = { enabled: !!entry.enabled, index, entry };
            if (prompt && typeof prompt.content === 'string') {
                addPromptSource(prompt, index, state);
                return;
            }
            sources.push({
                id: `prompt-order:${entry.identifier}${branchSuffix}`,
                label: `${prompt?.name || entry.identifier || 'Blank prompt'} #${index + 1}${entry.enabled ? ' enabled' : ' disabled'}`,
                group: 'Chat Completion Prompts',
                groupOrder: GROUP_ORDER['Chat Completion Prompts'],
                order: index,
                readonly: true,
                selectable: false,
                placeholder: true,
                enabled: !!entry.enabled,
                toggleable: true,
                branchManager,
                promptOrderEntry: entry,
                read: () => '',
                write: () => { },
                save: async () => {
                    entry.enabled = !!entry.enabled;
                    await promptManager.saveServiceSettings?.();
                    promptManager.render?.(false);
                },
                toggle: async () => {
                    const counts = promptManager.tokenHandler?.getCounts?.();
                    if (counts)
                        counts[entry.identifier] = null;
                    entry.enabled = !entry.enabled;
                    promptManager.render?.(false);
                    await promptManager.saveServiceSettings?.();
                },
                meta: 'In prompt order, but no editable text content is exposed here',
            });
        });
        promptManager.serviceSettings.prompts.forEach((prompt, index) => {
            if (!prompt || typeof prompt.content !== 'string' || enabledById.has(prompt.identifier))
                return;
            addPromptSource(prompt, index, null);
        });
    }
    if (oai_settings) {
        for (const [property, label, selector] of TEXT_FIELDS.utility) {
            if (typeof oai_settings[property] !== 'string')
                continue;
            sources.push(makeObjectFieldSource({
                id: `oai_settings:${property}`,
                label,
                group: 'Utility Prompts',
                object: oai_settings,
                property,
                selector,
            }));
        }
        for (const [property, label, selector] of TEXT_FIELDS.formatting) {
            if (typeof oai_settings[property] !== 'string')
                continue;
            sources.push(makeObjectFieldSource({
                id: `oai_settings:${property}`,
                label,
                group: 'Formatting Prompts',
                object: oai_settings,
                property,
                selector,
            }));
        }
        for (const [property, label] of TEXT_FIELDS.customOpenAi) {
            if (typeof oai_settings[property] !== 'string')
                continue;
            sources.push(makeObjectFieldSource({
                id: `oai_settings:${property}`,
                label,
                group: 'Custom OpenAI Parameters',
                object: oai_settings,
                property,
            }));
        }
    }
    if (textgenerationwebui_settings) {
        for (const [property, label] of TEXT_FIELDS.textgen) {
            if (!(property in textgenerationwebui_settings))
                continue;
            sources.push(makeTextGenFieldSource(property, label));
        }
    }
    if (power_user?.context) {
        for (const [property, label] of TEXT_FIELDS.context) {
            sources.push(makeObjectFieldSource({
                id: `power_user.context:${property}`,
                label,
                group: 'Power User Context',
                object: power_user.context,
                property,
                selector: `#context_${property}`,
            }));
        }
    }
    if (power_user?.instruct) {
        for (const [property, label] of TEXT_FIELDS.instruct) {
            sources.push(makeInstructFieldSource(property, label));
        }
    }
    if (power_user?.sysprompt) {
        for (const [property, label] of TEXT_FIELDS.sysprompt) {
            sources.push(makeSystemPromptFieldSource(property, label));
        }
    }
    if (typeof power_user?.custom_css === 'string') {
        sources.push(makeThemeJsonSource());
        sources.push(makeCustomCssSource());
    }
    if (typeof power_user?.persona_description === 'string') {
        sources.push(makeObjectFieldSource({
            id: 'power_user:persona_description',
            label: 'Active Persona Description',
            group: 'Personas',
            object: power_user,
            property: 'persona_description',
            selector: '#persona_description',
        }));
    }
    if (power_user?.persona_descriptions && typeof power_user.persona_descriptions === 'object') {
        for (const [key, value] of Object.entries(power_user.persona_descriptions)) {
            if (!value || typeof value.description !== 'string')
                continue;
            sources.push({
                id: `power_user.persona_descriptions:${key}`,
                label: value.name || key,
                group: 'Personas',
                readonly: false,
                read: () => String(value.description ?? ''),
                write: (text) => {
                    value.description = text;
                },
                save: () => saveSettingsDebounced(),
            });
        }
    }
    for (const profile of getConnectionManagerProfiles()) {
        sources.push(makeConnectionProfileSource(profile));
    }
    if (Array.isArray(characters) && characters.length) {
        for (const character of characters) {
            if (!character?.avatar)
                continue;
            sources.push(...makeCharacterCardSources(character));
        }
    }
    if (Array.isArray(world_names) && world_names.length) {
        for (const worldName of world_names) {
            let data;
            try {
                data = await loadWorldInfo(worldName);
            }
            catch (error) {
                console.warn(`[${NAME}] Could not load world info "${worldName}"`, error);
                continue;
            }
            const entries = Array.isArray(data?.entries)
                ? data.entries.map((entry) => [entry?.uid, entry])
                : Object.entries(data?.entries ?? {});
            let editableEntryCount = 0;
            for (const [entryKey, entry] of entries) {
                if (!entry || typeof entry !== 'object')
                    continue;
                editableEntryCount += 1;
                const uid = entry.uid ?? entryKey;
                const title = getWorldInfoEntryTitle(entry, uid);
                let activeData = data;
                let activeEntry = entry;
                const refreshEntry = async () => {
                    const fresh = await getWorldInfoEntry(worldName, uid);
                    if (!fresh.entry)
                        throw new Error(`World entry ${uid} was not found in "${worldName}".`);
                    activeData = fresh.data;
                    activeEntry = fresh.entry;
                    return activeEntry;
                };
                sources.push({
                    id: `world:${worldName}:${uid}:content`,
                    label: title,
                    group: `World/Lorebook: ${worldName}`,
                    readonly: false,
                    read: () => String(activeEntry.content ?? ''),
                    readFresh: async () => String((await refreshEntry()).content ?? ''),
                    write: (text) => {
                        activeEntry.content = text;
                    },
                    save: async () => {
                        await saveWorldInfo(worldName, activeData, true);
                        reloadEditor(worldName, true);
                    },
                    meta: `World entry ${uid}`,
                    metadata: {
                        name: {
                            get: () => activeEntry.comment || activeEntry.memo || '',
                            set: async (v) => {
                                activeEntry.comment = v;
                                await saveWorldInfo(worldName, activeData, true);
                                reloadEditor(worldName, true);
                            }
                        },
                        triggers: {
                            get: () => Array.isArray(activeEntry.key) ? activeEntry.key.join(', ') : '',
                            set: async (v) => {
                                activeEntry.key = v.split(',').map(s => s.trim()).filter(Boolean);
                                await saveWorldInfo(worldName, activeData, true);
                                reloadEditor(worldName, true);
                            }
                        }
                    }
                });
            }
            if (!editableEntryCount) {
                sources.push({
                    id: `world:${worldName}:placeholder`,
                    label: 'No editable entries',
                    group: `World/Lorebook: ${worldName}`,
                    readonly: true,
                    selectable: false,
                    placeholder: true,
                    read: () => '',
                    write: () => { },
                    save: () => { },
                    meta: 'Lorebook has no editable entry content',
                });
            }
        }
    }
    return sources.sort((a, b) => {
        const groupCompare = (a.groupOrder ?? GROUP_ORDER[a.group] ?? 1000).valueOf() - (b.groupOrder ?? GROUP_ORDER[b.group] ?? 1000).valueOf();
        if (groupCompare)
            return groupCompare;
        const groupNameCompare = a.group.localeCompare(b.group);
        if (groupNameCompare)
            return groupNameCompare;
        const orderCompare = (a.order ?? 1000) - (b.order ?? 1000);
        if (orderCompare)
            return orderCompare;
        return a.label.localeCompare(b.label);
    });
};
//# sourceMappingURL=SourceManager.js.map