import { a as languages, c as tokenize } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, n as clone } from "../../language-CXbc22uF.js";
import { t as embeddedIn } from "../../templating-BdhIX5ID.js";
import "./markup.js";
import "./php.js";
//#region src/prism/languages/latte.js
var markupLatte = clone(languages.html);
insertBefore(markupLatte.tag.inside, "attr-value", { "n-attr": {
	pattern: /n:[\w-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=>]+))?/g,
	inside: {
		"attr-value": {
			pattern: /(=\s*)[^]+/,
			lookbehind: true,
			inside: {
				"punctuation": /^["']|["']$/g,
				"php": {
					pattern: /\S(?:[^]*\S)?/,
					inside: "php"
				}
			}
		},
		"attr-equals": /=/,
		"attr-name": {
			pattern: /\S+/,
			alias: "important"
		}
	}
} });
languages.latte = {
	"latte": {
		pattern: /\{\*[^]*?\*\}|\{[^\s{}"'*](?:[^"'/{}]|\/(?![*/])|(["'])(?:\\[^]|(?!\1)[^\\])*\1|\/\*(?:[^*]|\*(?!\/))*\*\/)*\}/,
		alias: "language-latte",
		inside: {
			"comment": /^\{\*[^]+/,
			"latte-tag": {
				pattern: /(^\{(?:\/(?=[a-z]))?)(?:[=_]|[a-z]\w*\b(?!\())/i,
				lookbehind: true,
				alias: "important"
			},
			"delimiter": {
				pattern: /^\{\/?|\}$/g,
				alias: "punctuation"
			},
			"php": {
				pattern: /\S(?:[^]*\S)?/,
				alias: "language-php",
				inside: "php"
			}
		}
	},
	[tokenize]: embeddedIn(markupLatte)
};
//#endregion

//# sourceMappingURL=latte.js.map