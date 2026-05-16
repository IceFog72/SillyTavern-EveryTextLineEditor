import { l as a } from "../prismCore-AxbjJFmh.js";
var t = /(?:(?!\s)[\d$+<=a-zA-Z\x80-\uFFFF])+/.source, e = /[^{}@#]+/.source, n = /\{[^}#@]*\}/.source, r = e + n, i = /(?:h|hours|hrs|m|min|minutes)/.source, o = {
  pattern: /\{[^{}]*\}/,
  inside: {
    amount: {
      pattern: /([\{|])[^{}|*%]+/,
      lookbehind: !0,
      alias: "number"
    },
    unit: {
      pattern: /(%)[^}]+/,
      lookbehind: !0,
      alias: "symbol"
    },
    "servings-scaler": {
      pattern: /\*/,
      alias: "operator"
    },
    "servings-alternative-separator": {
      pattern: /\|/,
      alias: "operator"
    },
    "unit-separator": {
      pattern: /(?:%|(\*)%)/,
      lookbehind: !0,
      alias: "operator"
    },
    punctuation: /[{}]/
  }
};
a.cooklang = {
  comment: {
    // [- comment -]
    // -- comment
    pattern: /\[-[\s\S]*?-\]|--.*/,
    greedy: !0
  },
  meta: {
    // >> key: value
    pattern: />>.*:.*/,
    inside: {
      property: {
        // key:
        pattern: /(>>\s*)[^\s:](?:[^:]*[^\s:])?/,
        lookbehind: !0
      }
    }
  },
  "cookware-group": {
    // #...{...}, #...
    pattern: RegExp(`#(?:${r}|${t})`),
    inside: {
      cookware: {
        pattern: RegExp(`(^#)(?:${e})`),
        lookbehind: !0,
        alias: "variable"
      },
      "cookware-keyword": {
        pattern: /^#/,
        alias: "keyword"
      },
      "quantity-group": {
        pattern: /\{[^{}@#]*\}/,
        inside: {
          punctuation: /[{}]/,
          quantity: {
            pattern: /[\s\S]+/,
            alias: "number"
          }
        }
      }
    }
  },
  "ingredient-group": {
    // @...{...}, @...
    pattern: RegExp(`@(?:${r}|${t})`),
    inside: {
      ingredient: {
        pattern: RegExp(`(^@)(?:${e})`),
        lookbehind: !0,
        alias: "variable"
      },
      "ingredient-keyword": {
        pattern: /^@/,
        alias: "keyword"
      },
      "amount-group": o
    }
  },
  "timer-group": {
    // ~timer{...}
    // eslint-disable-next-line regexp/sort-alternatives
    pattern: /~(?!\s)[^@#~{}]*\{[^{}]*\}/,
    inside: {
      timer: {
        pattern: /(^~)[^{]+/,
        lookbehind: !0,
        alias: "variable"
      },
      "duration-group": {
        // {...}
        pattern: /\{[^{}]*\}/,
        inside: {
          punctuation: /[{}]/,
          unit: {
            pattern: RegExp("(%\\s*)" + i + "\\b"),
            lookbehind: !0,
            alias: "symbol"
          },
          operator: /%/,
          duration: {
            pattern: /\d+/,
            alias: "number"
          }
        }
      },
      "timer-keyword": {
        pattern: /^~/,
        alias: "keyword"
      }
    }
  }
};
//# sourceMappingURL=cooklang.js.map
