import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation, t as boolean } from "../../patterns-DSInPV_c.js";
import { t as clikeClass } from "../../clike-class-CXD3NFPG.js";
//#region src/prism/languages/d.js
languages.d = {
	"comment": /^\s*#!.+|(?:\/\+(?:\/\+(?:[^+]|\+(?!\/))*\+\/|(?!\/\+)[^])*?\+\/|\/\/.*|\/\*[^]*?\*\/)/g,
	"char": /'(?:\\(?:\W|\w+)|[^\\])'/,
	"string": [/\b[rx]"(?:\\[^]|[^\\"])*"[cwd]?|\bq"(?:\[[^]*?\]|\([^]*?\)|<[^]*?>|\{[^]*?\})"|\bq"((?!\d)\w+)$[^]*?^\1"|\bq"(.)[^]*?\2"|(["`])(?:\\[^]|(?!\3)[^\\])*\3[cwd]?/gm, {
		pattern: /\bq\{(?:[^{}]|\{[^}]*\})*\}/g,
		alias: "token-string"
	}],
	"class-name": clikeClass(),
	"property": /\B@\w*/,
	"keyword": /\$|\b(?:__(?:(?:DATE|EOF|FILE|FUNCTION|LINE|MODULE|PRETTY_FUNCTION|TIMESTAMP|TIME|VENDOR|VERSION)__|gshared|parameters|traits|vector)|abstract|alias|align|asm|assert|auto|body|bool|break|cas[et]|catch|[ci]?double|[ci]?float|class|const|continue|[ci]?real|[dw]?char|debug|default|delegate|delete|deprecated|do|d?string|else|enum|export|extern|false|true|final|finally|for|foreach|foreach_reverse|function|goto|if|immutable|import|inout|interface|invariant|lazy|macro|mixin|module|new|nothrow|null|out|override|package|pragma|private|protected|ptrdiff_t|public|pure|ref|return|scope|shared|size_t|static|struct|super|switch|synchronized|template|this|throw|try|typedef|typeid|typeof|u?byte|u?cent|u?int|u?long|union|unittest|u?short|version|void|volatile|while|with|wstring)\b/,
	"boolean": boolean,
	"register": {
		pattern: /\b(?:[ABCD][LHX]|E?(?:BP|DI|SI|SP)|[BS]PL|[ECSDGF]S|CR[0234]|[DS]IL|DR[012367]|[ER][ABCD]X|X?MM[0-7]|R(?:1[0-5]|[89])[BWD]?|R[BS]P|R[DS]I|TR[3-7]|XMM(?:1[0-5]|[89])|YMM(?:1[0-5]|\d))\b|\bST(?:\([0-7]\)|\b)/,
		alias: "variable"
	},
	"function": /\b\w+(?=\()/,
	"number": {
		pattern: /\b0x\.?[a-f\d_]+(?:(?!\.\.)\.[a-f\d_]*)?(?:p[+-]?[a-f\d_]+)?[ulfi]{0,4}|(\.\.)?(?:\b0b\.?|\b|\.)\d[\d_]*(?:(?!\.\.)\.[\d_]*)?(?:e[+-]?\d[\d_]*)?[ulfi]{0,4}/i,
		lookbehind: true
	},
	"operator": /--|\+\+|&&|\|\||=>|!?\bi[ns]\b|(?:!<>?|!>|<[<>]?|>>?>?|\^\^|[~%&|^!=/*+-])=?|\.{2,3}/,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=d.js.map