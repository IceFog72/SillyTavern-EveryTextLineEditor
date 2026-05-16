import { PrismEditor } from '../../index.js';
import { SearchAPI } from './search.js';

/**
 * Object with methods useful for performing a search
 * and both highlighting and replacing the matches.
 */
export interface ReplaceAPI extends SearchAPI {
    /** Index of the match ahead of the cursor. */
    next(): number;
    /** Index of the match behind the cursor. */
    prev(): number;
    /** Index of the closest match. */
    closest(): number;
    /**
     * Selects the match with the passed index and scrolls
     * it into view with the specified scroll padding.
     */
    selectMatch(index: number, scrollPadding?: number): void;
    /**
     * If a match is selected and it's different to the provided string, it's replaced,
     * else the index of the closest match is returned.
     * If there's no selected match, the index of the closest match is returned.
     */
    replace(replacement: string): number | undefined;
    /**
     * Replaces all search matches with the specified string.
     * @param replacement String to replace all matches with.
     * @param selection Does nothing. Kept for backwards compatibility.
     */
    replaceAll(replacement: string, selection?: [number, number]): void;
    /** Removes the highlight container from the DOM and all potential event listeners. */
    destroy(): void;
}
/** Function adding both search and replace functionality to an editor. */
declare const createReplaceAPI: (editor: PrismEditor) => ReplaceAPI;
export { createReplaceAPI };
