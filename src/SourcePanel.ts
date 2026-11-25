import { NAME } from './constants.js';
import { discoverExtensionTextFields, setCollapsedGroups } from './SourceManager.js';
import { getCustomExtensionFields, isHideNonEditableSourcesEnabled } from './settings.js';
import { CustomExtensionField, DomRefs, Language, TextSource } from './types.js';

export const isLorebookGroup = (group: string): boolean => group.startsWith('World/Lorebook: ');
export const isCardGroup = (group: string): boolean => group === 'Current Card' || group.startsWith('Character Card: ');
const getCardName = (group: string): string => group === 'Current Card' ? 'Current Card' : group.replace(/^Character Card: /, '');

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
    setCustomExtensionFields(fields: CustomExtensionField[], selectedGroups: string[]): Promise<void>;
    makeTextButton(label: string, icon: string, onClick: () => void): HTMLButtonElement;
}

export function renderSourceTree(host: SourcePanelHost) {
    host.dom.tree.innerHTML = '';
    const groups = new Map<string, { label: string; branchName: string; sources: TextSource[] }>();
    const query = String(host.dom.sourceSearch?.value ?? '').trim().toLowerCase();
    const hideNonEditable = isHideNonEditableSourcesEnabled();
    const trackedSources = host.getTrackedSources().filter(source => {
        if (hideNonEditable && (source.readonly || source.selectable === false || source.placeholder)) return false;
        if (!query) return true;
        return [source.label, source.group, source.meta ?? '', source.id]
            .some(value => String(value).toLowerCase().includes(query));
    });
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
            ? query
                ? 'No sources match the filter.'
                : 'No source categories selected. Click Control to choose what appears here.'
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

    const header = document.createElement('div');
    header.classList.add('etle--sourceDialogHeader');
    const title = document.createElement('h3');
    title.textContent = 'Source Categories';
    const toggleSelected = document.createElement('button');
    toggleSelected.type = 'button';
    toggleSelected.classList.add('etle--sourceDialogToggle', 'fa-solid', 'fa-fw', 'fa-eye');
    toggleSelected.title = 'Show only selected';
    let showOnlySelected = false;
    toggleSelected.addEventListener('click', (e) => {
        e.preventDefault();
        showOnlySelected = !showOnlySelected;
        toggleSelected.classList.toggle('fa-eye');
        toggleSelected.classList.toggle('fa-eye-slash');
        toggleSelected.classList.toggle('etle--active');
        applySourceControlFilters(dialog, showOnlySelected);
    });
    header.append(title, toggleSelected);
    shell.append(header);

    const columns = document.createElement('div');
    columns.classList.add('etle--sourceDialogColumns');
    shell.append(columns);

    const categories = availableGroups.filter(([group]) => !isLorebookGroup(group) && !isCardGroup(group));
    const lorebooks = availableGroups.filter(([group]) => isLorebookGroup(group));
    const cards = availableGroups.filter(([group]) => isCardGroup(group));
    appendSourceControlColumn(host, columns, 'Categories', categories, (group, count) => `${group} (${count})`, false, () => applySourceControlFilters(dialog, showOnlySelected));
    appendSourceControlColumn(host, columns, 'Lorebooks', lorebooks, (group, count) => `${getLorebookName(group)} (${count})`, true, () => applySourceControlFilters(dialog, showOnlySelected));
    appendSourceControlColumn(host, columns, 'Cards', cards, (group, count) => `${getCardName(group)} (${count})`, true, () => applySourceControlFilters(dialog, showOnlySelected), cards.some(([group]) => group === 'Current Card') ? ['Current Card'] : []);
    appendExtensionFieldsColumn(columns, () => applySourceControlFilters(dialog, showOnlySelected));
    applySourceControlFilters(dialog, showOnlySelected);

    const actions = document.createElement('div');
    actions.classList.add('etle--sourceDialogActions');
    const cancel = host.makeTextButton('Cancel', 'fa-xmark', () => dialog.close());
    cancel.value = 'cancel';
    const add = host.makeTextButton('Apply', 'fa-check', () => {
        const selectedGroups = [...dialog.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-kind="group"]:checked')].map(input => input.value);
        const selectedExtFields: CustomExtensionField[] = [...dialog.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-kind="ext-field"]:checked')].map(input => ({
            selector: input.dataset.extSelector ?? '',
            label: input.dataset.extLabel ?? '',
            group: input.dataset.extGroup ?? 'Extension Fields',
        })).filter(field => Boolean(field.selector));
        host.setCustomExtensionFields(selectedExtFields, selectedGroups)
            .catch((error) => console.error(`[${NAME}] Failed to update source categories`, error));
        dialog.close();
    });
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
            subgroup.textContent = source.group === 'Current Card'
                ? source.displayGroup ?? source.group
                : source.group;
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
    if (source.enabled === false) item.classList.add('etle--disabled');

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

