export class HistoryPanel {
    container;
    delegate;
    constructor(container, delegate) {
        this.container = container;
        this.delegate = delegate;
    }
    render(activeGroup, allGroups, allSources, commits, changedSources) {
        this.container.innerHTML = '';
        const shell = document.createElement('div');
        shell.classList.add('etle--historyShell');
        this.container.append(shell);
        // 0. Category Navigator
        const nav = document.createElement('div');
        nav.classList.add('etle--historyNav');
        const select = document.createElement('select');
        select.classList.add('menu_button', 'etle--historySourceSelect');
        for (const group of allGroups) {
            const option = document.createElement('option');
            option.value = group;
            option.textContent = group;
            if (group === activeGroup)
                option.selected = true;
            select.append(option);
        }
        select.addEventListener('change', () => this.delegate.onSelectCategory(select.value));
        nav.append(select);
        shell.append(nav);
        // 1. Changes Section
        const changes = document.createElement('section');
        changes.classList.add('etle--historySection');
        changes.innerHTML = `
            <button type="button" class="etle--historySectionHeader">
                <span class="fa-solid fa-fw fa-chevron-down"></span>
                <span>Changes</span>
                <small>${changedSources.length}</small>
            </button>
            <textarea class="text_pole etle--commitMessage" placeholder="Message (optional)"></textarea>
            <button type="button" class="menu_button etle--commitButton" ${changedSources.length === 0 ? 'disabled' : ''}>
                <span class="fa-solid fa-fw fa-check"></span>
                <span>Commit</span>
            </button>
            <div class="etle--changeList"></div>
        `;
        shell.append(changes);
        const commitBtn = changes.querySelector('.etle--commitButton');
        const messageInput = changes.querySelector('.etle--commitMessage');
        commitBtn.addEventListener('click', async () => {
            const message = messageInput.value.trim();
            await this.delegate.onManualCommit(message, changedSources);
            messageInput.value = '';
        });
        const changeList = changes.querySelector('.etle--changeList');
        for (const { source, status } of changedSources) {
            const row = this.renderFileRow(source, status);
            row.addEventListener('click', () => this.delegate.onSelectSource(source.id));
            changeList.append(row);
        }
        // 2. History Section
        const commitGroups = this.groupCommits(commits);
        const history = document.createElement('section');
        history.classList.add('etle--historySection', 'etle--graphSection');
        history.innerHTML = `
            <button type="button" class="etle--historySectionHeader">
                <span class="fa-solid fa-fw fa-chevron-down"></span>
                <span>History</span>
                <small>${commitGroups.length}</small>
            </button>
            <div class="etle--commitTree"></div>
        `;
        shell.append(history);
        const tree = history.querySelector('.etle--commitTree');
        if (commits.length === 0) {
            const empty = document.createElement('div');
            empty.classList.add('etle--empty');
            empty.style.padding = '1rem';
            const btn = document.createElement('button');
            btn.classList.add('menu_button', 'etle--initialCommitBtn');
            btn.type = 'button';
            btn.innerHTML = '<i class="fa-solid fa-code-commit"></i> Create Initial Commit';
            btn.addEventListener('click', () => this.delegate.onInitialCommit());
            empty.append(btn);
            tree.append(empty);
        }
        else {
            for (const group of commitGroups) {
                const item = document.createElement('details');
                item.classList.add('etle--commitItem');
                item.open = true;
                const summary = document.createElement('summary');
                summary.classList.add('etle--commitRow');
                const chevron = document.createElement('span');
                chevron.classList.add('fa-solid', 'fa-fw', 'fa-chevron-right', 'etle--commitChevron');
                const title = document.createElement('span');
                title.classList.add('etle--commitTitle');
                title.textContent = group.title;
                const time = document.createElement('small');
                time.textContent = this.formatTime(group.createdAt);
                summary.append(chevron, title, time);
                const files = document.createElement('div');
                files.classList.add('etle--commitFiles');
                for (const commit of group.commits) {
                    const source = allSources.find(s => s.id === commit.sourceId) || { label: commit.sourceLabel, group: commit.sourceGroup };
                    const fileRow = this.renderFileRow(source, commit.parentId ? 'M' : 'A', commit);
                    files.append(fileRow);
                }
                item.append(summary, files);
                tree.append(item);
            }
        }
    }
    groupCommits(commits) {
        const groups = new Map();
        for (const commit of commits) {
            const key = commit.meta?.batchId || [
                commit.reason,
                commit.meta?.message || '',
                Math.floor(commit.createdAt / 2000),
            ].join(':');
            const existing = groups.get(key);
            if (existing) {
                existing.commits.push(commit);
                existing.createdAt = Math.max(existing.createdAt, commit.createdAt);
                continue;
            }
            groups.set(key, {
                id: key,
                title: commit.meta?.message || (commit.reason.toUpperCase() + (commit.parentId ? '' : ' (Baseline)')),
                createdAt: commit.createdAt,
                reason: commit.reason,
                commits: [commit],
            });
        }
        return [...groups.values()].sort((a, b) => b.createdAt - a.createdAt);
    }
    renderFileRow(source, status, commit) {
        const row = document.createElement('div');
        row.classList.add('etle--historyRow');
        const kind = document.createElement('span');
        kind.classList.add('etle--fileKind');
        kind.textContent = this.getSourceKind(source);
        const name = document.createElement('span');
        name.classList.add('etle--fileName');
        name.textContent = source.label;
        const group = document.createElement('small');
        group.textContent = source.group;
        const actions = document.createElement('span');
        actions.classList.add('etle--historyActions');
        if (commit) {
            const diffBtn = document.createElement('span');
            diffBtn.classList.add('fa-solid', 'fa-fw', 'fa-code-compare');
            diffBtn.title = 'Diff';
            diffBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.delegate.onDiffCommit(commit);
            });
            const loadBtn = document.createElement('span');
            loadBtn.classList.add('fa-solid', 'fa-fw', 'fa-rotate-left');
            loadBtn.title = 'Load';
            loadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.delegate.onLoadCommit(commit);
            });
            actions.append(diffBtn, loadBtn);
        }
        const statusEl = document.createElement('span');
        statusEl.classList.add('etle--fileStatus');
        statusEl.textContent = status;
        row.append(kind, name, group, actions, statusEl);
        return row;
    }
    getSourceKind(source) {
        if (source.group.includes('World'))
            return 'WI';
        if (source.group.includes('Persona'))
            return 'P';
        if (source.group.includes('Instruct'))
            return 'IN';
        if (source.group.includes('Context'))
            return 'C';
        return 'T';
    }
    formatTime(timestamp) {
        const diff = Date.now() - timestamp;
        if (diff < 60000)
            return 'just now';
        if (diff < 3600000)
            return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000)
            return `${Math.floor(diff / 3600000)}h ago`;
        return new Date(timestamp).toLocaleDateString();
    }
}
//# sourceMappingURL=HistoryPanel.js.map