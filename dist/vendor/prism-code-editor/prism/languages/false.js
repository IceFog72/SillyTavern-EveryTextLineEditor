import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/false.js
/**
* Based on the manual by Wouter van Oortmerssen.
*
* @see {@link https://github.com/PrismJS/prism/issues/2801#issue-829717504}
*/
languages["false"] = {
	"comment": /\{[^}]*\}/,
	"string": /"[^"]*"/g,
	"character-code": {
		pattern: /'[^]/,
		alias: "number"
	},
	"assembler-code": {
		pattern: /\d+`/,
		alias: "important"
	},
	"number": /\d+/,
	"operator": /[#$?'.,:;@\\_`~ßø%&|^!=>/*+-]/,
	"punctuation": /[[\]]/,
	"variable": /[a-z]/,
	"non-standard": {
		pattern: /[()<BDO®]/,
		alias: "bold"
	}
};
//#endregion

//# sourceMappingURL=false.js.map