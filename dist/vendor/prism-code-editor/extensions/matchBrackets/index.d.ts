import { BasicExtension } from '../../index.js';
import { Token } from '../../prism/index.js';
export interface BracketMatcher extends BasicExtension {
    /**
     * Array of tuples containing in the following order:
     * - The bracket's `Token`
     * - Its starting position
     * - Its ending position
     * - Its level of nesting
     * - Its text content
     * - Whether it's an opening bracket
     */
    readonly brackets: Bracket[];
    /** Array mapping the index of a bracket to the index of its matching bracket. */
    readonly pairs: (number | undefined)[];
}
/**
 * Tuple containing in the following order:
 * - The bracket's `Token`
 * - Its starting position
 * - Its ending position
 * - Its level of nesting
 * - Its text content
 * - Whether it's an opening bracket
 */
export type Bracket = [Token, number, number, number, string, boolean];
/**
 * Extension that matches punctuation tokens together. Intended for matching brackets.
 *
 * Without rainbow brackets, this extension can be added dynamically with no downsides.
 *
 * @param rainbowBrackets Whether to add extra classes to brackets for styling. Defaults
 * to `true`. When enabled, adding the extension dynamically will force a rerender to add
 * these extra classes.
 * @param pairs Which characters to match together. The opening character must be followed
 * by the corresponding closing character. Defaults to `"()[]{}"`.
 */
export declare const matchBrackets: (rainbowBrackets?: boolean, pairs?: string) => BracketMatcher;
