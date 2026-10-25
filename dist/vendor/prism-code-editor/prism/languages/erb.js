import { a as languages, c as tokenize } from "../../core-Dr0o9A-8.js";
import { t as embeddedIn } from "../../templating-BdhIX5ID.js";
import "./markup.js";
import "./ruby.js";
//#region src/prism/languages/erb.js
languages.erb = {
	"erb": {
		pattern: /<%=?(?:[^\n]|\n(?!=begin)|\n=begin\s(?:[^\n]|\n(?!=end))*\n=end)+?%>/,
		inside: {
			"delimiter": {
				pattern: /^..=?|%>$/g,
				alias: "punctuation"
			},
			"ruby": {
				pattern: /\s*\S[^]*/,
				alias: "language-ruby",
				inside: "ruby"
			}
		}
	},
	[tokenize]: embeddedIn("html")
};
//#endregion

//# sourceMappingURL=erb.js.map