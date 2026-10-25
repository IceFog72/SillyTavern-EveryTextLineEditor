import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/monkey.js
languages.monkey = {
	"comment": /^#rem\s[^]*?^#end|'.+/gim,
	"string": /"[^\n"]*"/g,
	"preprocessor": {
		pattern: /(^[ 	]*)#.+/gm,
		lookbehind: true,
		alias: "property"
	},
	"function": /\b\w+(?=\()/,
	"type-char": {
		pattern: /\b[?%#$]/,
		alias: "class-name"
	},
	"number": {
		pattern: /(\.\.)?(?:(?:\b|\B-\.?|\B\.)\d+(?:(?!\.\.)\.\d*)?|\$[a-f\d]+)/i,
		lookbehind: true
	},
	"keyword": /\b(?:abstract|array|bool|case|catch|class|const|continue|default|eachin|else|elseif|end|endif|exit|extends|extern|false|true|field|final|float|for|forever|function|global|if|implements|import|inline|int|interface|local|method|module|new|next|null|object|private|property|public|repeat|return|select|self|step|strict|string|super|then|throw|to|try|until|void|wend|while)\b/i,
	"operator": /\.\.|<[=>]?|>=?|:?=|(?:[~&|/*+-]|\b(?:mod|shl|shr)\b)=?|\b(?:and|not|or)\b/i,
	"punctuation": /[()[\].,:;]/
};
//#endregion

//# sourceMappingURL=monkey.js.map