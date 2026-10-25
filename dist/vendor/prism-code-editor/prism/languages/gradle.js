import { a as languages } from "../../core-Dr0o9A-8.js";
import { n as clikeComment, t as boolean } from "../../patterns-DSInPV_c.js";
import { t as clikeClass } from "../../clike-class-CXD3NFPG.js";
//#region src/prism/languages/gradle.js
var expression = { pattern: /[^]+/ };
expression.inside = languages.gradle = {
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
	"keyword": /\b(?:apply|def|dependencies|else|if|implementation|import|plugins?|project|repositories|repository|sourceSets|tasks|val)\b/,
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

//# sourceMappingURL=gradle.js.map