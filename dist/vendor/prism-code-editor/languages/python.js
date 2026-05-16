import { l as e } from "../index-svJglgH1.js";
import { i as r } from "../patterns-JQzfU8Ac.js";
import "../prismCore-AxbjJFmh.js";
const a = /[([{][^\n)\]}]*$|:[ \t]*$/;
e.py = e.python = {
  comments: {
    line: "#"
  },
  autoIndent: [
    ([t], o) => a.test(o.slice(0, t)),
    ([t, o], n) => r.test(n[t - 1] + n[o])
  ]
};
//# sourceMappingURL=python.js.map