function appendSourceControlColumn(
    host: SourcePanelHost,
    columns: HTMLElement,
    title: string,
    groups: Array<[string, number]>,
    formatLabel: (group: string, count: number) => string,
    searchable = false,
    onFilter?: () => void,
    pinnedGroups: string[] = [],
) {
    const column = document.createElement('section');
    column.classList.add('etle--sourceDialogColumn');
    const groupTitle = document.createElement('div');
    groupTitle.classList.add('etle--sourceDialogGroup');
    groupTitle.textContent = title;
    column.append(groupTitle);
    const pinnedSet = new Set(pinnedGroups);
    const pinnedRows = groups.filter(([group]) => pinnedSet.has(group));
    for (const [group, count] of pinnedRows) {
        column.append(renderSourceControlRow(host, group, count, (itemGroup, itemCount) => `Current Card: ${getCardName(itemGroup)} (${itemCount})`, true));
    }
    if (searchable) {
        const search = document.createElement('input');
        search.type = 'search';
        search.placeholder = `Search ${title.toLowerCase()}`;
        search.classList.add('etle--sourceDialogSearch');
        search.addEventListener('input', () => onFilter?.());
        column.append(search);
    }
    if (!groups.length) {
        const empty = document.createElement('div');
        empty.classList.add('etle--empty');
        empty.textContent = 'None available.';
        column.append(empty);
        columns.append(column);
        return;
    }
    for (const [group, count] of groups) {
        if (pinnedSet.has(group)) continue;
        column.append(renderSourceControlRow(host, group, count, formatLabel));
    }
    columns.append(column);
}

function renderSourceControlRow(
    host: SourcePanelHost,
    group: string,
    count: number,
    formatLabel: (group: string, count: number) => string,
    pinned = false,
) {
    const row = document.createElement('label');
    row.classList.add('etle--sourceDialogRow');
    if (pinned) row.classList.add('etle--sourceDialogPinnedRow');
    row.dataset.filterText = `${group} ${formatLabel(group, count)}`.toLowerCase();
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.kind = 'group';
    checkbox.value = group;
    checkbox.checked = host.trackedSourceGroups.has(group);
    const text = document.createElement('span');
    text.textContent = formatLabel(group, count);
    row.append(checkbox, text);
    return row;
}

