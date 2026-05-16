import { l as n, i as d } from "../prismCore-AxbjJFmh.js";
var p = n.javadoclike = {
  parameter: {
    pattern: /(^[\t ]*(?:\/{3}|\*|\/\*\*)\s*@(?:arg|arguments|param)\s+)\w+/m,
    lookbehind: !0
  },
  keyword: {
    // keywords are the first word in a line preceded be an `@` or surrounded by curly braces.
    // @word, {@word}
    pattern: /(^[\t ]*(?:\/{3}|\*|\/\*\*)\s*|\{)@[a-z][a-zA-Z-]+\b/m,
    lookbehind: !0
  },
  punctuation: /[{}]/
}, f = (e, m) => {
  var o = n[e];
  if (o) {
    var a = "doc-comment", r = o[a];
    if (r || d(e, "comment", r = {
      [a]: {
        pattern: /\/\*\*[^/][\s\S]*?(?:\*\/|$)/,
        alias: "comment"
      }
    }), r instanceof RegExp && (r = o[a] = { pattern: r }), Array.isArray(r))
      for (var t = 0, s = r.length; t < s; t++)
        r[t] instanceof RegExp && (r[t] = { pattern: r[t] }), m(r[t]);
    else
      m(r);
  }
}, i = (e, m) => {
  (e.map ? e : [e]).forEach((o) => {
    f(o, (a) => {
      (a.inside || (a.inside = {})).rest = m;
    });
  });
};
Object.defineProperty(p, "addSupport", { value: i });
i(["java", "javascript", "php"], p);
//# sourceMappingURL=javadoclike.js.map
