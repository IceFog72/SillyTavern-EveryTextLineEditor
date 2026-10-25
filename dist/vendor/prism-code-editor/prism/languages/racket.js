import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, r as extend } from "../../language-CXbc22uF.js";
import "./scheme.js";
//#region src/prism/languages/racket.js
insertBefore(languages.rkt = languages.racket = extend("scheme", { "lambda-parameter": {
	pattern: /([(\[]lambda\s+[(\[])[^()[\]'\s]+/,
	lookbehind: true
} }), "string", { "lang": {
	pattern: /^#lang.+/gm,
	alias: "keyword"
} });
//#endregion

//# sourceMappingURL=racket.js.map