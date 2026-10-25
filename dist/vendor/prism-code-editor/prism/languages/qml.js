import { a as languages } from "../../core-Dr0o9A-8.js";
import { n as clikeComment } from "../../patterns-DSInPV_c.js";
import { n as re, t as nested } from "../../shared-oTKIFAwH.js";
import "./javascript.js";
//#region src/prism/languages/qml.js
var jsExpr = nested("(?:[^\\\\()[\\]{}\"'/]|\"(?:\\\\.|[^\\\\\n\"])*\"|'(?:\\\\.|[^\\\\\n'])*'|/(?![*/])|//.*(?!.)|/\\*(?:[^*]|\\*(?!/))*\\*/|\\(<self>*\\)|\\[<self>*\\]|\\{<self>*\\}|\\\\[\\s\\S])", 2);
languages.qml = {
	"comment": clikeComment,
	"javascript-function": {
		pattern: re("((?:^|;)[ 	]*)function\\s+(?!\\d)(?:(?!\\s)[$\\w\\xa0-\\uffff])+\\s*\\(<0>*\\)\\s*\\{<0>*\\}", [jsExpr], "mg"),
		lookbehind: true,
		alias: "language-javascript",
		inside: languages.js
	},
	"class-name": {
		pattern: /((?:^|[:;])[ 	]*)(?!\d)\w+(?=[ 	]*\{|[ 	]+on\b)/m,
		lookbehind: true
	},
	"property": [{
		pattern: /((?:^|[;{])[ 	]*)(?!\d)\w+(?:\.\w+)*(?=[ 	]*:)/m,
		lookbehind: true
	}, {
		pattern: /((?:^|[;{])[ 	]*)property[ 	]+(?!\d)\w+(?:\.\w+)*[ 	]+(?!\d)\w+(?:\.\w+)*(?=[ 	]*:)/m,
		lookbehind: true,
		inside: {
			"keyword": /^property/,
			"property": /\w+(?:\.\w+)*/
		}
	}],
	"javascript-expression": {
		pattern: re("(:[ 	]*)(?![\\s;}[])(?:(?!$|[;}])<0>)+", [jsExpr], "mg"),
		lookbehind: true,
		alias: "language-javascript",
		inside: languages.js
	},
	"string": /"(?:\\.|[^\\\n"])*"/g,
	"keyword": /\b(?:as|import|on)\b/,
	"punctuation": /[[\]{},:;]/
};
//#endregion

//# sourceMappingURL=qml.js.map