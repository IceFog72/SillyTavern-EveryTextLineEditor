// @ts-ignore
import { oai_settings, promptManager, openai_setting_names } from '../../../../openai.js';
// @ts-ignore
import { power_user, context_presets } from '../../../../power-user.js';
// @ts-ignore
import { selectContextPreset, selectInstructPreset, instruct_presets } from '../../../../instruct-mode.js';
// @ts-ignore
import { loadWorldInfo, reloadEditor, saveWorldInfo, world_names } from '../../../../world-info.js';
// @ts-ignore
import { saveSettingsDebounced } from '../../../../../script.js';
import { diffLines, type Change } from './vendor/diff/index.js';
import { GENERATION_TRIGGERS, NAME, STORAGE, TEXT_FIELDS } from './constants.js';
import { AlignedDiff, BranchManager, DiffMark, TextSource } from './types.js';

const GROUP_ORDER: Record<string, number> = {
    'Chat Completion Prompts': 10,
    'Utility Prompts': 20,
    'Formatting Prompts': 30,
    'Power User Context': 40,
    'Power User Instruct': 50,
    'System Prompt': 60,
    'Personas': 70,
};

export const getCollapsedGroups = (): Set<string> => {
    try {
        return new Set(JSON.parse(localStorage.getItem(STORAGE.collapsedGroups) || '[]'));
    } catch {
        return new Set();
    }
};

export const setCollapsedGroups = (groups: Set<string>) => {
    localStorage.setItem(STORAGE.collapsedGroups, JSON.stringify([...groups]));
};

const splitLines = (text: unknown): string[] => String(text ?? '').split('\n');

const GENERATION_TRIGGER_IDS: Set<string> = new Set(GENERATION_TRIGGERS.map(trigger => trigger.id));
const GENERATION_TRIGGER_LABELS: Map<string, string> = new Map(GENERATION_TRIGGERS.map(trigger => [trigger.id, trigger.label]));

const getPromptInjectionTriggers = (prompt: Record<string, any>): string[] => (
    Array.isArray(prompt.injection_trigger)
        ? prompt.injection_trigger.filter((trigger: unknown): trigger is string => typeof trigger === 'string')
        : []
);

const formatPromptInjectionTriggers = (prompt: Record<string, any>): string => {
    const triggers = getPromptInjectionTriggers(prompt);
    if (!triggers.length) return 'All types (default)';
    return triggers.map(trigger => GENERATION_TRIGGER_LABELS.get(trigger) ?? trigger).join(', ');
};

const parsePromptInjectionTriggers = (value: string): string[] => (
    value
        .split(',')
        .map(trigger => trigger.trim().toLowerCase())
        .filter(trigger => GENERATION_TRIGGER_IDS.has(trigger))
);

export const getLineDiff = (oldText: string, newText: string): AlignedDiff => {
    const oldLines = splitLines(oldText);
    const newLines = splitLines(newText);
    const oldDisplayLines: string[] = [];
    const oldMarks: DiffMark[] = [];
    const newMarks: DiffMark[] = Array(newLines.length).fill('');
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
            markLines(newMarks, newIdx, change.count, 'added');
            appendOldBlankLines(change.count);
            newIdx += change.count;
            continue;
        }

        appendOldLines(change.count, '');
        oldIdx += change.count;
        newIdx += change.count;
    }

    return { oldMarks, newMarks, oldDisplayText: oldDisplayLines.join('\n') };

    function alignChangedBlocks(removed: Change, added: Change) {
        markLines(newMarks, newIdx, added.count, 'added');
        appendOldLines(removed.count, 'removed');
        appendOldBlankLines(Math.max(0, added.count - removed.count));

        oldIdx += removed.count;
        newIdx += added.count;
    }

    function appendOldLines(count = 0, mark: DiffMark) {
        for (let index = 0; index < count && oldIdx + index < oldLines.length; index++) {
            oldDisplayLines.push(oldLines[oldIdx + index]);
            oldMarks.push(mark);
        }
    }

    function appendOldBlankLines(count = 0) {
        for (let index = 0; index < count; index++) {
            oldDisplayLines.push('');
            oldMarks.push('added');
        }
    }
};

const markLines = (marks: DiffMark[], start: number, count: number, mark: DiffMark) => {
    for (let index = start; index < start + count && index < marks.length; index++) {
        marks[index] = mark;
    }
};

const savePowerUserField = (selector: string, value: string) => {
    const field = document.querySelector(selector);
    if (field instanceof HTMLTextAreaElement || field instanceof HTMLInputElement) {
        field.value = value;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
    }
    saveSettingsDebounced();
};

const makeObjectFieldSource = ({ id, label, group, object, property, selector = null }: {
    id: string;
    label: string;
    group: string;
    object: Record<string, any>;
    property: string;
    selector?: string | null;
}): TextSource => {
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
            if (selector) savePowerUserField(selector, value);
        },
        save: () => saveSettingsDebounced(),
    };
};

