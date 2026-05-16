import { l as e, P as t } from "../prismCore-AxbjJFmh.js";
import "./lua.js";
import "./markup-templating.js";
import "./markup.js";
e.etlua = {
  delimiter: {
    pattern: /^<%[-=]?|-?%>$/,
    alias: "punctuation"
  },
  "language-lua": {
    pattern: /[\s\S]+/,
    inside: "lua"
  }
};
t.hooks.add("before-tokenize", (a) => {
  var i = /<%[\s\S]+?%>/g;
  e["markup-templating"].buildPlaceholders(a, "etlua", i);
});
t.hooks.add("after-tokenize", (a) => {
  e["markup-templating"].tokenizePlaceholders(a, "etlua");
});
//# sourceMappingURL=etlua.js.map
