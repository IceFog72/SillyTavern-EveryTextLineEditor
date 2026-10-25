import { a as languages } from "../../core-Dr0o9A-8.js";
import { a as clikeString, i as clikePunctuation, r as clikeNumber, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/firestore-security-rules.js
languages["firestore-security-rules"] = {
	"comment": /\/\/.*/,
	"string": clikeString,
	"path": {
		pattern: /(^|[\s(),])(?:\/(?:[\w\xa0-\uffff]+|\{[\w\xa0-\uffff]+(?:=\*\*)?\}|\$\([\w\xa0-\uffff.]+\)))+/g,
		lookbehind: true,
		inside: {
			"variable": {
				pattern: /\{[\w\xa0-\uffff]+(?:=\*\*)?\}|\$\([\w\xa0-\uffff.]+\)/,
				inside: {
					"operator": /=/,
					"keyword": /\*\*/,
					"punctuation": /[(){}.$]/
				}
			},
			"punctuation": /\//
		}
	},
	"method": {
		pattern: /(\ballow\s+)[a-z]+(?:\s*,\s*[a-z]+)*(?=\s*[:;])/,
		lookbehind: true,
		alias: "builtin",
		inside: { "punctuation": /,/ }
	},
	"keyword": /\b(?:allow|function|if|match|null|return|rules_version|service)\b/,
	"boolean": boolean,
	"function": /\b\w+(?=\()/,
	"number": clikeNumber,
	"operator": /&&|\|\||[!=<>]=?|[%/*+-]|\bi[ns]\b/,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=firestore-security-rules.js.map