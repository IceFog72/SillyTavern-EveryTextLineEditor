import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, n as clone } from "../../language-CXbc22uF.js";
import "./c.js";
//#region src/prism/languages/cilkc.js
insertBefore(languages["cilk-c"] = languages.cilkc = clone(languages.c), "function", { "parallel-keyword": {
	pattern: /\bcilk_(?:for|reducer|s(?:cope|pawn|ync))\b/,
	alias: "keyword"
} });
//#endregion

//# sourceMappingURL=cilkc.js.map