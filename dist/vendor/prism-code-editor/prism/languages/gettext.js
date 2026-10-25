import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/gettext.js
languages.po = languages.gettext = {
	"comment": [
		{
			pattern: /# .*/g,
			alias: "translator-comment"
		},
		{
			pattern: /#\..*/g,
			alias: "extracted-comment"
		},
		{
			pattern: /#:.*/g,
			alias: "reference-comment"
		},
		{
			pattern: /#,.*/g,
			alias: "flag-comment"
		},
		{
			pattern: /#\|.*/g,
			alias: "previously-untranslated-comment"
		},
		/#.*/g
	],
	"string": {
		pattern: /(^|[^\\])"(?:\\.|[^\\"])*"/g,
		lookbehind: true
	},
	"keyword": /^msg(?:ctxt|id|id_plural|str)\b/m,
	"number": /\b\d+\b/,
	"punctuation": /[[\]]/
};
//#endregion

//# sourceMappingURL=gettext.js.map