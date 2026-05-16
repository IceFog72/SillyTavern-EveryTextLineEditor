import { InputSelection, PrismEditor } from '../index.js';

declare let prevSelection: InputSelection | 0;
/** Escapes all special regex characters with a backslash and returns the escaped string. */
declare const regexEscape: (str: string) => string;
/** Returns the string between the position and the previous \n. */
declare const getLineBefore: (text: string, position: number) => string;
/**
 * Gets all lines that are at least partially between `start` and `end`.
 * @param text Text to search in.
 * @param start Start of the selection.
 * @param end End of the selection. Defaults to `start`.
 * @returns A tuple containing an array of lines, the starting position of the first line,
 * and the ending position of the last line.
 */
declare const getLines: (text: string, start: number, end?: number) => readonly [string[], number, number];
/**
 * Searches a full line for a token that matches a selector and contains `position`
 * within the specified margins. Tokens are searched in reverse document order which means
 * children are searched before their parents.
 * @param editor Editor you want to search in.
 * @param selector CSS selector for the tokens you want to search for.
 * @param marginLeft How far to the left of the token the position can be. Defaults to 0.
 * @param marginRight How far to the right of the token the position can be. Defaults to `marginLeft`.
 * @param position Position to search in. Defaults to `selectionStart`.
 * @returns A span element if one's found or undefined if not.
 * @example
 * This will return a string token if the cursor
 * is at least 1 character inside a string token
 * ```javascript
 * getClosestToken(editor, '.string', -1)
 * ```
 */
declare const getClosestToken: (editor: PrismEditor, selector: string, marginLeft?: number, marginRight?: number, position?: number) => HTMLSpanElement | undefined;
/**
 * Gets the current language at a position.
 * Useful if you want to run different logic based on the language.
 * @param editor Editor to search in.
 * @param position Position to search in. Defaults to `selectionStart`.
 */
declare const getLanguage: (editor: PrismEditor, position?: number) => string;
/**
 * Inserts text into the editor (unless it's read-only) while keeping undo/redo history.
 * Focuses the `textarea` if it isn't already.
 * @param editor Target editor.
 * @param text Text to insert.
 * @param start Position to start the insertion. Defaults to `selectionStart`.
 * @param end Position to end the insertion. Defaults to `start` if specified, else `selectionEnd`.
 * @param newCursorStart New starting position for the cursor. Defaults to the end of the inserted text.
 * @param newCursorEnd New ending position for the cursor. Defaults to `newCursorStart`.
 */
declare const insertText: (editor: PrismEditor, text: string, start?: number | null, end?: number | null, newCursorStart?: number | null, newCursorEnd?: number | null) => void;
/**
 * Returns a 4 bit integer where each bit represents whether
 * each modifier is pressed in the order Shift, Meta, Ctrl, Alt
 * ```javascript
 * e.altKey && e.ctrlKey && e.shiftKey && !e.metaKey
 * // is equivalent to
 * getModifierCode(e) == 0b1011
 * ```
 */
declare const getModifierCode: (e: KeyboardEvent) => number;
export { regexEscape, getLineBefore, getLines, getClosestToken, getLanguage, insertText, getModifierCode, prevSelection, };
