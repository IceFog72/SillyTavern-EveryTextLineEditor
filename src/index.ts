// SillyTavern runtime modules live outside this extension package and do not ship local .d.ts files.
// @ts-ignore
import { extension_settings } from '../../../../extensions.js';
// @ts-ignore
import { oai_settings, promptManager } from '../../../../openai.js';
// @ts-ignore
import { power_user } from '../../../../power-user.js';
// @ts-ignore
import { setSlashCommandAutoComplete } from '../../../../slash-commands.js';
// @ts-ignore
import { loadWorldInfo, reloadEditor, saveWorldInfo, world_names } from '../../../../world-info.js';
// @ts-ignore
import { Popup, POPUP_RESULT } from '../../../../popup.js';
// @ts-ignore
import { saveSettingsDebounced } from '../../../../../script.js';
import { createEditor, languageMap } from '../lib/prism-code-editor/index.js';
import { defaultCommands } from '../lib/prism-code-editor/extensions/commands.js';
import { indentGuides } from '../lib/prism-code-editor/extensions/guides.js';
import { matchBrackets } from '../lib/prism-code-editor/extensions/matchBrackets/index.js';
import { highlightBracketPairs } from '../lib/prism-code-editor/extensions/matchBrackets/highlight.js';
import { searchWidget } from '../lib/prism-code-editor/extensions/search/index.js';
import '../lib/prism-code-editor/prism/languages/yaml.js';
import '../lib/prism-code-editor/prism/languages/markdown.js';

type TextField = readonly [property: string, label: string, selector?: string];
type DiffMark = '' | 'added' | 'removed';
type IndentMode = typeof INDENT_MODES[number];

interface PromptOrderEntry {
    identifier?: string;
    enabled?: boolean;
    [key: string]: any;
}

interface TextSource {
    id: string;
    label: string;
    group: string;
    groupOrder?: number;
    order?: number;
    readonly?: boolean;
    selectable?: boolean;
    placeholder?: boolean;
    enabled?: boolean;
    toggleable?: boolean;
    promptOrderEntry?: PromptOrderEntry;
    meta?: string;
    read(): string;
    write(value: string): void;
    save?(): void | Promise<void>;
    toggle?(): void | Promise<void>;
}

interface PrismEditorLike {
    value: string;
    textarea: HTMLTextAreaElement;
    scrollContainer: HTMLElement;
    setOptions(options: Record<string, any>): void;
    update?(): void;
}

interface DomRefs {
    [key: string]: any;
    drawer?: HTMLDivElement;
    toggle?: HTMLDivElement;
    icon?: HTMLDivElement;
    root?: HTMLDivElement;
    sidebar?: HTMLElement;
    tree?: HTMLDivElement;
    currentGroup?: HTMLDivElement;
    currentTitle?: HTMLHeadingElement;
    currentMeta?: HTMLDivElement;
    diff?: HTMLButtonElement;
    revert?: HTMLButtonElement;
    apply?: HTMLButtonElement;
    workspace?: HTMLDivElement;
    oldEditorHost?: HTMLDivElement;
    editorHost?: HTMLDivElement;
}

declare global {
    interface Window {
        EveryTextLineEditor?: EveryTextLineEditor;
    }
}

const EXTENSION_PATH_PARTS = new URL(import.meta.url).pathname.split('/');
const EXTENSION_FOLDER = EXTENSION_PATH_PARTS.at(-2);
export const NAME = ['dist', 'src'].includes(EXTENSION_FOLDER) ? EXTENSION_PATH_PARTS.at(-3) : EXTENSION_FOLDER;

const STORAGE = {
    selectedSource: `${NAME}:selectedSource`,
    wordWrap: `${NAME}:wordWrap`,
    panelWidth: `${NAME}:panelWidth`,
    collapsedGroups: `${NAME}:collapsedGroups`,
    indentMode: `${NAME}:indentMode`,
};

