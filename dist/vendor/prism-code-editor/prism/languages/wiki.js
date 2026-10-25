import { a as languages, s as rest } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, r as extend } from "../../language-CXbc22uF.js";
import "./markup.js";
//#region src/prism/languages/wiki.js
var tagInside = languages.html.tag.inside;
insertBefore(languages.wiki = extend("html", {
	"block-comment": {
		pattern: /(^|[^\\])\/\*[^]*?\*\//,
		lookbehind: true,
		alias: "comment"
	},
	"heading": {
		pattern: /^(=+)[^\n=].*?\1/m,
		inside: {
			"punctuation": /^=+|=+$/,
			"important": /.+/
		}
	},
	"emphasis": {
		pattern: /('{2,5}).+?\1/,
		inside: {
			"bold-italic": {
				pattern: /(''''').+?(?=\1)/,
				lookbehind: true,
				alias: "bold italic"
			},
			"bold": {
				pattern: /(''')[^'].*(?=\1)/,
				lookbehind: true
			},
			"italic": /[^'].*(?='')/,
			"punctuation": /.+/
		}
	},
	"hr": {
		pattern: /^-{4,}/m,
		alias: "punctuation"
	},
	"url": [/isbn +(?:97[89][ -]?)?(?:\d[ -]?){9}[\dx]\b|(?:pmid|rfc) +\d+/i, /\[\[.+?\]\]|\[.+?\]/],
	"variable": [
		/__[A-Z]+__/,
		/\{{3}.+?\}{3}/,
		/\{\{.+?\}\}/
	],
	"symbol": [/^#redirect/im, /~{3,5}/],
	"table-tag": {
		pattern: /((?:^|[|!])[|!])[^\n|]+\|(?!\|)/m,
		lookbehind: true,
		inside: {
			"table-bar": {
				pattern: /\|$/,
				alias: "punctuation"
			},
			[rest]: tagInside
		}
	},
	"punctuation": /^(?:\{\||\|\}|\|-|[*#:;!|])|\|\||!!/m
}), "tag", { "nowiki": {
	pattern: /<(nowiki|pre|source)\b[^>]*>[^]*?<\/\1>/i,
	inside: { "tag": {
		pattern: /<(?:nowiki|pre|source)\b[^>]*>|<\/(?:nowiki|pre|source)>/i,
		inside: tagInside
	} }
} });
delete languages.wiki["markup-bracket"];
//#endregion

//# sourceMappingURL=wiki.js.map