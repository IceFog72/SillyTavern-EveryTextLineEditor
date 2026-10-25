import { a as languages } from "../../core-Dr0o9A-8.js";
import { n as clikeComment, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/json.js
languages.webmanifest = languages.json = {
	"property": /"(?:\\.|[^\\\n"])*"(?=\s*:)/g,
	"string": /"(?:\\.|[^\\\n"])*"/g,
	"comment": clikeComment,
	"number": /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
	"operator": /:/,
	"punctuation": /[[\]{},]/,
	"boolean": boolean,
	"null": {
		pattern: /\bnull\b/,
		alias: "keyword"
	}
};
//#endregion

//# sourceMappingURL=json.js.map