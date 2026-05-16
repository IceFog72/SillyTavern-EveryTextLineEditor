/**
 * @typedef TokenStreamItem
 * @property {string} type
 * @property {string | Array<string|TokenStreamItem>} content
 *
 * @typedef {Array<string|TokenStreamItem>} TokenStream
 *
 * @typedef {string | [string, string | SimplifiedTokenStream]} SimplifiedToken
 * @typedef {Array<string | [string, string | Array]>} SimplifiedTokenStream
 *
 * @typedef {Array<PrettyTokenStreamItem>} PrettyTokenStream
 * @typedef {string | LineBreakItem | GlueItem | [string, string | Array]} PrettyTokenStreamItem
 */
/**
 * Simplifies the token stream to ease the matching with the expected token stream.
 *
 * * Strings are kept as-is
 * * In arrays each value is transformed individually
 * * Values that are empty (empty arrays or strings only containing whitespace)
 * @param {TokenStream} tokenStream
 * @returns {SimplifiedTokenStream}
 */
export function simplify(tokenStream: TokenStream): SimplifiedTokenStream;
/**
 * @param {TokenStream} tokenStream
 * @param {string} [indentation]
 * @returns {string}
 */
export function prettyprint(tokenStream: TokenStream, indentation?: string | undefined): string;
export type TokenStreamItem = {
    type: string;
    content: string | Array<string | TokenStreamItem>;
};
export type TokenStream = Array<string | TokenStreamItem>;
export type SimplifiedToken = string | [string, string | (string | [string, string | any[]])[]];
export type SimplifiedTokenStream = Array<string | [string, string | any[]]>;
export type PrettyTokenStream = Array<PrettyTokenStreamItem>;
export type PrettyTokenStreamItem = string | LineBreakItem | GlueItem | [string, string | any[]];
/**
 * This item indicates that one or multiple line breaks are present between the preceding and following items in the
 * source token stream.
 *
 * Only if an item is enabled will it appear in the pretty-printed token stream.
 */
declare class LineBreakItem {
    /** @param {number} sourceCount */
    constructor(sourceCount: number);
    sourceCount: number;
    enabled: boolean;
}
/**
 * This item indicates the the preceding and following items are to be printed on the same line in the pretty-printed
 * token stream.
 */
declare class GlueItem {
}
export {};
