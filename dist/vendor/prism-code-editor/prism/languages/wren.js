import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/wren.js
languages.wren = {
	"comment": /\/\/.*|\/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|\/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|\/\*(?:[^*/]|\*(?!\/)|\/(?!\*))*\*\/)*\*\/)*\*\//g,
	"triple-quoted-string": {
		pattern: /"""[^]*?"""/g,
		alias: "string"
	},
	"string-literal": {
		pattern: /(^|[^\\"])"(?:\\[^]|[^\\"%]|%(?!\()|%\((?:[^()]|\((?:[^()]|\([^)]*\))*\))*\))*"/g,
		lookbehind: true,
		inside: {
			"interpolation": {
				pattern: /((?:^|[^\\])(?:\\\\)*)%\((?:[^()]|\((?:[^()]|\([^)]*\))*\))*\)/,
				lookbehind: true,
				inside: {
					"expression": {
						pattern: /^(..)[^]+(?=.)/,
						lookbehind: true,
						inside: "wren"
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
	"hashbang": {
		pattern: /^#!\/.+/g,
		alias: "comment"
	},
	"attribute": {
		pattern: /#!?[ 	　]*\w+/,
		alias: "keyword"
	},
	"class-name": {
		pattern: /(\bclass\s+)\w+|\b[A-Z][a-z\d_]*\b/,
		lookbehind: true
	},
	"constant": /\b[A-Z][A-Z\d_]*\b/,
	"null": {
		pattern: /\bnull\b/,
		alias: "keyword"
	},
	"keyword": /\b(?:as|break|class|construct|continue|else|for|foreign|i[fns]|import|return|static|super|this|var|while)\b/,
	"boolean": boolean,
	"number": /\b(?:0x[a-f\d]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b/i,
	"function": /\b[a-z_]\w*(?=\s*[({])/i,
	"operator": /<<|>>|[!=<>]=?|&&|\|\||[%&|^~?:/*+-]|\.{2,3}/,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=wren.js.map