function appendExtensionFieldsColumn(columns: HTMLElement, onFilter: () => void) {
    const column = document.createElement('section');
    column.classList.add('etle--sourceDialogColumn');

    const groupTitle = document.createElement('div');
    groupTitle.classList.add('etle--sourceDialogGroup');
    groupTitle.textContent = 'Extension Fields';
    column.append(groupTitle);

    const search = document.createElement('input');
    search.type = 'search';
    search.placeholder = 'Search extension fields';
    search.classList.add('etle--sourceDialogSearch');
    search.addEventListener('input', () => onFilter());
    column.append(search);

    const saved = getCustomExtensionFields();
    const savedBySelector = new Map(saved.map(item => [item.selector, item]));
    const discovered = discoverExtensionTextFields();
    const merged = new Map<string, CustomExtensionField>();
    for (const item of discovered) merged.set(item.selector, item);
    for (const item of saved) {
        if (!merged.has(item.selector)) merged.set(item.selector, item);
    }

    const addRow = (field: CustomExtensionField, checked: boolean) => {
        const row = document.createElement('label');
        row.classList.add('etle--sourceDialogRow');
        const extName = field.group.replace(/^Extension:\s*/, '');
        const display = `${extName}: ${field.label}`;
        row.dataset.filterText = `${display} ${field.selector}`.toLowerCase();
        row.title = field.selector;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.kind = 'ext-field';
        checkbox.dataset.extSelector = field.selector;
        checkbox.dataset.extLabel = field.label;
        checkbox.dataset.extGroup = field.group;
        checkbox.checked = checked;
        const text = document.createElement('span');
        text.textContent = display;
        row.append(checkbox, text);
        return row;
    };

    const listWrap = document.createElement('div');
    listWrap.classList.add('etle--extFieldList');
    for (const field of merged.values()) {
        listWrap.append(addRow(field, savedBySelector.has(field.selector)));
    }
    column.append(listWrap);

    const customForm = document.createElement('div');
    customForm.classList.add('etle--extFieldCustom');
    const selectorInput = document.createElement('input');
    selectorInput.type = 'text';
    selectorInput.classList.add('text_pole');
    selectorInput.placeholder = '#selector (e.g. #memory_contents)';
    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.classList.add('text_pole');
    labelInput.placeholder = 'Label (optional)';
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.classList.add('menu_button', 'fa-solid', 'fa-fw', 'fa-plus');
    addBtn.title = 'Add custom CSS selector field';
    addBtn.addEventListener('click', () => {
        const selector = selectorInput.value.trim();
        if (!selector) return;
        const label = labelInput.value.trim() || selector;
        const existing = listWrap.querySelector<HTMLInputElement>(`input[data-ext-selector="${CSS.escape(selector)}"]`);
        if (existing) {
            existing.checked = true;
        } else {
            listWrap.prepend(addRow({ selector, label, group: 'Extension Fields' }, true));
        }
        selectorInput.value = '';
        labelInput.value = '';
        onFilter();
    });
    customForm.append(selectorInput, labelInput, addBtn);
    column.append(customForm);

    columns.append(column);
}

function applySourceControlFilters(dialog: HTMLDialogElement, showOnlySelected: boolean) {
    dialog.querySelectorAll<HTMLElement>('.etle--sourceDialogColumn').forEach(column => {
        const query = column.querySelector<HTMLInputElement>('.etle--sourceDialogSearch')?.value.trim().toLowerCase() ?? '';
        let visible = 0;

        column.querySelectorAll<HTMLElement>('.etle--sourceDialogRow').forEach(row => {
            const checkbox = row.querySelector<HTMLInputElement>('input[type="checkbox"]');
            const isPinned = row.classList.contains('etle--sourceDialogPinnedRow');
            const matchesSearch = isPinned || !query || String(row.dataset.filterText ?? '').includes(query);
            const matchesSelected = !showOnlySelected || !!checkbox?.checked;
            const show = matchesSearch && matchesSelected;
            row.hidden = !show;
            if (show) visible++;
        });

        let empty = column.querySelector<HTMLElement>('.etle--sourceDialogEmptyFilter');
        if (!empty) {
            empty = document.createElement('div');
            empty.classList.add('etle--empty', 'etle--sourceDialogEmptyFilter');
            empty.textContent = 'No matches.';
            column.append(empty);
        }
        empty.hidden = !!visible;
        column.classList.toggle('etle--sourceDialogColumnEmpty', !visible);
    });
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
