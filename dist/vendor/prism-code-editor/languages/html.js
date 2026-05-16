import { l as e } from "../index-svJglgH1.js";
import { o as n, i as r, x as g, a as m } from "../patterns-JQzfU8Ac.js";
import "../prismCore-AxbjJFmh.js";
const c = /^(?:area|base|w?br|col|embed|hr|img|input|link|meta|source|track)$/, i = (t) => !c.test(t.match(m)?.[1] || "br");
e.markup = e.html = e.markdown = e.md = {
  comments: {
    block: ["<!--", "-->"]
  },
  autoIndent: [
    ([t], s) => i(s = s.slice(0, t)) || n.test(s),
    ([t, s], a) => r.test(a[t - 1] + a[s]) || i(a.slice(0, t)) && g.test(a.slice(s))
  ],
  autoCloseTags([t, s], a) {
    const o = t == s && (a.slice(0, t) + ">").match(m)?.[1];
    if (o && !c.test(o))
      return `</${o}>`;
  }
};
//# sourceMappingURL=html.js.map
