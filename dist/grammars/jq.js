import { l as a } from "../prismCore-AxbjJFmh.js";
var r = {
  pattern: /[\s\S]+/
}, n = /\\\((?:[^()]|\([^()]*\))*\)/.source, e = RegExp(/(^|[^\\])"(?:[^"\r\n\\]|\\[^\r\n(]|__)*"/.source.replace(/__/g, n)), t = {
  interpolation: {
    pattern: RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + n),
    lookbehind: !0,
    inside: {
      punctuation: /^\\\(|\)$/,
      content: r
    }
  }
};
r.inside = a.jq = {
  comment: /#.*/,
  property: {
    pattern: RegExp(e.source + /(?=\s*:(?!:))/.source),
    lookbehind: !0,
    greedy: !0,
    inside: t
  },
  string: {
    pattern: e,
    lookbehind: !0,
    greedy: !0,
    inside: t
  },
  function: {
    pattern: /(\bdef\s+)[a-z_]\w+/i,
    lookbehind: !0
  },
  variable: /\B\$\w+/,
  "property-literal": {
    pattern: /\b[a-z_]\w*(?=\s*:(?!:))/i,
    alias: "property"
  },
  keyword: /\b(?:as|break|catch|def|elif|else|end|foreach|if|import|include|label|module|modulemeta|null|reduce|then|try|while)\b/,
  boolean: /\b(?:false|true)\b/,
  number: /(?:\b\d+\.|\B\.)?\b\d+(?:[eE][+-]?\d+)?\b/,
  operator: [
    {
      pattern: /\|=?/,
      alias: "pipe"
    },
    /\.\.|[!=<>]?=|\?\/\/|\/\/=?|[-+*/%]=?|[<>?]|\b(?:and|not|or)\b/
  ],
  "c-style-function": {
    pattern: /\b[a-z_]\w*(?=\s*\()/i,
    alias: "function"
  },
  punctuation: /::|[()\[\]{},:;]|\.(?=\s*[\[\w$])/,
  dot: {
    pattern: /\./,
    alias: "important"
  }
};
//# sourceMappingURL=jq.js.map
