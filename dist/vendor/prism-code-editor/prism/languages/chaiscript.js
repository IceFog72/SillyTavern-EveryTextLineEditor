import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation, n as clikeComment, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/chaiscript.js
languages.chaiscript = {
	"comment": clikeComment,
	"string-interpolation": {
		pattern: /(^|[^\\])"(?:\\[^]|[^\\$"]|\$(?!\{)|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})*\})*"/g,
		lookbehind: true,
		inside: {
			"interpolation": {
				pattern: /((?:^|[^\\])(?:\\\\)*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})*\}/,
				lookbehind: true,
				inside: {
					"interpolation-expression": {
						pattern: /(..)[^]+(?=.)/,
						lookbehind: true,
						inside: "chaiscript"
					},
					"interpolation-punctuation": {
						pattern: /.+/,
						alias: "punctuation"
					}
				}
			},
			"string": /[^]+/
		}
	},
	"string": {
		pattern: /(^|[^\\])'(?:\\[^]|[^\\'])*'/g,
		lookbehind: true
	},
	"class-name": [{
		pattern: /(\bclass\s+)\w+/,
		lookbehind: true
	}, {
		pattern: /(\b(?:attr|def)\s+)\w+(?=\s*::)/,
		lookbehind: true
	}],
	"keyword": /\b(?:attr|auto|break|case|catch|class|continue|def|default|else|finally|for|fun|global|if|return|switch|this|try|var|while)\b/,
	"boolean": boolean,
	"function": /\b\w+(?=\()/,
	"number": [/(?:\b0b[01']+|\b0x(?:[a-f\d']+(?:\.[a-f\d']*)?|\.[a-f\d']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/gi, /\b(?:Infinity|NaN)\b/],
	"parameter-type": {
		pattern: /([,(]\s*)\w+(?=\s+\w)/,
		lookbehind: true,
		alias: "class-name"
	},
	"operator": /:[:=]|--|\+\+|&&|\|\||>>=?|<<=?|[%&|^!=<>/*+-]=?|[?:~]|`[^\n`]{1,4}`/,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=chaiscript.js.map