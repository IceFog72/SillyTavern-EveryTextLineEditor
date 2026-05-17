import { HistoryCommit, HistoryScope, HistorySource, TextSource } from './types.js';
export declare class HistoryStore {
    private db;
    open(): Promise<void>;
    commit(source: TextSource, content: string, reason: HistoryCommit['reason'], message: string | undefined, batchId: string, scope: HistoryScope): Promise<HistoryCommit | null>;
    listCommits(sourceId: string, scopeId: string, limit?: number): Promise<HistoryCommit[]>;
    listCommitsByScope(scopeId: string, limit?: number): Promise<HistoryCommit[]>;
    getCommit(id: string): Promise<HistoryCommit | null>;
    pruneSource(sourceId: string, scopeId: string, keepCount: number): Promise<number>;
    getLatestSource(sourceId: string, scopeId: string): Promise<HistorySource | null>;
    exportAll(): Promise<{
        commits: HistoryCommit[];
        sources: HistorySource[];
    }>;
    clearAll(): Promise<void>;
    hashContent(content: string): Promise<string>;
    private getAllFromStore;
    private getSourceKey;
    private createCommitIndexes;
    private ensureCommitIndexes;
}
