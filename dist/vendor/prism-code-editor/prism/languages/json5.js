import { a as languages } from "../../core-Dr0o9A-8.js";
import { r as extend } from "../../language-CXbc22uF.js";
import { a as clikeString } from "../../patterns-DSInPV_c.js";
import "./json.js";
//#region src/prism/languages/json5.js
languages.json5 = extend("json", {
	"property": [RegExp(clikeString.source + "(?=\\s*:)"), {
		pattern: /(?!\d)(?:(?!\s)[$\w\xa0-\uffff])+(?=\s*:)/,
		alias: "unquoted"
	}],
	"string": clikeString,
	"number": /[+-]?\b(?:NaN|Infinity|0x[a-fA-F\d]+)\b|[+-]?(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[eE][+-]?\d+\b)?/
});
//#endregion

//# sourceMappingURL=json5.js.map