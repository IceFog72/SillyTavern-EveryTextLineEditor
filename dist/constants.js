const EXTENSION_PATH_PARTS = new URL(import.meta.url).pathname.split('/');
const EXTENSION_FOLDER = EXTENSION_PATH_PARTS.at(-2);
export const NAME = ['dist', 'src'].includes(EXTENSION_FOLDER) ? EXTENSION_PATH_PARTS.at(-3) : EXTENSION_FOLDER;
export const STORAGE = {
    selectedSource: `${NAME}:selectedSource`,
    wordWrap: `${NAME}:wordWrap`,
    spellCheck: `${NAME}:spellCheck`,
    monacoMinimap: `${NAME}:monacoMinimap`,
    panelWidth: `${NAME}:panelWidth`,
    sidebarCollapsed: `${NAME}:sidebarCollapsed`,
    collapsedGroups: `${NAME}:collapsedGroups`,
    indentMode: `${NAME}:indentMode`,
    scrollSync: `${NAME}:scrollSync`,
    editorEngine: `${NAME}:editorEngine`,
    sourceLanguages: `${NAME}:sourceLanguages`,
    trackedSources: `${NAME}:trackedSources`,
    ignoreFullJsonHistory: `${NAME}:ignoreFullJsonHistory`,
    promptInspectorEnabled: `${NAME}:promptInspectorEnabled`,
    promptInspectorCurrent: `${NAME}:promptInspectorCurrent`,
    promptInspectorPrevious: `${NAME}:promptInspectorPrevious`,
    promptInspectorUpdatedAt: `${NAME}:promptInspectorUpdatedAt`,
};
export const DB = {
    NAME: `${NAME}:history`,
    VERSION: 2,
};
export const INDENT_MODES = [
    { id: 'tabs', label: 'Tabs: 4', insertSpaces: false, tabSize: 4 },
    { id: 'spaces2', label: 'Spaces: 2', insertSpaces: true, tabSize: 2 },
    { id: 'spaces4', label: 'Spaces: 4', insertSpaces: true, tabSize: 4 },
];
export const LANGUAGES = [
    { id: 'markdown', label: '.md' },
    { id: 'json', label: '.json' },
    { id: 'yaml', label: '.yaml' },
    { id: 'css', label: '.css' },
    { id: 'text', label: 'text' },
];
export const SYNC_MODES = [
    { id: 'off', label: 'Sync: Off' },
    { id: 'line', label: 'Sync: Line' },
    { id: 'ratio', label: 'Sync: Ratio' },
];
export const EDITOR_ENGINES = [
    { id: 'prism', label: 'Prism' },
    { id: 'monaco', label: 'Monaco' },
];
export const GENERATION_TRIGGERS = [
    { id: 'normal', label: 'Normal' },
    { id: 'continue', label: 'Continue' },
    { id: 'impersonate', label: 'Impersonate' },
    { id: 'swipe', label: 'Swipe' },
    { id: 'regenerate', label: 'Regenerate' },
    { id: 'quiet', label: 'Quiet' },
];
export const TEXT_FIELDS = {
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
    textgen: [
        ['negative_prompt', 'Negative Prompt'],
        ['grammar_string', 'Grammar String'],
        ['banned_tokens', 'Banned Tokens'],
        ['global_banned_tokens', 'Global Banned Tokens'],
        ['dry_sequence_breakers', 'DRY Sequence Breakers'],
    ],
    customOpenAi: [
        ['custom_include_body', 'Custom Include Body'],
        ['custom_exclude_body', 'Custom Exclude Body'],
        ['custom_include_headers', 'Custom Include Headers'],
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
        ['description_format', 'Description Format', '#description_format_textarea'],
    ],
};
//# sourceMappingURL=constants.js.map