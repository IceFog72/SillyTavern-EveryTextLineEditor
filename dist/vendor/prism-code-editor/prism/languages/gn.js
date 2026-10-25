import { a as languages } from "../../core-Dr0o9A-8.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/gn.js
var expression = { pattern: /[^]+/ };
expression.inside = languages.gni = languages.gn = {
	"comment": /#.*/,
	"string-literal": {
		pattern: /(^|[^\\"])"(?:\\.|[^\\\n"])*"/g,
		lookbehind: true,
		inside: {
			"interpolation": {
				pattern: /((?:^|[^\\])(?:\\\\)*)\$(?:\{[^]*?\}|(?!\d)\w+|0x[a-fA-F\d]{2})/,
				lookbehind: true,
				inside: {
					"number": /^\$0.+/,
					"variable": /^\$\w+/,
					"interpolation-punctuation": {
						pattern: /^..|\}$/g,
						alias: "punctuation"
					},
					"expression": expression
				}
			},
			"string": /[^]+/
		}
	},
	"keyword": /\b(?:else|if)\b/,
	"boolean": boolean,
	"builtin-function": {
		pattern: /\b(?:assert|defined|foreach|import|[pt]ool|print|template|toolchain)(?=\s*\()/i,
		alias: "keyword"
	},
	"function": /\b[a-z_]\w*(?=\s*\()/i,
	"constant": /\b(?:current_cpu|current_os|current_toolchain|default_toolchain|host_cpu|host_os|root_build_dir|root_gen_dir|root_out_dir|target_cpu|target_gen_dir|target_os|target_out_dir)\b/,
	"number": /-?\b\d+\b/,
	"operator": /[!=<>+-]=?|&&|\|\|/,
	"punctuation": /[()[\]{}.,]/
};
//#endregion

//# sourceMappingURL=gn.js.map