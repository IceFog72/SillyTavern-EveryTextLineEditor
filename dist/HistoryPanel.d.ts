import { ChangedSource, HistoryCommit, TextSource } from './types.js';
export interface HistoryPanelDelegate {
    onDiffCommit(commit: HistoryCommit): void;
    onLoadCommit(commit: HistoryCommit): void;
    onInitialCommit(): void;
    onManualCommit(message: string, changedSources: ChangedSource[]): Promise<void>;
    onSelectCategory(groupName: string): void;
    onSelectSource(sourceId: string): void;
    onCompareChanged(change: ChangedSource): void;
}
export declare class HistoryPanel {
    private container;
    private delegate;
    constructor(container: HTMLElement, delegate: HistoryPanelDelegate);
    render(activeGroup: string, allGroups: string[], allSources: TextSource[], commits: HistoryCommit[], changedSources: ChangedSource[]): void;
    private groupCommits;
    private getVisibleSourceGroups;
    private renderFileRow;
    private getSourceKind;
    private createAutoMessage;
    private formatTime;
}
