import { a as languages } from "../../core-Dr0o9A-8.js";
import { a as clikeString, i as clikePunctuation, n as clikeComment, r as clikeNumber, t as boolean } from "../../patterns-DSInPV_c.js";
import { t as clikeClass } from "../../clike-class-CXD3NFPG.js";
//#region src/prism/languages/clike.js
languages.clike = {
	"comment": clikeComment,
	"string": clikeString,
	"class-name": clikeClass(),
	"keyword": /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
	"boolean": boolean,
	"function": /\b\w+(?=\()/,
	"number": clikeNumber,
	"operator": /[!=]==|[!=<>]=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=clike.js.map