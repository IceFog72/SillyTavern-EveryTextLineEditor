import { a as languages } from "../../core-Dr0o9A-8.js";
import { n as clikeComment, t as boolean } from "../../patterns-DSInPV_c.js";
import { t as clikeClass } from "../../clike-class-CXD3NFPG.js";
//#region src/prism/languages/groovy.js
var expression = { pattern: /[^]+/ };
expression.inside = languages.groovy = {
	"comment": clikeComment,
	"shebang": {
		pattern: /#!.+/g,
		alias: "comment"
	},
	"interpolation-string": {
		pattern: /"""(?:\\[^]|[^\\])*?"""|(["/])(?:\\.|(?!\1)[^\\\n])*\1|\$\/(?:[^/$]|\$(?:[/$]|(?![/$]))|\/(?!\$))*\/\$/g,
		inside: {
			"interpolation": {
				pattern: /((?:^|[^\\$])(?:\\\\)*)\$(?:\w+|\{[^{}]*\})/,
				lookbehind: true,
				inside: {
					"interpolation-punctuation": {
						pattern: /^.\{?|\}$/g,
						alias: "punctuation"
					},
					"expression": expression
				}
			},
			"string": /[^]+/
		}
	},
	"string": /'''(?:\\[^]|[^\\])*?'''|'(?:\\.|[^\\\n'])*'/g,
	"class-name": clikeClass(),
	"keyword": /\b(?:abstract|as|assert|boolean|break|byte|case|catch|char|class|const|continue|def|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int?|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throws?|trait|transient|try|void|volatile|while)\b/,
	"boolean": boolean,
	"annotation": {
		pattern: /(^|[^.])@\w+/,
		lookbehind: true,
		alias: "punctuation"
	},
	"function": /\b\w+(?=\()/,
	"number": /\b(?:0b[01_]+|0x[a-f\d_]+(?:\.[a-f\d_p-]+)?|[\d_]+(?:\.[\d_]+)?(?:e[+-]?\d+)?)[glidf]?\b/i,
	"operator": {
		pattern: /(^|[^.])(?:~|==?~?|\?[.:]?|\*\.|\.[@&]|\.\.<|\.\.(?!\.)|--|\+\+|&&|\|\||\*\*=?|->|>>>?=?|<<=?|<=>?|[%&|^!=<>/*+-]=?)/,
		lookbehind: true
	},
	"spock-block": /\b(?:and|cleanup|expect|given|setup|[tw]hen|where):/,
	"punctuation": /\.+|[()[\]{},:;$]/
};
//#endregion

//# sourceMappingURL=groovy.js.map