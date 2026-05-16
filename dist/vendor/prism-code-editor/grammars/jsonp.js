import { l as n, i as o } from "../prismCore-AxbjJFmh.js";
import "./json.js";
n.jsonp = n.extend("json", {
  punctuation: /[{}[\]();,.]/
});
o("jsonp", "punctuation", {
  function: /(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+(?=\s*\()/
});
//# sourceMappingURL=jsonp.js.map
