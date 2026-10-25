/**
 * Creates a nested pattern where all occurrences of the string `<self>` are replaced with the pattern itself.
 *
 * @param {string} pattern
 * @param {number} depthLog2
 */
export function nested(pattern: string, depthLog2: number): string;
/**
 * Replaces all placeholders "<n>" of given pattern with the n-th replacement (zero based).
 *
 * Note: This is a simple text based replacement. Be careful when using backreferences!
 *
 * @param {string} pattern the given pattern.
 * @param {string[]} replacements a list of replacement which can be inserted into the given pattern.
 * @returns the pattern with all placeholders replaced with their corresponding replacements.
 * @example replace(/a<0>a/.source, [/b+/.source]) === /a(?:b+)a/.source
 */
export function replace(pattern: string, replacements: string[]): string;
/**
 * @param {string} pattern
 * @param {string[]} replacements
 * @param {string=} flags
 */
export function re(pattern: string, replacements: string[], flags?: string | undefined): RegExp;
