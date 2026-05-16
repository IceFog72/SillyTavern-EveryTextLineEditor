import { l as t, i as e } from "../prismCore-AxbjJFmh.js";
import "./clike.js";
t.cfc = t.cfscript = t.extend("clike", {
  comment: [
    {
      pattern: /\/\*[\s\S]*?(?:\*\/|$)/,
      inside: {
        annotation: {
          pattern: /(?:^|[^.])@[\w\.]+/,
          alias: "punctuation"
        }
      }
    },
    {
      pattern: /\/\/.*/,
      greedy: !0
    }
  ],
  keyword: /\b(?:abstract|break|catch|component|continue|default|do|else|extends|final|finally|for|function|if|in|include|package|private|property|public|remote|required|rethrow|return|static|switch|throw|try|var|while|xml)\b(?!\s*=)/,
  operator: [
    /\+\+|--|&&|\|\||::|=>|[!=]==|[-+*/%&|^!=<>]=?|\?(?:\.|:)?|:/,
    /\b(?:and|contains|eq|equal|eqv|gt|gte|imp|is|lt|lte|mod|not|or|xor)\b/
  ],
  scope: {
    pattern: /\b(?:application|arguments|cgi|client|cookie|local|session|super|this|variables)\b/,
    alias: "global"
  },
  type: {
    pattern: /\b(?:any|array|binary|boolean|date|guid|numeric|query|string|struct|uuid|void|xml)\b/,
    alias: "builtin"
  }
});
e("cfscript", "keyword", {
  // This must be declared before keyword because we use "function" inside the lookahead
  "function-variable": {
    pattern: /(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+(?=\s*[=:]\s*(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+)\s*=>))/,
    alias: "function"
  }
});
delete t.cfc["class-name"];
//# sourceMappingURL=cfscript.js.map
