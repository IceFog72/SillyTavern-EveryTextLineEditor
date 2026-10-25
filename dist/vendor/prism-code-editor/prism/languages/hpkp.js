import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/hpkp.js
/**
* Original by Scott Helme.
*
* Reference: https://scotthelme.co.uk/hpkp-cheat-sheet/
*/
languages.hpkp = {
	"directive": {
		pattern: /\b(?:includesubdomains|max-age|pin-sha256|preload|report-to|report-uri|strict)(?![^\s;=])/i,
		alias: "property"
	},
	"operator": /=/,
	"punctuation": /;/
};
//#endregion

//# sourceMappingURL=hpkp.js.map