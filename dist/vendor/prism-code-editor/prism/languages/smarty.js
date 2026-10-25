import { a as languages, c as tokenize } from "../../core-Dr0o9A-8.js";
import { t as embeddedIn } from "../../templating-BdhIX5ID.js";
import "./markup.js";
//#region src/prism/languages/smarty.js
var expression = { pattern: /[^]+/ };
var smarty = expression.inside = {
	"string": [{
		pattern: /"(?:\\.|[^\\\n"])*"/g,
		inside: {
			"interpolation": {
				pattern: /\{[^{}]*\}|`[^`]*`/,
				inside: {
					"interpolation-punctuation": {
						pattern: /^.|[`}]$/g,
						alias: "punctuation"
					},
					"expression": expression
				}
			},
			"variable": /\$\w+/
		}
	}, /'(?:\\.|[^\\\n'])*'/g],
	"keyword": {
		pattern: /(^\{\/?)[a-z_]\w*\b(?!\()/gi,
		lookbehind: true
	},
	"delimiter": {
		pattern: /^\{\/?|\}$/g,
		alias: "punctuation"
	},
	"number": /\b0x[a-fA-F\d]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][+-]?\d+)?/,
	"variable": [
		/\$(?!\d)\w+/,
		/#(?!\d)\w+#/,
		{
			pattern: /(\.|->|\w\s*=)(?!\d)\w+\b(?!\()/,
			lookbehind: true
		},
		{
			pattern: /(\[)(?!\d)\w+(?=\])/,
			lookbehind: true
		}
	],
	"function": {
		pattern: /(\|\s*)@?[a-z_]\w*|\b[a-z_]\w*(?=\()/i,
		lookbehind: true
	},
	"attr-name": /\b[a-z_]\w*(?=\s*=)/i,
	"boolean": /\b(?:false|true|no|off|on|yes)\b/,
	"punctuation": /[()[\]{}.,:`]|->/,
	"operator": [
		/[%/*+-]|===|[!=<>]=?|&&|\|\|?/,
		/\bis\s+(?:not\s+)?(?:div|even|odd)(?:\s+by)?\b/,
		/\b(?:and|eq|[gl][te]|[gl]te|mod|neq?|not|or)\b/
	]
};
languages.smarty = {
	"ignore-literal": {
		pattern: /(\{literal\})(?!\{\/literal\})[^]+?(?=\{\/literal\})/g,
		lookbehind: true
	},
	"embedded-php": {
		pattern: /(\{php\})(?!\{\/php\})[^]+?(?=\{\/php\})/g,
		lookbehind: true,
		alias: "language-php",
		inside: "php"
	},
	"smarty-comment": {
		pattern: /\{\*[^]*?\*\}/g,
		alias: "comment"
	},
	"smarty": {
		pattern: RegExp("<>|<>|<>)*})*})*}".replace(/<>/g, `{(?:[^{}"']|"(?:\\\\.|[^\\\\\n"])*"|'(?:\\\\.|[^\\\\\n'])*'`), "g"),
		alias: "language-smarty",
		inside: smarty
	},
	[tokenize]: embeddedIn("html")
};
//#endregion

//# sourceMappingURL=smarty.js.map