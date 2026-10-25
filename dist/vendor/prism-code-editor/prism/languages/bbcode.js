import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/bbcode.js
languages.shortcode = languages.bbcode = { "tag": {
	pattern: /\[\/?[^\s=\]]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'\]=]+))?(?:\s+[^\s=\]]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'\]=]+))*\s*\]/,
	inside: {
		"punctuation": /^\[\/?|\]$/g,
		"attr-value": {
			pattern: /(=\s*)(?:"[^"]*"|'[^']*'|\S+)/,
			lookbehind: true,
			inside: { "punctuation": /^["']|["']$/g }
		},
		"attr-equals": /=/,
		"tag": /^\S+/,
		"attr-name": /\S+/
	}
} };
//#endregion

//# sourceMappingURL=bbcode.js.map