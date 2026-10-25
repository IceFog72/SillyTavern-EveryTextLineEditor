import { a as languages } from "../../core-Dr0o9A-8.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/turtle.js
languages.trig = languages.turtle = {
	"comment": /#.*/g,
	"multiline-string": {
		pattern: /"""(?:\\.|[^\\])*?"""|'''(?:\\.|[^\\])*?'''/g,
		alias: "string",
		inside: { "comment": /#.*/ }
	},
	"string": /"(?:\\.|[^\\\n"])*"|'(?:\\.|[^\\\n'])*'/g,
	"url": {
		pattern: /<(?:[^\0- <>"{}|^`\\]|\\(?:u[a-fA-F\d]{4}|U[a-fA-F\d]{8}))*>/g,
		inside: { "punctuation": /<|>/ }
	},
	"function": {
		pattern: /(?:(?![-.\d\xb7])[-.\w\xb7\xc0-\ufffd]+)?:(?:(?![-.])(?:[-.:\w\xc0-\ufffd]|%[a-f\d]{2}|\\.)+)?/i,
		inside: {
			"local-name": {
				pattern: /(:)[^]+/,
				lookbehind: true
			},
			"prefix": {
				pattern: /[^]+/,
				inside: { "punctuation": /:/ }
			}
		}
	},
	"number": /[+-]?\b\d+(?:\.\d*)?(?:e[+-]?\d+)?/i,
	"punctuation": /[()[\]{}.,;]|\^\^/,
	"boolean": boolean,
	"keyword": [/(?:\ba|@prefix|@base)\b|=/, /\b(?:base|graph|prefix)\b/i],
	"tag": {
		pattern: /@[a-z]+(?:-[a-z\d]+)*/i,
		inside: { "punctuation": /@/ }
	}
};
//#endregion

//# sourceMappingURL=turtle.js.map