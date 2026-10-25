import { a as languages, c as tokenize } from "../../core-Dr0o9A-8.js";
import { t as embeddedIn } from "../../templating-BdhIX5ID.js";
import "./javascript.js";
import "./markup.js";
//#region src/prism/languages/ejs.js
languages.eta = languages.ejs = {
	"ejs": {
		pattern: /<%[^%][^]*?%>/,
		inside: {
			"comment": /^<%#[^]+/,
			"delimiter": {
				pattern: /^..[-_=]?|[-_]?%>$/g,
				alias: "punctuation"
			},
			"language-javascript": {
				pattern: /[^]+/,
				inside: "js"
			}
		}
	},
	"escape": /<%%|%%>/,
	[tokenize]: embeddedIn("html")
};
//#endregion

//# sourceMappingURL=ejs.js.map