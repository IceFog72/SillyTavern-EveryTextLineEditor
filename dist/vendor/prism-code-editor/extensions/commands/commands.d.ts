import { PrismEditor } from '../../types.js';
import { EditorHotkey } from './types.js';
declare let ignoreTab: boolean;
/**
 * Sets whether editors should ignore tab or use it for indentation. Users can toggle
 * this using `Ctrl` + `M` / `Ctrl` + `Shift` + `M` (Mac) when the {@link defaultKeymap}
 * or {@link defaultCommands} extension is used.
 */
declare const setIgnoreTab: (newState: boolean) => boolean;
declare const whitespaceEnd: (str: string) => number;
declare const scroll: (editor: PrismEditor) => boolean;
/**
 * Command that indents or outdents all user-selected lines in the editor unless the
 * editor is `readOnly`.
 * @param editor Editor to execute the command on.
 * @param less By default lines are indented. By passing `true`, lines are outdented
 * instead.
 */
declare const indentSelectedLines: (editor: PrismEditor, less?: boolean) => boolean;
/**
 * Command that inserts spaces if `insertSpaces` isn't `false` or a tab character
 * otherwise at the specified position unless the editor is `readOnly`.
 * @param editor Editor to execute the command on.
 * @param pos Position to insert the tab.
 */
declare const insertTab: (editor: PrismEditor, pos: number) => boolean;
/**
 * Command that inserts a new line replacing the current selection unless the editor is
 * `readOnly`. It uses the `autoIndent` behavior of the current language to determine
 * whether to preserve the indentation or increase it.
 * @param editor Editor to execute the command on.
 * @param eol If `true`, the new line is inserted at the end of the line instead of at
 * the cursor's position.
 */
declare const insertLineAndIndent: (editor: PrismEditor, eol?: boolean) => boolean | undefined;
/**
 * Command that moves all selected lines unless the editor is `readOnly`.
 * @param editor Editor to execute the command on.
 * @param up Whether to move the lines up. Defaults to `false`.
 */
declare const moveSelectedLines: (editor: PrismEditor, up?: boolean) => boolean;
/**
 * Command that copies all selected lines unless the editor is `readOnly`.
 * @param editor Editor to execute the command on.
 * @param up Whether or not the selection should remain on the top copy. Defaults to
 * `false`.
 */
declare const copySelectedLines: (editor: PrismEditor, up?: boolean) => boolean;
/**
 * Command that scrolls the editor by one line.
 * @param editor Editor to execute the command on.
 * @param up Whether to scroll up. Defaults to `false`.
 */
declare const scrollByOneLine: (editor: PrismEditor, up?: boolean) => boolean;
/**
 * Command that deletes all selected lines unless the editor is `readOnly`.
 * @param editor Editor to execute the command on.
 */
declare const deleteSelectedLines: (editor: PrismEditor) => boolean;
/**
 * Command that toggles the comment around the current selection unless the editor is
 * `readOnly`. Comment syntax is determined using the current {@link Language}. It will
 * use the `getComments()` method if present and the `comments` property otherwise.
 * @param editor Editor to execute the command on.
 * @param isBlock Whether or not to toggle the comment using block syntax.
 */
declare const toggleComment: (editor: PrismEditor, isBlock?: boolean) => boolean;
/**
 * Default keymapping that includes the following commands:
 *
 * - `Alt` + `ArrowUp`: Move line up
 * - `Alt` + `ArrowDown`: Move line down
 * - `Ctrl` + `ArrowUp`: Scroll one line up (Windows/Linux)
 * - `Ctrl` + `ArrowDown`: Scroll one line down (Windows/Linux)
 * - `Ctrl` + `PageUp`: Scroll one line up (Mac)
 * - `Ctrl` + `PageDown`: Scroll one line down (Mac)
 * - `Shift` + `Alt` + `ArrowUp`: Copy line up
 * - `Shift` + `Alt` + `ArrowDown`: Copy line down
 * - `Enter`: Insert line and indent
 * - `Shift` + `Enter`: Insert line and indent
 * - `Mod` + `Enter`: Insert blank line
 * - `Mod` + `]`: Indent line
 * - `Mod` + `[`: Outdent line
 * - `Tab`: Indent line (Tab capture enabled)
 * - `Shift` + `Tab`: Outdent line (Tab capture enabled)
 * - `Shift` + `Mod` + `K`: Delete line
 * - `Mod` + `/`: Toggle comment
 * - `Shift` + `Alt` + `A`: Toggle block comment
 * - `Ctrl` + `M`: Toggle tab capturing (Windows/Linux)
 * - `Ctrl` + `Shift` + `M`: Toggle tab capturing (Mac)
 *
 * Here, `Mod` refers to `Cmd` on Mac and `Ctrl` otherwise.
 */
declare const defaultKeymap: Record<string, EditorHotkey>;
export { whitespaceEnd, scroll, indentSelectedLines, insertTab, insertLineAndIndent, moveSelectedLines, copySelectedLines, scrollByOneLine, deleteSelectedLines, toggleComment, setIgnoreTab, defaultKeymap, ignoreTab, };
