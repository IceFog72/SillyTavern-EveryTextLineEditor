import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/nim.js
languages.nim = {
	"comment": /#.*/g,
	"string": /(?:\b(?!\d)(?:\w|\\x[89a-fA-F][a-fA-F\d])+)?(?:"""[^]*?"""(?!")|"(?:\\[^]|""|[^\\"])*")/g,
	"char": /'(?:\\(?:\d+|x[a-fA-F\d]{0,2}|.)|[^'])'/g,
	"function": {
		pattern: /(?:(?!\d)(?:\w|\\x[89a-fA-F][a-fA-F\d])+|`[^\n`]+`)\*?(?:\[[^\]]+\])?(?=\s*\()/g,
		inside: { "operator": /\*$/ }
	},
	"identifier": {
		pattern: /`[^\n`]+`/g,
		inside: { "punctuation": /`/ }
	},
	"number": /\b(?:0[xXoObB][a-fA-F\d_]+|\d[\d_]*(?:(?!\.\.)\.[\d_]*)?(?:[eE][+-]?\d[\d_]*)?)(?:'?[iuf]\d*)?/,
	"keyword": /\b(?:addr|asm?|atomic|bind|block|break|cas[et]|concept|const|continue|converter|defer|discard|distinct|do|elif|else|end|enum|except|export|finally|for|from|func|generic|if|import|include|interface|iterator|let|macro|method|mixin|nil|object|out|proc|ptr|raise|ref|return|static|template|try|tuple|type|using|var|when|while|with|without|yield)\b/,
	"operator": {
		pattern: /(^|[({\[](?=\.\.)|(?![({\[]\.).)(?:(?:[\\@$~?:%&|^!=<>/*+-]|\.\.|\.(?![)}\]]))+|\b(?:and|div|in|isnot|is|mod|notin|not|of|sh[lr]|x?or)\b)/m,
		lookbehind: true
	},
	"punctuation": /[({[]\.|\.[)}\]]|[`()[\]{},:]/
};
//#endregion

//# sourceMappingURL=nim.js.map