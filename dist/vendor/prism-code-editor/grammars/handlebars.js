import { l as a, P as r } from "../prismCore-AxbjJFmh.js";
import "./markup-templating.js";
import "./markup.js";
a.handlebars = {
  comment: /\{\{![\s\S]*?\}\}/,
  delimiter: {
    pattern: /^\{\{\{?|\}\}\}?$/,
    alias: "punctuation"
  },
  string: /(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/,
  number: /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][+-]?\d+)?/,
  boolean: /\b(?:false|true)\b/,
  block: {
    pattern: /^(\s*(?:~\s*)?)[#\/]\S+?(?=\s*(?:~\s*)?$|\s)/,
    lookbehind: !0,
    alias: "keyword"
  },
  brackets: {
    pattern: /\[[^\]]+\]/,
    inside: {
      punctuation: /\[|\]/,
      variable: /[\s\S]+/
    }
  },
  punctuation: /[!"#%&':()*+,.\/;<=>@\[\\\]^`{|}~]/,
  variable: /[^!"#%&'()*+,\/;<=>@\[\\\]^`{|}~\s]+/
};
r.hooks.add("before-tokenize", (e) => {
  var s = /\{\{\{[\s\S]+?\}\}\}|\{\{[\s\S]+?\}\}/g;
  a["markup-templating"].buildPlaceholders(e, "handlebars", s);
});
r.hooks.add("after-tokenize", (e) => {
  a["markup-templating"].tokenizePlaceholders(e, "handlebars");
});
a.hbs = a.handlebars;
a.mustache = a.handlebars;
//# sourceMappingURL=handlebars.js.map
