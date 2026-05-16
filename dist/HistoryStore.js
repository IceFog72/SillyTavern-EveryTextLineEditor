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
                    commits.createIndex('sourceId', 'sourceId', { unique: false });
                    commits.createIndex('createdAt', 'createdAt', { unique: false });
                    commits.createIndex('sourceId_createdAt', ['sourceId', 'createdAt'], { unique: false });
                }
                if (!db.objectStoreNames.contains('sources')) {
                    db.createObjectStore('sources', { keyPath: 'sourceId' });
                }
            };
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }
    async commit(source, content, reason, message, batchId) {
        if (!this.db || source.readonly)
            return null;
        const hash = await this.hashContent(content);
        const sourceId = source.id;
        // Check for duplicates
        const latestSource = await this.getLatestSource(sourceId);
        if (latestSource?.latestHash === hash) {
            return null;
        }
        const commit = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            sourceId,
            sourceLabel: source.label,
            sourceGroup: source.group,
            createdAt: Date.now(),
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
            sourceId,
            latestCommitId: commit.id,
            latestHash: hash,
            updatedAt: commit.createdAt,
            label: source.label,
            group: source.group,
        };
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['commits', 'sources'], 'readwrite');
            transaction.objectStore('commits').add(commit);
            transaction.objectStore('sources').put(historySource);
            transaction.oncomplete = () => {
                this.pruneSource(sourceId, 100).catch(err => console.error('[HistoryStore] Prune failed', err));
                resolve(commit);
            };
            transaction.onerror = () => reject(transaction.error);
        });
    }
    async listCommits(sourceId, limit = 100) {
        if (!this.db)
            return [];
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction('commits', 'readonly');
            const store = transaction.objectStore('commits');
            const index = store.index('sourceId_createdAt');
            // Range from [sourceId, 0] to [sourceId, Date.now()] in reverse
            const range = IDBKeyRange.bound([sourceId, 0], [sourceId, Date.now()]);
            const request = index.openCursor(range, 'prev');
            const results = [];
            request.onsuccess = () => {
                const cursor = request.result;
                if (cursor && results.length < limit) {
                    results.push(cursor.value);
                    cursor.continue();
                }
                else {
                    resolve(results);
                }
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
    async pruneSource(sourceId, keepCount) {
        if (!this.db)
            return 0;
        const commits = await this.listCommits(sourceId, 500); // Get a larger sample to prune
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
    async getLatestSource(sourceId) {
        if (!this.db)
            return null;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction('sources', 'readonly');
            const request = transaction.objectStore('sources').get(sourceId);
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }
    async hashContent(content) {
        try {
            const msgBuffer = new TextEncoder().encode(content);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }
        catch (err) {
            // Fallback to simple hash if crypto is unavailable
            let hash = 0;
            for (let i = 0; i < content.length; i++) {
                const char = content.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash |= 0;
            }
            return `fallback-${hash}`;
        }
    }
}
//# sourceMappingURL=HistoryStore.js.map