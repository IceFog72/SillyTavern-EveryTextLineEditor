import { DB } from './constants.js';
export class HistoryStore {
    db = null;
    async open() {
        if (this.db)
            return;
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB.NAME, DB.VERSION);
            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains('commits')) {
                    const commits = db.createObjectStore('commits', { keyPath: 'id' });
                    this.createCommitIndexes(commits);
                }
                else {
                    this.ensureCommitIndexes(request.transaction.objectStore('commits'));
                }
                if (db.objectStoreNames.contains('sources')) {
                    db.deleteObjectStore('sources');
                }
                const sources = db.createObjectStore('sources', { keyPath: 'sourceKey' });
                sources.createIndex('scopeId', 'scopeId', { unique: false });
                sources.createIndex('source_scope', ['sourceId', 'scopeId'], { unique: true });
            };
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }
    async commit(source, content, reason, message, batchId, scope) {
        if (!this.db || source.readonly)
            return null;
        const hash = await this.hashContent(content);
        const latestSource = await this.getLatestSource(source.id, scope.scopeId);
        if (latestSource?.latestHash === hash)
            return null;
        const createdAt = Date.now();
        const commit = {
            id: `${createdAt}-${Math.random().toString(36).slice(2, 9)}`,
            sourceId: source.id,
            sourceLabel: source.label,
            sourceGroup: source.group,
            scopeId: scope.scopeId,
            scopeType: scope.scopeType,
            scopeLabel: scope.scopeLabel,
            createdAt,
            parentId: latestSource?.latestCommitId ?? null,
            reason,
            content,
            hash,
            meta: {
                app: 'SillyTavern',
                sourceMeta: source.meta,
                message,
                batchId,
            },
        };
        const historySource = {
            sourceKey: this.getSourceKey(source.id, scope.scopeId),
            sourceId: source.id,
            scopeId: scope.scopeId,
            scopeType: scope.scopeType,
            scopeLabel: scope.scopeLabel,
            latestCommitId: commit.id,
            latestHash: hash,
            updatedAt: createdAt,
            label: source.label,
            group: source.group,
        };
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['commits', 'sources'], 'readwrite');
            transaction.objectStore('commits').add(commit);
            transaction.objectStore('sources').put(historySource);
            transaction.oncomplete = () => {
                this.pruneSource(source.id, scope.scopeId, 100).catch(err => console.error('[HistoryStore] Prune failed', err));
                resolve(commit);
            };
            transaction.onerror = () => reject(transaction.error);
        });
    }
    async listCommits(sourceId, scopeId, limit = 100) {
        if (!this.db)
            return [];
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction('commits', 'readonly');
            const index = transaction.objectStore('commits').index('source_scope_createdAt');
            const range = IDBKeyRange.bound([sourceId, scopeId, 0], [sourceId, scopeId, Date.now()]);
            const request = index.openCursor(range, 'prev');
            const results = [];
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor && results.length < limit) {
                    results.push(cursor.value);
                    cursor.continue();
                    return;
                }
                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    }
    async listCommitsByScope(scopeId, limit = 200) {
        if (!this.db)
            return [];
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction('commits', 'readonly');
            const index = transaction.objectStore('commits').index('scope_createdAt');
            const range = IDBKeyRange.bound([scopeId, 0], [scopeId, Date.now()]);
            const request = index.openCursor(range, 'prev');
            const results = [];
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor && results.length < limit) {
                    results.push(cursor.value);
                    cursor.continue();
                    return;
                }
                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    }
    async getCommit(id) {
        if (!this.db)
            return null;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction('commits', 'readonly');
            const request = transaction.objectStore('commits').get(id);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }
    async pruneSource(sourceId, scopeId, keepCount) {
        if (!this.db)
            return 0;
        const commits = await this.listCommits(sourceId, scopeId, 500);
        if (commits.length <= keepCount)
            return 0;
        const toDelete = commits.slice(keepCount);
        const transaction = this.db.transaction('commits', 'readwrite');
        const store = transaction.objectStore('commits');
        toDelete.forEach(commit => store.delete(commit.id));
        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve(toDelete.length);
            transaction.onerror = () => reject(transaction.error);
        });
    }
    async getLatestSource(sourceId, scopeId) {
        if (!this.db)
            return null;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction('sources', 'readonly');
            const request = transaction.objectStore('sources').get(this.getSourceKey(sourceId, scopeId));
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }
    async exportAll() {
        if (!this.db)
            return { commits: [], sources: [] };
        const [commits, sources] = await Promise.all([
            this.getAllFromStore('commits'),
            this.getAllFromStore('sources'),
        ]);
        return { commits, sources };
    }
    async clearAll() {
        if (!this.db)
            return;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['commits', 'sources'], 'readwrite');
            transaction.objectStore('commits').clear();
            transaction.objectStore('sources').clear();
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }
    async hashContent(content) {
        try {
            const msgBuffer = new TextEncoder().encode(content);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }
        catch {
            let hash = 0;
            for (let index = 0; index < content.length; index++) {
                hash = ((hash << 5) - hash) + content.charCodeAt(index);
                hash |= 0;
            }
            return `fallback-${hash}`;
        }
    }
    async getAllFromStore(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeName, 'readonly');
            const request = transaction.objectStore(storeName).getAll();
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    }
    getSourceKey(sourceId, scopeId) {
        return `${scopeId}::${sourceId}`;
    }
    createCommitIndexes(commits) {
        commits.createIndex('sourceId', 'sourceId', { unique: false });
        commits.createIndex('scopeId', 'scopeId', { unique: false });
        commits.createIndex('batchId', 'meta.batchId', { unique: false });
        commits.createIndex('createdAt', 'createdAt', { unique: false });
        commits.createIndex('sourceId_createdAt', ['sourceId', 'createdAt'], { unique: false });
        commits.createIndex('source_scope_createdAt', ['sourceId', 'scopeId', 'createdAt'], { unique: false });
        commits.createIndex('scope_createdAt', ['scopeId', 'createdAt'], { unique: false });
    }
    ensureCommitIndexes(commits) {
        const ensure = (name, keyPath) => {
            if (!commits.indexNames.contains(name))
                commits.createIndex(name, keyPath, { unique: false });
        };
        ensure('sourceId', 'sourceId');
        ensure('scopeId', 'scopeId');
        ensure('batchId', 'meta.batchId');
        ensure('createdAt', 'createdAt');
        ensure('sourceId_createdAt', ['sourceId', 'createdAt']);
        ensure('source_scope_createdAt', ['sourceId', 'scopeId', 'createdAt']);
        ensure('scope_createdAt', ['scopeId', 'createdAt']);
    }
}
//# sourceMappingURL=HistoryStore.js.map