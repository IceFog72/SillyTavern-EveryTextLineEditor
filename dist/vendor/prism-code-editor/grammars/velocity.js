import { l as a, i as n } from "../prismCore-AxbjJFmh.js";
import "./markup.js";
var t = a.velocity = a.extend("markup", {}), r = {
  pattern: /(^|[^\\](?:\\\\)*)\$!?(?:[a-z][\w-]*(?:\([^)]*\))?(?:\.[a-z][\w-]*(?:\([^)]*\))?|\[[^\]]+\])*|\{[^}]+\})/i,
  lookbehind: !0,
  inside: {}
  // See below
}, e = {
  variable: r,
  string: {
    pattern: /"[^"]*"|'[^']*'/,
    greedy: !0
  },
  number: /\b\d+\b/,
  boolean: /\b(?:false|true)\b/,
  operator: /[=!<>]=?|[+*/%-]|&&|\|\||\.\.|\b(?:eq|g[et]|l[et]|n(?:e|ot))\b/,
  punctuation: /[(){}[\]:,.]/
}, i = t["markup-bracket"];
delete t["markup-bracket"];
t["markup-bracket"] = i;
r.inside = {
  string: e.string,
  function: {
    pattern: /([^\w-])[a-z][\w-]*(?=\()/,
    lookbehind: !0
  },
  number: e.number,
  boolean: e.boolean,
  punctuation: e.punctuation
};
n("velocity", "comment", {
  unparsed: {
    pattern: /(^|[^\\])#\[\[[\s\S]*?\]\]#/,
    lookbehind: !0,
    greedy: !0,
    inside: {
      punctuation: /^#\[\[|\]\]#$/
    }
  },
  "velocity-comment": [
    {
      pattern: /(^|[^\\])#\*[\s\S]*?\*#/,
      lookbehind: !0,
      greedy: !0,
      alias: "comment"
    },
    {
      pattern: /(^|[^\\])##.*/,
      lookbehind: !0,
      greedy: !0,
      alias: "comment"
    }
  ],
  directive: {
    pattern: /(^|[^\\](?:\\\\)*)#@?(?:[a-z][\w-]*|\{[a-z][\w-]*\})(?:\s*\((?:[^()]|\([^()]*\))*\))?/i,
    lookbehind: !0,
    inside: {
      keyword: {
        pattern: /^#@?(?:[a-z][\w-]*|\{[a-z][\w-]*\})|\bin\b/,
        inside: {
          punctuation: /[{}]/
        }
      },
      rest: e
    }
  },
  variable: r
});
t.tag.inside["attr-value"].inside.rest = t;
//# sourceMappingURL=velocity.js.map
