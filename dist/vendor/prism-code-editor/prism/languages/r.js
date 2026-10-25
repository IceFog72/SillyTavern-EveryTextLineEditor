import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/r.js
languages.r = {
	"comment": /#.*/,
	"string": /(["'])(?:\\.|(?!\1)[^\\\n])*\1/g,
	"percent-operator": {
		pattern: /%[^%\s]*%/,
		alias: "operator"
	},
	"boolean": /\b(?:FALSE|TRUE)\b/,
	"ellipsis": /\.\.(?:\.|\d+)/,
	"number": [/\b(?:Inf|NaN)\b/, /(?:\b0x[a-fA-F\d]+(?:\.\d*)?|\b\d+(?:\.\d*)?|\B\.\d+)(?:[EePp][+-]?\d+)?[iL]?/],
	"keyword": /\b(?:NA|NA_character_|NA_complex_|NA_integer_|NA_real_|NULL|break|else|for|function|if|in|next|repeat|while)\b/,
	"operator": /->>?|<=|<<?-|[!=<>]=?|::?|&&?|\|\|?|[~^$@/*+-]/,
	"punctuation": /[()[\]{},;]/
};
//#endregion

//# sourceMappingURL=r.js.map