export declare const NAME: string;
export declare const STORAGE: {
    selectedSource: string;
    wordWrap: string;
    spellCheck: string;
    monacoMinimap: string;
    panelWidth: string;
    sidebarCollapsed: string;
    collapsedGroups: string;
    indentMode: string;
    scrollSync: string;
    editorEngine: string;
    sourceLanguages: string;
    trackedSources: string;
};
export declare const DB: {
    readonly NAME: `${string}:history`;
    readonly VERSION: 2;
};
export declare const INDENT_MODES: readonly [{
    readonly id: "tabs";
    readonly label: "Tabs: 4";
    readonly insertSpaces: false;
    readonly tabSize: 4;
}, {
    readonly id: "spaces2";
    readonly label: "Spaces: 2";
    readonly insertSpaces: true;
    readonly tabSize: 2;
}, {
    readonly id: "spaces4";
    readonly label: "Spaces: 4";
    readonly insertSpaces: true;
    readonly tabSize: 4;
}];
export declare const LANGUAGES: readonly [{
    readonly id: "markdown";
    readonly label: ".md";
}, {
    readonly id: "json";
    readonly label: ".json";
}, {
    readonly id: "yaml";
    readonly label: ".yaml";
}, {
    readonly id: "text";
    readonly label: "text";
}];
export declare const SYNC_MODES: readonly [{
    readonly id: "off";
    readonly label: "Sync: Off";
}, {
    readonly id: "line";
    readonly label: "Sync: Line";
}, {
    readonly id: "ratio";
    readonly label: "Sync: Ratio";
}];
export declare const EDITOR_ENGINES: readonly [{
    readonly id: "prism";
    readonly label: "Prism";
}, {
    readonly id: "monaco";
    readonly label: "Monaco";
}];
export declare const GENERATION_TRIGGERS: readonly [{
    readonly id: "normal";
    readonly label: "Normal";
}, {
    readonly id: "continue";
    readonly label: "Continue";
}, {
    readonly id: "impersonate";
    readonly label: "Impersonate";
}, {
    readonly id: "swipe";
    readonly label: "Swipe";
}, {
    readonly id: "regenerate";
    readonly label: "Regenerate";
}, {
    readonly id: "quiet";
    readonly label: "Quiet";
}];
export type TextField = readonly [property: string, label: string, selector?: string];
export declare const TEXT_FIELDS: Record<string, TextField[]>;
