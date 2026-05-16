import { l as e, i } from "../prismCore-AxbjJFmh.js";
import "./haskell.js";
e.idris = e.extend("haskell", {
  comment: /(?:(?:--|\|\|\|).*$|\{-[\s\S]*?-\})/m,
  keyword: /\b(?:Type|case|class|codata|constructor|corecord|data|do|dsl|else|export|if|implementation|implicit|import|impossible|in|infix|infixl|infixr|instance|interface|let|module|mutual|namespace|of|parameters|partial|postulate|private|proof|public|quoteGoal|record|rewrite|syntax|then|total|using|where|with)\b/,
  builtin: void 0
});
i("idris", "keyword", {
  "import-statement": {
    pattern: /(^\s*import\s+)(?:[A-Z][\w']*)(?:\.[A-Z][\w']*)*/m,
    lookbehind: !0,
    inside: {
      punctuation: /\./
    }
  }
});
e.idr = e.idris;
//# sourceMappingURL=idris.js.map
