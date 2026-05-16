import { l as n } from "../prismCore-AxbjJFmh.js";
var e = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/, r = e.source, t = n.css = {
  comment: /\/\*[\s\S]*?\*\//,
  atrule: {
    pattern: RegExp(`@[\\w-](?:[^;{\\s"']|\\s+(?!\\s)|${r})*?(?:;|(?=\\s*\\{))`),
    inside: {
      rule: /^@[\w-]+/,
      "selector-function-argument": {
        pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
        lookbehind: !0,
        alias: "selector"
      },
      keyword: {
        pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
        lookbehind: !0
      }
      // See rest below
    }
  },
  url: {
    // https://drafts.csswg.org/css-values-3/#urls
    pattern: RegExp(`\\burl\\((?:${r}|(?:[^\\\\\\r\\n()"']|\\\\[\\s\\S])*)\\)`, "i"),
    greedy: !0,
    inside: {
      function: /^url/i,
      punctuation: /^\(|\)$/,
      string: {
        pattern: RegExp("^" + r + "$"),
        alias: "url"
      }
    }
  },
  selector: {
    pattern: RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|${r})*(?=\\s*\\{)`),
    lookbehind: !0
  },
  string: {
    pattern: e,
    greedy: !0
  },
  property: {
    pattern: /(^|[^-\w\xA0-\uFFFF])(?!\d)(?:(?!\s)[-\w\xA0-\uFFFF])+(?=\s*:)/i,
    lookbehind: !0
  },
  important: /!important\b/i,
  function: {
    pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
    lookbehind: !0
  },
  punctuation: /[(){};:,]/
};
t.atrule.inside.rest = t;
//# sourceMappingURL=css.js.map
