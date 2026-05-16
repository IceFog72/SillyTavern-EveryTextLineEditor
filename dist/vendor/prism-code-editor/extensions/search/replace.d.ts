import { PrismEditor } from "../..";
import { SearchAPI } from "./search";
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
     * If a match is selected, it's replaced with the specified value.
     * If not, the closest match will be selected and the index is returned.
     */
    replace(value: string): number | undefined;
    /**
     * @param value Value
     * @param selection Does nothing. Kept for backwards compatibility.
     */
    replaceAll(value: string, selection?: [number, number]): void;
    /** Removes the highlight container from the DOM and all potential event listeners. */
    destroy(): void;
}
/** Function adding both search and replace functionality to an editor. */
declare const createReplaceAPI: (editor: PrismEditor) => ReplaceAPI;
export { createReplaceAPI };
