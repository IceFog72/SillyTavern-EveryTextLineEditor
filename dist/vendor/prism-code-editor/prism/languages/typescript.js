import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, r as extend } from "../../language-CXbc22uF.js";
import "./javascript.js";
//#region src/prism/languages/typescript.js
var className = {
	pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\d)(?:(?!\s)[$\w\xa0-\uffff])+(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/g,
	lookbehind: true
};
var ts = languages.ts = languages.typescript = extend("js", { "class-name": className });
insertBefore(ts, "operator", { "builtin": /\b(?:Array|Function|Promise|any|boolean|never|number|string|symbol|unknown)\b/ });
ts.keyword.push(/\b(?:abstract|declare|is|keyof|readonly|require)\b|\b(?:asserts|infer|interface|module|namespace|type)\b(?!\s*[^\s{_$a-zA-Z\xa0-\uffff])|\btype(?=\s*\*)/);
delete ts["parameter"];
delete ts["literal-property"];
var typeInside = className.inside = Object.assign({}, ts);
delete typeInside["class-name"];
delete typeInside["maybe-class-name"];
insertBefore(ts, "constant", {
	"decorator": {
		pattern: /@[$\w\xa0-\uffff]+/,
		inside: {
			"at": {
				pattern: /^@/,
				alias: "operator"
			},
			"function": /.+/
		}
	},
	"generic-function": {
		pattern: /#?(?!\d)(?:(?!\s)[$\w\xa0-\uffff])+\s*<(?:[^<>=]|=[^<]|=?<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/g,
		inside: {
			"generic": {
				pattern: /<[^]+/,
				alias: "class-name",
				inside: typeInside
			},
			"function": /\S+/
		}
	}
});
//#endregion

//# sourceMappingURL=typescript.js.map