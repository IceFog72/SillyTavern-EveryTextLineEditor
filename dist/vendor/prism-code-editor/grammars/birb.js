import { l as e, i as a } from "../prismCore-AxbjJFmh.js";
import "./clike.js";
e.birb = e.extend("clike", {
  string: {
    pattern: /r?("|')(?:\\.|(?!\1)[^\\])*\1/,
    greedy: !0
  },
  "class-name": [
    /\b[A-Z](?:[\d_]*[a-zA-Z]\w*)?\b/,
    // matches variable and function return types (parameters as well).
    /\b(?:[A-Z]\w*|(?!(?:var|void)\b)[a-z]\w*)(?=\s+\w+\s*[;,=()])/
  ],
  keyword: /\b(?:assert|break|case|class|const|default|else|enum|final|follows|for|grab|if|nest|new|next|noSeeb|return|static|switch|throw|var|void|while)\b/,
  operator: /\+\+|--|&&|\|\||<<=?|>>=?|~(?:\/=?)?|[+\-*\/%&^|=!<>]=?|\?|:/,
  variable: /\b[a-z_]\w*\b/
});
a("birb", "function", {
  metadata: {
    pattern: /<\w+>/,
    greedy: !0,
    alias: "symbol"
  }
});
//# sourceMappingURL=birb.js.map
