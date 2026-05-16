import { l as a, i as n } from "../prismCore-AxbjJFmh.js";
import "./markup.js";
var e = (t, o) => {
  a[t] && n(t, "comment", {
    "doc-comment": o
  });
}, r = a.markup.tag, m = {
  pattern: /\/\/\/.*/,
  greedy: !0,
  alias: "comment",
  inside: {
    tag: r
  }
}, i = {
  pattern: /'''.*/,
  greedy: !0,
  alias: "comment",
  inside: {
    tag: r
  }
};
e("csharp", m);
e("fsharp", m);
e("vbnet", i);
//# sourceMappingURL=xml-doc.js.map
