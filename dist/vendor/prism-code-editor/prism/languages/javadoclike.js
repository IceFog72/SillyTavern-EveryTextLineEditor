import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/javadoclike.js
languages.javadoclike = {
	"parameter": {
		pattern: /(^[ 	]*(?:\/{3}|\*|\/\*\*)\s*@(?:arg|arguments|param)\s+)\w+/m,
		lookbehind: true
	},
	"keyword": {
		pattern: /(^[ 	]*(?:\/{3}|\*|\/\*\*)\s*|\{)@[a-z][a-zA-Z-]+\b/m,
		lookbehind: true
	},
	"punctuation": /[{}]/
};
//#endregion

//# sourceMappingURL=javadoclike.js.map