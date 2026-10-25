import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, n as clone } from "../../language-CXbc22uF.js";
import "./cpp.js";
//#region src/prism/languages/cilkcpp.js
insertBefore(languages.cilk = languages["cilk-cpp"] = languages.cilkcpp = clone(languages.cpp), "function", { "parallel-keyword": {
	pattern: /\bcilk_(?:for|reducer|s(?:cope|pawn|ync))\b/,
	alias: "keyword"
} });
//#endregion

//# sourceMappingURL=cilkcpp.js.map