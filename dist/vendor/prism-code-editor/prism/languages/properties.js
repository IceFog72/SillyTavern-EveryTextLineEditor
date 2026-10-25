import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/properties.js
languages.properties = {
	"comment": /^[ 	]*[#!].*/m,
	"value": {
		pattern: /(^[ 	]*(?:\\[^]|[^\\\s:=])+(?: *[=:] *(?! )| ))(?:\\[^]|[^\\\n])+/m,
		lookbehind: true,
		alias: "attr-value"
	},
	"key": {
		pattern: /^[ 	]*(?:\\[^]|[^\\\s:=])+(?= *[=:]| )/m,
		alias: "attr-name"
	},
	"punctuation": /[=:]/
};
//#endregion

//# sourceMappingURL=properties.js.map