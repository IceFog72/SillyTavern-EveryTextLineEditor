import { l as e, P as a } from "../prismCore-AxbjJFmh.js";
import "./markup-templating.js";
import "./markup.js";
e.twig = {
  comment: /^\{#[\s\S]*?#\}$/,
  "tag-name": {
    pattern: /(^\{%-?\s*)\w+/,
    lookbehind: !0,
    alias: "keyword"
  },
  delimiter: {
    pattern: /^\{[{%]-?|-?[%}]\}$/,
    alias: "punctuation"
  },
  string: {
    pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
    inside: {
      punctuation: /^['"]|['"]$/
    }
  },
  keyword: /\b(?:even|if|odd)\b/,
  boolean: /\b(?:false|null|true)\b/,
  number: /\b0x[\dA-Fa-f]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee][-+]?\d+)?/,
  operator: [
    {
      pattern: /(\s)(?:and|b-and|b-or|b-xor|ends with|in|is|matches|not|or|same as|starts with)(?=\s)/,
      lookbehind: !0
    },
    /[=<>]=?|!=|\*\*?|\/\/?|\?:?|[-+~%|]/
  ],
  punctuation: /[()\[\]{}:.,]/
};
a.hooks.add("before-tokenize", (t) => {
  if (t.language === "twig") {
    var n = /\{(?:#[\s\S]*?#|%[\s\S]*?%|\{[\s\S]*?\})\}/g;
    e["markup-templating"].buildPlaceholders(t, "twig", n);
  }
});
a.hooks.add("after-tokenize", (t) => {
  e["markup-templating"].tokenizePlaceholders(t, "twig");
});
//# sourceMappingURL=twig.js.map
