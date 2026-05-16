import { HistoryCommit, HistorySource, TextSource } from './types.js';
export declare class HistoryStore {
    private db;
    open(): Promise<void>;
    commit(source: TextSource, content: string, reason: HistoryCommit['reason'], message?: string, batchId?: string): Promise<HistoryCommit | null>;
    listCommits(sourceId: string, limit?: number): Promise<HistoryCommit[]>;
    getCommit(id: string): Promise<HistoryCommit | null>;
    pruneSource(sourceId: string, keepCount: number): Promise<number>;
    getLatestSource(sourceId: string): Promise<HistorySource | null>;
    hashContent(content: string): Promise<string>;
}
