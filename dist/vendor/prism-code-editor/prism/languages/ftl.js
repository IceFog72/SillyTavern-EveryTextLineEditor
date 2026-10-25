import { a as languages, c as tokenize, s as rest } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation, t as boolean } from "../../patterns-DSInPV_c.js";
import { n as re, t as nested } from "../../shared-oTKIFAwH.js";
import { t as embeddedIn } from "../../templating-BdhIX5ID.js";
import "./markup.js";
//#region src/prism/languages/ftl.js
var FTL_EXPR = [nested("[^<()\"']|\\((?:<self>)*\\)|<(?!#--)|<#--(?:[^-]|-(?!->))*-->|\"(?:\\\\.|[^\\\\\"])*\"|'(?:\\\\.|[^\\\\'])*'", 2)];
var interpolationInside = { "interpolation-punctuation": {
	pattern: /^..|\}$/g,
	alias: "punctuation"
} };
var ftl = interpolationInside[rest] = {
	"comment": /<#--[^]*?-->/,
	"string": [/\br(["'])(?:\\.|(?!\1)[^\\])*\1/g, {
		pattern: re("([\"'])(?:\\\\.|(?!\\1|\\$\\{)[^\\\\]|\\$\\{(?:(?!\\})<0>)*\\})*\\1", FTL_EXPR, "g"),
		inside: { "interpolation": {
			pattern: re("((?:^|[^\\\\])(?:\\\\\\\\)*)\\$\\{(?:(?!\\})<0>)*\\}", FTL_EXPR),
			lookbehind: true,
			inside: interpolationInside
		} }
	}],
	"keyword": /\b(?:as)\b/,
	"boolean": boolean,
	"builtin-function": {
		pattern: /((?:^|[^?])\?\s*)\w+/,
		lookbehind: true,
		alias: "function"
	},
	"function": /\b\w+(?=\s*\()/,
	"number": /\b\d+(?:\.\d+)?\b/,
	"operator": /\.\.[<*!]?|->|--|\+\+|&&|\|\||\?\??|[%!=<>/*+-]=?|\b[gl]te?\b/,
	"punctuation": clikePunctuation
};
languages.ftl = {
	"ftl-comment": {
		pattern: /<#--[^]*?-->/g,
		alias: "comment"
	},
	"ftl-directive": {
		pattern: re("</?[#@][a-zA-Z]<0>*?>", FTL_EXPR, "gi"),
		inside: {
			"punctuation": /^<\/?|\/?>$/,
			"directive": {
				pattern: /^[#@][a-z]\w*/i,
				alias: "keyword"
			},
			"ftl": {
				pattern: /\s*\S[^]*/,
				alias: "language-ftl",
				inside: ftl
			}
		}
	},
	"ftl-interpolation": {
		pattern: re("\\$\\{<0>*?\\}", FTL_EXPR, "gi"),
		inside: {
			"punctuation": /^..|\}$/g,
			"ftl": {
				pattern: /\s*\S[^]*/,
				alias: "language-ftl",
				inside: ftl
			}
		}
	},
	[tokenize]: embeddedIn("html")
};
//#endregion

//# sourceMappingURL=ftl.js.map