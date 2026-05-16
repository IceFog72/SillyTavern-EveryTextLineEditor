/** @module commands */
import { Extension } from "..";
/**
 * Extension that will add automatic indentation, closing of brackets,
 * quotes and tags along with the following commands:
 *
 * - Alt+ArrowUp/Down: Move line up/down
 * - Shift+Alt+ArrowUp/Down: Copy line up/down
 * - Ctrl+Enter (Cmd+Enter on MacOS): Insert blank line
 * - Ctrl+[ (Cmd+[ on MacOS): Outdent line
 * - Ctrl+] (Cmd+] on MacOS): Indent line
 * - Shift+Ctrl+K (Shift+Cmd + K on MacOS): Delete line
 * - Ctrl+/ (Cmd+/ on MacOS): Toggle comment
 * - Shift+Alt+A: Toggle block comment
 * - Ctrl+M (Ctrl+Shift+M on MacOS): Toggle Tab capturing
 * @param selfClosePairs Pairs of self-closing brackets and quotes.
 * Must be an array of strings with 2 characters each.
 * Defaults to `['""', "''", '``', '()', '[]', '{}']`.
 * @param selfCloseRegex Regex controlling whether or not a bracket/quote should
 * automatically close based on the character before and after the cursor.
 * Defaults to ``/([^\w$'"`]["'`]|.[[({])[;:,.\])}>\s]|.[[({]`/s``.
 */
export declare const defaultCommands: (selfClosePairs?: string[], selfCloseRegex?: RegExp) => Extension;
