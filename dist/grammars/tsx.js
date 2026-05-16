import { P as p, l as t } from "../prismCore-AxbjJFmh.js";
import "./jsx.js";
import "./typescript.js";
import "./markup.js";
import "./javascript.js";
import "./clike.js";
var o = p.util.clone(t.ts), e = t.tsx = t.extend("jsx", o), r = e.tag, a = "(?:^|(";
delete e.parameter;
delete e["literal-property"];
try {
  RegExp("(?<=)"), a += "?<=";
} catch {
  r.lookbehind = !0;
}
r.pattern = RegExp(a + `[^\\w$])|(?=</))${r.pattern.source}`, "g");
//# sourceMappingURL=tsx.js.map
