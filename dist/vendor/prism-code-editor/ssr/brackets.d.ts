import { TokenStream } from '../prism/index.js';
/**
 * Function that runs the same bracket matching algorithm as the {@link matchBrackets}
 * extension. This is useful to add rainbow brackets outside an editor or with
 * {@link renderEditor}.
 *
 * @param pairs Which characters to match together. The opening character must be followed
 * by the corresponding closing character. Defaults to `"()[]{}"`.
 * @returns A function that accepts a token stream and adds extra classes to the brackets.
 */
declare const rainbowBrackets: (pairs?: string) => (tokens: TokenStream) => void;
export { rainbowBrackets };
