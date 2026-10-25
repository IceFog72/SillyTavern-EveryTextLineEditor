import { a as languages } from "../../core-Dr0o9A-8.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
import { n as re } from "../../shared-oTKIFAwH.js";
//#region src/prism/languages/toml.js
/** @param {string} pattern */
var insertKey = (pattern) => re(pattern, [`(?:[\\w-]+|'[^\n']*'|"(?:\\\\.|[^\\\\"\n])*")`], "mg");
languages.toml = {
	"comment": /#.*/g,
	"table": {
		pattern: insertKey("(^[ 	]*\\[\\s*(?:\\[\\s*)?)<0>(?:\\s*\\.\\s*<0>)*(?=\\s*\\])"),
		lookbehind: true,
		alias: "class-name"
	},
	"key": {
		pattern: insertKey("(^[ 	]*|[{,]\\s*)<0>(?:\\s*\\.\\s*<0>)*(?=\\s*=)"),
		lookbehind: true,
		alias: "property"
	},
	"string": /"""(?:\\[^]|[^\\])*?"""|'''[^]*?'''|'[^\n']*'|"(?:\\.|[^\\\n"])*"/g,
	"date": {
		pattern: /\b(?:\d{4}-\d\d-\d\d(?:[t\s]\d\d:\d\d:\d\d(?:\.\d+)?(?:z|[+-]\d\d:\d\d)?)?|\d\d:\d\d:\d\d(?:\.\d+)?)\b/i,
		alias: "number"
	},
	"number": /(?:\b0(?:x[a-zA-Z\d]+(?:_[a-zA-Z\d]+)*|o[0-7]+(?:_[0-7]+)*|b[10]+(?:_[10]+)*))\b|[+-]?\b\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?\b|[+-]?\b(?:inf|nan)\b/,
	"boolean": boolean,
	"punctuation": /[[\]{}.,=]/
};
//#endregion

//# sourceMappingURL=toml.js.map