import { InputSelection, PrismEditor } from '../index.js';
import { PrismCodeBlock } from '../client/code-block.js';
/**
 * If {@link insertText} has been called, this variable stores the editor's selection
 * before the call. This variable is set to 0 right before {@link insertText} returns.
 * This can therefore be used inside a `beforeinput` handler to determine if
 * {@link insertText} fired the event, and if true, get the selection before the call.
 *
 * Intended for internal use only.
 */
declare let prevSelection: InputSelection | 0;
/**
 * Escapes all regex syntax characters with a backslash and returns the escaped string.
 *
 * The returned string is not safe inside a character class.
 */
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
 * Sets the selection for the `textarea` and synchronously runs the selectionChange listeners.
 * If you don't want to synchronously run the listeners, use `textarea.setSelectionRange` instead.
 * @param editor Editor you want to change the selection of.
 * @param start New selectionStart.
 * @param end New selectionEnd. Defaults to `start`.
 * @param direction New direction.
 */
declare const setSelection: (editor: PrismEditor, start: number, end?: number, direction?: "backward" | "forward" | "none") => void;
/** Whether the user is on an Apple-based system. */
declare const isMac: boolean;
/** Whether the browser is Chromium based. */
declare const isChrome: boolean;
/** Whether the browser uses the WebKit browser engine. */
declare const isWebKit: boolean;
/**
 * Returns a 4 bit integer where each bit represents whether
 * each modifier is pressed in the order Shift, Meta, Ctrl, Alt.
 *
 * ```javascript
 * e.shiftKey && !e.metaKey && e.ctrlKey && e.altKey
 * // is equivalent to
 * getModifierCode(e) == 0b1011
 * ```
 */
declare const getModifierCode: (e: KeyboardEvent) => number;
/**
 * Adds an overlay by appending the element to the editor's overlays.
 * Equivalent to calling `editor.lines[0].append(overlay)`.
 * @param editor Editor or code block you want to add an overlay to.
 * @param overlay The overlay you want to add.
 */
declare const addOverlay: (editor: PrismEditor | PrismCodeBlock, overlay: HTMLElement) => void;
/**
 * Gets the position of the cursor in the document. It returns a tuple with three numbers:
 *
 * 1. The line number of the cursor
 * 2. The 1-based column of the cursor
 * 3. Number of characters selected
 *
 * @example
 * const [line, col, selected] = getDocumentPosition(editor)
 */
declare const getDocumentPosition: (editor: PrismEditor) => [number, number, number];
/**
 * Computes the offset at which the specified token begins in the editor's value.
 * @param editor Editor or code block the token is inside.
 * @param token Token to compute the offset for.
 * @throws {Error} If the token isn't inside the specified editor.
 */
declare const getTokenOffset: (editor: PrismEditor | PrismCodeBlock, token: HTMLSpanElement) => number;
/**
 * Gets the language used for syntax highlighting at the token's position.
 */
declare const getTokenLanguage: (token: Element) => string;
export { regexEscape, getLineBefore, getLines, getClosestToken, getLanguage, insertText, getModifierCode, setSelection, addOverlay, getDocumentPosition, getTokenOffset, getTokenLanguage, isMac, isChrome, isWebKit, prevSelection, };
