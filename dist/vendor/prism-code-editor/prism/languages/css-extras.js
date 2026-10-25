import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore } from "../../language-CXbc22uF.js";
import "./css.js";
//#region src/prism/languages/css-extras.js
var css = languages.css;
css.selector.inside = css["atrule"].inside["selector-function-argument"].inside = {
	"pseudo-element": /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
	"pseudo-class": /:[-\w]+/,
	"class": /\.[-\w]+/,
	"id": /#[-\w]+/,
	"attribute": {
		pattern: /\[(?:[^[\]"']|(["'])(?:\\[^]|(?!\1)[^\\\n])*\1)*\]/g,
		inside: {
			"punctuation": /^\[|\]$/,
			"case-sensitivity": {
				pattern: /(\s)[si]$/i,
				lookbehind: true,
				alias: "keyword"
			},
			"namespace": {
				pattern: /^(\s*)(?:(?!\s)[-*\w\xa0-\uffff])*\|(?!=)/,
				lookbehind: true,
				inside: { "punctuation": /\|$/ }
			},
			"attr-name": {
				pattern: /^(\s*)(?:(?!\s)[-\w\xa0-\uffff])+/,
				lookbehind: true
			},
			"attr-value": {
				pattern: /(=\s*)(?:(?!\s)[-\w\xa0-\uffff])+(?=\s*$)|(["'])(?:\\[^]|(?!\2)[^\\\n])*\2/,
				lookbehind: true
			},
			"operator": /[|~*^$]?=/
		}
	},
	"n-th": [{
		pattern: /(\(\s*)[+-]?\d*[\dn](?:\s*[+-]\s*\d+)?(?=\s*\))/,
		lookbehind: true,
		inside: {
			"number": /[\dn]+/,
			"operator": /[+-]/
		}
	}, {
		pattern: /(\(\s*)(?:even|odd)(?=\s*\))/i,
		lookbehind: true
	}],
	"combinator": /[>+~]|\|\|/,
	"punctuation": /[(),]/
};
insertBefore(css, "function", {
	"operator": {
		pattern: /(\s)[/*+-](?!\S)/,
		lookbehind: true
	},
	"hexcode": {
		pattern: /\B#[a-f\d]{3,8}\b/i,
		alias: "color"
	},
	"entity": /\\[a-f\d]{1,8}/i,
	"unit": {
		pattern: /(\b\d+)(?:%|[a-z]+(?![\w-]))/,
		lookbehind: true
	},
	"number": {
		pattern: /(^|[^\w.-])-?(?:\d+(?:\.\d+)?|\.\d+)/,
		lookbehind: true
	}
});
//#endregion

//# sourceMappingURL=css-extras.js.map