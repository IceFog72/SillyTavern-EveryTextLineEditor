import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/diff.js
var diff = languages.diff = { "coord": /^(?:\*{3}|-{3}|\+{3}|\d).*$|^@@.*@@$/m };
/**
* A map from the name of a block to its line prefix.
*
* @type {Object<string, string>}
*/
var PREFIXES = {
	"deleted-sign": "-",
	"deleted-arrow": "<",
	"inserted-sign": "\\+",
	"inserted-arrow": ">",
	"unchanged": " ",
	"diff": "!"
};
for (var name in PREFIXES) {
	var prefix = name.split("-")[0];
	diff[name] = {
		pattern: RegExp("(?:^" + PREFIXES[name] + ".*\n?)+", "m"),
		alias: prefix != name ? prefix : name == "diff" ? "bold" : void 0,
		inside: { "prefix": {
			pattern: RegExp("^" + PREFIXES[name], "mg"),
			alias: prefix
		} }
	};
}
//#endregion

//# sourceMappingURL=diff.js.map