const getBranchManager = (group: string): BranchManager | undefined => {
    switch (group) {
        case 'Chat Completion Prompts':
            return {
                getBranches: () => Object.keys(openai_setting_names || {}),
                getCurrentBranch: () => oai_settings?.preset_settings_openai ?? 'Default',
                switchBranch: async (branchName) => {
                    if (oai_settings) {
                        oai_settings.preset_settings_openai = branchName;
                        const value = openai_setting_names[branchName];
                        const select = document.querySelector<HTMLSelectElement>('#settings_preset_openai');
                        if (select) {
                            select.value = value;
                            select.dispatchEvent(new Event('change', { bubbles: true }));
                        }
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
        default:
            return undefined;
    }
};

export const getSources = async (): Promise<TextSource[]> => {
    const sources: TextSource[] = [];

    if (promptManager?.serviceSettings?.prompts) {
        const branchManager = getBranchManager('Chat Completion Prompts');
        const branchSuffix = branchManager ? `@${branchManager.getCurrentBranch()}` : '';

        const activeOrder = promptManager.activeCharacter
            ? promptManager.getPromptOrderForCharacter(promptManager.activeCharacter)
            : [];
        const enabledById = new Map(activeOrder.map((entry, index) => [entry.identifier, { enabled: !!entry.enabled, index }]));
        const promptById = new Map<string, any>(promptManager.serviceSettings.prompts.map(prompt => [prompt?.identifier, prompt]));
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
                    if (!state?.entry) return;
                    const counts = promptManager.tokenHandler?.getCounts?.();
                    if (counts) counts[prompt.identifier] = null;
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
                    if (counts) counts[entry.identifier] = null;
                    entry.enabled = !entry.enabled;
                    promptManager.render?.(false);
                    await promptManager.saveServiceSettings?.();
                },
                meta: 'In prompt order, but no editable text content is exposed here',
            });
        });

        promptManager.serviceSettings.prompts.forEach((prompt, index) => {
            if (!prompt || typeof prompt.content !== 'string' || enabledById.has(prompt.identifier)) return;
            addPromptSource(prompt, index, null);
        });
    }

    if (oai_settings) {
        for (const [property, label, selector] of TEXT_FIELDS.utility) {
            if (typeof oai_settings[property] !== 'string') continue;
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
            if (typeof oai_settings[property] !== 'string') continue;
            sources.push(makeObjectFieldSource({
                id: `oai_settings:${property}`,
                label,
                group: 'Formatting Prompts',
                object: oai_settings,
                property,
                selector,
            }));
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
            sources.push(makeObjectFieldSource({
                id: `power_user.instruct:${property}`,
                label,
                group: 'Power User Instruct',
                object: power_user.instruct,
                property,
                selector: `#instruct_${property}`,
            }));
        }
    }

    if (power_user?.sysprompt) {
        for (const [property, label] of TEXT_FIELDS.sysprompt) {
            sources.push(makeObjectFieldSource({
                id: `power_user.sysprompt:${property}`,
                label,
                group: 'System Prompt',
                object: power_user.sysprompt,
                property,
                selector: property === 'content' ? '#sysprompt_content' : null,
            }));
        }
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
        for (const [key, value] of Object.entries(power_user.persona_descriptions) as Array<[string, any]>) {
            if (!value || typeof value.description !== 'string') continue;
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

    if (Array.isArray(world_names) && world_names.length) {
        for (const worldName of world_names) {
            let data;
            try {
                data = await loadWorldInfo(worldName);
            } catch (error) {
                console.warn(`[${NAME}] Could not load world info "${worldName}"`, error);
                continue;
            }
            const entries = Array.isArray(data?.entries) ? data.entries : [];
            for (const entry of entries) {
                if (!entry || typeof entry.content !== 'string') continue;
                const title = entry.comment || entry.memo || entry.key?.join(', ') || `Entry ${entry.uid}`;
                sources.push({
                    id: `world:${worldName}:${entry.uid}:content`,
                    label: title,
                    group: `World/Lorebook: ${worldName}`,
                    readonly: false,
                    read: () => String(entry.content ?? ''),
                    write: (text) => {
                        entry.content = text;
                    },
                    save: async () => {
                        await saveWorldInfo(worldName, data, true);
                        reloadEditor(worldName, true);
                    },
                    meta: `World entry ${entry.uid}`,
                    metadata: {
                        name: {
                            get: () => entry.comment || entry.memo || '',
                            set: async (v) => {
                                entry.comment = v;
                                await saveWorldInfo(worldName, data, true);
                                reloadEditor(worldName, true);
                            }
                        },
                        triggers: {
                            get: () => Array.isArray(entry.key) ? entry.key.join(', ') : '',
                            set: async (v) => {
                                entry.key = v.split(',').map(s => s.trim()).filter(Boolean);
                                await saveWorldInfo(worldName, data, true);
                                reloadEditor(worldName, true);
                            }
                        }
                    }
                });
            }
        }
    }

    return sources.sort((a, b) => {
        const groupCompare = (a.groupOrder ?? GROUP_ORDER[a.group] ?? 1000).valueOf() - (b.groupOrder ?? GROUP_ORDER[b.group] ?? 1000).valueOf();
        if (groupCompare) return groupCompare;
        const groupNameCompare = a.group.localeCompare(b.group);
        if (groupNameCompare) return groupNameCompare;
        const orderCompare = (a.order ?? 1000) - (b.order ?? 1000);
        if (orderCompare) return orderCompare;
        return a.label.localeCompare(b.label);
    });
};
