import { l as t } from "../prismCore-AxbjJFmh.js";
var i = `(?:(?!d)[\\w\\x80-\\uFFFF]+|-?(?:\\.\\d+|\\d+(?:\\.\\d*)?)|"[^"\\\\]*(?:\\\\[\\s\\S][^"\\\\]*)*"|<(?:[^<>]|(?!<!--)<(?:[^<>"']|"[^"]*"|'[^']*')+>|<!--(?:[^-]|-(?!->))*-->)*>)`, e = {
  markup: {
    pattern: /(^<)[\s\S]+(?=>)/,
    lookbehind: !0,
    alias: "language-markup",
    inside: "markup"
  }
}, r = (a, n) => RegExp(a.replace(/<ID>/g, i), n);
t.gv = t.dot = {
  comment: {
    pattern: /\/\/.*|\/\*[\s\S]*?\*\/|^#.*/m,
    greedy: !0
  },
  "graph-name": {
    pattern: r(/(\b(?:digraph|graph|subgraph)[ \t\r\n]+)<ID>/.source, "i"),
    lookbehind: !0,
    greedy: !0,
    alias: "class-name",
    inside: e
  },
  "attr-value": {
    pattern: r(/(=[ \t\r\n]*)<ID>/.source),
    lookbehind: !0,
    greedy: !0,
    inside: e
  },
  "attr-name": {
    pattern: r(/([\[;, \t\r\n])<ID>(?=[ \t\r\n]*=)/.source),
    lookbehind: !0,
    greedy: !0,
    inside: e
  },
  keyword: /\b(?:digraph|edge|graph|node|strict|subgraph)\b/i,
  "compass-point": {
    pattern: /(:[ \t\r\n]*)(?:[ewc_]|[ns][ew]?)(?![\w\x80-\uFFFF])/,
    lookbehind: !0,
    alias: "builtin"
  },
  node: {
    pattern: r(/(^|[^-.\w\x80-\uFFFF\\])<ID>/.source),
    lookbehind: !0,
    greedy: !0,
    inside: e
  },
  operator: /[=:]|-[->]/,
  punctuation: /[\[\]{};,]/
};
//# sourceMappingURL=dot.js.map
