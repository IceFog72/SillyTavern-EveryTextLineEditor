import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/excel-formula.js
languages["xlsx"] = languages["xls"] = languages["excel-formula"] = {
	"comment": {
		pattern: /(\bn\(\s*)"(?:[^"]|"")*"(?=\s*\))/gi,
		lookbehind: true
	},
	"string": /"(?:[^"]|"")*"(?!")/g,
	"reference": {
		pattern: /(?:'[^']*'|(?:[^\s()[\]{}<>*?"';,$&]*\[[^^\s()[\]{}<>*?"']+\])?\w+)!/g,
		alias: "string",
		inside: {
			"operator": /!$/,
			"punctuation": /'/,
			"sheet": {
				pattern: /[^[\]]+$/,
				alias: "function"
			},
			"file": {
				pattern: /\[[^[\]]+\]$/,
				inside: { "punctuation": /[[\]]/ }
			},
			"path": /[^]+/
		}
	},
	"function-name": {
		pattern: /\b[a-z]\w*(?=\()/i,
		alias: "builtin"
	},
	"range": {
		pattern: /\$?\b(?:[a-z]+\$?\d+:\$?[a-z]+\$?\d+|[a-z]+:\$?[a-z]+|\d+:\$?\d+)\b/i,
		alias: "selector",
		inside: {
			"operator": /:/,
			"cell": /\$?[a-z]+\$?\d+/i,
			"column": /\$?[a-z]+/i,
			"row": /\$?\d+/
		}
	},
	"cell": {
		pattern: /\b[A-Z]+\d+\b|\$[a-zA-Z]+\$?\d+\b|\b[a-zA-Z]+\$\d+\b/,
		alias: "selector"
	},
	"number": /(?:\b\d+(?:\.\d+)?|\B\.\d+)(?:e[+-]?\d+)?\b/i,
	"boolean": /\b(?:false|true)\b/i,
	"operator": /[%&^,=/*+-]|<[=>]?|>=?/,
	"punctuation": /[()[\]{};|]/
};
//#endregion

//# sourceMappingURL=excel-formula.js.map