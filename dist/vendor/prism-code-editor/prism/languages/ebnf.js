import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/ebnf.js
languages.ebnf = {
	"comment": /\(\*[^]*?\*\)/,
	"string": /"[^\n"]*"|'[^\n']*'/g,
	"special": {
		pattern: /\?[^\n?]*\?/g,
		alias: "class-name"
	},
	"definition": {
		pattern: /^([ 	]*)[a-z]\w*(?:[ 	]+[a-z]\w*)*(?=\s*=)/im,
		lookbehind: true,
		alias: "rule keyword"
	},
	"rule": /\b[a-z]\w*(?:[ 	]+[a-z]\w*)*\b/i,
	"punctuation": /\([:/]|[:/]\)|[()[\]{}.,;]/,
	"operator": /[|!=/*-]/
};
//#endregion

//# sourceMappingURL=ebnf.js.map