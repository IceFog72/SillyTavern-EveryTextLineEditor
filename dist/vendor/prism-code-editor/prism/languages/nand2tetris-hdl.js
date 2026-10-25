import { a as languages } from "../../core-Dr0o9A-8.js";
import { n as clikeComment, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/nand2tetris-hdl.js
languages["nand2tetris-hdl"] = {
	"comment": clikeComment,
	"keyword": /\b(?:BUILTIN|CHIP|CLOCKED|IN|OUT|PARTS)\b/,
	"boolean": boolean,
	"function": /\b[a-zA-Z][A-Za-z\d]*(?=\()/,
	"number": /\b\d+\b/,
	"operator": /=|\.\./,
	"punctuation": /[()[\]{},:;]/
};
//#endregion

//# sourceMappingURL=nand2tetris-hdl.js.map