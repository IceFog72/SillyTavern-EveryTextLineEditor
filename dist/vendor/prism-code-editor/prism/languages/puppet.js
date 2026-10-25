import { a as languages, s as rest } from "../../core-Dr0o9A-8.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/puppet.js
var interpolation = [{
	pattern: /(^|[^\\])\$\{(?:[^{}"']|\{[^}]*\}|(["'])(?:\\[^]|(?!\2)[^\\])*\2)+\}/,
	lookbehind: true,
	inside: {
		"short-variable": {
			pattern: /(^\$\{)(?!\w+\()(?:::)?\w+(?:::\w+)*/,
			lookbehind: true,
			alias: "variable",
			inside: { "punctuation": /::/ }
		},
		"delimiter": {
			pattern: /^\$/,
			alias: "variable"
		}
	}
}, {
	pattern: /(^|[^\\])\$(?:::)?\w+(?:::\w+)*/,
	lookbehind: true,
	alias: "variable",
	inside: { "punctuation": /::/ }
}];
interpolation[0].inside[rest] = languages.puppet = {
	"heredoc": [
		{
			pattern: /(@\("([^\n"/):]+)"(?:\/[nrts$uL]*)?\).*\n)(?:.*\n)*?[ 	]*(?:\|[ 	]*)?(?:-[ 	]*)?\2/,
			lookbehind: true,
			alias: "string",
			inside: {
				"punctuation": /(?!\s).*\S(?= *$)/,
				"interpolation": interpolation
			}
		},
		{
			pattern: /(@\(([^\n"/):]+)(?:\/[nrts$uL]*)?\).*\n)(?:.*\n)*?[ 	]*(?:\|[ 	]*)?(?:-[ 	]*)?\2/g,
			lookbehind: true,
			alias: "string",
			inside: { "punctuation": /(?!\s).*\S(?= *$)/ }
		},
		{
			pattern: /@\("?(?:[^\n"/):]+)"?(?:\/[nrts$uL]*)?\)/,
			alias: "string",
			inside: { "punctuation": /(?![(@]).+(?=.)/ }
		}
	],
	"multiline-comment": {
		pattern: /\/\*[^]*?\*\//g,
		alias: "comment"
	},
	"regex": {
		pattern: /(\bnode\s+|[~=([{,]\s*|[=+]>\s*|^\s*)\/(?:\\[^]|[^\\/])+\/(?:[imx]+\b|\B)/g,
		lookbehind: true,
		inside: { "extended-regex": {
			pattern: /^\/(?:\\[^]|[^\\/])+\/[im]*x[im]*$/,
			inside: { "comment": /#.*/ }
		} }
	},
	"comment": /#.*/g,
	"string": {
		pattern: /(["'])(?:\$\{(?:[^}"']|(["'])(?:\\[^]|(?!\2)[^\\])*\2)+\}|\$(?!\{)|\\[^]|(?!\1)[^\\$])*\1/g,
		inside: { "double-quoted": {
			pattern: /^"[^]*"$/,
			inside: { "interpolation": interpolation }
		} }
	},
	"variable": {
		pattern: /\$(?:::)?\w+(?:::\w+)*/,
		inside: { "punctuation": /::/ }
	},
	"attr-name": /(?:\b\w+|\*)(?=\s*=>)/,
	"function": [{
		pattern: /(\.)(?!\d)\w+/,
		lookbehind: true
	}, /\b(?:contain|debug|err|fail|include|info|notice|realize|require|tag|warning)\b|\b(?!\d)\w+(?=\()/],
	"number": /\b(?:0x[a-f\d]+|\d+(?:\.\d+)?(?:e-?\d+)?)\b/i,
	"boolean": boolean,
	"keyword": /\b(?:application|attr|case|class|consumes|default|define|else|elsif|function|if|import|inherits|node|private|produces|type|undef|unless)\b/,
	"datatype": {
		pattern: /\b(?:Any|Array|Boolean|Callable|Catalogentry|Class|Collection|Data|Default|Enum|Float|Hash|Integer|NotUndef|Numeric|Optional|Pattern|Regexp|Resource|Runtime|Scalar|String|Struct|Tuple|Type|Undef|Variant)\b/,
		alias: "symbol"
	},
	"operator": /=[=~>]?|![=~]?|<<\|?|<[=~|-]?|>[>=]?|->?|~>|\|>?>?|[%/*+?]|\b(?:and|in|or)\b/,
	"punctuation": /[()[\]{}.,;]|:+/
};
//#endregion

//# sourceMappingURL=puppet.js.map