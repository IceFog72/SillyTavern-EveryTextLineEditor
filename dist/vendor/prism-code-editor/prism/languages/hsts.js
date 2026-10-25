import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/hsts.js
/**
* Original by Scott Helme.
*
* Reference: https://scotthelme.co.uk/hsts-cheat-sheet/
*/
languages.hsts = {
	"directive": {
		pattern: /\b(?:includesubdomains|max-age|preload)(?![^\s;=])/i,
		alias: "property"
	},
	"operator": /=/,
	"punctuation": /;/
};
//#endregion

//# sourceMappingURL=hsts.js.map