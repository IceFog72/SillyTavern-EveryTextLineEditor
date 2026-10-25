import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/keyman.js
languages.keyman = {
	"comment": /\bc .*/gi,
	"string": /"[^\n"]*"|'[^\n']*'/g,
	"virtual-key": {
		pattern: /\[\s*(?:(?:[lr]?alt|[lr]?ctrl|n?caps|shift)\s+)*(?:[tku]_[\w?]+|[a-e]\d\d?|"[^\n"]*"|'[^\n']*')\s*\]/gi,
		alias: "function"
	},
	"header-keyword": {
		pattern: /&\w+/,
		alias: "bold"
	},
	"header-statement": {
		pattern: /\b(?:bitmap|bitmaps|caps always off|caps on only|copyright|hotkey|language|layout|message|name|shift frees caps|version)\b/i,
		alias: "bold"
	},
	"rule-keyword": {
		pattern: /\b(?:any|baselayout|beep|call|context|deadkey|dk|if|index|layer|notany|nul|outs|platform|reset|return|save|set|store|use)\b/i,
		alias: "keyword"
	},
	"structural-keyword": {
		pattern: /\b(?:ansi|begin|group|match|newcontext|nomatch|postkeystroke|readonly|unicode|using keys)\b/i,
		alias: "keyword"
	},
	"compile-target": {
		pattern: /\$(?:keyman|keymanonly|keymanweb|kmfl|weaver):/i,
		alias: "property"
	},
	"number": /\b(?:u\+[a-f\d]+|d?\d+|x[a-f\d]+)\b/i,
	"operator": /[\\+>$]|\.\./,
	"punctuation": /[(),=]/
};
//#endregion

//# sourceMappingURL=keyman.js.map