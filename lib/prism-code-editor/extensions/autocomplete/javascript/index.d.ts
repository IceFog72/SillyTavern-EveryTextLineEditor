import { PrismEditor } from '../../../index.js';
import { CompletionContext, CompletionSource } from '../types.js';

export type JSContext = {
    /**
     * Whether autocomplete should be disabled due to happening inside a regex, string,
     * comment or variable name declaration
     */
    disabled: boolean;
    /**
     * List of identifiers that were separated by `.` or `?.` before the cursor.
     *
     * Here's a list of strings before the cursor and the corresponding path:
     * - `a.b.c` -> `["a", "b", "c"]`
     * - `a.b.` -> `["a", "b", ""]`
     *
     * If there's no identifier before the cursor, the path will be `[""]`.
     * If completion shouldn't happen where the cursor is, `path` will be `null`.
     * If `tagMatch` is present, `path` will also be `null`.
     */
    path: string[] | null;
    /**
     * If the current language is `jsx` or `tsx` and the cursor is in a tag, this match
     * will be present.
     *
     * There are three capture groups:
     * 1) The tag's name
     * 2) The last attribute's name
     * 3) Is present if the cursor is inside an attribute value
     */
    tagMatch: null | RegExpExecArray;
};
/**
 * Adds extra properties to the completion context used by JavaScript completion sources.
 */
declare const jsContext: (context: CompletionContext, editor: PrismEditor) => JSContext;
/**
 * Returns a completion source that adds completions for a scope object.
 * @param scope Scope object you want to provide completions for. For example `window`.
 * @param commitChars If a character in this string is typed and and of these options
 * is selected, the option is inserted right before typing that character.
 */
declare const completeScope: (scope: any, commitChars?: string) => CompletionSource<{
    path: string[] | null;
}>;
/**
 * Completion source that searches the editor for identifiers and returns them as
 * completions. Best to avoid using this and {@link completeScope} at the same time.
 * @param identifers List of identifiers that should be completed even if they're not
 * found in the editor.
 */
declare const completeIdentifiers: (identifiers?: Iterable<string>) => CompletionSource<JSContext>;
export { jsxTagCompletion } from './jsx.js';
export { completeKeywords } from './keywords.js';
export { globalReactAttributes, reactTags } from './reactData.js';
export { jsSnipets } from './snippets.js';
export { jsDocCompletion } from './jsdoc.js';
export { jsContext, completeScope, completeIdentifiers };
