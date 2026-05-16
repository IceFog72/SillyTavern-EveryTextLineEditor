import { BasicExtension } from '../../index.js';
import { SearchAPI, SearchFilter } from './search.js';

export interface SelectionMatchHighlighter extends BasicExtension {
    /**
     * Search API used by the extension.
     * Can be used get the position of the matches for example.
     * This property is only present after the extension is added to an editor.
     */
    api?: SearchAPI;
}
export interface WordHighlighter extends SelectionMatchHighlighter {
    /** Sets the search filter used. Useful for updating the filter after changing an editor's language. */
    setFilter(newFilter: SearchFilter): void;
}
/**
 * Extension that highlights selection matches in an editor.
 * @param caseSensitive Whether or not matches must have the same case. Defaults to false.
 * @param minLength Minimum length needed to perform a search. Defaults to 1.
 * @param maxLength Maximum length at which to perform a search. Defaults to 200.

 * Lower values of `minLength` and higher values of `maxLength` can impact performance.
 *
 * The CSS-selector `.selection-matches span` can be used to style the matches.
 */
declare const highlightSelectionMatches: (caseSensitive?: boolean, minLength?: number, maxLength?: number) => SelectionMatchHighlighter;
/**
 * Extension that highlights all instances of the word the cursor is on if there's no selection.
 * @param filter Function that can filter away matches based on their position.
 * The filter can be changed later using the `setFilter` method.
 * @param includeHyphens A function returning whether or not hyphens should be included in the search.
 * For languages that don't commonly use hyphens as an operator (such as CSS), it makes sense to
 * return true. If this parameter is omitted, hyphens are not included.
 *
 * The CSS-selector `.word-matches span` can be used to style the matches.
 *
 * @example
 * This filters away all words that start inside a string, comment or keyword or regex token.
 * Different filter functions should be chosen based on the language.
 * ```
 * const selector = ".string, .comment, .keyword, .regex"
 * const filter = start => !getClosestToken(editor, selector, 0, 0, start)
 * const includeHyphens = position => getLanguage(editor, position) == "css"
 *
 * editor.addExtensions(
 * 	highlightCurrentWord(filter, includeHyphens)
 * )
 * ```
 */
declare const highlightCurrentWord: (filter?: SearchFilter, includeHyphens?: ((cursorPosition: number) => boolean) | undefined) => WordHighlighter;
export { highlightSelectionMatches, highlightCurrentWord };
