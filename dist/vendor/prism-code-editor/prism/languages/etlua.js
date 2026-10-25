import { a as languages, c as tokenize } from "../../core-Dr0o9A-8.js";
import { t as embeddedIn } from "../../templating-BdhIX5ID.js";
import "./markup.js";
import "./lua.js";
//#region src/prism/languages/etlua.js
languages.etlua = {
	"etlua": {
		pattern: /<%[^]+?%>/,
		inside: {
			"delimiter": {
				pattern: /^..[=-]?|-?%>$/g,
				alias: "punctuation"
			},
			"language-lua": {
				pattern: /[^]+/,
				inside: "lua"
			}
		}
	},
	[tokenize]: embeddedIn("html")
};
//#endregion

//# sourceMappingURL=etlua.js.map