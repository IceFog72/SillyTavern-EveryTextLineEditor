import { l as E, P as n } from "../prismCore-AxbjJFmh.js";
import "./javascript.js";
import "./clike.js";
var z = E.js, _ = z["template-string"], $ = _.pattern.source, {
  pattern: G,
  inside: { ["interpolation-punctuation"]: H }
} = _.inside.interpolation, d = (r, a) => ({
  pattern: RegExp("((?:" + a.source + ")\\s*)" + $),
  lookbehind: !0,
  greedy: !0,
  inside: {
    "template-punctuation": {
      pattern: /^`|`$/,
      alias: "string"
    },
    "embedded-code": {
      pattern: /[\s\S]+/,
      alias: r
    }
  }
});
z["template-string"] = [
  // styled-jsx:
  //   css`a { color: #25F; }`
  // styled-components:
  //   styled.h1`color: red;`
  d("css", /\b(?:styled(?:\([^)]*\))?(?:\s*\.\s*\w+(?:\([^)]*\))*)*|css(?:\s*\.\s*(?:global|resolve))?|createGlobalStyle|keyframes)/),
  // html`<p></p>`
  // div.innerHTML = `<p></p>`
  d("html", /\bhtml|\.\s*(?:inner|outer)HTML\s*\+?=/),
  // svg`<path fill="#fff" d="M55.37 ..."/>`
  d("svg", /\bsvg/),
  // md`# h1`, markdown`## h2`
  d("markdown", /\b(?:markdown|md)/),
  // gql`...`, graphql`...`, graphql.experimental`...`
  d("graphql", /\b(?:gql|graphql(?:\s*\.\s*experimental)?)/),
  // sql`...`
  d("sql", /\bsql/),
  // vanilla template string
  _
];
var L = (r, a) => `___${a.toUpperCase()}_${r}___`, O = (r, a, e) => {
  var t = {
    code: r,
    grammar: a,
    language: e
  };
  return n.hooks.run("before-tokenize", t), t.tokens = n.tokenize(t.code, t.grammar), n.hooks.run("after-tokenize", t), t.tokens;
}, M = (r) => {
  var a = {
    "interpolation-punctuation": H
  }, e = n.tokenize(r, a);
  return e.length == 3 && e.splice(1, 1, ...O(e[1], z, "javascript")), new n.Token("interpolation", e, "language-javascript", r);
}, I = (r, a = {}, e) => {
  var t = n.tokenize(r, {
    interpolation: {
      pattern: G,
      lookbehind: !0
    }
  }), s = 0, p = {}, o = t.map((l) => {
    if (typeof l == "string")
      return l;
    for (var v = l.content, i; r.indexOf(i = L(s++, e)) != -1; )
      ;
    return p[i] = v, i;
  }).join(""), g = O(o, a, e), h = Object.keys(p), f = h.length, c = 0, w = [], k = (l) => {
    for (var v = 0; v < l.length && s < f; v++) {
      var i = l[v], u = i.content;
      if (u && (w[c++] = i), Array.isArray(u))
        k(u);
      else {
        var b = h[s], y = u || i, j = y.indexOf(b);
        if (j + 1) {
          ++s;
          var P = y.slice(0, j), T = p[b], q = b.length, S = M(T), x = y.slice(j + q), m = [S], A = 0;
          if (P && m.unshift(P), x) {
            var C = [x];
            k(C), m.push(...C);
          }
          for (; A < c; )
            w[A++].length += T.length - q;
          u ? i.content = m : (l.splice(v, 1, ...m), v += m.length - 1);
        }
      }
      u && c--;
    }
  };
  return s = 0, k(g), new n.Token(e, g, "language-" + e, r);
}, R = ["javascript", "typescript", "jsx", "tsx", "js", "ts"];
n.hooks.add("after-tokenize", (r) => {
  if (R.includes(r.language)) {
    "" + r.language;
    var a = (e) => {
      for (var t = 0, s = e.length; t < s; t++) {
        var p = e[t], o = p.content;
        if (Array.isArray(o))
          if (p.type == "template-string") {
            var g = o[1];
            if (o.length == 3 && g.type == "embedded-code") {
              var h = g.content, f = g.alias;
              o[1] = I(h, E[f], f);
            }
          } else
            a(o);
      }
    };
    a(r.tokens);
  }
});
//# sourceMappingURL=js-templates.js.map
