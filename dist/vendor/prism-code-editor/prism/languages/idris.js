import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, r as extend } from "../../language-CXbc22uF.js";
import { o as dotPunctuation } from "../../patterns-DSInPV_c.js";
import "./haskell.js";
//#region src/prism/languages/idris.js
insertBefore(languages.idr = languages.idris = extend("hs", {
	"comment": /(?:(?:--|\|\|\|).*$|\{-[^]*?-\})/m,
	"keyword": /\b(?:Type|case|class|codata|constructor|corecord|data|do|dsl|else|export|if|implementation|implicit|import|impossible|in|infix[lr]?|instance|interface|let|module|mutual|namespace|of|parameters|partial|postulate|private|proof|public|quoteGoal|record|rewrite|syntax|then|total|using|where|with)\b/,
	"builtin": void 0
}), "keyword", { "import-statement": {
	pattern: /(^\s*import\s+)(?:[A-Z][\w']*)(?:\.[A-Z][\w']*)*/m,
	lookbehind: true,
	inside: dotPunctuation
} });
//#endregion

//# sourceMappingURL=idris.js.map