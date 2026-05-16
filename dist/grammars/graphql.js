import { l as w, P as A } from "../prismCore-AxbjJFmh.js";
w.graphql = {
  comment: /#.*/,
  description: {
    pattern: /(?:"""(?:[^"]|(?!""")")*"""|"(?:\\.|[^\\"\r\n])*")(?=\s*[a-z_])/i,
    greedy: !0,
    alias: "string",
    inside: {
      "language-markdown": {
        pattern: /(^"(?:"")?)(?!\1)[\s\S]+(?=\1$)/,
        lookbehind: !0,
        inside: "md"
      }
    }
  },
  string: {
    pattern: /"""(?:[^"]|(?!""")")*"""|"(?:\\.|[^\\"\r\n])*"/,
    greedy: !0
  },
  number: /(?:\B-|\b)\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
  boolean: /\b(?:false|true)\b/,
  variable: /\$[a-z_]\w*/i,
  directive: {
    pattern: /@[a-z_]\w*/i,
    alias: "function"
  },
  "attr-name": {
    pattern: /\b[a-z_]\w*(?=\s*(?:\((?:[^()"]|"(?:\\.|[^\\"\r\n])*")*\))?:)/i,
    greedy: !0
  },
  "atom-input": {
    pattern: /\b[A-Z]\w*Input\b/,
    alias: "class-name"
  },
  scalar: /\b(?:Boolean|Float|ID|Int|String)\b/,
  constant: /\b[A-Z][A-Z_\d]*\b/,
  "class-name": {
    pattern: /(\b(?:enum|implements|interface|on|scalar|type|union)\s+|&\s*|:\s*|\[)[A-Z_]\w*/,
    lookbehind: !0
  },
  fragment: {
    pattern: /(\bfragment\s+|\.{3}\s*(?!on\b))[a-zA-Z_]\w*/,
    lookbehind: !0,
    alias: "function"
  },
  "definition-mutation": {
    pattern: /(\bmutation\s+)[a-zA-Z_]\w*/,
    lookbehind: !0,
    alias: "function"
  },
  "definition-query": {
    pattern: /(\bquery\s+)[a-zA-Z_]\w*/,
    lookbehind: !0,
    alias: "function"
  },
  keyword: /\b(?:directive|enum|extend|fragment|implements|input|interface|mutation|on|query|repeatable|scalar|schema|subscription|type|union)\b/,
  operator: /[!=|&]|\.{3}/,
  "property-query": /\w+(?=\s*\()/,
  object: /\w+(?=\s*\{)/,
  punctuation: /[!(){}\[\]:=,]/,
  property: /\w+/
};
A.hooks.add("after-tokenize", (m) => {
  if (m.language == "graphql")
    for (var i = m.tokens.filter(
      (t) => typeof t != "string" && t.type != "comment" && t.type != "scalar"
    ), a = 0, o = (t) => i[a + t], d = (t, r) => {
      r = r || 0;
      for (var e = 0; e < t.length; e++) {
        var n = o(e + r);
        if (!n || n.type !== t[e])
          return !1;
      }
      return !0;
    }, y = (t, r) => {
      for (var e = 1, n = a; n < i.length; n++) {
        var h = i[n], b = h.content;
        if (h.type == "punctuation" && typeof b == "string") {
          if (t.test(b))
            e++;
          else if (r.test(b) && (e--, e === 0))
            return n;
        }
      }
      return -1;
    }, s = (t, r) => {
      var e = t.alias;
      e ? Array.isArray(e) || (t.alias = e = [e]) : t.alias = e = [], e.push(r);
    }; a < i.length; ) {
      var g = i[a++];
      if (g.type === "keyword" && g.content == "mutation") {
        var u = [];
        if (d(["definition-mutation", "punctuation"]) && o(1).content == "(") {
          a += 2;
          var l = y(/^\($/, /^\)$/);
          if (l == -1)
            continue;
          for (; a < l; a++) {
            var p = o(0);
            p.type == "variable" && (s(p, "variable-input"), u.push(p.content));
          }
          a = l + 1;
        }
        if (d(["punctuation", "property-query"]) && o(0).content == "{" && (a++, s(o(0), "property-mutation"), u.length > 0)) {
          var v = y(/^\{$/, /^\}$/);
          if (v == -1)
            continue;
          for (var f = a; f < v; f++) {
            var c = i[f];
            c.type == "variable" && u.indexOf(c.content) >= 0 && s(c, "variable-input");
          }
        }
      }
    }
});
//# sourceMappingURL=graphql.js.map
