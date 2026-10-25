import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation, n as clikeComment, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/bicep.js
languages.bicep = {
	"comment": clikeComment,
	"property": {
		pattern: /(\n[ 	]*)(?:[a-z_]\w*(?=[ 	]*:)|'(?:\\.|\$(?!\{)|[^\\\n'$])*'(?=[ 	]*:))/gi,
		lookbehind: true
	},
	"string": [/'''[^'][^]*?'''/g, {
		pattern: /(^|[^\\'])'(?:\\.|\$(?!\{)|[^\\\n'$])*'/g,
		lookbehind: true
	}],
	"interpolated-string": {
		pattern: /(^|[^\\'])'(?:\\.|\$(?:(?!\{)|\{[^{}\n]*\})|[^\\\n'$])*'/g,
		lookbehind: true,
		inside: {
			"interpolation": {
				pattern: /\$\{[^{}\n]*\}/,
				inside: {
					"punctuation": /^..|\}$/g,
					"expression": {
						pattern: /[^]+/,
						inside: "bicep"
					}
				}
			},
			"string": /[^]+/
		}
	},
	"datatype": {
		pattern: /(\b(?:output|param)\b[ 	]+\w+[ 	]+)\w+/,
		lookbehind: true,
		alias: "class-name"
	},
	"boolean": boolean,
	"keyword": /\b(?:existing|for|if|in|module|null|output|param|resource|targetScope|var)\b/,
	"decorator": /@\w+/,
	"function": /\b[a-z_]\w*(?=[ 	]*\()/i,
	"number": /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
	"operator": /--|\+\+|=>|(?:\*\*|&&|\|\||\?\?|[!=]=|<<|>>>?|[%&|^!=<>/*+-])=?|\.{3}|\?\.?|[~:]/,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=bicep.js.map