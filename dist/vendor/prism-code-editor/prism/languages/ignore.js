import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/ignore.js
languages.npmignore = languages.hgignore = languages.gitignore = languages.ignore = {
	"comment": /^#.*/m,
	"entry": {
		pattern: /\S(?:.*(?:(?:\\ )|\S))?/,
		alias: "string",
		inside: {
			"operator": /^!|\*\*?|\?/,
			"regex": {
				pattern: /(^|[^\\])\[[^[\]]*\]/,
				lookbehind: true
			},
			"punctuation": /\//
		}
	}
};
//#endregion

//# sourceMappingURL=ignore.js.map