import { a as languages, s as rest } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/livescript.js
languages.livescript = {
	"comment": /#.*|\/\*[^]*?\*\//,
	"interpolated-string": {
		pattern: /"""(?:\\[^]|[^\\])*?"""|"(?:\\[^]|[^\\])*?"/g,
		inside: {
			"variable": {
				pattern: /(^|[^\\])#[a-z_](?:-?[a-z]|[\d_])*/m,
				lookbehind: true
			},
			"interpolation": {
				pattern: /(^|[^\\])#\{[^}]+\}/m,
				lookbehind: true,
				inside: {
					"interpolation-punctuation": {
						pattern: /^..|\}$/g,
						alias: "variable"
					},
					[rest]: "livescript"
				}
			},
			"string": /[^]+/
		}
	},
	"string": [/'''(?:\\[^]|[^\\])*?'''|'(?:\\[^]|[^\\])*?'|<\[[^]*?\]>/g, /\\[^\s,;\])}]+/],
	"regex": [{
		pattern: /\/\/(?:\[[^\n\]]*\]|\\.|(?!\/\/)[^\\[])+\/\/[gimyu]{0,5}/g,
		inside: { "comment": /#.*/ }
	}, /\/(?:\[[^\n\]]*\]|\\.|[^\\\n/[])+\/[gimyu]{0,5}/g],
	"keyword": {
		pattern: /(^|(?!-).)\b(?:break|case|catch|class|const|continue|default|do|else|extends|fallthrough|finally|for ever|for|function|if|implements|it|let|loop|new|null|otherwise|own|return|super|switch|that|[tw]hen|this|throw|try|unless|until|var|void|while|yield)(?!-)\b/m,
		lookbehind: true
	},
	"keyword-operator": {
		pattern: /(^|[^-])\b(?:(?:delete|require|typeof)!|(?:and|by|delete|export|from|import all|import|in|instanceof|isnt|is not|is|not|of|til|to|typeof|with|x?or)(?!-)\b)/m,
		lookbehind: true,
		alias: "operator"
	},
	"boolean": {
		pattern: /(^|[^-])\b(?:false|true|no|off|on|yes)(?!-)\b/m,
		lookbehind: true
	},
	"argument": {
		pattern: /(^|(?!\.&\.)[^&])&(?!&)\d*/m,
		lookbehind: true,
		alias: "variable"
	},
	"number": /\b(?:\d+~[a-z\d]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[a-z]\w*)?)/i,
	"identifier": /[a-z_](?:-?[a-z]|[\d_])*/i,
	"operator": {
		pattern: /( )\.(?= )|\.[=~]|\.{2,3}|\.(?:[&|^]|>>>?|<<)\.|::?=|::|&&|\|[|>]|<--?!?|<~~?!?|<[|?=]|<{1,4}|>[>=?]?|--?>?|\+\+?|@@?|%%?|\*\*?|!--?>|!~?~>|!~?=?|~=|~~?>?|==?|\^\^?|[/?]/,
		lookbehind: true
	},
	"punctuation": /[()[\]{}.,:;|`]/
};
//#endregion

//# sourceMappingURL=livescript.js.map