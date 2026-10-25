import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/smali.js
languages.smali = {
	"comment": /#.*/,
	"string": /"(?:\\.|[^\\\n"])*"|'(?:[^\\\n']|\\(?:.|u[a-fA-F\d]{4}))'/g,
	"class-name": {
		pattern: /(^|[^L])L(?:(?:\w+|`[^\n`]*`)\/)*(?:[$\w]+|`[^\n`]*`)(?=\s*;)/,
		lookbehind: true,
		inside: {
			"class-name": {
				pattern: /(^L|\/)(?:[$\w]+|`[^\n`]*`)$/,
				lookbehind: true
			},
			"namespace": {
				pattern: /^(L)(?:(?:\w+|`[^\n`]*`)\/)+/,
				lookbehind: true,
				inside: { "punctuation": /\// }
			},
			"builtin": /^L/
		}
	},
	"builtin": [{
		pattern: /([()[;])[BCDFIJSVZ]+/,
		lookbehind: true
	}, {
		pattern: /([$\w>]:)[BCDFIJSVZ]/,
		lookbehind: true
	}],
	"keyword": [
		{
			pattern: /(\.end\s+)[\w-]+/,
			lookbehind: true
		},
		{
			pattern: /(^|[^\w.-])\.(?!\d)[\w-]+/,
			lookbehind: true
		},
		{
			pattern: /(^|[^\w.-])(?:abstract|annotation|bridge|constructor|enum|final|interface|private|protected|public|runtime|static|synthetic|system|transient)(?![\w.-])/,
			lookbehind: true
		}
	],
	"function": {
		pattern: /(^|[^\w.-])(?:\w+|<[$\w-]+>)(?=\()/,
		lookbehind: true
	},
	"field": {
		pattern: /[$\w]+(?=:)/,
		alias: "variable"
	},
	"register": {
		pattern: /(^|[^\w.-])[vp]\d(?![\w.-])/,
		lookbehind: true,
		alias: "variable"
	},
	"boolean": {
		pattern: /(^|[^\w.-])(?:false|true)(?![\w.-])/,
		lookbehind: true
	},
	"number": {
		pattern: /(^|[^/\w.-])-?(?:NaN|Infinity|0x(?:[a-f\d]+(?:\.[a-f\d]*)?|\.[a-f\d]+)(?:p[+-]?[a-f\d]+)?|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)[dflst]?(?![\w.-])/i,
		lookbehind: true
	},
	"label": {
		pattern: /(:)\w+/,
		lookbehind: true,
		alias: "property"
	},
	"operator": /->|\.\.|[[=]/,
	"punctuation": /[(){},:;]/
};
//#endregion

//# sourceMappingURL=smali.js.map