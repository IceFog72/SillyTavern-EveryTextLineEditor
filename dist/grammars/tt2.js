import { l as t, i as r, P as a } from "../prismCore-AxbjJFmh.js";
import "./clike.js";
import "./markup-templating.js";
import "./markup.js";
t.tt2 = t.extend("clike", {
  comment: /#.*|\[%#[\s\S]*?%\]/,
  keyword: /\b(?:BLOCK|CALL|CASE|CATCH|CLEAR|DEBUG|DEFAULT|ELSE|ELSIF|END|FILTER|FINAL|FOREACH|GET|IF|IN|INCLUDE|INSERT|LAST|MACRO|META|NEXT|PERL|PROCESS|RAWPERL|RETURN|SET|STOP|SWITCH|TAGS|THROW|TRY|UNLESS|USE|WHILE|WRAPPER)\b/,
  punctuation: /[[\]{},()]/
});
r("tt2", "number", {
  operator: /=[>=]?|!=?|<=?|>=?|&&|\|\|?|\b(?:and|not|or)\b/,
  variable: /\b[a-z]\w*(?:\s*\.\s*(?:\d+|\$?[a-z]\w*))*\b/i
});
r("tt2", "keyword", {
  delimiter: {
    pattern: /^(?:\[%|%%)-?|-?%\]$/,
    alias: "punctuation"
  }
});
r("tt2", "string", {
  "single-quoted-string": {
    pattern: /'[^\\']*(?:\\[\s\S][^\\']*)*'/,
    greedy: !0,
    alias: "string"
  },
  "double-quoted-string": {
    pattern: /"[^\\"]*(?:\\[\s\S][^\\"]*)*"/,
    greedy: !0,
    alias: "string",
    inside: {
      variable: /\$(?:[a-z]\w*(?:\.(?:\d+|\$?[a-z]\w*))*)/i
    }
  }
});
delete t.tt2.string;
a.hooks.add("before-tokenize", (e) => {
  var i = /\[%[\s\S]+?%\]/g;
  t["markup-templating"].buildPlaceholders(e, "tt2", i);
});
a.hooks.add("after-tokenize", (e) => {
  t["markup-templating"].tokenizePlaceholders(e, "tt2");
});
//# sourceMappingURL=tt2.js.map
