import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation } from "../../patterns-DSInPV_c.js";
import { t as clikeClass } from "../../clike-class-CXD3NFPG.js";
//#region src/prism/languages/qore.js
languages.qore = {
	"comment": /\/\*[^]*?\*\/|\/\/.*|#.*/,
	"string": /(["'])(?:\\[^]|(?!\1)[^\\])*\1/g,
	"class-name": clikeClass(),
	"keyword": /\b(?:abstract|any|assert|binary|bool|boolean|break|byte|case|catch|char|class|code|const|continue|data|default|do|double|else|enum|extends|final|finally|float|for|goto|hash|if|implements|import|inherits|instanceof|int|interface|long|my|native|new|nothing|null|object|our|own|private|reference|rethrow|return|short|soft(?:bool|date|float|int|list|number|string)|static|strictfp|string|sub|super|switch|synchronized|this|throws?|transient|try|void|volatile|while)\b/,
	"boolean": /\b(?:false|true)\b/i,
	"function": /\$?\b(?!\d)\w+(?=\()/,
	"number": /\b(?:0b[01]+|0x(?:[a-f\d]*\.)?[a-f\dp-]+|(?:\d+(?:\.\d+)?|\.\d+)(?:e\d+)?[df]|(?:\d+(?:\.\d+)?|\.\d+))\b/i,
	"operator": {
		pattern: /(^|[^.])(?:--|\+\+|&&|\|\||[!=]==|[!=]~|<=>?|>>=?|<<=?|[%&|^!=<>/*+-]=?|[~?])/,
		lookbehind: true
	},
	"punctuation": clikePunctuation,
	"variable": /\$(?!\d)\w+/
};
//#endregion

//# sourceMappingURL=qore.js.map