import { NAME } from './constants.js';
import { setCollapsedGroups } from './SourceManager.js';
import { DomRefs, Language, TextSource } from './types.js';

export const isLorebookGroup = (group: string): boolean => group.startsWith('World/Lorebook: ');

const getLorebookName = (group: string): string => group.replace(/^World\/Lorebook: /, '');

interface SourcePanelHost {
    dom: DomRefs;
    sources: TextSource[];
    selectedSource: TextSource | null;
    trackedSourceGroups: Set<string>;
    collapsedGroups: Set<string>;
    getTrackedSources(): TextSource[];
    getLanguageForSource(source?: TextSource | null): Language;
    toggleSource(source: TextSource): Promise<void>;
    selectSource(id: string, options?: { force?: boolean }): Promise<void>;
    setTrackedSourceGroups(groups: string[]): Promise<void>;
    makeTextButton(label: string, icon: string, onClick: () => void): HTMLButtonElement;
}

export function renderSourceTree(host: SourcePanelHost) {
    host.dom.tree.innerHTML = '';
    const groups = new Map<string, { label: string; branchName: string; sources: TextSource[] }>();
    const trackedSources = host.getTrackedSources();
    for (const source of trackedSources) {
        const treeGroup = getTreeGroupForSource(source);
        if (!groups.has(treeGroup.key)) {
            groups.set(treeGroup.key, {
                label: treeGroup.label,
                branchName: treeGroup.branchName,
                sources: [],
            });
        }
        groups.get(treeGroup.key)?.sources.push(source);
    }

    if (!groups.size) {
        const empty = document.createElement('div');
        empty.classList.add('etle--empty');
        empty.textContent = host.sources.length
            ? 'No source categories selected. Click Control to choose what appears here.'
            : 'No sources available';
        host.dom.tree.append(empty);
        return;
    }

    for (const [group, treeGroup] of groups) {
        const { label, branchName, sources } = treeGroup;
        const section = document.createElement('section');
        section.classList.add('etle--group');
        if (host.collapsedGroups.has(group)) section.classList.add('etle--collapsed');

        const header = document.createElement('button');
        header.type = 'button';
        header.classList.add('etle--groupHeader');
        header.innerHTML = `<span class="fa-solid fa-fw fa-chevron-down"></span><span></span><small></small>`;
        header.children[1].textContent = label;
        header.children[2].textContent = String(sources.length);
        header.addEventListener('click', () => {
            if (host.collapsedGroups.has(group)) host.collapsedGroups.delete(group);
            else host.collapsedGroups.add(group);
            setCollapsedGroups(host.collapsedGroups);
            renderSourceTree(host);
        });
        section.append(header);

        if (branchName) {
            const branchLine = document.createElement('div');
            branchLine.classList.add('etle--groupBranch');
            branchLine.textContent = branchName;
            branchLine.title = branchName;
            section.append(branchLine);
        }

        section.append(renderSourceList(host, sources));
        host.dom.tree.append(section);
    }
}

export function openSourceControlDialog(host: SourcePanelHost) {
    const sourceGroups = new Map<string, number>();
    for (const source of host.sources) {
        sourceGroups.set(source.group, (sourceGroups.get(source.group) ?? 0) + 1);
    }
    const availableGroups = [...sourceGroups.entries()];
    const dialog = document.createElement('dialog');
    dialog.classList.add('etle--sourceDialog');

    const shell = document.createElement('form');
    shell.method = 'dialog';
    shell.classList.add('etle--sourceDialogShell');

    const title = document.createElement('h3');
    title.textContent = 'Source Categories';
    shell.append(title);

    const list = document.createElement('div');
    list.classList.add('etle--sourceDialogList');
    shell.append(list);

    if (!availableGroups.length) {
        const empty = document.createElement('div');
        empty.classList.add('etle--empty');
        empty.textContent = 'No sources available.';
        list.append(empty);
    } else {
        const categories = availableGroups.filter(([group]) => !isLorebookGroup(group));
        const lorebooks = availableGroups.filter(([group]) => isLorebookGroup(group));
        appendSourceControlRows(host, list, 'Categories', categories, (group, count) => `${group} (${count})`);
        appendSourceControlRows(host, list, 'Lorebooks', lorebooks, (group, count) => `${getLorebookName(group)} (${count})`);
    }

    const actions = document.createElement('div');
    actions.classList.add('etle--sourceDialogActions');
    const cancel = host.makeTextButton('Cancel', 'fa-xmark', () => dialog.close());
    cancel.value = 'cancel';
    const add = host.makeTextButton('Apply', 'fa-check', () => {
        const selected = [...dialog.querySelectorAll<HTMLInputElement>('input[type="checkbox"]:checked')].map(input => input.value);
        host.setTrackedSourceGroups(selected).catch((error) => console.error(`[${NAME}] Failed to update source categories`, error));
        dialog.close();
    });
    add.disabled = !availableGroups.length;
    actions.append(cancel, add);
    shell.append(actions);

    dialog.append(shell);
    document.body.append(dialog);
    dialog.addEventListener('close', () => dialog.remove(), { once: true });
    dialog.showModal();
}

