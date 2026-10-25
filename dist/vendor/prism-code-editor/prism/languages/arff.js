import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/arff.js
languages.arff = {
	"comment": /%.*/,
	"string": /(["'])(?:\\.|(?!\1)[^\\\n])*\1/g,
	"keyword": /@(?:attribute|data|end|relation)\b/i,
	"number": /\b\d+(?:\.\d+)?\b/,
	"punctuation": /[{},]/
};
//#endregion

//# sourceMappingURL=arff.js.map