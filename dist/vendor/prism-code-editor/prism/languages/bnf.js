import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/bnf.js
languages.rbnf = languages.bnf = {
	"string": /"[^\n"]*"|'[^\n']*'/,
	"definition": {
		pattern: /<[^<>\n	]+>(?=\s*::=)/,
		alias: "rule keyword",
		inside: { "punctuation": /^<|>$/ }
	},
	"rule": {
		pattern: /<[^<>\n	]+>/,
		inside: { "punctuation": /^<|>$/ }
	},
	"operator": /::=|[|()[\]{}*+?]|\.{3}/
};
//#endregion

//# sourceMappingURL=bnf.js.map