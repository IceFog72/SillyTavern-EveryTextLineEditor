import { a as languages } from "../../core-Dr0o9A-8.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/erlang.js
languages.erlang = {
	"comment": /%.+/,
	"string": /"(?:\\.|[^\\\n"])*"/g,
	"quoted-function": {
		pattern: /'(?:\\.|[^\\\n'])+'(?=\()/,
		alias: "function"
	},
	"quoted-atom": {
		pattern: /'(?:\\.|[^\\\n'])+'/,
		alias: "atom"
	},
	"boolean": boolean,
	"keyword": /\b(?:after|begin|case|catch|end|fun|if|of|receive|try|when)\b/,
	"number": [
		/\$\\?./,
		/\b\d+#[a-z\d]+/i,
		/(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i
	],
	"function": /\b[a-z][\w@]*(?=\()/,
	"variable": {
		pattern: /(^|[^@])(?:\b|\?)[A-Z_][\w@]*/,
		lookbehind: true
	},
	"operator": [
		/[:=<>/]=|=[:/]=|\+\+?|--?|[!=/*]|\b(?:andalso|b?and|b?not|b?x?or|bs[lr]|div|orelse|rem)\b/,
		{
			pattern: /(^|[^<])<(?!<)/,
			lookbehind: true
		},
		{
			pattern: /(^|[^>])>(?!>)/,
			lookbehind: true
		}
	],
	"atom": /\b[a-z][\w@]*/,
	"punctuation": /[()[\]{}.,:;#|]|<<|>>/
};
//#endregion

//# sourceMappingURL=erlang.js.map