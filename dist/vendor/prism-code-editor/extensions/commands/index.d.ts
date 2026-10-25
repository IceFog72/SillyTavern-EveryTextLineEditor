import { BasicExtension } from '../../index.js';
import { EditHistory, EditorHotkey } from './types.js';
/**
 * Extension that will add automatic closing of brackets, quotes, and tags along
 * with the specified commands.
 *
 * @param hotkeyMap Commands that will be added to the editor.
 * @param selfClosePairs Pairs of self-closing brackets and quotes.
 * Must be an array of strings with 2 characters each.
 * Defaults to `['""', "''", '``', '()', '[]', '{}']`.
 * @param selfCloseRegex Regex controlling whether or not a bracket/quote should
 * automatically close based on the character before and after the cursor.
 * Defaults to ``/([^$\w'"`]["'`]|.[[({])[.,:;\])}>\s]|.[[({]`/s``.
 */
declare const editorCommands: (hotkeyMap: Record<string, EditorHotkey>, selfClosePairs?: string[], selfCloseRegex?: RegExp) => BasicExtension;
/**
 * History extension that overrides the undo/redo behavior of the browser.
 *
 * Without this extension, the browser's native undo/redo is used, which can be sufficient
 * in some cases.
 *
 * Once added to an editor, this extension can be accessed from `editor.extensions.history`.
 *
 * If you want to create a new editor with different extensions while keeping the undo/redo
 * history of an old editor, you can! Just add the old editor's history extension instance
 * to the new editor. Keep in mind that this will fully break the undo/redo behavior of the
 * old editor.
 *
 * @param historyLimit The maximum size of the history stack. Defaults to 999.
 */
declare const editHistory: (historyLimit?: number) => EditHistory;
export { editorCommands, editHistory };
export { normalizeKey, getKeysFromEvent, addEditorHotkey, addHotkey, addEditorHotkeySequence, addHotkeySequence, runHotkeys, isModifierKey, } from './utils.js';
export { indentSelectedLines, insertTab, insertLineAndIndent, moveSelectedLines, copySelectedLines, scrollByOneLine, deleteSelectedLines, toggleComment, setIgnoreTab, defaultKeymap, ignoreTab, } from './commands.js';
export * from './deprecated.js';
export * from './types.js';
export * from './format.js';
