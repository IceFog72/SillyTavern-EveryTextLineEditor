import { a as languages } from "../../core-Dr0o9A-8.js";
import { n as re, r as replace } from "../../shared-oTKIFAwH.js";
//#region src/prism/languages/pascaligo.js
var type = replace("(?:\\b\\w+<0>?|<0>)", ["\\((?:[^()]|\\((?:[^()]|\\([^)]*\\))*\\))*\\)"]);
var classNameInside = {};
var className = [
	{
		pattern: re("(\\btype\\s+\\w+\\s+is\\s+)<0>", [type], "i"),
		lookbehind: true,
		inside: classNameInside
	},
	{
		pattern: re("<0>(?=\\s+is\\b)", [type], "i"),
		inside: classNameInside
	},
	{
		pattern: re("(:\\s*)<0>", [type]),
		lookbehind: true,
		inside: classNameInside
	}
];
var pascaligo = languages.pascaligo = {
	"comment": /\(\*[^]+?\*\)|\/\/.*/,
	"string": /(["'`])(?:\\[^]|(?!\1)[^\\])*\1|\^[a-z]/gi,
	"class-name": className,
	"keyword": {
		pattern: /(^|[^&])\b(?:begin|block|case|const|else|end|fail|for|from|function|if|is|nil|of|remove|return|skip|then|type|var|while|with)\b/i,
		lookbehind: true
	},
	"boolean": {
		pattern: /(^|[^&])\b(?:false|true)\b/i,
		lookbehind: true
	},
	"builtin": {
		pattern: /(^|[^&])\b(?:bool|int|list|map|nat|record|string|unit)\b/i,
		lookbehind: true
	},
	"function": /\b\w+(?=\s*\()/,
	"number": [/%[01]+|&[0-7]+|\$[a-f\d]+/i, /\b\d+(?:\.\d+)?(?:e[+-]?\d+)?(?:mtz|n)?/i],
	"operator": /->|=\/=|\.\.|\*\*|:=|<>|>>|<<|[<>/*+-]=?|[@|^=]|\b(?:and|mod|or)\b/,
	"punctuation": /\(\.|\.\)|[()[\]{}.,:;]/
};
[
	"comment",
	"keyword",
	"builtin",
	"operator",
	"punctuation"
].forEach((key) => {
	classNameInside[key] = pascaligo[key];
});
//#endregion

//# sourceMappingURL=pascaligo.js.map