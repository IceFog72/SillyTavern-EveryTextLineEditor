import { a as languages } from "../../core-Dr0o9A-8.js";
import { a as clikeString, i as clikePunctuation, r as clikeNumber, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/cfscript.js
languages.cfc = languages.cfscript = {
	"comment": [/\/\/.*/, {
		pattern: /\/\*[^]*?(?:\*\/|$)/g,
		inside: { "annotation": {
			pattern: /(?:^|[^.])@[\w\.]+/,
			alias: "punctuation"
		} }
	}],
	"string": clikeString,
	"function-variable": {
		pattern: /(?!\d)(?:(?!\s)[$\w\xa0-\uffff])+(?=\s*[=:]\s*(?:\bfunction\b|(?:\((?:[^()]|\([^)]*\))*\)|(?!\d)(?:(?!\s)[$\w\xa0-\uffff])+)\s*=>))/,
		alias: "function"
	},
	"keyword": /\b(?:abstract|break|catch|component|continue|default|do|else|extends|final|finally|for|function|if|in|include|package|private|property|public|remote|required|rethrow|return|static|switch|throw|try|var|while|xml)\b(?!\s*=)/,
	"boolean": boolean,
	"function": /\b\w+(?=\()/,
	"number": clikeNumber,
	"operator": /--|\+\+|&&|\|\||::|=>|[!=]==|[%&|^!=<>/*+-]=?|\?[.:]?|:|\b(?:and|contains|equal|eqv?|[gl]te?|imp|is|mod|not|x?or)\b/,
	"punctuation": clikePunctuation,
	"scope": {
		pattern: /\b(?:application|arguments|cgi|client|cookie|local|session|super|this|variables)\b/,
		alias: "global"
	},
	"type": {
		pattern: /\b(?:any|array|binary|boolean|date|[gu]uid|numeric|query|string|struct|void|xml)\b/,
		alias: "builtin"
	}
};
//#endregion

//# sourceMappingURL=cfscript.js.map