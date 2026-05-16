import { BasicExtension } from '../../index.js';

/**
 * Extension adding a `selectionChange` handler to highlight the closest bracket pair.
 *
 * You must to add a {@link BracketMatcher} to your editor for this extension to work.
 *
 * The `.active-bracket` CSS selector can be used to highlight the brackets.
 */
export declare const highlightBracketPairs: () => BasicExtension;
