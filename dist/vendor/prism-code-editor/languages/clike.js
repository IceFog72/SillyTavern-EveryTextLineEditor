import { l as t } from "../index-svJglgH1.js";
import { c as i, i as e } from "../patterns-JQzfU8Ac.js";
import "../prismCore-AxbjJFmh.js";
t.clike = t.js = t.javascript = t.ts = t.typescript = t.java = t.cs = t.csharp = t.c = t.cpp = {
  comments: {
    line: "//",
    block: ["/*", "*/"]
  },
  autoIndent: [
    ([s], a) => i.test(a.slice(0, s)),
    ([s, a], c) => e.test(c[s - 1] + c[a])
  ]
};
//# sourceMappingURL=clike.js.map
