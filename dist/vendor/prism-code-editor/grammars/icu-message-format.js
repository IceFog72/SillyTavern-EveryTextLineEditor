import { l as d } from "../prismCore-AxbjJFmh.js";
var e = (t, r) => r ? t.replace(/<SELF>/g, e(t, r - 1)) : "[]", n = /'[{}:=,](?:[^']|'')*'(?!')/, i = {
  pattern: /''/,
  greedy: !0,
  alias: "operator"
}, u = {
  pattern: n,
  greedy: !0,
  inside: {
    escape: i
  }
}, o = {
  pattern: /(?!^)[\s\S]+(?=.)/
}, s = {
  punctuation: /\|/,
  range: {
    pattern: /^(\s*)[+-]?(?:\d+(?:\.\d*)?|\u221e)\s*[<#\u2264]/,
    lookbehind: !0,
    inside: {
      operator: /[<#\u2264]/,
      number: /\S+/
    }
  }
}, l = e(
  /\{(?:[^{}']|'(?![{},'])|''|<STR>|<SELF>)*\}/.source.replace(/<STR>/g, n.source),
  8
), a = {
  pattern: RegExp(l),
  inside: {
    message: o,
    "message-delimiter": {
      pattern: /./,
      alias: "punctuation"
    }
  }
};
s.rest = o.inside = d["icu-message-format"] = {
  argument: {
    pattern: RegExp(l),
    greedy: !0,
    inside: {
      content: {
        pattern: /(?!^)[\s\S]+(?=.)/,
        inside: {
          "argument-name": {
            pattern: /^(\s*)[^{}:=,\s]+/,
            lookbehind: !0
          },
          "choice-style": {
            // https://unicode-org.github.io/icu-docs/apidoc/released/icu4c/classicu_1_1ChoiceFormat.html#details
            pattern: /^(\s*,\s*choice\s*,\s*)\S(?:[\s\S]*\S)?/,
            lookbehind: !0,
            inside: s
          },
          "plural-style": {
            // https://unicode-org.github.io/icu-docs/apidoc/released/icu4j/com/ibm/icu/text/PluralFormat.html#:~:text=Patterns%20and%20Their%20Interpretation
            pattern: /^(\s*,\s*(?:plural|selectordinal)\s*,\s*)\S(?:[\s\S]*\S)?/,
            lookbehind: !0,
            inside: {
              offset: /^offset:\s*\d+/,
              "nested-message": a,
              selector: {
                pattern: /=\d+|[^{}:=,\s]+/,
                inside: {
                  keyword: /^(?:few|many|one|other|two|zero)$/
                }
              }
            }
          },
          "select-style": {
            // https://unicode-org.github.io/icu-docs/apidoc/released/icu4j/com/ibm/icu/text/SelectFormat.html#:~:text=Patterns%20and%20Their%20Interpretation
            pattern: /^(\s*,\s*select\s*,\s*)\S(?:[\s\S]*\S)?/,
            lookbehind: !0,
            inside: {
              "nested-message": a,
              selector: {
                pattern: /[^{}:=,\s]+/,
                inside: {
                  keyword: /^other$/
                }
              }
            }
          },
          keyword: /\b(?:choice|plural|select|selectordinal)\b/,
          "arg-type": {
            pattern: /\b(?:date|duration|number|ordinal|spellout|time)\b/,
            alias: "keyword"
          },
          "arg-skeleton": {
            pattern: /(,\s*)::[^{}:=,\s]+/,
            lookbehind: !0
          },
          "arg-style": {
            pattern: /(,\s*)(?:currency|full|integer|long|medium|percent|short)(?=\s*$)/,
            lookbehind: !0
          },
          "arg-style-text": {
            pattern: RegExp(/(^\s*,\s*(?=\S))/.source + e(/(?:[^{}']|'[^']*'|\{(?:<SELF>)?\})+/.source, 8) + "$"),
            lookbehind: !0,
            alias: "string"
          },
          punctuation: /,/
        }
      },
      "argument-delimiter": {
        pattern: /./,
        alias: "operator"
      }
    }
  },
  escape: i,
  string: u
};
//# sourceMappingURL=icu-message-format.js.map
