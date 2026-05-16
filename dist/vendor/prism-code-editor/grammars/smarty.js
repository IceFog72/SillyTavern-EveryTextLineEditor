import { l as r, P as p } from "../prismCore-AxbjJFmh.js";
import "./markup-templating.js";
import "./markup.js";
var d = /\{\*[\s\S]*?\*\}|\{php\}[\s\S]*?\{\/php\}|\{(?:[^{}"']|"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'|\{(?:[^{}"']|"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'|\{(?:[^{}"']|"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*')*\})*\})*\}/g, n = {
  pattern: /^\{php\}|\{\/php\}$/
}, i = {
  pattern: /[\s\S]+/
};
n.inside = i.inside = r.smarty = {
  comment: {
    pattern: /^\{\*[\s\S]*?\*\}/,
    greedy: !0
  },
  "embedded-php": {
    pattern: /^\{php\}[\s\S]*?\{\/php\}/,
    greedy: !0,
    inside: {
      smarty: n,
      php: {
        pattern: /[\s\S]+/,
        alias: "language-php",
        inside: "php"
      }
    }
  },
  string: [
    {
      pattern: /"(?:\\.|[^"\\\r\n])*"/,
      greedy: !0,
      inside: {
        interpolation: {
          pattern: /\{[^{}]*\}|`[^`]*`/,
          inside: {
            "interpolation-punctuation": {
              pattern: /^[{`]|[`}]$/,
              alias: "punctuation"
            },
            expression: i
          }
        },
        variable: /\$\w+/
      }
    },
    {
      pattern: /'(?:\\.|[^'\\\r\n])*'/,
      greedy: !0
    }
  ],
  keyword: {
    pattern: /(^\{\/?)[a-z_]\w*\b(?!\()/i,
    lookbehind: !0,
    greedy: !0
  },
  delimiter: {
    pattern: /^\{\/?|\}$/,
    greedy: !0,
    alias: "punctuation"
  },
  number: /\b0x[\dA-Fa-f]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][-+]?\d+)?/,
  variable: [
    /\$(?!\d)\w+/,
    /#(?!\d)\w+#/,
    {
      pattern: /(\.|->|\w\s*=)(?!\d)\w+\b(?!\()/,
      lookbehind: !0
    },
    {
      pattern: /(\[)(?!\d)\w+(?=\])/,
      lookbehind: !0
    }
  ],
  function: {
    pattern: /(\|\s*)@?[a-z_]\w*|\b[a-z_]\w*(?=\()/i,
    lookbehind: !0
  },
  "attr-name": /\b[a-z_]\w*(?=\s*=)/i,
  boolean: /\b(?:false|no|off|on|true|yes)\b/,
  punctuation: /[\[\](){}.,:`]|->/,
  operator: [
    /[+\-*\/%]|==?=?|[!<>]=?|&&|\|\|?/,
    /\bis\s+(?:not\s+)?(?:div|even|odd)(?:\s+by)?\b/,
    /\b(?:and|eq|gt?e|gt|lt?e|lt|mod|neq?|not|or)\b/
  ]
};
p.hooks.add("before-tokenize", (e) => {
  var s = "{literal}", o = "{/literal}", t = !1;
  r["markup-templating"].buildPlaceholders(e, "smarty", d, (a) => (a == o && (t = !1), t ? !1 : (a == s && (t = !0), !0)));
});
p.hooks.add("after-tokenize", (e) => {
  r["markup-templating"].tokenizePlaceholders(e, "smarty");
});
//# sourceMappingURL=smarty.js.map
