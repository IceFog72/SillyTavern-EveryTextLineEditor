import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/lua.js
languages.lua = {
	"comment": /^#!.+|--(?:\[(=*)\[[^]*?\]\1\]|.*)/m,
	"string": /(["'])(?:(?!\1)[^\\\n]|\\z\s|\\[^z])*\1|\[(=*)\[[^]*?\]\2\]/g,
	"number": /\b0x[a-f\d]+(?:\.[a-f\d]*)?(?:p[+-]?\d+)?\b|\b\d+(?:\.\B|(?:\.\d*)?(?:e[+-]?\d+)?\b)|\B\.\d+(?:e[+-]?\d+)?\b/i,
	"keyword": /\b(?:and|break|do|else|elseif|end|false|true|f?or|function|goto|if|in|local|nil|not|repeat|return|then|until|while)\b/,
	"function": /(?!\d)\w+(?=\s*(?:[({]))/,
	"operator": {
		pattern: /[%&|^#*+-]|\/\/?|<[<=]?|>[>=]?|[=~]=?|(^|[^.])\.\.(?!\.)/,
		lookbehind: true
	},
	"punctuation": /[()[\]{},;]|\.+|:+/
};
//#endregion

//# sourceMappingURL=lua.js.map