function renderSourceList(host: SourcePanelHost, sources: TextSource[]) {
    const list = document.createElement('div');
    list.classList.add('etle--sourceList');
    let previousSourceGroup = '';
    for (const source of sources) {
        if (source.group !== previousSourceGroup) {
            previousSourceGroup = source.group;
            const subgroup = document.createElement('div');
            subgroup.classList.add('etle--sourceSubgroup');
            subgroup.textContent = source.group;
            list.append(subgroup);
        }
        list.append(renderSourceRow(host, source));
    }
    return list;
}

function renderSourceRow(host: SourcePanelHost, source: TextSource) {
    const item = document.createElement('div');
    item.classList.add('etle--source');
    item.dataset.sourceId = source.id;
    if (host.selectedSource?.id === source.id) item.classList.add('etle--active');
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
            await host.toggleSource(source);
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
    select.innerHTML = '<span class="etle--sourceLang"></span><span></span>';
    const lang = host.getLanguageForSource(source);
    select.children[0].textContent = lang.label;
    select.children[0].setAttribute('title', `${lang.label} syntax`);
    select.children[1].textContent = source.label;
    item.title = source.label;
    select.addEventListener('click', () => host.selectSource(source.id).catch((error) => console.error(`[${NAME}] Failed to select source`, error)));
    item.append(select);
    return item;
}

function appendSourceControlRows(
    host: SourcePanelHost,
    list: HTMLElement,
    title: string,
    groups: Array<[string, number]>,
    formatLabel: (group: string, count: number) => string,
) {
    if (!groups.length) return;
    const groupTitle = document.createElement('div');
    groupTitle.classList.add('etle--sourceDialogGroup');
    groupTitle.textContent = title;
    list.append(groupTitle);
    for (const [group, count] of groups) {
        const row = document.createElement('label');
        row.classList.add('etle--sourceDialogRow');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = group;
        checkbox.checked = host.trackedSourceGroups.has(group);
        const text = document.createElement('span');
        text.textContent = formatLabel(group, count);
        row.append(checkbox, text);
        list.append(row);
    }
}

function getTreeGroupForSource(source: TextSource) {
    const branchName = source.branchManager?.getCurrentBranch?.() ?? '';
    if (!branchName) {
        return {
            key: source.group,
            label: source.group,
            branchName: '',
        };
    }

    const scopeLabel = getTreeBranchScopeLabel(source);
    return {
        key: `${scopeLabel}:${branchName}`,
        label: scopeLabel,
        branchName,
    };
}

function getTreeBranchScopeLabel(source: TextSource) {
    if (source.group.includes('Chat Completion')
        || source.group.includes('Utility')
        || source.group.includes('Formatting')
        || source.group.includes('Custom OpenAI')) {
        return 'Chat Completion Preset';
    }
    if (source.group.includes('Text Completion')) return 'Text Completion Preset';
    if (source.group.includes('Power User Context')) return 'Context Template';
    if (source.group.includes('Power User Instruct')) return 'Instruct Template';
    if (source.group.includes('System Prompt')) return 'System Prompt Preset';
    if (source.group.includes('Connection Profiles')) return 'Connection Profile';
    return source.group;
}
