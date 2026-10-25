import { a as languages } from "../../core-Dr0o9A-8.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/julia.js
languages.julia = {
	"comment": /#=(?:[^#=]|=(?!#)|#(?!=)|#=(?:[^#=]|=(?!#)|#(?!=))*=#)*=#|#.*/,
	"regex": /r"(?:\\.|[^\\\n"])*"[imsx]{0,4}/g,
	"string": /"""[^]+?"""|(?:\b\w+)?"(?:\\.|[^\\\n"])*"|`(?:\\.|[^\\\n`])*`/g,
	"char": {
		pattern: /(^|[^\w'])'(?:\\[^\n][^\n']*|[^\\\n])'/g,
		lookbehind: true
	},
	"keyword": /\b(?:abstract|baremodule|begin|bitstype|break|catch|ccall|const|continue|do|else|elseif|end|export|finally|for|function|global|if|immutable|import|importall|in|let|local|macro|module|print|println|quote|return|struct|try|type|typealias|using|while)\b/,
	"boolean": boolean,
	"number": /(?:\b(?=\d)|\B(?=\.))(?:0[box])?(?:[a-f\d]+(?:_[a-f\d]+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[efp][+-]?\d+(?:_\d+)*)?j?/i,
	"operator": /&&|\|\||\/\/|[!=]==|\|>|>>>?=?|<<=?|<:|<\||[\\$÷⊻%&|^!=<>/*+-]=?|[~≠≤≥'√∛]/,
	"punctuation": /::|[()[\]{}.,:;?]/,
	"constant": /\b(?:(?:Inf|NaN)(?:16|32|64)?|im|pi)\b|[πℯ]/
};
//#endregion

//# sourceMappingURL=julia.js.map