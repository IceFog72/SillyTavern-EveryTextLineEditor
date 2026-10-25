import { a as languages } from "../../core-Dr0o9A-8.js";
import { n as re } from "../../shared-oTKIFAwH.js";
var stringLiteral = re(`(^|[^\\\\#"'])(#*)(?:"""(?:[^\\\\"]|"(?!""\\2)|<0>)*"""|'''(?:[^\\\\']|'(?!''\\2)|<0>)*'''|"(?:[^\\\\\n"]|"(?!\\2)|<0>)*"|'(?:[^\\\\\n']|'(?!\\2)|<0>)*')(?!["'])\\2`, ["\\\\(?:(?!\\2)|\\2(?:[^()\n]|\\([^()]*\\)))"], "g");
var expression = { pattern: /[^]+/ };
expression.inside = languages.cue = {
	"comment": /\/\/.*/,
	"string-literal": {
		pattern: stringLiteral,
		lookbehind: true,
		inside: {
			"escape": {
				pattern: /(?=[^]*["'](#*)$)\\\1(?:U[a-fA-F\d]{1,8}|u[a-fA-F\d]{1,4}|x[a-fA-F\d]{1,2}|\d{2,3}|[^(])/g,
				alias: "string"
			},
			"interpolation": {
				pattern: /(?=[^]*["'](#*)$)\\\1\([^()]*\)/g,
				inside: {
					"punctuation": /^\\#*\(|\)$/,
					"expression": expression
				}
			},
			"string": /[^]+/
		}
	},
	"keyword": {
		pattern: /(^|[^$\w])(?:for|if|import|in|let|null|package)(?![$\w])/,
		lookbehind: true
	},
	"boolean": {
		pattern: /(^|[^$\w])(?:false|true)(?![$\w])/,
		lookbehind: true
	},
	"builtin": {
		pattern: /(^|[^$\w])(?:bool|bytes|float(?:32|64)?|u?int(?:8|16|32|64|128)?|number|rune|string)(?![$\w])/,
		lookbehind: true
	},
	"attribute": {
		pattern: /@[$\w]+(?=\s*\()/,
		alias: "function"
	},
	"function": {
		pattern: /(^|[^$\w])[a-z_$][$\w]*(?=\s*\()/i,
		lookbehind: true
	},
	"number": {
		pattern: /(^|[^$\w.])(?:0b[01]+(?:_[01]+)*|0o[0-7]+(?:_[0-7]+)*|0[xX][a-fA-F\d]+(?:_[a-fA-F\d]+)*|(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[eE][+-]?\d+(?:_\d+)*)?(?:[KMGTP]i?)?)(?![$\w])/,
		lookbehind: true
	},
	"operator": /\.{3}|_\|_|&&?|\|\|?|[!=]~|[<>!=]=?|[?/*+-]/,
	"punctuation": /[()[\]{}.,:]/
};
//#endregion

//# sourceMappingURL=cue.js.map