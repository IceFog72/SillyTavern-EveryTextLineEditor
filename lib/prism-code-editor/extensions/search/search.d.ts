import { PrismEditor } from '../../types.js';

declare const searchTemplate: () => HTMLDivElement;
declare const matchTemplate: () => HTMLDivElement;
export type SearchFilter = (start: number, end: number) => boolean;
/** Object with methods useful for performing a search and highlighting the matches. */
export interface SearchAPI {
    /**
     * Unhides the search container and highlights all matches of the specified string in the editor.
     * @param str String to search for.
     * @param caseSensitive Whether or not the search is case sensetive.
     * @param wholeWord Whether or not matches must be surrounded by word boundries.
     * @param useRegExp If true, special characters won't be escaped when creating the RegExp.
     * @param selection Boundries to search between. If excluded, all the code is searched.
     * @param filter A function called for each match with the start and end positions of the match.
     * If it returns false, the match won't be included.
     * @param wholeWordBoundry Pattern controlling the behavior of whole word search. Best left
     * undefined unless you know what you're doing. Does nothing if `wholeWord` isn't set to `true`.
     * Defaults to `/[_\p{N}\p{L}]{2}/u`.
     * @returns An error message if the RegExp was invalid.
     */
    search(str: string, caseSensitive?: boolean, wholeWord?: boolean, useRegExp?: boolean, selection?: [number, number], filter?: SearchFilter, wholeWordBoundry?: RegExp): string | void;
    /** Container that all the search results are appended to. */
    readonly container: HTMLDivElement;
    /** Current regex used for searching. */
    readonly regex: RegExp;
    /** Array of positions of all the matches. */
    readonly matches: [number, number][];
    /** Hides the search container and removes all the matches. */
    stopSearch(): void;
}
/** Function adding search functionality to an editor. */
declare const createSearchAPI: (editor: PrismEditor) => SearchAPI;
export { createSearchAPI, searchTemplate, matchTemplate };
