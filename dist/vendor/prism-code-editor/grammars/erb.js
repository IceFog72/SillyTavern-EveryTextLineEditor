import { l as r, P as a } from "../prismCore-AxbjJFmh.js";
import "./ruby.js";
import "./markup-templating.js";
import "./clike.js";
import "./markup.js";
r.erb = {
  delimiter: {
    pattern: /^(\s*)<%=?|%>(?=\s*$)/,
    lookbehind: !0,
    alias: "punctuation"
  },
  ruby: {
    pattern: /\s*\S[\s\S]*/,
    alias: "language-ruby",
    inside: "ruby"
  }
};
a.hooks.add("before-tokenize", (e) => {
  var n = /<%=?(?:[^\r\n]|[\r\n](?!=begin)|[\r\n]=begin\s(?:[^\r\n]|[\r\n](?!=end))*[\r\n]=end)+?%>/g;
  r["markup-templating"].buildPlaceholders(e, "erb", n);
});
a.hooks.add("after-tokenize", (e) => {
  r["markup-templating"].tokenizePlaceholders(e, "erb");
});
//# sourceMappingURL=erb.js.map
