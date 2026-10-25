import { TokenStream } from '../types.js';
/** @import { TokenStream } from '../types.js' */
/**
 * Tokenizes all strings in the token stream with the given tokenization function.
 *
 * @param {TokenStream} tokens Tokens to mutate.
 * @param {(code: string) => TokenStream} tokenize Function applied to all strings in the
 * token stream. The token stream returned must have the same text content as the given
 * text.
 */
export function tokenizeStrings(tokens: TokenStream, tokenize: (code: string) => TokenStream): void;
