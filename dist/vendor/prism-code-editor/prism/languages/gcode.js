import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/gcode.js
languages.gcode = {
	"comment": /;.*|\B\(.*?\)\B/,
	"string": /"(?:""|[^"])*"/g,
	"keyword": /\b[GM]\d+(?:\.\d+)?\b/,
	"property": /\b[A-Z]/,
	"checksum": {
		pattern: /(\*)\d+/,
		lookbehind: true,
		alias: "number"
	},
	"punctuation": /[:*]/
};
//#endregion

//# sourceMappingURL=gcode.js.map