import { l as e } from "../prismCore-AxbjJFmh.js";
import "./mata.js";
import "./java.js";
import "./python.js";
import "./clike.js";
var t = {
  pattern: /[\s\S]+/
};
t.inside = e.stata = {
  comment: [
    {
      pattern: /(^[ \t]*)\*.*/m,
      lookbehind: !0,
      greedy: !0
    },
    {
      pattern: /(^|\s)\/\/.*|\/\*[\s\S]*?\*\//,
      lookbehind: !0,
      greedy: !0
    }
  ],
  "string-literal": {
    pattern: /"[^"\r\n]*"|[‘`']".*?"[’`']/,
    greedy: !0,
    inside: {
      interpolation: {
        pattern: /\$\{[^{}]*\}|[‘`']\w[^’`'\r\n]*[’`']/,
        inside: {
          punctuation: /^\$\{|\}$/,
          expression: t
        }
      },
      string: /[\s\S]+/
    }
  },
  mata: {
    pattern: /(^[ \t]*mata[ \t]*:)[\s\S]+?(?=^end\b)/m,
    lookbehind: !0,
    greedy: !0,
    alias: "language-mata",
    inside: e.mata
  },
  java: {
    pattern: /(^[ \t]*java[ \t]*:)[\s\S]+?(?=^end\b)/m,
    lookbehind: !0,
    greedy: !0,
    alias: "language-java",
    inside: e.java
  },
  python: {
    pattern: /(^[ \t]*python[ \t]*:)[\s\S]+?(?=^end\b)/m,
    lookbehind: !0,
    greedy: !0,
    alias: "language-python",
    inside: e.py
  },
  command: {
    pattern: /(^[ \t]*(?:\.[ \t]+)?(?:(?:bayes|bootstrap|by|bysort|capture|collect|fmm|fp|frame|jackknife|mfp|mi|nestreg|noisily|permute|quietly|rolling|simulate|statsby|stepwise|svy|version|xi)\b[^:\r\n]*:[ \t]*|(?:capture|noisily|quietly|version)[ \t]+)?)[a-zA-Z]\w*/m,
    lookbehind: !0,
    greedy: !0,
    alias: "keyword"
  },
  variable: /\$\w+|[‘`']\w[^’`'\r\n]*[’`']/,
  keyword: /\b(?:bayes|bootstrap|by|bysort|capture|clear|collect|fmm|fp|frame|if|in|jackknife|mi[ \t]+estimate|mfp|nestreg|noisily|of|permute|quietly|rolling|simulate|sort|statsby|stepwise|svy|varlist|version|xi)\b/,
  boolean: /\b(?:off|on)\b/,
  number: /\b\d+(?:\.\d+)?\b|\B\.\d+/,
  function: /\b[a-z_]\w*(?=\()/i,
  operator: /\+\+|--|##?|[<>!=~]=?|[+\-*^&|/]/,
  punctuation: /[(){}[\],:]/
};
//# sourceMappingURL=stata.js.map
