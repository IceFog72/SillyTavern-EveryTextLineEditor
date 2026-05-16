import { l as o, P as t } from "../prismCore-AxbjJFmh.js";
import "./markup-templating.js";
import "./markup.js";
o.django = {
  comment: /^\{#[\s\S]*?#\}$/,
  tag: {
    pattern: /(^\{%[+-]?\s*)\w+/,
    lookbehind: !0,
    alias: "keyword"
  },
  delimiter: {
    pattern: /^\{[{%][+-]?|[+-]?[}%]\}$/,
    alias: "punctuation"
  },
  string: {
    pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
    greedy: !0
  },
  filter: {
    pattern: /(\|)\w+/,
    lookbehind: !0,
    alias: "function"
  },
  test: {
    pattern: /(\bis\s+(?:not\s+)?)(?!not\b)\w+/,
    lookbehind: !0,
    alias: "function"
  },
  function: /\b[a-z_]\w+(?=\s*\()/i,
  keyword: /\b(?:and|as|by|else|for|if|import|in|is|loop|not|or|recursive|with|without)\b/,
  operator: /[-+%=]=?|!=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
  number: /\b\d+(?:\.\d+)?\b/,
  boolean: /[Ff]alse|[Nn]one|[Tt]rue/,
  variable: /\b\w+\b/,
  punctuation: /[{}[\](),.:;]/
};
var n = /\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}|\{#[\s\S]*?#\}/g, a = o["markup-templating"];
t.hooks.add("before-tokenize", (e) => {
  a.buildPlaceholders(e, "django", n);
});
t.hooks.add("after-tokenize", (e) => {
  a.tokenizePlaceholders(e, "django");
});
o.jinja2 = o.django;
t.hooks.add("before-tokenize", (e) => {
  a.buildPlaceholders(e, "jinja2", n);
});
t.hooks.add("after-tokenize", (e) => {
  a.tokenizePlaceholders(e, "jinja2");
});
//# sourceMappingURL=django.js.map
