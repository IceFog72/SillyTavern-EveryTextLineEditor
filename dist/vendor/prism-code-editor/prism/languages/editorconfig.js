import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/editorconfig.js
languages.editorconfig = {
	"comment": /[;#].*/,
	"section": {
		pattern: /(^[ 	]*)\[.+\]/m,
		lookbehind: true,
		alias: "selector",
		inside: {
			"regex": /\\\\[[\]{}.,?!*]/,
			"operator": /[!?]|\.\.|\*\*?/,
			"punctuation": /[[\]{},]/
		}
	},
	"key": {
		pattern: /(^[ 	]*)[^\s=]+(?=[ 	]*=)/m,
		lookbehind: true,
		alias: "attr-name"
	},
	"value": {
		pattern: /=.*/,
		alias: "attr-value",
		inside: { "punctuation": /^=/ }
	}
};
//#endregion

//# sourceMappingURL=editorconfig.js.map