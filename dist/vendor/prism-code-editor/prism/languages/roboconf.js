import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/roboconf.js
languages.roboconf = {
	"comment": /#.*/,
	"keyword": {
		"pattern": /(^|\s)(?:(?:external|import)\b|(?:facet|instance of)(?=[ 	]+[\w-]+[ 	]*\{))/,
		lookbehind: true
	},
	"component": {
		pattern: /[\w-]+(?=[ 	]*\{)/,
		alias: "variable"
	},
	"property": /[\w.-]+(?=[ 	]*:)/,
	"value": {
		pattern: /(=[ 	]*(?![ 	]))[^,;]+/,
		lookbehind: true,
		alias: "attr-value"
	},
	"optional": {
		pattern: /\(optional\)/,
		alias: "builtin"
	},
	"wildcard": {
		pattern: /(\.)\*/,
		lookbehind: true,
		alias: "operator"
	},
	"punctuation": /[{}.,:;=]/
};
//#endregion

//# sourceMappingURL=roboconf.js.map