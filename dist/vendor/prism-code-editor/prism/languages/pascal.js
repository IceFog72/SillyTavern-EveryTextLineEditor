import { a as languages } from "../../core-Dr0o9A-8.js";
import { r as extend } from "../../language-CXbc22uF.js";
//#region src/prism/languages/pascal.js
var asm = {
	pattern: /(\basm\b)[^]+?(?=\bend\s*[;[])/gi,
	lookbehind: true
};
languages.objectpascal = asm.inside = languages.pascal = {
	"directive": {
		pattern: /\{\$[^]*?\}/g,
		alias: "marco property"
	},
	"comment": /\(\*[^]*?\*\)|\{[^]*?\}|\/\/.*/g,
	"string": /(?:'(?:''|[^\n'])*'(?!')|#[&$%]?[a-f\d]+)+|\^[a-z]/gi,
	"asm": asm,
	"keyword": {
		pattern: /(^|[^&])\b(?:absolute|abstract|alias|array|asm|assembler|begin|bitpacked|break|case|cdecl|class|const|constructor|continue|cppdecl|c?var|default|deprecated|destructor|dispinterface|dispose|do|downto|dynamic|else|end|enumerator|except|exit|experimental|exports?|external|false|far|far16|file|finalization|finally|for|forward|function|generic|goto|helper|if|implementation|implements|index|inherited|initialization|inline|interface|interrupt|iochecks|label|library|local|message|name|near|new|nil|nodefault|noreturn|nostackframe|object|of|oldfpccall|on|operator|otherwise|out|overload|override|packed|pascal|platform|private|procedure|program|property|protected|public|published|raise|read|record|register|reintroduce|repeat|resourcestring|result|safecall|saveregisters|self|set|softfloat|specialize|static|stdcall|stored|strict|string|then|threadvar|to|true|try|type|unaligned|unimplemented|unit|until|uses|varargs|virtual|while|with|write)\b/,
		lookbehind: true
	},
	"number": /[&%]\d+|\$[a-f\d]+|\b\d+(?:\.\d+)?(?:e[+-]?\d+)?/i,
	"operator": {
		pattern: /\.\.|\*\*|:=|<>|>>|<<|[<>/*+-]=?|[@^=]|(^|[^&])\b(?:and|as|div|exclude|in|include|is|mod|not|x?or|sh[lr])\b/,
		lookbehind: true
	},
	"punctuation": /\(\.|\.\)|[()[\].,:;]/
};
asm.inside = extend("pascal", {
	"asm": void 0,
	"keyword": void 0,
	"operator": void 0
});
//#endregion

//# sourceMappingURL=pascal.js.map