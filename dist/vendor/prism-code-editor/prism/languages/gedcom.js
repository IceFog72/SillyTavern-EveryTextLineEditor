import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/gedcom.js
languages.gedcom = {
	"line-value": {
		pattern: /(^[ 	]*\d+ +(?:@\w[\w!"$%&'()*+,./:;<=>?[\\\]^`{|}~\x80-\xfe #-]*@ +)?\w+ ).+/m,
		lookbehind: true,
		inside: { "pointer": {
			pattern: /^@\w[\w!"$%&'()*+,./:;<=>?[\\\]^`{|}~\x80-\xfe #-]*@$/,
			alias: "variable"
		} }
	},
	"record": {
		pattern: /(^[ 	]*\d+ +(?:@\w[\w!"$%&'()*+,./:;<=>?[\\\]^`{|}~\x80-\xfe #-]*@ +)?)\w+/m,
		lookbehind: true,
		alias: "tag"
	},
	"level": {
		pattern: /(^[ 	]*)\d+/m,
		lookbehind: true,
		alias: "number"
	},
	"pointer": {
		pattern: /@\w[\w!"$%&'()*+,./:;<=>?[\\\]^`{|}~\x80-\xfe #-]*@/,
		alias: "variable"
	}
};
//#endregion

//# sourceMappingURL=gedcom.js.map