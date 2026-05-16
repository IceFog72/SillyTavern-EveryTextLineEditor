import { l as p, P as h } from "../prismCore-AxbjJFmh.js";
import "./markup.js";
var g = p.xquery = p.extend("markup", {
  "xquery-comment": {
    pattern: /\(:[\s\S]*?:\)/,
    greedy: !0,
    alias: "comment"
  },
  string: {
    pattern: /(["'])(?:\1\1|(?!\1)[\s\S])*\1/,
    greedy: !0
  },
  extension: {
    pattern: /\(#.+?#\)/,
    alias: "symbol"
  },
  variable: /\$[-\w:]+/,
  axis: {
    pattern: /(^|[^-])(?:ancestor(?:-or-self)?|attribute|child|descendant(?:-or-self)?|following(?:-sibling)?|parent|preceding(?:-sibling)?|self)(?=::)/,
    lookbehind: !0,
    alias: "operator"
  },
  "keyword-operator": {
    pattern: /(^|[^:-])\b(?:and|castable as|div|eq|except|ge|gt|idiv|instance of|intersect|is|le|lt|mod|ne|or|union)\b(?=$|[^:-])/,
    lookbehind: !0,
    alias: "operator"
  },
  keyword: {
    pattern: /(^|[^:-])\b(?:as|ascending|at|base-uri|boundary-space|case|cast as|collation|construction|copy-namespaces|declare|default|descending|else|empty (?:greatest|least)|encoding|every|external|for|function|if|import|in|inherit|lax|let|map|module|namespace|no-inherit|no-preserve|option|order(?: by|ed|ing)?|preserve|return|satisfies|schema|some|stable|strict|strip|then|to|treat as|typeswitch|unordered|validate|variable|version|where|xquery)\b(?=$|[^:-])/,
    lookbehind: !0
  },
  function: /[\w-]+(?::[\w-]+)*(?=\s*\()/,
  "xquery-element": {
    pattern: /(element\s+)[\w-]+(?::[\w-]+)*/,
    lookbehind: !0,
    alias: "tag"
  },
  "xquery-attribute": {
    pattern: /(attribute\s+)[\w-]+(?::[\w-]+)*/,
    lookbehind: !0,
    alias: "attr-name"
  },
  builtin: {
    pattern: /(^|[^:-])\b(?:attribute|comment|document|element|processing-instruction|text|xs:(?:ENTITIES|ENTITY|ID|IDREFS?|NCName|NMTOKENS?|NOTATION|Name|QName|anyAtomicType|anyType|anyURI|base64Binary|boolean|byte|date|dateTime|dayTimeDuration|decimal|double|duration|float|gDay|gMonth|gMonthDay|gYear|gYearMonth|hexBinary|int|integer|language|long|negativeInteger|nonNegativeInteger|nonPositiveInteger|normalizedString|positiveInteger|short|string|time|token|unsigned(?:Byte|Int|Long|Short)|untyped(?:Atomic)?|yearMonthDuration))\b(?=$|[^:-])/,
    lookbehind: !0
  },
  number: /\b\d+(?:\.\d+)?(?:E[+-]?\d+)?/,
  operator: [
    /[+*=?|@]|\.\.?|:=|!=|<[=<]?|>[=>]?/,
    {
      pattern: /(\s)-(?=\s)/,
      lookbehind: !0
    }
  ],
  punctuation: /[[\](){},;:/]/
}), v = g.tag, y = v.inside["attr-value"], f = (e) => e && (!e.type || e.type == "plain-text"), x = (e, i, a) => {
  for (var r = 0, t = []; r < e.length; r++) {
    var m = e[r], u = m.length, n = m.content, l = m.type, b = !l, o, d, c, s;
    l && l != "comment" && (l == "tag" && n[0].type == "tag" ? (d = i.slice(a + 1, a + n[0].length), d[0] == "/" ? t[0] && t[t.length - 1][0] == d.slice(1) && t.pop() : i[a + u - 2] != "/" && t.push([d, 0])) : t[0] && l == "punctuation" ? (o = t[t.length - 1], n == "{" && i[a - 1] != "{" && i[a + 1] != "{" ? o[1]++ : o[1] && n == "}" ? o[1]-- : b = !0) : b = !0), b && t[0] && !t[t.length - 1][1] ? (c = a, f(e[r + 1]) && (u += e[r + 1].length, e.splice(r + 1, 1)), f(e[r - 1]) && (c -= e[--r].length, e.splice(r, 1)), s = i.slice(c, a + u), e[r] = s.trimEnd() ? new h.Token("plain-text", s, null, s) : s) : Array.isArray(n) && x(n, i, a), a += u;
  }
};
v.pattern = /<\/?(?!\d)[^\s>\/=$<%]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|\{(?!\{)(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])+\}|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/;
y.pattern = /=(?:("|')(?:\\[\s\S]|\{(?!\{)(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])+\}|(?!\1)[^\\])*\1|[^\s'">=]+)/;
y.inside.punctuation = /^="|"$/;
y.inside.expression = {
  // Allow for two levels of nesting
  pattern: /\{(?!\{)(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])+\}/,
  inside: g,
  alias: "language-xquery"
};
delete g["markup-bracket"];
h.hooks.add("after-tokenize", (e) => {
  e.language == "xquery" && x(e.tokens, e.code, 0);
});
//# sourceMappingURL=xquery.js.map
