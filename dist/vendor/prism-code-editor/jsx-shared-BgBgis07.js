import { a as languages, c as tokenize, t as Token, u as withoutTokenizer } from "./core-Dr0o9A-8.js";
import { i as insertBefore, n as clone } from "./language-CXbc22uF.js";
import { n as clikeComment } from "./patterns-DSInPV_c.js";
import { n as re } from "./shared-oTKIFAwH.js";
//#region src/prism/utils/jsx-shared.js
var space = "\\s|//.*(?!.)|/\\*(?:[^*]|\\*(?!/))*\\*/";
var braces = "\\{(?:[^{}]|\\{(?:[^{}]|\\{(?:[^{}]|\\{[^}]*\\})*\\})*\\})*\\}";
/**
* @param {string} code
* @param {*} grammar
*/
var tokenizer = (code, grammar) => {
	var position = 0, tokens = withoutTokenizer(code, grammar);
	var i = 0, openedTags = [], l = 0;
	var token;
	var j = 0;
	var textStartPos;
	var content;
	var last;
	var addStoredText = () => {
		if (textStartPos) {
			content = code.slice(textStartPos, position);
			tokens[j++] = new Token("plain-text", content, content);
			textStartPos = 0;
		}
	};
	for (; token = tokens[i]; i++, position += length) {
		var length = token.length;
		var isNeverText = token.type;
		var tag, start;
		if (isNeverText) {
			content = token.content;
			if (isNeverText == "tag") {
				start = content[0].length;
				tag = content[2] ? code.substr(position + start, content[1].length) : "";
				if (start > 1) {
					if (l && last[0] == tag) last = openedTags[--l - 1];
				} else if (content[content.length - 1].length < 2) openedTags[l++] = last = [tag, 0];
			} else if (l && isNeverText == "punctuation") {
				if (content == "{") last[1]++;
				else if (last[1] && content == "}") last[1]--;
				else isNeverText = "}()[]".includes(content);
			} else isNeverText = false;
		}
		if (!isNeverText && l && !last[1]) {
			if (!textStartPos) textStartPos = position;
		} else {
			addStoredText();
			tokens[j++] = token;
		}
	}
	addStoredText();
	tokens.length = j;
	return tokens;
};
/**
* Adds JSX tags along with the custom tokenizer to the grammar
* @param {any} grammar
* @param {string} name
*/
var addJsxTag = (grammar, name) => {
	insertBefore(languages[name] = grammar = clone(grammar), "regex", { "tag": {
		pattern: re("</?(?:(?!\\d)[^\\s%=<>/]+(?:<0>(?:<0>*(?:[^\\s{=<>/*]+(?:<0>*=<0>*(?!\\s)(?:\"[^\"]*\"|'[^']*'|<1>)?|(?=[\\s/>]))|<1>))*)?<0>*/?)?>", [space, braces], "g"),
		inside: {
			"punctuation": /^<\/?|\/?>$/,
			"tag": {
				pattern: /^[^\s/<]+/,
				inside: {
					"namespace": /^[^:]+:/,
					"class-name": /^[A-Z]\w*(?:\.[A-Z]\w*)*$/
				}
			},
			"attr-value": {
				pattern: re("(=<0>*)(?:\"[^\"]*\"|'[^']*')", [space]),
				lookbehind: true,
				inside: { "punctuation": /^["']|["']$/g }
			},
			"expression": {
				pattern: RegExp(braces, "g"),
				alias: "language-" + name,
				inside: grammar
			},
			"comment": clikeComment,
			"attr-equals": /=/,
			"attr-name": {
				pattern: /\S+/,
				inside: { "namespace": /^[^:]+:/ }
			}
		}
	} });
	grammar[tokenize] = tokenizer;
	return grammar;
};
//#endregion
export { braces as n, space as r, addJsxTag as t };

//# sourceMappingURL=jsx-shared-BgBgis07.js.map