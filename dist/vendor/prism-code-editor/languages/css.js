import { l as a } from "../index-svJglgH1.js";
import { o as e, i as r } from "../patterns-JQzfU8Ac.js";
import "../prismCore-AxbjJFmh.js";
a.css = a.sass = a.scss = {
  comments: {
    block: ["/*", "*/"]
  },
  autoIndent: [
    ([s], t) => e.test(t.slice(0, s)),
    ([s, t], o) => r.test(o[s - 1] + o[t])
  ]
};
//# sourceMappingURL=css.js.map
