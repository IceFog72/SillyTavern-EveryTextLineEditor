import { a as languages } from "../../core-Dr0o9A-8.js";
import { n as tag, r as xmlComment, t as entity } from "../../xml-shared-ONZRGEwv.js";
//#region src/prism/languages/xml.js
languages.rss = languages.atom = languages.ssml = languages.xml = {
	"comment": xmlComment,
	"prolog": /<\?[^]+?\?>/g,
	"doctype": {
		pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/gi,
		inside: {
			"internal-subset": {
				pattern: /(\[)[^]+(?=\]\s*>$)/,
				lookbehind: true,
				inside: "xml"
			},
			"string": /"[^"]*"|'[^']*'/,
			"punctuation": /^<!|[>[\]]/,
			"doctype-tag": /^DOCTYPE/i,
			"name": /\S+/
		}
	},
	"cdata": /<!\[CDATA\[[^]*?\]\]>/gi,
	"tag": tag,
	"entity": entity,
	"markup-bracket": {
		pattern: /[()[\]{}]/,
		alias: "punctuation"
	}
};
//#endregion

//# sourceMappingURL=xml.js.map