import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation, n as clikeComment, r as clikeNumber, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/reason.js
languages.reason = {
	"comment": clikeComment,
	"string": /"(?:\\[^]|[^\\\n"])*"/g,
	"char": /'(?:\\x[a-f\d]{2}|\\o[0-3][0-7][0-7]|\\\d{3}|\\.|[^\\\n'])'/g,
	"constructor": /\b[A-Z]\w*\b(?!\s*\.)/,
	"label": {
		pattern: /\b[a-z]\w*(?=::)/,
		alias: "symbol"
	},
	"class-name": /\b[A-Z]\w*/,
	"keyword": /\b(?:and|as|assert|begin|class|constraint|do|done|downto|else|end|exception|external|f?or|fun|function|functor|if|in|include|inherit|initializer|lazy|let|method|module|mutable|new|nonrec|object|of|open|private|rec|sig|struct|switch|[tw]hen|to|try|type|val|virtual|while|with)\b/,
	"boolean": boolean,
	"number": clikeNumber,
	"operator": /\.{3}|:[:=]|[|-]>|=>|==?=?|<=?|>=?|[|^?'#!~`]|[/*+-]\.?|\b(?:asr|land|ls[lr]|lx?or|mod)\b/,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=reason.js.map