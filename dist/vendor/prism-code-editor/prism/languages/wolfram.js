import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/wolfram.js
languages.nb = languages.wl = languages.mathematica = languages.wolfram = {
	"comment": /\(\*(?:\(\*(?:[^*]|\*(?!\)))*\*\)|(?!\(\*)[^])*?\*\)/,
	"string": /"(?:\\.|[^\\\n"])*"/g,
	"keyword": /\b(?:Abs|AbsArg|Accuracy|Block|Do|For|Function|If|Manipulate|Module|Nest|NestList|None|Return|Switch|Table|Which|While)\b/,
	"context": {
		pattern: /\b\w+`+\w*/,
		alias: "class-name"
	},
	"blank": {
		pattern: /\b\w+_\b/,
		alias: "regex"
	},
	"global-variable": {
		pattern: /\$\w+/,
		alias: "variable"
	},
	"boolean": /\b(?:False|True)\b/,
	"number": /(?:\b(?=\d)|\B(?=\.))(?:0[bo])?(?:(?:\d|0x[a-f\d])[a-f\d]*(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?j?\b/i,
	"operator": /[/=]\.|:>|\|?->|<-|@@?@?|\/@|=?[!=]?=|\^?:?=|\*\*?=?|\/\/?=?|[/+-]=?|<[<|=>]?|>[|=>]?|[;&|^~]/,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=wolfram.js.map