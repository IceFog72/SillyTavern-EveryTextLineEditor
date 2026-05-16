import { l as g } from "../index-svJglgH1.js";
import { b as f } from "../utils-qtFp4SO6.js";
import { c as h, i as C } from "../patterns-JQzfU8Ac.js";
import "../prismCore-AxbjJFmh.js";
const r = /(?:^|[^\w$])<(?:(?!\d)([^\s>\/=<%]+)(?:(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))*\*\/)+(?:[^\s{*<>\/=]+(?:(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))*\*\/)*=\s*(?:"[^"]*"|'[^']*'|[^\s{'"\/>=]+|(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})))?|(?:\{(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))*\*\/)*\.{3}(?:[^{}]|(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\}))*\})))*(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))*\*\/)*)?>[ \t]*$/, k = /^<\/(?!\d)[^\s>\/=<%]*\s*>/, T = ({ tags: t, pairs: s }, { brackets: e, pairs: c }, m) => {
  for (let i = t.length, n, l = 0; n = t[--i]; )
    if (n[3] > m && n[1] < m)
      l = n[1];
    else if (n[2] < 2 && !n[5] && n[1] >= l && n[3] <= m && !(t[s[i]]?.[1] < m)) {
      for (let a = e.length, o; o = e[--a]; )
        if (o[1] >= n[3] && o[1] < m && o[3] == "{" && !(e[c[a]]?.[1] < m))
          return;
      return !0;
    }
}, x = {
  line: "//",
  block: ["/*", "*/"]
}, j = {
  block: ["{/*", "*/}"]
};
g.jsx = g.tsx = {
  comments: x,
  getComments(t, s) {
    const { matchBrackets: e, matchTags: c } = t.extensions;
    return (e && c ? T(c, e, s) : f(t, ".plain-text", 0, 0, s)) ? j : x;
  },
  autoIndent: [
    ([t], s) => r.test(s = s.slice(0, t)) || h.test(s),
    ([t, s], e) => C.test(e[t - 1] + e[s]) || r.test(e.slice(0, t)) && k.test(e.slice(s))
  ],
  autoCloseTags([t, s], e) {
    const c = t == s && (e.slice(0, t) + ">").match(r);
    return c ? `</${c[1] || ""}>` : "";
  }
};
//# sourceMappingURL=jsx.js.map
