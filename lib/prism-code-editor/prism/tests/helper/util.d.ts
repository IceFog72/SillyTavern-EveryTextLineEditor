/**
 * Performs a breadth-first search on the given start element.
 * @param {any} start
 * @param {(path: { key: string, value: any }[], obj: Record<string, any>) => void} callback
 */
export function BFS(start: any, callback: (path: {
    key: string;
    value: any;
}[], obj: Record<string, any>) => void): void;
/**
 * Given the `BFS` path given to `BFS` callbacks, this will return the Prism language token path of the current
 * value (e.g. `Prism.languages.xml.tag.pattern`).
 *
 * @param {readonly{ key: string, value: any }[]} path
 * @param {string} [root]
 * @returns {string}
 */
export function BFSPathToPrismTokenPath(path: readonly {
    key: string;
    value: any;
}[], root?: string | undefined): string;
/**
 * Returns the AST of a given pattern.
 *
 * @param {RegExp} regex
 * @returns {LiteralAST}
 */
export function parseRegex(regex: RegExp): LiteralAST;
/** @param {string} string */
export function getLeadingSpaces(string: string): string;
/** @param {string} string */
export function getTrailingSpaces(string: string): string;
/**
 * @param {string} html
 * @returns {string}
 */
export function formatHtml(html: string): string;
/**
 * @param {unknown} value
 * @returns {value is RegExp}
 */
export function isRegExp(value: unknown): value is RegExp;
export type Pattern = import('regexpp/ast').Pattern;
export type Flags = import('regexpp/ast').Flags;
export type LiteralAST = {
    pattern: Pattern;
    flags: Flags;
};
