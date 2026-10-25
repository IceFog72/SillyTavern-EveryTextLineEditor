import { a as languages, s as rest } from "../../core-Dr0o9A-8.js";
import { n as re, t as nested } from "../../shared-oTKIFAwH.js";
import "./scheme.js";
//#region src/prism/languages/lilypond.js
var schemeExpression = nested("\\((?:\\\\[\\s\\S]|[^\\\\\"();#]|;.*(?!.)|\"(?:\\\\.|[^\\\\\"])*\"|#(?:\\{(?:(?!#\\})[\\s\\S])*#\\}|[^{])|<self>)*\\)", 5);
var inside = {
	pattern: /[^]+/,
	alias: "language-lilypond"
};
inside.inside = languages.ly = languages.lilypond = {
	"comment": /%\{[^]*?%\}|%.*/,
	"embedded-scheme": {
		pattern: re("(^|[=\\s])#(?:\"(?:\\\\.|[^\\\\\"])*\"|[^\\s()\"]*(?:[^\\s()]|<0>))", [schemeExpression], "mg"),
		lookbehind: true,
		inside: {
			"scheme": {
				pattern: /(?!^)[^]+/,
				alias: "language-scheme",
				inside: {
					"embedded-lilypond": {
						pattern: /#\{[^]*?#\}/g,
						inside: {
							"punctuation": /^..|#\}$/g,
							"lilypond": inside
						}
					},
					[rest]: languages.scheme
				}
			},
			"punctuation": /#/
		}
	},
	"string": /"(?:\\.|[^\\"])*"/g,
	"class-name": {
		pattern: /(\\new\s+)[\w-]+/,
		lookbehind: true
	},
	"keyword": {
		pattern: /\\[a-z][-\w]*/i,
		inside: { "punctuation": /^\\/ }
	},
	"operator": /[=|]|<<|>>/,
	"punctuation": {
		pattern: /(^|[a-z\d])(?:'+|,+|[_^]?-[_^]?(?:[!>._^+-]|(?=\d))|[_^]\.?|[.!])|[()[\]{}<>^~]|\\[()[\]<>\\!]|--|__/,
		lookbehind: true
	},
	"number": /\b\d+(?:\/\d+)?\b/
};
//#endregion

//# sourceMappingURL=lilypond.js.map