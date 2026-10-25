import { a as languages } from "../../core-Dr0o9A-8.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/jexl.js
languages.jexl = {
	"string": /(["'])(?:\\[^]|(?!\1)[^\\])*\1/,
	"transform": {
		pattern: /(\|\s*)[a-zA-Zа-яА-Я_\xc0-\xd6\xd8-\xf6\xf8-\xff$][\wа-яА-Я\xc0-\xd6\xd8-\xf6\xf8-\xff$]*/,
		alias: "function",
		lookbehind: true
	},
	"function": /[a-zA-Zа-яА-Я_\xc0-\xd6\xd8-\xf6\xf8-\xff$][\wа-яА-Я\xc0-\xd6\xd8-\xf6\xf8-\xff$]*\s*(?=\()/,
	"number": /\b\d+(?:\.\d+)?\b|\B\.\d+\b/,
	"operator": /[!<>]=?|&&|==|\|\||\/\/|[?:%|^/*+-]/,
	"boolean": boolean,
	"keyword": /\bin\b/,
	"punctuation": /[()[\]{}.,]/
};
//#endregion

//# sourceMappingURL=jexl.js.map