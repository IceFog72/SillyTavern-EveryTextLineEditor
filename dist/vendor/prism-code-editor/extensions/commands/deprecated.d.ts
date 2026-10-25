import { BasicExtension } from '../../index.js';
/**
 * Extension that will add automatic indentation and closing of brackets, quotes, and
 * tags along with the commands presented later.
 *
 * ## Commands
 *
 * Here, `Mod` refers to `Cmd` on Mac and `Ctrl` otherwise.
 *
 * - `Alt` + `ArrowUp`: Move line up
 * - `Alt` + `ArrowDown`: Move line down
 * - `Ctrl` + `ArrowUp`: Scroll one line up (Windows/Linux only)
 * - `Ctrl` + `ArrowDown`: Scroll one line down (Windows/Linux only)
 * - `Shift` + `Alt` + `ArrowUp`: Copy line up
 * - `Shift` + `Alt` + `ArrowDown`: Copy line down
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
 * @param selfClosePairs Pairs of self-closing brackets and quotes.
 * Must be an array of strings with 2 characters each.
 * Defaults to `['""', "''", '``', '()', '[]', '{}']`.
 * @param selfCloseRegex Regex controlling whether or not a bracket/quote should
 * automatically close based on the character before and after the cursor.
 * Defaults to ``/([^$\w'"`]["'`]|.[[({])[.,:;\])}>\s]|.[[({]`/s``.
 *
 * @deprecated Consider using {@link editorCommands} instead. This will be removed in next
 * major release.
 */
declare const defaultCommands: (selfClosePairs?: string[], selfCloseRegex?: RegExp) => BasicExtension;
export { defaultCommands };
