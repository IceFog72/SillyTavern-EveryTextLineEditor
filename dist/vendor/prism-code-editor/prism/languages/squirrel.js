import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation, o as dotPunctuation, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/squirrel.js
languages.squirrel = {
	"comment": /\/\*[^]*?(?:\*\/|$)|\/\/.*|#.*/g,
	"char": {
		pattern: /(^|[^\\"'])'(?:[^\\']|\\(?:[xuU][a-fA-F\d]{0,8}|[^]))'/g,
		lookbehind: true
	},
	"string": {
		pattern: /(^|[^\\"'@])(?:@"(?:[^"]|"")*"(?!")|"(?:\\.|[^\\\n"])*")/g,
		lookbehind: true
	},
	"class-name": {
		pattern: /(\b(?:class|enum|extends|instanceof)\s+)\w+(?:\.\w+)*/,
		lookbehind: true,
		inside: dotPunctuation
	},
	"keyword": /\b(?:__FILE__|__LINE__|base|break|case|catch|class|clone|const|constructor|continue|default|delete|else|enum|extends|for|foreach|function|if|in|instanceof|local|null|resume|return|static|switch|this|throw|try|typeof|while|yield)\b/,
	"boolean": boolean,
	"function": /\b\w+(?=\()/,
	"number": /\b(?:0x[a-fA-F\d]+|\d+(?:\.(?:\d+|[eE][+-]?\d+))?)\b/,
	"attribute-punctuation": {
		pattern: /<\/|\/>/,
		alias: "important"
	},
	"lambda": {
		pattern: /@(?=\()/,
		alias: "operator"
	},
	"operator": /--|\+\+|<=>|<[-<]|>>>?|&&?|\|\|?|[%!=<>/*+-]=?|[~^]|::?/,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=squirrel.js.map