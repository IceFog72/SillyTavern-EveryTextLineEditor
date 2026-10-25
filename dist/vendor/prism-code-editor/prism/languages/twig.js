import { a as languages, c as tokenize } from "../../core-Dr0o9A-8.js";
import { t as embeddedIn } from "../../templating-BdhIX5ID.js";
import "./markup.js";
//#region src/prism/languages/twig.js
languages.twig = {
	"twig": {
		pattern: /\{(?:#[^]*?#|%[^]*?%|\{[^]*?\})\}/,
		alias: "language-twig",
		inside: {
			"comment": /^\{#[^]+/,
			"tag-name": {
				pattern: /(^\{%-?\s*)\w+/,
				lookbehind: true,
				alias: "keyword"
			},
			"delimiter": {
				pattern: /^..-?|-?[%}]\}$/g,
				alias: "punctuation"
			},
			"string": {
				pattern: /(["'])(?:\\.|(?!\1)[^\\\n])*\1/,
				inside: { "punctuation": /^.|["']$/g }
			},
			"keyword": /\b(?:even|if|odd)\b/,
			"boolean": /\b(?:false|true|null)\b/,
			"number": /\b0x[a-fA-F\d]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][+-]?\d+)?/,
			"operator": [{
				pattern: /(\s)(?:and|b-and|b-x?or|ends with|in|is|matches|not|or|same as|starts with)(?!\S)/,
				lookbehind: true
			}, /[=<>]=?|!=|\*\*?|\/\/?|\?:?|[~%|+-]/],
			"punctuation": /[()[\]{}.,:]/
		}
	},
	[tokenize]: embeddedIn("html")
};
//#endregion

//# sourceMappingURL=twig.js.map