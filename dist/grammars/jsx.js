import { P as E, l as h, i as y } from "../prismCore-AxbjJFmh.js";
import "./markup.js";
import "./javascript.js";
import "./clike.js";
var C = E.util.clone(h.js), v = h.jsx = h.extend("xml", C), R = v.tag, m = R.inside, B = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))*\*\/)/.source, b = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source, p = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/, j = (r) => RegExp(
  r.source.replace(/<S>/g, B).replace(/<BRACES>/g, b).replace(/<SPREAD>/g, p.source)
);
p = j(p);
R.pattern = j(
  /<\/?(?:(?!\d)[^\s>\/=<%]+(?:<S>+(?:[^\s{*<>\/=]+(?:<S>*=\s*(?:(?:"[^"]*"|'[^']*'|[^\s{'"\/>=]+|<BRACES>)|(?=\S)))?|<SPREAD>))*<S>*\/?)?>/
);
m.tag.pattern = /^<\/?[^\s>/]*/;
m["attr-value"].pattern = /=\s*(?:"[^"]*"|'[^']*'|[^\s\/'">]+)?/;
m.tag.inside["class-name"] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/;
m.comment = C.comment;
delete v["markup-bracket"];
y("inside", "special-attr", {
  script: {
    // Allow for two levels of nesting
    pattern: j(/=\s*<BRACES>/),
    alias: "language-jsx",
    inside: {
      "script-punctuation": {
        pattern: /^=/,
        alias: "punctuation"
      },
      rest: v
    }
  },
  spread: {
    pattern: p,
    inside: v
  }
}, R);
var w = (r) => r && (!r.type || r.type == "plain-text"), P = (r, i, l) => {
  for (var e = 0, a = []; e < r.length; e++) {
    var S = r[e], t = S.length, s = S.content, u = S.type, A = !u, c, f, g, x;
    u && (u == "tag" && s[0].type == "tag" ? (f = i.slice(l + 1, l + s[0].length), f[0] == "/" ? a[0] && a[a.length - 1][0] == f.slice(1) && a.pop() : i[l + t - 2] != "/" && a.push([f, 0])) : a[0] && u == "punctuation" ? (c = a[a.length - 1], s == "{" ? c[1]++ : c[1] && s == "}" ? c[1]-- : A = !0) : A = !0), A && a[0] && !a[a.length - 1][1] ? (g = l, w(r[e + 1]) && (t += r[e + 1].length, r.splice(e + 1, 1)), w(r[e - 1]) && (g -= r[--e].length, r.splice(e, 1)), x = i.slice(g, l + t), r[e] = new E.Token("plain-text", x, null, x)) : Array.isArray(s) && P(s, i, l), l += t;
  }
};
E.hooks.add("after-tokenize", (r) => {
  (r.language == "jsx" || r.language == "tsx") && P(r.tokens, r.code, 0);
});
//# sourceMappingURL=jsx.js.map
