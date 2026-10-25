import { a as languages } from "../../core-Dr0o9A-8.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/supercollider.js
languages.sclang = languages.supercollider = {
	"comment": /\/\/.*|\/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/)*\*\//g,
	"string": {
		pattern: /(^|[^\\])"(?:\\[^]|[^\\"])*"/g,
		lookbehind: true
	},
	"char": /\$(?:\\.|[^\\\n])/g,
	"symbol": {
		pattern: /(^|[^\\])'(?:\\[^]|[^\\'])*'|\\\w+/g,
		lookbehind: true
	},
	"keyword": /\b(?:_|arg|classvar|const|nil|var|while)\b/,
	"boolean": boolean,
	"label": {
		pattern: /\b[a-z_]\w*(?=\s*:)/,
		alias: "property"
	},
	"number": /\b(?:inf|pi|0x[a-fA-F\d]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?(?:pi)?|\d+r[a-zA-Z\d]+(?:\.[a-zA-Z\d]+)?|\d+[sb]{1,4}\d*)\b/,
	"class-name": /\b[A-Z]\w*\b/,
	"operator": /\.{2,3}|#(?![[{])|&&|[!=]==?|\+>>|\+{1,3}|--|[-=>]>|\?\?|@\|?@|\|(?:@|[!=]=)?\||!\?|<[!=>]|\*\*?|<<<?\*?|[%&|?!=<>/@`-]/,
	"punctuation": /[()[\]{}.,:;]|#[[{]/
};
//#endregion

//# sourceMappingURL=supercollider.js.map