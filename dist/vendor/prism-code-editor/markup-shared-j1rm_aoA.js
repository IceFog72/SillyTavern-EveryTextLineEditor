import { c as tokenize, u as withoutTokenizer } from "./core-Dr0o9A-8.js";
import { n as re } from "./shared-oTKIFAwH.js";
import { n as braces } from "./jsx-shared-BgBgis07.js";
//#region src/prism/utils/markup-shared.js
/**
* @param {string} tagName
* @param {*} tagInside
* @param {(code: string) => string} getLang
*/
var addInlined = (tagName, tagInside, getLang) => ({
	pattern: RegExp(`<${tagName}(?:\\s[^>]*)?>[^]*?</${tagName}\\s*>`, "g"),
	inside: {
		"code-block": {
			pattern: /(>)[^]+(?=<)/,
			lookbehind: true
		},
		"tag": {
			pattern: /[^>]+>/,
			inside: tagInside
		},
		[tokenize]: (code, grammar) => {
			grammar["code-block"].alias = "language-" + (grammar["code-block"].inside = getLang(code));
			return withoutTokenizer(code, grammar);
		}
	}
});
/**
* @param {*} expression
*/
var astroTag = (expression) => ({
	pattern: re("</?(?:(?!\\d)[^\\s%=<>/]+(?:\\s(?:\\s*[^\\s{=<>/]+(?:\\s*=\\s*(?!\\s)(?:\"[^\"]*\"|'[^']*'|[^\\s{=<>/\"']+(?=[\\s/>])|<0>)?|(?=[\\s/>]))|\\s*<0>)*)?\\s*/?)?>", [braces], "g"),
	inside: {
		"punctuation": /^<\/?|\/?>$/,
		"tag": {
			pattern: /^\S+/,
			inside: {
				"namespace": /^[^:]+:/,
				"class-name": /^[A-Z]\w*(?:\.[A-Z]\w*)*$/
			}
		},
		"attr-value": {
			pattern: /(=\s*)(?:"[^"]*"|'[^']*'|[^\s"'>{]+)/,
			lookbehind: true,
			inside: { "punctuation": /^["']|["']$/g }
		},
		"expression": expression,
		"attr-equals": /=/,
		"attr-name": {
			pattern: /\S+/,
			inside: { "namespace": /^[^:]+:/ }
		}
	}
});
//#endregion
export { astroTag as n, addInlined as t };

//# sourceMappingURL=markup-shared-j1rm_aoA.js.map