/** @module match-brackets */
import { Extension } from "../..";
export interface BracketMatcher extends Extension {
    /**
     * Array of tuples containing in the following order:
     * - The bracket's `Token`
     * - Its starting position
     * - Its level of nesting
     * - Its text content
     * - Whether it's an opening bracket
     */
    readonly brackets: Bracket[];
    /** Array mapping the index of a bracket to the index of its matching bracket. */
    readonly pairs: (number | undefined)[];
}
export type Bracket = [Prism.Token, number, number, string, boolean];
/**
 * Extension that matches brackets together.
 * @param rainbowBrackets Whether to add extra classes to brackets for styling. Defaults to true.
 * Adding the extension dynamically, will force a rerender to add those extra classes.
 *
 * Without rainbow brackets, this extension can be added dynamically with no side effects.
 */
export declare const matchBrackets: (rainbowBrackets?: boolean) => BracketMatcher;
