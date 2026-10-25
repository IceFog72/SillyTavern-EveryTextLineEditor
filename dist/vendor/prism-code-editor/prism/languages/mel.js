import { a as languages } from "../../core-Dr0o9A-8.js";
import { n as clikeComment } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/mel.js
var statement = { pattern: /[^]+/ };
statement.inside = languages.mel = {
	"comment": clikeComment,
	"code": {
		pattern: /`(?:\\.|[^\\`])*`/g,
		alias: "italic",
		inside: {
			"delimiter": {
				pattern: /^`|`$/,
				alias: "punctuation"
			},
			"statement": statement
		}
	},
	"string": /"(?:\\.|[^\\\n"])*"/g,
	"variable": /\$\w+/,
	"number": /\b0x[a-fA-F\d]+\b|\b\d+(?:\.\d*)?|\B\.\d+/,
	"flag": {
		pattern: /-[^\d\W]\w*/,
		alias: "operator"
	},
	"keyword": /\b(?:break|case|continue|default|do|else|float|for|global|if|int?|matrix|proc|return|string|switch|vector|while)\b/,
	"function": {
		pattern: /((?:^|[{;])[ 	]*)[a-z_]\w*\b(?!\s*(?:\.(?!\.)|[[{=]))|\b[a-z_]\w*(?=[ 	]*\()/gim,
		lookbehind: true
	},
	"tensor-punctuation": {
		pattern: /<<|>>/,
		alias: "punctuation"
	},
	"operator": /--|\+\+|&&|\|\||[!=<>/*+-]=?|[%^]/,
	"punctuation": /[()[\]{}.,:;?]/
};
//#endregion

//# sourceMappingURL=mel.js.map