const TEXT_FIELDS: Record<string, TextField[]> = {
    context: [
        ['story_string', 'Story String'],
        ['example_separator', 'Example Separator'],
        ['chat_start', 'Chat Start'],
    ],
    instruct: [
        ['input_sequence', 'Input Sequence'],
        ['input_suffix', 'Input Suffix'],
        ['output_sequence', 'Output Sequence'],
        ['output_suffix', 'Output Suffix'],
        ['system_sequence', 'System Sequence'],
        ['system_suffix', 'System Suffix'],
        ['last_system_sequence', 'Last System Sequence'],
        ['first_input_sequence', 'First Input Sequence'],
        ['first_output_sequence', 'First Output Sequence'],
        ['last_input_sequence', 'Last Input Sequence'],
        ['last_output_sequence', 'Last Output Sequence'],
        ['story_string_prefix', 'Story String Prefix'],
        ['story_string_suffix', 'Story String Suffix'],
        ['stop_sequence', 'Stop Sequence'],
        ['activation_regex', 'Activation Regex'],
        ['user_alignment_message', 'User Alignment Message'],
        ['separator_sequence', 'Separator Sequence'],
    ],
    sysprompt: [
        ['content', 'System Prompt Content'],
        ['post_history', 'Post-History System Prompt'],
    ],
    utility: [
        ['send_if_empty', 'Empty User Message Replacement', '#send_if_empty_textarea'],
        ['impersonation_prompt', 'Impersonation Prompt', '#impersonation_prompt_textarea'],
        ['new_chat_prompt', 'New Chat Prompt', '#newchat_prompt_textarea'],
        ['new_group_chat_prompt', 'New Group Chat Prompt', '#newgroupchat_prompt_textarea'],
        ['new_example_chat_prompt', 'New Example Chat Prompt', '#newexamplechat_prompt_textarea'],
        ['continue_nudge_prompt', 'Continue Nudge Prompt', '#continue_nudge_prompt_textarea'],
        ['group_nudge_prompt', 'Group Nudge Prompt', '#group_nudge_prompt_textarea'],
    ],
    formatting: [
        ['wi_format', 'World Info Format', '#wi_format_textarea'],
        ['scenario_format', 'Scenario Format', '#scenario_format_textarea'],
        ['personality_format', 'Personality Format', '#personality_format_textarea'],
    ],
};

const GROUP_ORDER: Record<string, number> = {
    'Chat Completion Prompts': 10,
    'Utility Prompts': 20,
    'Formatting Prompts': 30,
    'Power User Context': 40,
    'Power User Instruct': 50,
    'System Prompt': 60,
    'Personas': 70,
};

const INDENT_MODES = [
    { id: 'tabs', label: 'Tabs', insertSpaces: false, tabSize: 4 },
    { id: 'spaces2', label: 'Spaces: 2', insertSpaces: true, tabSize: 2 },
    { id: 'spaces4', label: 'Spaces: 4', insertSpaces: true, tabSize: 4 },
];

const getCollapsedGroups = (): Set<string> => {
    try {
        return new Set(JSON.parse(localStorage.getItem(STORAGE.collapsedGroups) || '[]'));
    } catch {
        return new Set();
    }
};

const setCollapsedGroups = (groups: Set<string>) => {
    localStorage.setItem(STORAGE.collapsedGroups, JSON.stringify([...groups]));
};

const getIndentMode = (): IndentMode => {
    const stored = localStorage.getItem(STORAGE.indentMode);
    return INDENT_MODES.find(mode => mode.id === stored) ?? INDENT_MODES[0];
};

const splitLines = (text: unknown): string[] => String(text ?? '').split('\n');

const getLineDiff = (oldText: string, newText: string): { oldMarks: DiffMark[]; newMarks: DiffMark[] } => {
    const oldLines = splitLines(oldText);
    const newLines = splitLines(newText);
    const oldMarks: DiffMark[] = Array(oldLines.length).fill('');
    const newMarks: DiffMark[] = Array(newLines.length).fill('');

    const maxCells = oldLines.length * newLines.length;
    if (maxCells > 750000) {
        const maxLength = Math.max(oldLines.length, newLines.length);
        for (let index = 0; index < maxLength; index++) {
            if (oldLines[index] !== newLines[index]) {
                if (index < oldLines.length) oldMarks[index] = 'removed';
                if (index < newLines.length) newMarks[index] = 'added';
            }
        }
        return { oldMarks, newMarks };
    }

    const dp = Array.from({ length: oldLines.length + 1 }, () => Array(newLines.length + 1).fill(0));
    for (let oldIndex = oldLines.length - 1; oldIndex >= 0; oldIndex--) {
        for (let newIndex = newLines.length - 1; newIndex >= 0; newIndex--) {
            dp[oldIndex][newIndex] = oldLines[oldIndex] === newLines[newIndex]
                ? dp[oldIndex + 1][newIndex + 1] + 1
                : Math.max(dp[oldIndex + 1][newIndex], dp[oldIndex][newIndex + 1]);
        }
    }

    let oldIndex = 0;
    let newIndex = 0;
    while (oldIndex < oldLines.length && newIndex < newLines.length) {
        if (oldLines[oldIndex] === newLines[newIndex]) {
            oldIndex++;
            newIndex++;
        } else if (dp[oldIndex + 1][newIndex] >= dp[oldIndex][newIndex + 1]) {
            oldMarks[oldIndex++] = 'removed';
        } else {
            newMarks[newIndex++] = 'added';
        }
    }

    while (oldIndex < oldLines.length) oldMarks[oldIndex++] = 'removed';
    while (newIndex < newLines.length) newMarks[newIndex++] = 'added';

    return { oldMarks, newMarks };
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
}): TextSource => ({
    id,
    label,
    group,
    readonly: false,
    read: () => String(object?.[property] ?? ''),
    write: (value) => {
        object[property] = value;
        if (selector) savePowerUserField(selector, value);
    },
    save: () => saveSettingsDebounced(),
});

