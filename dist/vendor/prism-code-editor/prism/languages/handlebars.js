import { a as languages, c as tokenize } from "../../core-Dr0o9A-8.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
import { t as embeddedIn } from "../../templating-BdhIX5ID.js";
import "./markup.js";
//#region src/prism/languages/handlebars.js
languages.mustache = languages.hbs = languages.handlebars = {
	"handlebars": {
		pattern: /\{\{(?:\{[^]+?\}|[^]+?)\}\}/,
		alias: "language-handlebars",
		inside: {
			"comment": /\{\{![^]*?\}\}/,
			"delimiter": {
				pattern: /^..\{?|\}\}\}?$/g,
				alias: "punctuation"
			},
			"string": /(["'])(?:\\.|(?!\1)[^\\\n])*\1/,
			"number": /\b0x[a-fA-F\d]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][+-]?\d+)?/,
			"boolean": boolean,
			"block": {
				pattern: /^(\s*(?:~\s*)?)[#/]\S+?(?=\s|~?\s*$)/,
				lookbehind: true,
				alias: "keyword"
			},
			"brackets": {
				pattern: /\[[^\]]+\]/,
				inside: {
					punctuation: /[[\]]/,
					variable: /[^]+/
				}
			},
			"punctuation": /[%&|^!=<>/*+#"'()[\]{}.,:;@\\`~]/,
			"variable": /\S+/
		}
	},
	[tokenize]: embeddedIn("html")
};
//#endregion

//# sourceMappingURL=handlebars.js.map