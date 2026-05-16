import { BasicExtension } from '../../index.js';
import { Token } from '../../prism/index.js';

export interface BracketMatcher extends BasicExtension {
    /**
     * Array of tuples containing in the following order:
     * - The bracket's `Token`
     * - Its starting position
     * - Its level of nesting
     * - Its text content
     * - Whether it's an opening bracket
     * - Its ending position
     *
     * The order will likely change in the next major release
     */
    readonly brackets: Bracket[];
    /** Array mapping the index of a bracket to the index of its matching bracket. */
    readonly pairs: (number | undefined)[];
}
/**
 * Tuple containing in the following order:
 * - The bracket's `Token`
 * - Its starting position
 * - Its level of nesting
 * - Its text content
 * - Whether it's an opening bracket
 * - Its ending position
 *
 * The order will likely change in the next major release
 */
export type Bracket = [Token, number, number, string, boolean, number];
/**
 * Extension that matches punctuation tokens together. Intended for matching brackets.
 *
 * The order inside `openingBrackets` and `closingBrackets` determines which characters
 * are matched together.
 * @param rainbowBrackets Whether to add extra classes to brackets for styling. Defaults to true.
 * @param openingBrackets Defaults to `"([{"`.
 * @param closingBrackets Defaults to `")]}"`.
 *
 * Adding the extension dynamically, will force a rerender to add those extra classes.
 *
 * Without rainbow brackets, this extension can be added dynamically with no side effects.
 */
export declare const matchBrackets: (rainbowBrackets?: boolean, openingBrackets?: string, closingBrackets?: string) => BracketMatcher;