const getSources = async (): Promise<TextSource[]> => {
    const sources: TextSource[] = [];

    if (promptManager?.serviceSettings?.prompts) {
        const activeOrder = promptManager.activeCharacter
            ? promptManager.getPromptOrderForCharacter(promptManager.activeCharacter)
            : [];
        const enabledById = new Map(activeOrder.map((entry, index) => [entry.identifier, { enabled: !!entry.enabled, index }]));
        const promptById = new Map<string, any>(promptManager.serviceSettings.prompts.map(prompt => [prompt?.identifier, prompt]));
        const addPromptSource = (prompt, index, state) => {
            const orderLabel = state ? ` #${state.index + 1}` : '';
            const enabledLabel = state ? (state.enabled ? ' enabled' : ' disabled') : '';
            sources.push({
                id: `prompt:${prompt.identifier}`,
                label: `${prompt.name || prompt.identifier}${orderLabel}${enabledLabel}`,
                group: 'Chat Completion Prompts',
                groupOrder: GROUP_ORDER['Chat Completion Prompts'],
                order: state?.index ?? (10000 + index),
                readonly: false,
                enabled: state?.enabled,
                toggleable: !!state,
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
                id: `prompt-order:${entry.identifier}`,
                label: `${prompt?.name || entry.identifier || 'Blank prompt'} #${index + 1}${entry.enabled ? ' enabled' : ' disabled'}`,
                group: 'Chat Completion Prompts',
                groupOrder: GROUP_ORDER['Chat Completion Prompts'],
                order: index,
                readonly: true,
                selectable: false,
                placeholder: true,
                enabled: !!entry.enabled,
                toggleable: true,
                promptOrderEntry: entry,
                read: () => '',
                write: () => {},
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

class EveryTextLineEditor {
    sources: TextSource[];
    selectedSource: TextSource | null;
    dirty: boolean;
    collapsedGroups: Set<string>;
    dom: DomRefs;
    editor: PrismEditorLike | null;
    oldEditor: PrismEditorLike | null;
    diffOpen: boolean;
    isSyncingScroll: boolean;
    scrollSyncFrame: number;
    pendingScrollSync: { from: HTMLElement; to: HTMLElement } | null;
    indentMode: IndentMode;

    constructor() {
        this.sources = [];
        this.selectedSource = null;
        this.dirty = false;
        this.collapsedGroups = getCollapsedGroups();
        this.dom = {};
        this.editor = null;
        this.oldEditor = null;
        this.diffOpen = false;
        this.isSyncingScroll = false;
        this.scrollSyncFrame = 0;
        this.pendingScrollSync = null;
        this.indentMode = getIndentMode();
    }

    async inject() {
        this.renderDrawer();
        await this.refreshSources();
    }

    renderDrawer() {
        const drawer = document.createElement('div');
        this.dom.drawer = drawer;
        drawer.id = 'etle--drawer';
        drawer.classList.add('drawer');

        const toggle = document.createElement('div');
        this.dom.toggle = toggle;
        toggle.classList.add('drawer-toggle', 'drawer-header');
        drawer.append(toggle);

        const icon = document.createElement('div');
        this.dom.icon = icon;
        icon.id = 'etle--drawerIcon';
        icon.classList.add('drawer-icon', 'fa-solid', 'fa-pen-to-square', 'fa-fw', 'closedIcon');
        icon.title = 'Every Text Line Editor';
        icon.tabIndex = 0;
        icon.setAttribute('role', 'button');
        toggle.append(icon);
        toggle.addEventListener('click', (event) => this.handleDrawerToggle(event), { capture: true });

        drawer.append(this.renderPanel());

        const anchor = document.querySelector('#extensions-settings-button');
        if (anchor) {
            anchor.insertAdjacentElement('afterend', drawer);
            const anchorToggle = anchor.querySelector('.drawer-toggle');
            const clickHandler = globalThis.$?._data?.(anchorToggle, 'events')?.click?.[0]?.handler;
            if (clickHandler) {
                globalThis.$(toggle).on('click', clickHandler);
            } else {
                toggle.addEventListener('click', () => this.toggleDrawerClasses());
            }
        } else {
            document.body.append(drawer);
            toggle.addEventListener('click', () => this.toggleDrawerClasses());
        }

        document.addEventListener('click', (event) => this.handleDocumentClick(event), { capture: true });
    }

    handleDrawerToggle(event) {
        if (!this.dirty || !this.dom.root.classList.contains('openDrawer')) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        this.close().catch((error) => console.error(`[${NAME}] Failed to close editor`, error));
    }

    handleDocumentClick(event) {
        if (!this.dirty || !this.dom.root.classList.contains('openDrawer')) return;
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (this.dom.drawer.contains(target)) return;
        if (target instanceof Element && target.closest?.('.popup, dialog, .dialogue_popup')) return;

        event.preventDefault();
        event.stopImmediatePropagation();
        this.close().catch((error) => console.error(`[${NAME}] Failed to close editor`, error));
    }

    renderPanel() {
        const root = document.createElement('div');
        this.dom.root = root;
        root.id = 'etle--panel';
        root.classList.add('drawer-content', 'closedDrawer');
        root.style.setProperty('--etle-sidebar-width', localStorage.getItem(STORAGE.panelWidth) || '320px');

        const grabber = document.createElement('div');
        grabber.id = 'etle--headerGrip';
        grabber.classList.add('drag-grabber');

        const gripIcon = document.createElement('div');
        gripIcon.classList.add('fa-solid', 'fa-grip');
        grabber.append(gripIcon);
        root.append(grabber);

        const shell = document.createElement('div');
        shell.classList.add('etle--shell');
        root.append(shell);

        const sidebar = document.createElement('aside');
        this.dom.sidebar = sidebar;
        sidebar.classList.add('etle--sidebar');
        shell.append(sidebar);

        const sidebarHead = document.createElement('div');
        sidebarHead.classList.add('etle--sidebarHead');
        sidebar.append(sidebarHead);

        const title = document.createElement('h3');
        title.textContent = 'Every Text Line Editor';
        sidebarHead.append(title);

        const refresh = this.makeIconButton('fa-rotate', 'Refresh sources', () => this.refreshSources(true));
        sidebarHead.append(refresh);

        const tree = document.createElement('div');
        this.dom.tree = tree;
        tree.classList.add('etle--tree');
        sidebar.append(tree);

        const resize = document.createElement('div');
        resize.classList.add('etle--resize');
        resize.addEventListener('pointerdown', (event) => this.startResize(event));
        shell.append(resize);

        const main = document.createElement('main');
        main.classList.add('etle--main');
        shell.append(main);

        const header = document.createElement('header');
        header.classList.add('etle--header');
        main.append(header);

        const current = document.createElement('div');
        current.classList.add('etle--current');
        header.append(current);

        const currentGroup = document.createElement('div');
        this.dom.currentGroup = currentGroup;
        currentGroup.classList.add('etle--currentGroup');
        current.append(currentGroup);

        const currentTitle = document.createElement('h3');
        this.dom.currentTitle = currentTitle;
        currentTitle.textContent = 'No source selected';
        current.append(currentTitle);

        const currentMeta = document.createElement('div');
        this.dom.currentMeta = currentMeta;
        currentMeta.classList.add('etle--currentMeta');
        current.append(currentMeta);

        const actions = document.createElement('div');
        actions.classList.add('etle--actions');
        header.append(actions);

        this.dom.diff = this.makeTextButton('Diff', 'fa-code-compare', () => this.toggleDiff());
        this.dom.revert = this.makeTextButton('Revert', 'fa-rotate-left', () => this.revert());
        this.dom.apply = this.makeTextButton('Apply', 'fa-check', () => this.apply());
        actions.append(this.dom.diff, this.dom.revert, this.dom.apply, this.makeIconButton('fa-xmark', 'Close editor', () => this.close().catch((error) => console.error(`[${NAME}] Failed to close editor`, error))));

        const workspace = document.createElement('div');
        this.dom.workspace = workspace;
        workspace.classList.add('etle--workspace');
        main.append(workspace);

        const oldEditorHost = document.createElement('div');
        this.dom.oldEditorHost = oldEditorHost;
        oldEditorHost.classList.add('etle--oldEditorHost');
        workspace.append(oldEditorHost);

        const editorHost = document.createElement('div');
        this.dom.editorHost = editorHost;
        editorHost.classList.add('etle--editorHost');
        workspace.append(editorHost);

        this.createCodeEditor(editorHost);
        this.createReadonlyEditor(oldEditorHost);
        root.append(this.renderStatusBar());
        this.updateDirty(false);
        this.updateStatusBar();

        return root;
    }

    toggleDrawerClasses() {
        this.dom.icon.classList.toggle('openIcon');
        this.dom.icon.classList.toggle('closedIcon');
        this.dom.root.classList.toggle('openDrawer');
        this.dom.root.classList.toggle('closedDrawer');
    }

    setUnsavedLock(isLocked) {
        this.dom.root?.classList.toggle('pinnedOpen', !!isLocked);
        this.dom.icon?.classList.toggle('drawerPinnedOpen', !!isLocked);
    }

    makeIconButton(icon, title, onClick) {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('etle--iconButton', 'menu_button', 'fa-solid', 'fa-fw', icon);
        button.title = title;
        button.addEventListener('click', onClick);
        return button;
    }

    makeTextButton(text, icon, onClick) {
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('etle--textButton', 'menu_button');
        const iconEl = document.createElement('span');
        iconEl.classList.add('fa-solid', 'fa-fw', icon);
        const label = document.createElement('span');
        label.textContent = text;
        button.append(iconEl, label);
        button.addEventListener('click', onClick);
        return button;
    }

    renderStatusBar() {
        const status = document.createElement('footer');
        status.classList.add('etle--statusBar');

        const left = document.createElement('div');
        left.classList.add('etle--statusLeft');
        status.append(left);

        const dirty = document.createElement('span');
        this.dom.statusDirty = dirty;
        dirty.classList.add('etle--statusItem', 'etle--dirtyStatus');
        left.append(dirty);

        const sourceCount = document.createElement('span');
        this.dom.statusSourceCount = sourceCount;
        sourceCount.classList.add('etle--statusItem');
        left.append(sourceCount);

        const stats = document.createElement('span');
        this.dom.statusStats = stats;
        stats.classList.add('etle--statusItem');
        left.append(stats);

        const right = document.createElement('div');
        right.classList.add('etle--statusRight');
        status.append(right);

        const cursor = document.createElement('span');
        this.dom.statusCursor = cursor;
        cursor.classList.add('etle--statusItem');
        right.append(cursor);

        const selection = document.createElement('span');
        this.dom.statusSelection = selection;
        selection.classList.add('etle--statusItem');
        right.append(selection);

        const indent = document.createElement('button');
        this.dom.statusIndent = indent;
        indent.type = 'button';
        indent.classList.add('etle--statusButton');
        indent.title = 'Cycle indentation';
        indent.addEventListener('click', () => this.cycleIndentMode());
        right.append(indent);

        const wrap = document.createElement('button');
        this.dom.statusWrap = wrap;
        wrap.type = 'button';
        wrap.classList.add('etle--statusButton');
        wrap.title = 'Toggle word wrap';
        wrap.addEventListener('click', () => this.setWordWrap(!JSON.parse(localStorage.getItem(STORAGE.wordWrap) || 'true')));
        right.append(wrap);

        const language = document.createElement('span');
        this.dom.statusLanguage = language;
        language.classList.add('etle--statusItem');
        language.textContent = '.md';
        right.append(language);

        return status;
    }

    createCodeEditor(host) {
        languageMap.markdown = languageMap.md = {
            comments: {
                block: ['<!--', '-->'],
            },
        };

        this.editor = createEditor(
            host,
            {
                value: '',
                language: 'markdown',
                lineNumbers: true,
                readOnly: false,
                insertSpaces: this.indentMode.insertSpaces,
                tabSize: this.indentMode.tabSize,
                wordWrap: JSON.parse(localStorage.getItem(STORAGE.wordWrap) || 'true'),
                onUpdate: (value) => {
                    if (!this.selectedSource) return;
                    this.updateDirty(value !== this.selectedSource.read());
                    this.renderDiff();
                    this.updateStatusBar();
                },
            },
            searchWidget(),
            highlightBracketPairs(),
            matchBrackets(true, '{', '}'),
            indentGuides(),
            defaultCommands(),
        );

        setSlashCommandAutoComplete(this.editor.textarea, true).then((autocomplete) => {
            this.editor.textarea.addEventListener('keydown', (event) => autocomplete.handleKeyDown(event), { capture: true });
        }).catch(() => {});
        this.editor.textarea.addEventListener('keyup', () => this.updateStatusBar());
        this.editor.textarea.addEventListener('click', () => this.updateStatusBar());
        this.editor.textarea.addEventListener('select', () => this.updateStatusBar());
        this.editor.textarea.addEventListener('input', () => this.updateStatusBar());
    }

    createReadonlyEditor(host) {
        this.oldEditor = createEditor(
            host,
            {
                value: '',
                language: 'markdown',
                lineNumbers: true,
                readOnly: true,
                insertSpaces: this.indentMode.insertSpaces,
                tabSize: this.indentMode.tabSize,
                wordWrap: JSON.parse(localStorage.getItem(STORAGE.wordWrap) || 'true'),
            },
            searchWidget(),
            highlightBracketPairs(),
            matchBrackets(true, '{', '}'),
            indentGuides(),
        );
        this.bindDiffScrollSync();
    }

    bindDiffScrollSync() {
        if (!this.editor || !this.oldEditor) return;
        const queueSync = (from, to) => {
            if (!this.diffOpen || this.isSyncingScroll) return;
            this.pendingScrollSync = { from, to };
            if (this.scrollSyncFrame) return;
            this.scrollSyncFrame = requestAnimationFrame(() => {
                this.scrollSyncFrame = 0;
                const pending = this.pendingScrollSync;
                this.pendingScrollSync = null;
                if (!pending || !this.diffOpen) return;
                this.applyScrollSync(pending.from, pending.to);
            });
        };
        this.oldEditor.scrollContainer.addEventListener('scroll', () => queueSync(this.oldEditor.scrollContainer, this.editor.scrollContainer), { passive: true });
        this.editor.scrollContainer.addEventListener('scroll', () => queueSync(this.editor.scrollContainer, this.oldEditor.scrollContainer), { passive: true });
    }

    applyScrollSync(from, to) {
        this.isSyncingScroll = true;
        const topRatio = from.scrollTop / Math.max(1, from.scrollHeight - from.clientHeight);
        const leftRatio = from.scrollLeft / Math.max(1, from.scrollWidth - from.clientWidth);
        const nextTop = topRatio * Math.max(0, to.scrollHeight - to.clientHeight);
        const nextLeft = leftRatio * Math.max(0, to.scrollWidth - to.clientWidth);
        if (Math.abs(to.scrollTop - nextTop) > 0.5) to.scrollTop = nextTop;
        if (Math.abs(to.scrollLeft - nextLeft) > 0.5) to.scrollLeft = nextLeft;
        requestAnimationFrame(() => {
            this.isSyncingScroll = false;
        });
    }

    syncDiffScroll() {
        if (!this.editor || !this.oldEditor || !this.diffOpen) return;
        this.applyScrollSync(this.editor.scrollContainer, this.oldEditor.scrollContainer);
    }

    async refreshSources(keepSelection = false) {
        const previousId = keepSelection ? this.selectedSource?.id : localStorage.getItem(STORAGE.selectedSource);
        this.sources = await getSources();
        this.renderTree();
        this.updateStatusBar();

        if (previousId && this.sources.some(source => source.id === previousId)) {
            await this.selectSource(previousId, { force: true });
        } else if (!this.selectedSource && this.sources.length) {
            await this.selectSource(this.sources[0].id, { force: true });
        } else if (!this.sources.length) {
            this.setEditorValue('');
            this.dom.currentTitle.textContent = 'No editable prompt sources found';
            this.dom.currentGroup.textContent = '';
            this.dom.currentMeta.textContent = 'Open Chat Completion settings once if PromptManager has not initialized yet.';
        }
    }

    async selectInitialSource() {
        const storedId = localStorage.getItem(STORAGE.selectedSource);
        if (storedId && this.sources.some(source => source.id === storedId)) {
            await this.selectSource(storedId, { force: true });
        } else if (this.sources.length) {
            await this.selectSource(this.sources[0].id, { force: true });
        }
    }

    renderTree() {
        this.dom.tree.innerHTML = '';
        const groups = new Map();
        for (const source of this.sources) {
            if (!groups.has(source.group)) groups.set(source.group, []);
            groups.get(source.group).push(source);
        }

        if (!groups.size) {
            const empty = document.createElement('div');
            empty.classList.add('etle--empty');
            empty.textContent = 'No sources available';
            this.dom.tree.append(empty);
            return;
        }

        for (const [group, sources] of groups) {
            const section = document.createElement('section');
            section.classList.add('etle--group');
            if (this.collapsedGroups.has(group)) section.classList.add('etle--collapsed');

            const header = document.createElement('button');
            header.type = 'button';
            header.classList.add('etle--groupHeader');
            header.innerHTML = `<span class="fa-solid fa-fw fa-chevron-down"></span><span></span><small></small>`;
            header.children[1].textContent = group;
            header.children[2].textContent = String(sources.length);
            header.addEventListener('click', () => {
                if (this.collapsedGroups.has(group)) this.collapsedGroups.delete(group);
                else this.collapsedGroups.add(group);
                setCollapsedGroups(this.collapsedGroups);
                this.renderTree();
            });
            section.append(header);

            const list = document.createElement('div');
            list.classList.add('etle--sourceList');
            for (const source of sources) {
                const item = document.createElement('div');
                item.classList.add('etle--source');
                item.dataset.sourceId = source.id;
                if (this.selectedSource?.id === source.id) item.classList.add('etle--active');
                if (source.readonly) item.classList.add('etle--readonly');
                if (source.placeholder) item.classList.add('etle--placeholder');

                if (source.toggleable) {
                    const toggle = document.createElement('button');
                    toggle.type = 'button';
                    toggle.classList.add('etle--promptToggle', 'menu_button', 'fa-solid', 'fa-fw');
                    toggle.classList.add(source.enabled ? 'fa-toggle-on' : 'fa-toggle-off');
                    toggle.title = source.enabled ? 'Disable prompt' : 'Enable prompt';
                    toggle.addEventListener('click', async (event) => {
                        event.stopPropagation();
                        await this.toggleSource(source);
                    });
                    item.append(toggle);
                } else {
                    const spacer = document.createElement('span');
                    spacer.classList.add('etle--sourceSpacer');
                    item.append(spacer);
                }

                const select = document.createElement('button');
                select.type = 'button';
                select.classList.add('etle--sourceSelect');
                select.disabled = source.selectable === false;
                select.innerHTML = '<span class="fa-solid fa-fw fa-file-lines"></span><span></span>';
                select.children[1].textContent = source.label;
                item.title = source.label;
                select.addEventListener('click', () => this.selectSource(source.id).catch((error) => console.error(`[${NAME}] Failed to select source`, error)));
                item.append(select);
                list.append(item);
            }
            section.append(list);
        this.dom.tree.append(section);
        }
    }

    async toggleSource(source) {
        if (!source?.toggle) return;
        try {
            await source.toggle();
            await this.refreshSources(true);
            globalThis.toastr?.success?.(source.enabled ? 'Prompt disabled' : 'Prompt enabled');
        } catch (error) {
            console.error(`[${NAME}] Failed to toggle source`, error);
            globalThis.toastr?.error?.('Failed to toggle prompt. See console for details.');
        }
    }

    async selectSource(id, { force = false } = {}) {
        if (!force && this.selectedSource?.id === id) return;
        if (!force && this.dirty) {
            const choice = await this.confirmUnsavedSourceChange('switch');
            if (choice === 'cancel') return;
            if (choice === 'save') {
                const saved = await this.saveCurrentSource({ refresh: false, toast: true });
                if (!saved) return;
            }
            if (choice === 'discard') {
                this.updateDirty(false);
            }
        }
        const source = this.sources.find(item => item.id === id);
        if (!source || source.selectable === false) return;

        this.selectedSource = source;
        localStorage.setItem(STORAGE.selectedSource, source.id);
        this.dom.currentGroup.textContent = source.group;
        this.dom.currentTitle.textContent = source.label;
        this.dom.currentMeta.textContent = source.meta || (source.readonly ? 'Readonly' : 'Editable');
        this.editor.setOptions({ readOnly: !!source.readonly });
        this.setEditorValue(source.read());
        this.updateDirty(false);
        this.renderDiff();
        this.updateStatusBar();
        this.renderTree();
    }

    async confirmUnsavedSourceChange(action = 'switch') {
        const actionText = action === 'close' ? 'closing the editor' : 'switching sources';
        const result = await Popup.show.confirm(
            'Unsaved changes',
            `Save changes before ${actionText}?`,
            {
                okButton: 'Save Changes',
                cancelButton: 'Cancel',
                customButtons: [{
                    text: 'Discard Changes',
                    result: POPUP_RESULT.CUSTOM1,
                    icon: 'fa-trash-can',
                    classes: ['redWarningBG'],
                }],
                defaultResult: POPUP_RESULT.AFFIRMATIVE,
            },
        );

        if (result === POPUP_RESULT.AFFIRMATIVE) return 'save';
        if (result === POPUP_RESULT.CUSTOM1) return 'discard';
        return 'cancel';
    }

    setEditorValue(value) {
        this.editor.setOptions({ value: String(value ?? '') });
        this.renderDiff();
        this.updateStatusBar();
    }

    setWordWrap(enabled) {
        localStorage.setItem(STORAGE.wordWrap, JSON.stringify(enabled));
        this.editor.setOptions({ wordWrap: enabled });
        this.oldEditor?.setOptions({ wordWrap: enabled });
        this.updateStatusBar();
    }

    cycleIndentMode() {
        const index = INDENT_MODES.findIndex(mode => mode.id === this.indentMode.id);
        this.indentMode = INDENT_MODES[(index + 1) % INDENT_MODES.length];
        localStorage.setItem(STORAGE.indentMode, this.indentMode.id);
        this.editor?.setOptions({
            insertSpaces: this.indentMode.insertSpaces,
            tabSize: this.indentMode.tabSize,
        });
        this.oldEditor?.setOptions({
            insertSpaces: this.indentMode.insertSpaces,
            tabSize: this.indentMode.tabSize,
        });
        this.updateStatusBar();
    }

    getCursorPosition() {
        const value = this.editor?.value ?? '';
        const position = this.editor?.textarea?.selectionStart ?? 0;
        const before = value.slice(0, position);
        const lines = before.split('\n');
        return {
            line: lines.length,
            column: lines.at(-1).length + 1,
        };
    }

    getEditorStats() {
        const value = this.editor?.value ?? '';
        const selectionStart = this.editor?.textarea?.selectionStart ?? 0;
        const selectionEnd = this.editor?.textarea?.selectionEnd ?? selectionStart;
        return {
            chars: value.length,
            lines: value.length ? value.split('\n').length : 1,
            selection: Math.abs(selectionEnd - selectionStart),
        };
    }

    updateStatusBar() {
        const wrapEnabled = JSON.parse(localStorage.getItem(STORAGE.wordWrap) || 'true');
        const stats = this.getEditorStats();
        if (this.dom.statusDirty) {
            this.dom.statusDirty.textContent = this.dirty ? 'Unsaved changes' : 'All changes saved';
            this.dom.statusDirty.classList.toggle('etle--statusDirty', this.dirty);
        }
        if (this.dom.statusSourceCount) {
            this.dom.statusSourceCount.textContent = `${this.sources.length} sources`;
        }
        if (this.dom.statusStats) {
            this.dom.statusStats.textContent = `${stats.lines.toLocaleString()} lines, ${stats.chars.toLocaleString()} chars`;
        }
        if (this.dom.statusCursor) {
            const cursor = this.getCursorPosition();
            this.dom.statusCursor.textContent = `Ln ${cursor.line}, Col ${cursor.column}`;
        }
        if (this.dom.statusSelection) {
            this.dom.statusSelection.textContent = stats.selection ? `${stats.selection.toLocaleString()} selected` : '';
            this.dom.statusSelection.hidden = !stats.selection;
        }
        if (this.dom.statusIndent) {
            this.dom.statusIndent.textContent = this.indentMode.label;
        }
        if (this.dom.statusWrap) {
            this.dom.statusWrap.textContent = wrapEnabled ? 'Wrap: On' : 'Wrap: Off';
            this.dom.statusWrap.classList.toggle('etle--statusActive', wrapEnabled);
        }
        if (this.dom.statusLanguage) {
            this.dom.statusLanguage.textContent = '.md';
        }
    }

    async apply() {
        await this.saveCurrentSource({ refresh: true, toast: true });
    }

    async saveCurrentSource({ refresh = true, toast = true } = {}) {
        if (!this.selectedSource || this.selectedSource.readonly) return;
        const value = this.editor.value;
        try {
            this.selectedSource.write(value);
            await this.selectedSource.save?.();
            this.updateDirty(false);
            if (refresh) await this.refreshSources(true);
            this.renderDiff();
            if (toast) globalThis.toastr?.success?.('Saved prompt text');
            return true;
        } catch (error) {
            console.error(`[${NAME}] Failed to save source`, error);
            globalThis.toastr?.error?.('Failed to save prompt text. See console for details.');
            return false;
        }
    }

    revert() {
        if (!this.selectedSource) return;
        this.setEditorValue(this.selectedSource.read());
        this.updateDirty(false);
        this.renderDiff();
    }

    toggleDiff() {
        this.diffOpen = !this.diffOpen;
        this.dom.root.classList.toggle('etle--showDiff', this.diffOpen);
        this.dom.diff.classList.toggle('etle--activeButton', this.diffOpen);
        this.renderDiff();
        this.editor.update();
        this.oldEditor?.update();
        requestAnimationFrame(() => this.syncDiffScroll());
    }

    renderDiff() {
        if (!this.oldEditor) return;
        const saved = this.selectedSource ? this.selectedSource.read() : '';
        const unsaved = this.editor?.value ?? '';
        this.oldEditor.setOptions({ value: saved || '' });
        requestAnimationFrame(() => this.highlightDiff(saved, unsaved));
    }

    highlightDiff(saved, unsaved) {
        const { oldMarks, newMarks } = getLineDiff(saved, unsaved);
        this.applyDiffMarks(this.oldEditor, oldMarks, 'removed');
        this.applyDiffMarks(this.editor, newMarks, 'added');
    }

    applyDiffMarks(editor, marks, activeMark) {
        if (!editor) return;
        const lines = [...editor.wrapper.querySelectorAll('.pce-line')];
        lines.forEach((line, index) => {
            line.classList.remove('etle--diffAdded', 'etle--diffRemoved');
            if (!this.diffOpen) return;
            if (marks[index] === activeMark) {
                line.classList.add(activeMark === 'added' ? 'etle--diffAdded' : 'etle--diffRemoved');
            }
        });
    }

    updateDirty(isDirty) {
        this.dirty = !!isDirty;
        this.dom.root?.classList.toggle('etle--dirty', this.dirty);
        this.setUnsavedLock(this.dirty);
        if (this.dom.diff) this.dom.diff.disabled = !this.selectedSource;
        if (this.dom.apply) this.dom.apply.disabled = !this.dirty || this.selectedSource?.readonly;
        if (this.dom.revert) this.dom.revert.disabled = !this.dirty;
        this.updateStatusBar();
    }

    async open() {
        await this.refreshSources(true);
        if (!this.dom.root.classList.contains('openDrawer')) {
            this.dom.toggle.click();
        }
        this.editor.update();
        this.editor.textarea.focus();
    }

    async close() {
        if (this.dirty) {
            const choice = await this.confirmUnsavedSourceChange('close');
            if (choice === 'cancel') return;
            if (choice === 'save') {
                const saved = await this.saveCurrentSource({ refresh: false, toast: true });
                if (!saved) return;
            }
            if (choice === 'discard') {
                this.updateDirty(false);
            }
        }
        if (this.dom.root.classList.contains('openDrawer')) {
            this.dom.toggle.click();
        }
    }

    startResize(event) {
        event.preventDefault();
        const startX = event.clientX;
        const startWidth = parseInt(getComputedStyle(this.dom.root).getPropertyValue('--etle-sidebar-width')) || 320;
        const onMove = (moveEvent) => {
            const width = Math.min(560, Math.max(220, startWidth + moveEvent.clientX - startX));
            this.dom.root.style.setProperty('--etle-sidebar-width', `${width}px`);
            localStorage.setItem(STORAGE.panelWidth, `${width}px`);
        };
        const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
    }
}

const init = () => {
    if (extension_settings.disabledExtensions.includes(`third-party/${NAME}`)) return;
    const app = new EveryTextLineEditor();
    app.inject().catch((error) => console.error(`[${NAME}] Failed to initialize`, error));
    window.EveryTextLineEditor = app;
};

init();
