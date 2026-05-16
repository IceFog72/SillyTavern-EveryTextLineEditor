import { l as r } from "../prismCore-AxbjJFmh.js";
import "./javascript.js";
import "./clike.js";
var s = /"(?:\\.|[^\\"\r\n])*"|'(?:\\.|[^\\'\r\n])*'/.source, a = /\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))*\*\//.source, e = /(?:[^\\()[\]{}"'/]|<string>|\/(?![*/])|<comment>|\(<expr>*\)|\[<expr>*\]|\{<expr>*\}|\\[\s\S])/.source.replace(/<string>/g, s).replace(/<comment>/g, a);
for (var t = 0; t < 2; t++)
  e = e.replace(/<expr>/g, e);
e = e.replace(/<expr>/g, "[^\\s\\S]");
r.qml = {
  comment: {
    pattern: /\/\/.*|\/\*[\s\S]*?\*\//,
    greedy: !0
  },
  "javascript-function": {
    pattern: RegExp(/((?:^|;)[ \t]*)function\s+(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+\s*\(<js>*\)\s*\{<js>*\}/.source.replace(/<js>/g, e), "m"),
    lookbehind: !0,
    greedy: !0,
    alias: "language-javascript",
    inside: r.js
  },
  "class-name": {
    pattern: /((?:^|[:;])[ \t]*)(?!\d)\w+(?=[ \t]*\{|[ \t]+on\b)/m,
    lookbehind: !0
  },
  property: [
    {
      pattern: /((?:^|[;{])[ \t]*)(?!\d)\w+(?:\.\w+)*(?=[ \t]*:)/m,
      lookbehind: !0
    },
    {
      pattern: /((?:^|[;{])[ \t]*)property[ \t]+(?!\d)\w+(?:\.\w+)*[ \t]+(?!\d)\w+(?:\.\w+)*(?=[ \t]*:)/m,
      lookbehind: !0,
      inside: {
        keyword: /^property/,
        property: /\w+(?:\.\w+)*/
      }
    }
  ],
  "javascript-expression": {
    pattern: RegExp(/(:[ \t]*)(?![\s;}[])(?:(?!$|[;}])<js>)+/.source.replace(/<js>/g, e), "m"),
    lookbehind: !0,
    greedy: !0,
    alias: "language-javascript",
    inside: r.js
  },
  string: {
    pattern: /"(?:\\.|[^\\"\r\n])*"/,
    greedy: !0
  },
  keyword: /\b(?:as|import|on)\b/,
  punctuation: /[{}[\]:;,]/
};
//# sourceMappingURL=qml.js.map
