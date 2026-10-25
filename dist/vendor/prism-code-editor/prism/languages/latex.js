import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/latex.js
var funcPattern = /\\(?:[^a-z()[\]]|[a-z*]+)/i;
var insideEqu = { "equation-command": {
	pattern: funcPattern,
	alias: "regex"
} };
languages.context = languages.tex = languages.latex = {
	"comment": /%.*/,
	"cdata": {
		pattern: /(\\begin\{((?:lstlisting|verbatim)\*?)\})(?!\\end\{\2\})[^]+?(?=\\end\{\2\})/,
		lookbehind: true
	},
	"equation": [{
		pattern: /\$\$(?:\\[^]|[^\\$])+\$\$|\$(?:\\[^]|[^\\$])+\$|\\\([^]*?\\\)|\\\[[^]*?\\\]/,
		inside: insideEqu,
		alias: "string"
	}, {
		pattern: /(\\begin\{((?:align|eqnarray|equation|gather|math|multline)\*?)\})(?!\\end\{\2\})[^]+?(?=\\end\{\2\})/,
		lookbehind: true,
		inside: insideEqu,
		alias: "string"
	}],
	"keyword": {
		pattern: /(\\(?:begin|cite|documentclass|end|label|ref|usepackage)(?:\[[^\]]+\])?\{)[^}]+(?=\})/,
		lookbehind: true
	},
	"url": {
		pattern: /(\\url\{)[^}]+(?=\})/,
		lookbehind: true
	},
	"headline": {
		pattern: /(\\(?:chapter|frametitle|paragraph|part|section|subparagraph|subsection|subsubparagraph|subsubsection|subsubsubparagraph)\*?(?:\[[^\]]+\])?\{)[^}]+(?=\})/,
		lookbehind: true,
		alias: "class-name"
	},
	"function": {
		pattern: funcPattern,
		alias: "selector"
	},
	"punctuation": /[[\]{}&]/
};
//#endregion

//# sourceMappingURL=latex.js.map