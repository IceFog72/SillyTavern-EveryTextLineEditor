import { l as o } from "../index-svJglgH1.js";
import { a, o as i, i as c, x as l } from "../patterns-JQzfU8Ac.js";
import "../prismCore-AxbjJFmh.js";
o.xml = o.ssml = o.atom = o.rss = o.mathml = o.svg = {
  comments: {
    block: ["<!--", "-->"]
  },
  autoIndent: [
    ([t], s) => a.test(s = s.slice(0, t)) || i.test(s),
    ([t, s], m) => c.test(m[t - 1] + m[s]) || a.test(m.slice(0, t)) && l.test(m.slice(s))
  ],
  autoCloseTags([t, s], m) {
    const e = t == s && (m.slice(0, t) + ">").match(a);
    return e ? `</${e[1]}>` : "";
  }
};
//# sourceMappingURL=xml.js.map
