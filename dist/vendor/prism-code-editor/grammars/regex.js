import { l as n } from "../prismCore-AxbjJFmh.js";
var e = {
  pattern: /\\[\\(){}[\]^$+*?|.]/,
  alias: "escape"
}, a = /\\(?:x[\da-fA-F]{2}|u[\da-fA-F]{4}|u\{[\da-fA-F]+\}|0[0-7]{0,2}|[123][0-7]{2}|c[a-zA-Z]|.)/, s = {
  pattern: /\.|\\[wsd]|\\p\{[^{}]+\}/i,
  alias: "class-name"
}, i = {
  pattern: /\\[wsd]|\\p\{[^{}]+\}/i,
  alias: "class-name"
}, r = "(?:[^\\\\-]|" + a.source + ")", p = RegExp(r + "-" + r), t = {
  pattern: /(<|')[^<>']+(?=[>']$)/,
  lookbehind: !0,
  alias: "variable"
};
n.regex = {
  "char-class": {
    pattern: /((?:^|[^\\])(?:\\\\)*)\[(?:[^\\\]]|\\[\s\S])*\]/,
    lookbehind: !0,
    inside: {
      "char-class-punctuation": {
        pattern: /^\[|\]$/,
        alias: "punctuation"
      },
      "char-class-negation": {
        pattern: /^\^/,
        alias: "operator"
      },
      range: {
        pattern: p,
        inside: {
          escape: a,
          "range-punctuation": {
            pattern: /-/,
            alias: "operator"
          }
        }
      },
      "special-escape": e,
      "char-set": i,
      escape: a
    }
  },
  "special-escape": e,
  "char-set": s,
  backreference: [
    {
      // a backreference which is not an octal escape
      pattern: /\\(?![123][0-7]{2})[1-9]/,
      alias: "keyword"
    },
    {
      pattern: /\\k<[^<>']+>/,
      alias: "keyword",
      inside: {
        "group-name": t
      }
    }
  ],
  anchor: {
    pattern: /[$^]|\\[ABbGZz]/,
    alias: "function"
  },
  escape: a,
  group: [
    {
      // https://docs.oracle.com/javase/10/docs/api/java/util/regex/Pattern.html
      // https://docs.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference?view=netframework-4.7.2#grouping-constructs
      // (), (?<name>), (?'name'), (?>), (?:), (?=), (?!), (?<=), (?<!), (?is-m), (?i-m:)
      pattern: /\((?:\?(?:<[^<>']+>|'[^<>']+'|[>:]|<?[=!]|[idmnsuxU]+(?:-[idmnsuxU]+)?:?))?/,
      alias: "punctuation",
      inside: {
        "group-name": t
      }
    },
    {
      pattern: /\)/,
      alias: "punctuation"
    }
  ],
  quantifier: {
    pattern: /(?:[+*?]|\{\d+(?:,\d*)?\})[?+]?/,
    alias: "number"
  },
  alternation: {
    pattern: /\|/,
    alias: "keyword"
  }
};
//# sourceMappingURL=regex.js.map
