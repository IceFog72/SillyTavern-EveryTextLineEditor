import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation } from "../../patterns-DSInPV_c.js";
import { n as re, r as replace } from "../../shared-oTKIFAwH.js";
//#region src/prism/languages/sml.js
var keywords = /\b(?:abstype|[ae]nd|andalso|as|case|datatype|do|else|eqtype|exception|fu?n|functor|handle|if|in|include|infixr?|let|local|nonfix|of|op|open|orelse|raise|rec|sharing|sig|signature|struct|structure|then|type|val|where|while|with|withtype)\b/i;
var longId = `(?!${keywords.source})[a-z\\d_][\\w'.]*`;
var class0 = {
	pattern: re("((?:^|[^:]):\\s*)<0>(?:\\s*(?:(?:\\*|->)\\s*<0>|,\\s*<0>(?:(?=\\s*(?:[*,]|->))|(?!\\s*(?:[*,]|->))\\s+<1>)))*", [replace("(?:'[\\w']*|<0>|\\((?:[^()]|\\([^)]*\\))*\\)|\\{(?:[^{}]|\\{[^}]*\\})*\\})(?:\\s+<0>)*", [longId]), longId], "gi"),
	lookbehind: true
};
class0.inside = languages.smlnj = languages.sml = {
	"comment": /\(\*(?:[^*(]|\*(?!\))|\((?!\*)|\(\*(?:[^*(]|\*(?!\))|\((?!\*))*\*\))*\*\)/,
	"string": /#?"(?:\\.|[^\\"])*"/g,
	"class-name": [class0, {
		pattern: /((?:^|[^\w'])(?:datatype|exception|functor|signature|structure|type)\s+)[a-z_][\w'.]*/i,
		lookbehind: true
	}],
	"function": {
		pattern: /((?:^|[^\w'])fun\s+)[a-z_][\w'.]*/i,
		lookbehind: true
	},
	"keyword": keywords,
	"variable": {
		pattern: /(^|[^\w'])'[\w']*/,
		lookbehind: true
	},
	"number": /~?\b(?:\d+(?:\.\d+)?(?:e~?\d+)?|0x[a-f\d]+)\b/i,
	"word": {
		pattern: /\b0w(?:\d+|x[a-f\d]+)\b/i,
		alias: "constant"
	},
	"boolean": /\b(?:false|true)\b/i,
	"operator": /\.{3}|:[>=:]|=>?|->|[<>]=?|[|^#@~!/*+-]/,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=sml.js.map