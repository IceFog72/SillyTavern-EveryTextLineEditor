import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/prolog.js
languages.prolog = {
	"comment": /\/\*[^]*?\*\/|%.*/g,
	"string": /(["'])(?:\1\1|\\[^]|(?!\1)[^\\\n])*\1(?!\1)/g,
	"builtin": /\b(?:fx|fy|xf[xy]?|yfx?)\b/,
	"function": /\b[a-z]\w*(?:(?=\()|\/\d+)/,
	"number": /\b\d+(?:\.\d*)?/,
	"operator": /[\\$?@.:;|^!=<>/*+-]+|\b(?:is|mod|not|xor)\b/,
	"punctuation": /[()[\]{},]/
};
//#endregion

//# sourceMappingURL=prolog.js.map