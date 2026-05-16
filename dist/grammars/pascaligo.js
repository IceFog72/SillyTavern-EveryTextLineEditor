import { l as n } from "../prismCore-AxbjJFmh.js";
var o = /\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\)/.source, r = /(?:\b\w+(?:<braces>)?|<braces>)/.source.replace(/<braces>/g, o), a = n.pascaligo = {
  comment: /\(\*[\s\S]+?\*\)|\/\/.*/,
  string: {
    pattern: /(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1|\^[a-z]/i,
    greedy: !0
  },
  "class-name": [
    {
      pattern: RegExp(/(\btype\s+\w+\s+is\s+)<type>/.source.replace(/<type>/g, r), "i"),
      lookbehind: !0
    },
    {
      pattern: RegExp(/<type>(?=\s+is\b)/.source.replace(/<type>/g, r), "i")
    },
    {
      pattern: RegExp(/(:\s*)<type>/.source.replace(/<type>/g, r)),
      lookbehind: !0
    }
  ],
  keyword: {
    pattern: /(^|[^&])\b(?:begin|block|case|const|else|end|fail|for|from|function|if|is|nil|of|remove|return|skip|then|type|var|while|with)\b/i,
    lookbehind: !0
  },
  boolean: {
    pattern: /(^|[^&])\b(?:False|True)\b/i,
    lookbehind: !0
  },
  builtin: {
    pattern: /(^|[^&])\b(?:bool|int|list|map|nat|record|string|unit)\b/i,
    lookbehind: !0
  },
  function: /\b\w+(?=\s*\()/,
  number: [
    // Hexadecimal, octal and binary
    /%[01]+|&[0-7]+|\$[a-f\d]+/i,
    // Decimal
    /\b\d+(?:\.\d+)?(?:e[+-]?\d+)?(?:mtz|n)?/i
  ],
  operator: /->|=\/=|\.\.|\*\*|:=|<[<=>]?|>[>=]?|[+\-*\/]=?|[@^=|]|\b(?:and|mod|or)\b/,
  punctuation: /\(\.|\.\)|[()\[\]:;,.{}]/
}, i = ["comment", "keyword", "builtin", "operator", "punctuation"].reduce((e, t) => (e[t] = a[t], e), {});
a["class-name"].forEach((e) => {
  e.inside = i;
});
//# sourceMappingURL=pascaligo.js.map
