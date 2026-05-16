import { l as e, P as t } from "../prismCore-AxbjJFmh.js";
import "./javascript.js";
import "./markup-templating.js";
import "./clike.js";
import "./markup.js";
e.eta = e.ejs = {
  delimiter: {
    pattern: /^<%[-_=]?|[-_]?%>$/,
    alias: "punctuation"
  },
  comment: /^#[\s\S]*/,
  "language-javascript": {
    pattern: /[\s\S]+/,
    inside: "js"
  }
};
t.hooks.add("before-tokenize", (a) => {
  var i = /<%(?!%)[\s\S]+?%>/g;
  e["markup-templating"].buildPlaceholders(a, "ejs", i);
});
t.hooks.add("after-tokenize", (a) => {
  e["markup-templating"].tokenizePlaceholders(a, "ejs");
});
//# sourceMappingURL=ejs.js.map
