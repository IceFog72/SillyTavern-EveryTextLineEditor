import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, r as extend } from "../../language-CXbc22uF.js";
import "./css.js";
//#region src/prism/languages/sass.js
var variable = /\$[-\w]+|#\{\$[-\w]+\}/;
var operator = {
	pattern: /[%/*+]|[!=]=|<=?|>=?|\b(?:and|not|or)\b|(\s)-(?!\S)/,
	lookbehind: true
};
var sass = languages.sass = extend("css", { "comment": {
	pattern: /^([ 	]*)\/[/*].*(?:$\s*?\n\1[ 	]+\S.*)*/gm,
	lookbehind: true
} });
insertBefore(sass, "atrule", { "atrule-line": {
	pattern: /^(?:[ 	]*)[@+=].+/gm,
	inside: { "atrule": /(?:@[\w-]+|[+=])/ }
} });
delete sass.atrule;
insertBefore(sass, "property", {
	"variable-line": {
		pattern: /^[ 	]*\$.+/gm,
		inside: {
			"punctuation": /:/,
			"variable": variable,
			"operator": operator
		}
	},
	"property-line": {
		pattern: /^[ 	]*(?:[^:\s]+ *:.*|:[^:\s].*)/gm,
		inside: {
			"property": [/[^:\s]+(?=\s*:)/, {
				pattern: /(:)[^:\s]+/,
				lookbehind: true
			}],
			"punctuation": /:/,
			"variable": variable,
			"operator": operator,
			"important": sass.important
		}
	}
});
delete sass.property;
delete sass.important;
insertBefore(sass, "punctuation", { "selector": {
	pattern: /^([ 	]*)\S(?:,[^\n,]+|[^\n,]*)(?:,[^\n,]+)*(?:,\n\1[ 	]+\S(?:,[^\n,]+|[^\n,]*)(?:,[^\n,]+)*)*/gm,
	lookbehind: true
} });
//#endregion

//# sourceMappingURL=sass.js.map