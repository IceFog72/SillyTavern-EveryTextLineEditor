import { l as t, i as e } from "../prismCore-AxbjJFmh.js";
import "./clike.js";
var r = t.haxe = t.extend("clike", {
  string: {
    // Strings can be multi-line
    pattern: /"(?:[^"\\]|\\[\s\S])*"/,
    greedy: !0
  },
  "class-name": [
    {
      pattern: /(\b(?:abstract|class|enum|extends|implements|interface|new|typedef)\s+)[A-Z_]\w*/,
      lookbehind: !0
    },
    // based on naming convention
    /\b[A-Z]\w*/
  ],
  // The final look-ahead prevents highlighting of keywords if expressions such as "haxe.macro.Expr"
  keyword: /\bthis\b|\b(?:abstract|as|break|case|cast|catch|class|continue|default|do|dynamic|else|enum|extends|extern|final|for|from|function|if|implements|import|in|inline|interface|macro|new|null|operator|overload|override|package|private|public|return|static|super|switch|throw|to|try|typedef|untyped|using|var|while)(?!\.)\b/,
  function: {
    pattern: /\b[a-z_]\w*(?=\s*(?:<[^<>]*>\s*)?\()/i,
    greedy: !0
  },
  operator: /\.{3}|\+\+|--|&&|\|\||->|=>|(?:<<?|>{1,3}|[-+*/%!=&|^])=?|[?:~]/
});
e("haxe", "string", {
  "string-interpolation": {
    pattern: /'(?:[^'\\]|\\[\s\S])*'/,
    greedy: !0,
    inside: {
      interpolation: {
        pattern: /(^|[^\\])\$(?:\w+|\{[^{}]+\})/,
        lookbehind: !0,
        inside: {
          "interpolation-punctuation": {
            pattern: /^\$\{?|\}$/,
            alias: "punctuation"
          },
          expression: {
            pattern: /[\s\S]+/,
            inside: r
          }
        }
      },
      string: /[\s\S]+/
    }
  }
});
e("haxe", "class-name", {
  regex: {
    pattern: /~\/(?:[^\/\\\r\n]|\\.)+\/[a-z]*/,
    greedy: !0,
    inside: {
      "regex-flags": /\w+$/,
      "regex-delimiter": /^~\/|\/$/,
      "regex-source": {
        pattern: /[\s\S]+/,
        alias: "language-regex",
        inside: "regex"
      }
    }
  }
});
e("haxe", "keyword", {
  preprocessor: {
    pattern: /#(?:else|elseif|end|if)\b.*/,
    alias: "property"
  },
  metadata: {
    pattern: /@:?[\w.]+/,
    alias: "symbol"
  },
  reification: {
    pattern: /\$(?:\w+|(?=\{))/,
    alias: "important"
  }
});
//# sourceMappingURL=haxe.js.map
