import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/brainfuck.js
languages.brainfuck = {
	"pointer": {
		pattern: /<|>/,
		alias: "keyword"
	},
	"increment": {
		pattern: /\+/,
		alias: "inserted"
	},
	"decrement": {
		pattern: /-/,
		alias: "deleted"
	},
	"branching": {
		pattern: /[[\]]/,
		alias: "important"
	},
	"operator": /[.,]/,
	"comment": /\S+/
};
//#endregion

//# sourceMappingURL=brainfuck.js.map