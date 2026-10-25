import { a as languages, c as tokenize } from "../../core-Dr0o9A-8.js";
import { a as clikeString, o as dotPunctuation, t as boolean } from "../../patterns-DSInPV_c.js";
import { t as embeddedIn } from "../../templating-BdhIX5ID.js";
import "./markup.js";
//#region src/prism/languages/soy.js
var numberPattern = /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|\b0x[A-F\d]+\b/;
languages.soy = {
	"ignore-literal": {
		pattern: /(\{literal\})(?!\{\/literal\})[^]+?(?=\{\/literal\})/g,
		lookbehind: true
	},
	"soy": {
		pattern: /\{\{.+?\}\}|\{.+?\}|(^|\s)\/\/.*|\/\*[^]*?\*\//g,
		lookbehind: true,
		alias: "language-soy",
		inside: {
			"comment": {
				pattern: /(^|\s)\/\/.*|\/\*[^]*?\*\//,
				lookbehind: true
			},
			"command-arg": {
				pattern: /(\{+\/?\s*(?:alias|call|delcall|delpackage|deltemplate|namespace|template)\s+)\.?[\w.]+/,
				lookbehind: true,
				alias: "string",
				inside: dotPunctuation
			},
			"parameter": {
				pattern: /(\{+\/?\s*@?param\??\s+)\.?[\w.]+/,
				lookbehind: true,
				alias: "variable"
			},
			"keyword": {
				pattern: /(\{+\/?[^\S\n]*)(?:\\[nrt]|alias|call|case|css|default|delcall|delpackage|deltemplate|elseif|else|fallbackmsg|foreach|for|ifempty|if|lb|let|literal|msg|namespace|nil|@?param\??|rb|sp|switch|template|xid)|\b(?:any|as|attributes|bool|css|float|html|int?|js|list|map|null|number|string|uri)\b/,
				lookbehind: true
			},
			"delimiter": {
				pattern: /^\{+\/?|\/?\}+$/g,
				alias: "punctuation"
			},
			"property": /\w+(?==)/,
			"variable": {
				pattern: /\$(?!\d)\w+(?:\??(?:\.\w+|\[[^\]]+\]))*/,
				inside: {
					"string": clikeString,
					"number": numberPattern,
					"punctuation": /[[\].?]/
				}
			},
			"string": clikeString,
			"function": {
				pattern: /\w+(?=\()|(\|[^\S\n]*)\w+/,
				lookbehind: true
			},
			"boolean": boolean,
			"number": numberPattern,
			"operator": /\?:?|[=<>]=?|!=|[%/*+-]|\b(?:and|not|or)\b/,
			"punctuation": /[()[\]{}.,:|]/
		}
	},
	[tokenize]: embeddedIn("html")
};
//#endregion

//# sourceMappingURL=soy.js.map