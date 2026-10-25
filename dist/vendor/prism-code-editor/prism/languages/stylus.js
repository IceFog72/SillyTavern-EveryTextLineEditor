import { a as languages, s as rest } from "../../core-Dr0o9A-8.js";
import { a as clikeString, i as clikePunctuation, n as clikeComment, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/stylus.js
var interpolation = {
	pattern: /\{[^\n}:]*\}/,
	alias: "variable",
	inside: { "delimiter": {
		pattern: /^\{|\}$/g,
		alias: "punctuation"
	} }
};
var func = {
	pattern: /[\w-]+\([^)]*\).*/,
	inside: { "function": /^[^(]+/ }
};
var inside = interpolation.inside[rest] = func.inside[rest] = {
	"comment": clikeComment,
	"url": /\burl\((["']?).*?\1\)/gi,
	"string": clikeString,
	"interpolation": interpolation,
	"func": func,
	"important": /\B!(?:important|optional)\b/i,
	"keyword": {
		pattern: /(^|\s)(?:(?:else|for|if|return|unless)(?!\S)|@[\w-]+)/,
		lookbehind: true
	},
	"hexcode": /#[a-f\d]{3,6}/i,
	"entity": /\\[a-f\d]{1,8}/i,
	"unit": {
		pattern: /(\b\d+)(?:%|[a-z]+)/,
		lookbehind: true
	},
	"boolean": boolean,
	"operator": /~|\*\*|[?%!=<>/*+]=?|[-:]=|\.{2,3}|&&|\|\||\B-\B|\b(?:and|in|is(?: a| defined| not|nt)?|not|or)\b/,
	"number": {
		pattern: /(^|[^\w.-])-?(?:\d+(?:\.\d+)?|\.\d+)/,
		lookbehind: true
	},
	"punctuation": clikePunctuation
};
languages.stylus = {
	"atrule-declaration": {
		pattern: /(^[ 	]*)@.*[^\s{]/m,
		lookbehind: true,
		inside: {
			"atrule": /^@[\w-]+/,
			[rest]: inside
		}
	},
	"variable-declaration": {
		pattern: /(^[ 	]*)[$\w-]+\s*.?=[ 	]*(?:\{[^{}]*\}|\S.*|$)/m,
		lookbehind: true,
		inside: {
			"variable": /^\S+/,
			[rest]: inside
		}
	},
	"statement": {
		pattern: /(^[ 	]*)(?:else|for|if|return|unless)[ 	].+/m,
		lookbehind: true,
		inside: {
			"keyword": /^\S+/,
			[rest]: inside
		}
	},
	"property-declaration": {
		pattern: /((?:^|\{)([ 	]*))(?:[\w-]|\{[^\n}]*\})+(?:\s*:\s*|[ 	]+)(?!\s)[^\n{]*(?:;|[^\n{,]$(?!\n(?:\{|\2[ 	])))/m,
		lookbehind: true,
		inside: {
			"property": {
				pattern: /^[^\s:]+/,
				inside: { "interpolation": interpolation }
			},
			[rest]: inside
		}
	},
	"selector": {
		pattern: /(^[ 	]*)(?:(?!\s)(?:[^(){}\n:]|::?[\w-]+(?:\([^\n)]*\)|(?![\w-]))|\{[^\n}]*\})+)(?:\n(?:\1(?:(?!\s)(?:[^(){}\n:]|::?[\w-]+(?:\([^\n)]*\)|(?![\w-]))|\{[^\n}]*\})+)))*(?=,$|\{|\n(?:\{|\1[ 	]))/m,
		lookbehind: true,
		inside: {
			"interpolation": interpolation,
			"comment": clikeComment,
			"punctuation": /[()[\]{},]/
		}
	},
	"func": func,
	"string": clikeString,
	"comment": clikeComment,
	"interpolation": interpolation,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=stylus.js.map