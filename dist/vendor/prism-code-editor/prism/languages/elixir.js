import { a as languages, s as rest } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/elixir.js
var interpolationInside = { "delimiter": {
	pattern: /^..|\}$/g,
	alias: "punctuation"
} };
interpolationInside[rest] = languages.elixir = {
	"doc": {
		pattern: /@(?:doc|moduledoc)\s+(?:("""|''')[^]*?\1|(["'])(?:\\[^]|(?!\2)[^\\\n])*\2)/,
		inside: {
			"attribute": /^@\w+/,
			"string": /["'][^]+/
		}
	},
	"comment": /#.*/g,
	"regex": /~[rR](?:("""|''')(?:\\[^]|(?!\1)[^\\])+\1|([/|"'])(?:\\.|(?!\2)[^\\\n])+\2|\((?:\\.|[^\\)\n])+\)|\[(?:\\.|[^\\\]\n])+\]|\{(?:\\.|[^\\}\n])+\}|<(?:\\.|[^\\>\n])+>)[uismxfr]*/g,
	"string": {
		pattern: /~[cCsSwW](?:("""|''')(?:\\[^]|(?!\1)[^\\])+\1|([/|"'])(?:\\.|(?!\2)[^\\\n])+\2|\((?:\\.|[^\\)\n])+\)|\[(?:\\.|[^\\\]\n])+\]|\{(?:\\.|#\{[^}]+\}|#(?!\{)|[^\\\n#}])+\}|<(?:\\.|[^\\>\n])+>)[csa]?|("""|''')[^]*?\3|(["'])(?:\\[^]|(?!\4)[^\\\n])*\4/g,
		inside: { "interpolation": {
			pattern: /#\{[^}]+\}/,
			inside: interpolationInside
		} }
	},
	"atom": {
		pattern: /(^|[^:]):\w+/,
		lookbehind: true,
		alias: "symbol"
	},
	"module": {
		pattern: /\b[A-Z]\w*\b/,
		alias: "class-name"
	},
	"attr-name": /\b\w+\??:(?!:)/,
	"argument": {
		pattern: /(^|[^&])&\d+/,
		lookbehind: true,
		alias: "variable"
	},
	"attribute": {
		pattern: /@\w+/,
		alias: "variable"
	},
	"function": /\b(?!\d)\w+[?!]?(?:(?=\s*(?:\.\s*)?\()|(?=\/\d))/,
	"number": /\b(?:0[box][a-f\d_]+|\d[\d_]*)(?:\.[\d_]+)?(?:e[+-]?[\d_]+)?\b/i,
	"keyword": /\b(?:after|alias|[ae]nd|case|catch|cond|def(?:callback|delegate|exception|impl|macro|module|n?p?|protocol|struct)|do|else|fn|f?or|if|import|not|quote|raise|require|rescue|try|unless|unquote|use|when)\b/,
	"boolean": /\b(?:false|true|nil)\b/,
	"operator": [
		/\bin\b|&&?|\|[|>]?|\\\\|::|\.{2,3}|\+\+?|-[->]?|<[=>-]|>=|!==?|\B!|=(?:==?|[>~])?|[*/^]/,
		{
			pattern: /([^<])<(?!<)/,
			lookbehind: true
		},
		{
			pattern: /([^>])>(?!>)/,
			lookbehind: true
		}
	],
	"punctuation": /<<|>>|[()[\]{}.,%]/
};
//#endregion

//# sourceMappingURL=elixir.js.map