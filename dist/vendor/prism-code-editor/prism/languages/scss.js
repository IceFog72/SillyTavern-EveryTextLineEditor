import { a as languages, s as rest } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, r as extend } from "../../language-CXbc22uF.js";
import { n as clikeComment, t as boolean } from "../../patterns-DSInPV_c.js";
import "./css.js";
//#region src/prism/languages/scss.js
var variable = /\$[-\w]+|#\{\$[-\w]+\}/;
var scss = languages.scss = extend("css", {
	"comment": clikeComment,
	"atrule": {
		pattern: /@[\w-](?:\([^()]+\)|[^()\s]|\s+(?!\s))*?(?=\s+[{;])/,
		inside: {
			"rule": /@[\w-]+/,
			[rest]: "scss"
		}
	},
	"url": /(?:[-a-z]+-)?url(?=\()/i,
	"selector": {
		pattern: /(?!\s)[^@;(){}]?(?:[^@;(){}\s]|\s+(?!\s)|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}][^:{}]*[:{][^}]))/,
		inside: {
			"parent": {
				pattern: /&/,
				alias: "important"
			},
			"placeholder": /%[-\w]+/,
			"variable": variable
		}
	},
	"property": {
		pattern: /(?:[-\w]|\$[-\w]|#\{\$[-\w]+\})+(?=\s*:)/,
		inside: { "variable": variable }
	}
});
insertBefore(scss, "atrule", { "keyword": [/@(?:content|debug|each|else(?: if)?|extend|for|forward|function|if|import|include|mixin|return|use|warn|while)\b/i, {
	pattern: /( )(?:from|through)(?= )/,
	lookbehind: true
}] });
insertBefore(scss, "important", { "variable": variable });
insertBefore(scss, "function", {
	"module-modifier": {
		pattern: /\b(?:as|hide|show|with)\b/i,
		alias: "keyword"
	},
	"placeholder": {
		pattern: /%[-\w]+/,
		alias: "selector"
	},
	"statement": {
		pattern: /\B!(?:default|optional)\b/i,
		alias: "keyword"
	},
	"boolean": boolean,
	"null": {
		pattern: /\bnull\b/,
		alias: "keyword"
	},
	"operator": {
		pattern: /(\s)(?:[%/*+-]|[!=]=|[<>]=?|and|not|or)(?!\S)/,
		lookbehind: true
	}
});
//#endregion

//# sourceMappingURL=scss.js.map