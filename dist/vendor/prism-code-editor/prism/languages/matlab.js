import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/matlab.js
languages.matlab = {
	"comment": /%\{[^]*?\}%|%.+/,
	"string": /\B'(?:''|[^\n'])*'/g,
	"number": /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[eE][+-]?\d+)?(?:[ij])?|\b[ij]\b/,
	"keyword": /\b(?:NaN|break|case|catch|continue|else|elseif|end|for|function|in?f|otherwise|parfor|pause|pi|return|switch|try|while)\b/,
	"function": /\b(?!\d)\w+(?=\s*\()/,
	"operator": /\.?[\\^'/*]|[:@]|[~=<>+-]=?|&&?|\|\|?/,
	"punctuation": /\.{3}|[()[\]{}.,;!]/
};
//#endregion

//# sourceMappingURL=matlab.js.map