import { a as languages } from "../../core-Dr0o9A-8.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/smalltalk.js
languages.smalltalk = {
	"comment": /"(?:""|[^"])*"/g,
	"char": /\$./g,
	"string": /'(?:''|[^'])*'/g,
	"symbol": /#[a-z\d]+|#(?:-|([+/\\*~<>=@%|&?!])\1?)|#(?=\()/i,
	"block-arguments": {
		pattern: /(\[\s*):[^\[|]*\|/,
		lookbehind: true,
		inside: {
			"variable": /:[a-z\d]+/i,
			"punctuation": /\|/
		}
	},
	"temporary-variables": {
		pattern: /\|[^|]+\|/,
		inside: {
			"variable": /[a-z\d]+/i,
			"punctuation": /\|/
		}
	},
	"keyword": /\b(?:new|nil|self|super)\b/,
	"boolean": boolean,
	"number": [/\d+r-?[A-Z\d]+(?:\.[A-Z\d]+)?(?:e-?\d+)?/, /\b\d+(?:\.\d+)?(?:e-?\d+)?/],
	"operator": /[<=]=?|:=|~[~=]|\/\/?|\\\\|>[>=]?|[,@&|^!*+-]/,
	"punctuation": /[()[\]{}.:;?]/
};
//#endregion

//# sourceMappingURL=smalltalk.js.map