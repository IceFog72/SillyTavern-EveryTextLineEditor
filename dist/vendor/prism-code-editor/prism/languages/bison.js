import { a as languages, s as rest } from "../../core-Dr0o9A-8.js";
import { n as clone } from "../../language-CXbc22uF.js";
import "./c.js";
//#region src/prism/languages/bison.js
languages.bison = Object.assign({ "bison": {
	pattern: /^(?:[^%]|%(?!%))*%%[^]*?%%/,
	inside: {
		"c": {
			pattern: /%\{[^]*?%\}|\{(?:[^{}]|\{[^}]*\})*\}/,
			inside: {
				"delimiter": {
					pattern: /^%?\{|%?\}$/g,
					alias: "punctuation"
				},
				"bison-variable": {
					pattern: /[$@](?:<[^\s>]+>)?[$\w]+/,
					alias: "variable",
					inside: { "punctuation": /<|>/ }
				},
				[rest]: languages.c
			}
		},
		"comment": languages.c.comment,
		"string": languages.c.string,
		"property": /\S+(?=:)/,
		"keyword": /%\w+/,
		"number": {
			pattern: /(^|[^@])\b(?:0x[a-f\d]+|\d+)/i,
			lookbehind: true
		},
		"punctuation": /%[%?]|[|:;[\]<>]/
	}
} }, clone(languages.c));
//#endregion

//# sourceMappingURL=bison.js.map