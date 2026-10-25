import { a as languages } from "../../core-Dr0o9A-8.js";
import { n as clikeComment, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/yang.js
languages.yang = {
	"comment": clikeComment,
	"string": /"(?:\\.|[^\\"])*"|'[^']*'/g,
	"keyword": {
		pattern: /(^|[{};\n][ 	]*)[a-z_][\w.-]*/i,
		lookbehind: true
	},
	"namespace": {
		pattern: /(\s)[a-z_][\w.-]*(?=:)/i,
		lookbehind: true
	},
	"boolean": boolean,
	"operator": /\+/,
	"punctuation": /[{}:;]/
};
//#endregion

//# sourceMappingURL=yang.js.map