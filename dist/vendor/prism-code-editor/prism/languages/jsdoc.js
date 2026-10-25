import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, r as extend } from "../../language-CXbc22uF.js";
import { a as clikeString, o as dotPunctuation, t as boolean } from "../../patterns-DSInPV_c.js";
import { n as re } from "../../shared-oTKIFAwH.js";
import "./javascript.js";
import "./javadoclike.js";
import "./typescript.js";
//#region src/prism/languages/jsdoc.js
var javascript = languages.js;
var type = "\\{(?:[^{}]|\\{(?:[^{}]|\\{[^}]*\\})*\\})+\\}";
var parameterPrefix = `(@(?:arg|argument|param|property)\\s+(?:${type}\\s+)?)`;
insertBefore(languages.jsdoc = extend("javadoclike", { "parameter": {
	pattern: RegExp(parameterPrefix + "(?:(?!\\s)[$\\w\\xa0-\\uffff.])+(?!\\S)"),
	lookbehind: true,
	inside: dotPunctuation
} }), "keyword", {
	"optional-parameter": {
		pattern: RegExp(parameterPrefix + "\\[(?:(?!\\s)[$\\w\\xa0-\\uffff.])+(?:=[^[\\]]+)?\\](?!\\S)"),
		lookbehind: true,
		inside: {
			"code": {
				pattern: /(=)[^]+(?=.)/,
				lookbehind: true,
				alias: "language-javascript",
				inside: javascript
			},
			"punctuation": /[=[\]]/,
			"parameter": {
				pattern: /[^]+/,
				inside: dotPunctuation
			}
		}
	},
	"class-name": [{
		pattern: re("(@(?:augments|class|extends|interface|memberof!?|template|this|typedef)\\s+(?:<0>\\s+)?)[A-Z]\\w*(?:\\.[A-Z]\\w*)*", [type]),
		lookbehind: true,
		inside: dotPunctuation
	}, {
		pattern: RegExp("(@[a-z]+\\s+)" + type),
		lookbehind: true,
		inside: {
			"string": clikeString,
			"number": javascript.number,
			"boolean": boolean,
			"keyword": languages.ts.keyword,
			"operator": /=>|\.{3}|[&|?:*]/,
			"punctuation": /[()[\]{}.,;<>=]/
		}
	}],
	"example": {
		pattern: /(@example\s+(?!\s))(?:[^@\s]|\s+(?!\s))+?(?=\s*(?:\*\s*)?(?:@\w|\*\/))/,
		lookbehind: true,
		inside: { "code": {
			pattern: /^([ 	]*(?:\*[ 	]*|(?!\*)))\S.*/m,
			lookbehind: true,
			alias: "language-javascript",
			inside: javascript
		} }
	}
});
//#endregion

//# sourceMappingURL=jsdoc.js.map