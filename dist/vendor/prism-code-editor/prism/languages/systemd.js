import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/systemd.js
var comment = /^[;#].*/gm;
var quotesSource = "\"(?:\\\\[\\s\\S]|[^\\\\\n\"])*\"(?!\\S)";
languages.systemd = {
	"comment": comment,
	"section": {
		pattern: /^\[[^\n[\]]*\](?=[ 	]*$)/gm,
		inside: {
			"punctuation": /^\[|\]$/,
			"section-name": {
				pattern: /[^]+/,
				alias: "selector"
			}
		}
	},
	"key": {
		pattern: /^[^\s=]+(?=[ 	]*=)/gm,
		alias: "attr-name"
	},
	"value": {
		pattern: RegExp(`(=[ 	]*(?!\\s))(?:[^\\\\\\s]|[ 	]+(?:(?![ 	"])|${quotesSource})|\\\\\n+(?:[#;].*\n+)*(?![#;]))+`, "g"),
		lookbehind: true,
		alias: "attr-value",
		inside: {
			"comment": comment,
			"quoted": {
				pattern: RegExp("(^|\\s)" + quotesSource, "g"),
				lookbehind: true
			},
			"punctuation": /\\$/m,
			"boolean": /^(?:false|true|no|off|on|yes)$/g
		}
	},
	"punctuation": /=/
};
//#endregion

//# sourceMappingURL=systemd.js.map