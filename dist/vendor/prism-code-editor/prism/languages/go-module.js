import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/go-module.js
languages["go-mod"] = languages["go-module"] = {
	"comment": /\/\/.*/,
	"version": {
		pattern: /(^|[\s()[\],])v\d+\.\d+\.\d+(?:[+-][\w.+-]*)?(?![^\s()[\],])/,
		lookbehind: true,
		alias: "number"
	},
	"go-version": {
		pattern: /((?:^|\s)go\s+)\d+(?:\.\d+){1,2}/,
		lookbehind: true,
		alias: "number"
	},
	"keyword": {
		pattern: /^([ 	]*)(?:exclude|go|module|replace|require|retract)\b/m,
		lookbehind: true
	},
	"operator": /=>/,
	"punctuation": /[()[\],]/
};
//#endregion

//# sourceMappingURL=go-module.js.map