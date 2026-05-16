import { l as p, i as c } from "../prismCore-AxbjJFmh.js";
import "./cpp.js";
import "./c.js";
import "./clike.js";
p.cilkcpp = c("cpp", "function", {
  "parallel-keyword": {
    pattern: /\bcilk_(?:for|reducer|s(?:cope|pawn|ync))\b/,
    alias: "keyword"
  }
});
p["cilk-cpp"] = p.cilkcpp;
p.cilk = p.cilkcpp;
//# sourceMappingURL=cilkcpp.js.map
