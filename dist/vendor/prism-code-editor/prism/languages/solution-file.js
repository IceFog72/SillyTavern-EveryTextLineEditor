import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/solution-file.js
var guid = {
	pattern: /\{[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}\}/i,
	alias: "constant",
	inside: { "punctuation": /[{}]/ }
};
languages["solution-file"] = {
	"comment": /#.*/g,
	"string": {
		pattern: /"[^\n"]*"|'[^\n']*'/g,
		inside: { "guid": guid }
	},
	"object": {
		pattern: /^([ 	]*)(?:([A-Z]\w*)\b(?=.*\n(?:\1[ 	].*\n)*\1End\2(?=[ 	]*$))|End[A-Z]\w*(?=[ 	]*$))/gm,
		lookbehind: true,
		alias: "keyword"
	},
	"property": {
		pattern: /^([ 	]*)(?!\s)[^\n"#=()]*[^\s"#=()](?=\s*=)/m,
		lookbehind: true,
		inside: { "guid": guid }
	},
	"guid": guid,
	"number": /\b\d+(?:\.\d+)*\b/,
	"boolean": /\b(?:FALSE|TRUE)\b/,
	"operator": /=/,
	"punctuation": /[(),]/
};
languages["sln"] = languages["solution-file"];
//#endregion

//# sourceMappingURL=solution-file.js.map