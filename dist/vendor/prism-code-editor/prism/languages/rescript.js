import { a as languages, s as rest } from "../../core-Dr0o9A-8.js";
import { n as clikeComment, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/rescript.js
languages.res = languages.rescript = {
	"comment": clikeComment,
	"char": /'(?:[^\\\n]|\\(?:.|\w+))'/g,
	"template-string": {
		pattern: /`(?:\\[^]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})*\}|(?!\$\{)[^\\`])*`/g,
		inside: {
			"template-punctuation": {
				pattern: /^`|`$/,
				alias: "string"
			},
			"interpolation": {
				pattern: /((?:^|[^\\])(?:\\\\)*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})*\}/,
				lookbehind: true,
				inside: {
					"interpolation-punctuation": {
						pattern: /^..|\}$/g,
						alias: "tag"
					},
					[rest]: "res"
				}
			},
			"string": /[^]+/
		}
	},
	"string": /"(?:\\[^]|[^\\\n"])*"/g,
	"class-name": /\b[A-Z]\w*|@[a-z.]*|#[a-zA-Z]\w*|#\d/,
	"function": {
		pattern: /[a-zA-Z]\w*(?=\()|(\.)[a-z]\w*/,
		lookbehind: true
	},
	"number": /(?:\b0x(?:[a-f\d]+(?:\.[a-f\d]*)?|\.[a-f\d]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
	"boolean": boolean,
	"attr-value": /[a-zA-Z]\w*(?==)/,
	"constant": {
		pattern: /(\btype\s+)[a-z]\w*/,
		lookbehind: true
	},
	"tag": {
		pattern: /(<)[a-z]\w*|(?:<\/)[a-z]\w*/,
		lookbehind: true,
		inside: { "operator": /[<>/]/ }
	},
	"keyword": /\b(?:and|as|assert|begin|bool|class|constraint|do|done|downto|else|end|exception|external|float|f?or|fun|function|if|include|inherit|initializer|int?|lazy|let|method|module|mutable|new|nonrec|object|of|open|private|rec|string|switch|[tw]hen|to|try|type|while|with)\b/,
	"operator": /\.{3}|:[:=]?|\|>|->|=>|==?=?|<=?|>=?|[~|^!?'#`]|[/*+-]\.?|\b(?:asr|land|ls[lr]|lx?or|mod)\b/,
	"punctuation": /[()[\]{}.,;]/
};
//#endregion

//# sourceMappingURL=rescript.js.map