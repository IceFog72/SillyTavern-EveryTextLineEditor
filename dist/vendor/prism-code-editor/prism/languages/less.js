import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, r as extend } from "../../language-CXbc22uF.js";
import { n as clikeComment } from "../../patterns-DSInPV_c.js";
import "./css.js";
//#region src/prism/languages/less.js
insertBefore(languages.less = extend("css", {
	"comment": clikeComment,
	"atrule": {
		pattern: /@[\w-](?:\((?:[^(){}]|\([^(){}]*\))*\)|[^(){};\s]|\s+(?!\s))*?(?=\s*\{)/,
		inside: { "punctuation": /[():]/ }
	},
	"selector": {
		pattern: /(?:@\{[\w-]+\}|[^{};\s@])(?:@\{[\w-]+\}|\((?:[^(){}]|\([^(){}]*\))*\)|[^(){};@\s]|\s+(?!\s))*?(?=\s*\{)/,
		inside: { "variable": /@+[\w-]+/ }
	},
	"variable": [{
		pattern: /@[\w-]+\s*:/,
		inside: { "punctuation": /:/ }
	}, /@@?[\w-]+/],
	"property": /(?:@\{[\w-]+\}|[\w-])+(?:\+_?)?(?=\s*:)/,
	"operator": /[/*+-]/
}), "property", { "mixin-usage": {
	pattern: /([{;]\s*)[.#](?!\d)[\w-].*?(?=[(;])/,
	lookbehind: true,
	alias: "function"
} });
//#endregion

//# sourceMappingURL=less.js.map