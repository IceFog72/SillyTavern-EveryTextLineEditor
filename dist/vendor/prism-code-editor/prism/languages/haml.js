import { a as languages } from "../../core-Dr0o9A-8.js";
import { n as re } from "../../shared-oTKIFAwH.js";
import "./ruby.js";
//#region src/prism/languages/haml.js
var haml = languages.haml = {
	"multiline-comment": {
		pattern: /(^[ 	]*)(?:\/|-#).*(?:$\s*?\n\1[ 	]+\S.*)*/m,
		lookbehind: true,
		alias: "comment"
	},
	"multiline-code": {
		pattern: /(^([ 	]*)(?:[~-]|[&!]?=)).*(?:,[ 	]*(?:\n\2[ 	].*,[ 	]*)*(?:\n\2[ 	].+)|\|[ 	]*(?:\n\2[ 	].*\|[ 	]*)*)/m,
		lookbehind: true,
		inside: "ruby"
	}
};
var filter_pattern = "(^[ 	]*):<0>(?:$\\s*?\n\\1[ 	]+\\S.*)+";
[
	"css",
	"coffee",
	"erb",
	"javascript",
	"less",
	"markdown",
	"ruby",
	"scss",
	"textile"
].forEach((filter) => {
	var language = filter == "coffee" ? "coffeescript" : filter;
	haml["filter-" + filter] = {
		pattern: re(filter_pattern, [filter], "m"),
		lookbehind: true,
		inside: {
			"filter-name": {
				pattern: /^:.+/,
				alias: "symbol"
			},
			"text": {
				pattern: /[^]+/,
				alias: "language-" + language,
				inside: language
			}
		}
	};
});
Object.assign(haml, {
	"filter": {
		pattern: re(filter_pattern, ["[\\w-]+"], "m"),
		lookbehind: true,
		inside: { "filter-name": {
			pattern: /^:.+/,
			alias: "symbol"
		} }
	},
	"markup": {
		pattern: /(^[ 	]*)<.+/m,
		lookbehind: true,
		inside: "markup"
	},
	"doctype": {
		pattern: /(^[ 	]*)!!!(?: .+)?/m,
		lookbehind: true
	},
	"tag": {
		pattern: /(^[ 	]*)[%.#][\w#.-]*[\w-](?:\([^)]*\)|\{(?:[^{}]|\{[^}]*\})*\}|\[[^\]]*\])*[<>/]*/m,
		lookbehind: true,
		inside: {
			"attributes": [
				{
					pattern: /(^|[^#])\{(?:[^{}]|\{[^}]*\})*\}/,
					lookbehind: true,
					inside: "ruby"
				},
				{
					pattern: /\([^)]+\)/,
					inside: {
						"attr-value": {
							pattern: /(=\s*)(?:"(?:\\.|[^\\\n"])*"|[^)\s]+)/,
							lookbehind: true
						},
						"attr-name": /[\w:-]+(?=\s*!?=|\s*[,)])/,
						"punctuation": /[=(),]/
					}
				},
				{
					pattern: /\[[^\]]+\]/,
					inside: "ruby"
				}
			],
			"punctuation": /<|>/
		}
	},
	"code": {
		pattern: /(^[ 	]*(?:[~-]|[&!]?=)).+/m,
		lookbehind: true,
		inside: "ruby"
	},
	"interpolation": {
		pattern: /#\{[^}]+\}/,
		inside: {
			"delimiter": {
				pattern: /^..|\}$/g,
				alias: "punctuation"
			},
			"ruby": {
				pattern: /[^]+/,
				inside: "ruby"
			}
		}
	},
	"punctuation": {
		pattern: /(^[ 	]*)[~=&!-]+/m,
		lookbehind: true
	}
});
//#endregion

//# sourceMappingURL=haml.js.map