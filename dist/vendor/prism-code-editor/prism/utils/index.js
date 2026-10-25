import { a as languages, l as tokenizeText, t as Token } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, n as clone, r as extend, t as addAlias } from "../../language-CXbc22uF.js";
import { t as embeddedIn } from "../../templating-BdhIX5ID.js";
//#region src/prism/utils/tokenize-strings.js
/** @import { TokenStream } from '../types.js' */
/**
* Tokenizes all strings in the token stream with the given tokenization function.
*
* @param {TokenStream} tokens Tokens to mutate.
* @param {(code: string) => TokenStream} tokenize Function applied to all strings in the
* token stream. The token stream returned must have the same text content as the given
* text.
*/
var tokenizeStrings = (tokens, tokenize) => {
	/** @type {TokenStream} */
	var result = [];
	for (var i = 0, token; token = tokens[i++];) {
		/** @type {string | TokenStream | undefined} */
		var content = token.content;
		var stream;
		if (content) {
			if (Array.isArray(content)) tokenizeStrings(content, tokenize);
			else {
				stream = tokenize(content);
				if (stream[0] !== content) token.content = stream;
			}
			result.push(token);
		} else result.push(...tokenize(token));
	}
	for (i = 0; token = result[i];) tokens[i++] = token;
};
//#endregion
//#region src/prism/utils/data-uri.js
/** @import { TokenStream } from "../types.js" */
/** @import { matchTags } from "../../extensions/matchTags.js" */
/** @import { matchBrackets } from "../../extensions/matchBrackets/index.js" */
var pattern$1 = /(['"]?)\s*data:[^,/]+\/(?:[^,+]+\+)?(css|javascript|json|html|xml),([^]+)\1$/g;
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
var tokenizeDataUris = (tokens) => {
	return tokenizeStrings(tokens, (code) => {
		/** @type {TokenStream} */
		var result = [];
		var pos = 0;
		var match;
		var body;
		while (match = pattern$1.exec(code)) {
			result.push(code.slice(pos, pos = code.indexOf(",", match.index) + 1), new Token("language-" + match[2], tokenizeText(body = match[3], languages[match[2]] || {}), body));
			pos += body.length;
		}
		if (code[pos]) result.push(code.slice(pos));
		return result;
	});
};
//#endregion
//#region src/prism/utils/invisibles.js
/** @import { TokenStream } from "../types.js" */
/** @import { showInvisibles } from "../../extensions/search/invisibles.js" */
/** @import { tokenizeDataUris } from "./data-uri.js"; */
var pattern = / |	/g;
/**
* Function that will highlight all tabs and spaces in a token stream. Similar to
* {@link showInvisibles}, but this highlights all spaces and tabs as tokens instead.
* This also works with code blocks. If you only want to show spaces and tabs that are
* selected, then {@link showInvisibles} must be used instead.
*
* Requires styling from `prism-code-editor/invisibles.css`.
*
* ## Usage
*
* Note that this function should be the last tokenization function that's called. This
* is not just a performance optimization since {@link tokenizeDataUris} doesn't work
* when it's called after.
*
* ### With editors
*
* To use this function with editors, add it to `onTokenize` or as a `tokenize` listener.
*
* ```js
* createEditor(
*   "#editor",
*   { 
*     ...
*     onTokenize: tokenizeInvisibles
*   },
*   matchBrackets()
* )
* ```
*
* Or
*
* ```js
* createEditor(
*   "#editor",
*   { ... },
*   // Other tokenizers before
*   matchBrackets(),
*   editor => editor.on("tokenize", tokenizeInvisibles)
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
*   value: "const foo = 'bar'",
*   tokenizeCallback(tokens) {
*     // Other tokenizers before
*
*     tokenizeInvisibles(tokens)
*   }
* })
* ```
*
* @param {TokenStream} tokens Tokens to mutate.
*/
var tokenizeInvisibles = (tokens) => {
	return tokenizeStrings(tokens, (code) => {
		/** @type {TokenStream} */
		var result = [];
		var pos = 0;
		var match, i = 0;
		while (match = pattern.exec(code)) {
			if (match.index > pos) result[i++] = code.slice(pos, pos = match.index);
			result[i++] = new Token(match[0] == " " ? "space" : "tab", match[0], " ");
			pos++;
		}
		if (code[pos]) result[i] = code.slice(pos);
		return result;
	});
};
//#endregion
export { addAlias, clone, embeddedIn, extend, insertBefore, tokenizeDataUris, tokenizeInvisibles, tokenizeStrings };

//# sourceMappingURL=index.js.map