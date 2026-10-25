import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/linker-script.js
languages["ld"] = languages["linker-script"] = {
	"identifier": /"[^\n"]*"/,
	"comment": {
		pattern: /(^|\s)\/\*[^]*?(?:$|\*\/)/g,
		lookbehind: true
	},
	"location-counter": {
		pattern: /\B\.\B/,
		alias: "important"
	},
	"section": {
		pattern: /(^|[^\w*])\.\w+/,
		lookbehind: true,
		alias: "keyword"
	},
	"function": /\b[A-Z][A-Z_]*(?=\s*\()/,
	"number": /\b(?:0[xX][a-fA-F\d]+|\d+)[KM]?\b/,
	"operator": /->|--|\+\+|&&|\|\||::|[?:~]|>>=?|<<=?|[%&|^!=<>/*+-]=?/,
	"punctuation": /[(){},;]/
};
//#endregion

//# sourceMappingURL=linker-script.js.map