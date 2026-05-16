/** @module match-tags */
import { Extension, PrismEditor } from "..";
export interface TagMatcher {
    /**
     * Array of tuples containing in the following order:
     * - The tag's `Token`
     * - Its starting position
     * - Its leftmost punctuation length
     * - Its ending position
     * - Its tag name
     * - Whether it's self-closing
     */
    readonly tags: [Prism.Token, number, number, number, string, boolean][];
    /** Array mapping the index of a tag to the index of its matching tag. */
    readonly pairs: (number | undefined)[];
}
export interface TagHighlighter extends Extension {
    /**
     * The tag matcher used by the extension.
     * This property is only present after the extension is added to an editor.
     */
    matcher?: TagMatcher;
}
/**
 * Function that adds tag matching to the editor.
 * @returns An object containing all tags and pairs.
 */
export declare const createTagMatcher: (editor: PrismEditor) => TagMatcher;
/**
 * Extension that adds classes to matching HTML/XML/JSX tags. If the editor doesn't
 * have a {@link TagMatcher}, one is created. Obviously don't add this if the languages
 * used don't have tags.
 *
 * Use the CSS selectors `.active-tagname` to style the elements.
 *
 * This extension can safely be added dynamically to an editor.
 */
export declare const matchTags: () => TagHighlighter;
/**
 * Extension that highlights `<` and `>` punctuation in XML tags.
 * @param className Class added to the active punctuation you can use to style them with CSS.
 * @param alwaysHighlight If true, the punctuation will always be highlighted when the cursor
 * is inside a tag. If not it will only be highlighted when the cursor is on the punctuation.
 */
export declare const highlightTagPunctuation: (className: string, alwaysHighlight?: boolean) => TagHighlighter;
