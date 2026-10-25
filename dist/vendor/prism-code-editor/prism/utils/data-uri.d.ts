import { TokenStream } from '../types.js';
/**
 * Function that will highlight the body of data URIs. If you have
 * `'data:image/svg+xml,<svg></svg>'`, then this will highlight `<svg></svg>` as XML for
 * example.
 *
 * ## Usage
 *
 * Note that this function should be the first tokenization function that's called. If
 * {@link matchBrackets} or {@link matchTags} are called before this function is added
 * as a `tokenize` listener, then tags and brackets created by this won't be matched
 * together.
 *
 * ### With editors
 *
 * To use this function with editors, add it as a `tokenize` listener.
 *
 * ```js
 * createEditor(
 *   "#editor",
 *   { ... },
 *   editor => editor.on("tokenize", tokenizeDataUris),
 *   // Other tokenizers after
 *   matchBrackets()
 * )
 * ```
 *
 * ### With code blocks
 *
 * To use this function with code blocks, call it inside `tokenizeCallback`.
 *
 * ```js
 * renderCodeBlock({
 *   language: "js",
 *   code: "const foo = 'bar'",
 *   tokenizeCallback(tokens) {
 *     tokenizeDataUris(tokens)
 *
 *     // Other tokenizers after
 *   }
 * })
 * ```
 *
 * @param {TokenStream} tokens Tokens to mutate.
 */
export function tokenizeDataUris(tokens: TokenStream): void;
