import { l as n, P as i } from "../prismCore-AxbjJFmh.js";
import "./markup-templating.js";
import "./markup.js";
var e = /[^<()"']|\((?:<expr>)*\)|<(?!#--)|<#--(?:[^-]|-(?!->))*-->|"(?:[^\\"]|\\.)*"|'(?:[^\\']|\\.)*'/.source;
for (var a = 0; a < 2; a++)
  e = e.replace(/<expr>/g, e);
e = e.replace(/<expr>/g, /[^\s\S]/.source);
var t = {
  comment: /<#--[\s\S]*?-->/,
  string: [
    {
      // raw string
      pattern: /\br("|')(?:(?!\1)[^\\]|\\.)*\1/,
      greedy: !0
    },
    {
      pattern: RegExp(/("|')(?:(?!\1|\$\{)[^\\]|\\.|\$\{(?:(?!\})(?:<expr>))*\})*\1/.source.replace(/<expr>/g, e)),
      greedy: !0,
      inside: {
        interpolation: {
          pattern: RegExp(/((?:^|[^\\])(?:\\\\)*)\$\{(?:(?!\})(?:<expr>))*\}/.source.replace(/<expr>/g, e)),
          lookbehind: !0,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\$\{|\}$/,
              alias: "punctuation"
            }
          }
        }
      }
    }
  ],
  keyword: /\b(?:as)\b/,
  boolean: /\b(?:false|true)\b/,
  "builtin-function": {
    pattern: /((?:^|[^?])\?\s*)\w+/,
    lookbehind: !0,
    alias: "function"
  },
  function: /\b\w+(?=\s*\()/,
  number: /\b\d+(?:\.\d+)?\b/,
  operator: /\.\.[<*!]?|->|--|\+\+|&&|\|\||\?{1,2}|[-+*/%!=<>]=?|\b(?:gt|gte|lt|lte)\b/,
  punctuation: /[,;.:()[\]{}]/
};
t.string[1].inside.interpolation.inside.rest = t;
n.ftl = {
  "ftl-comment": {
    // the pattern is shortened to be more efficient
    pattern: /^<#--[\s\S]*/,
    alias: "comment"
  },
  "ftl-directive": {
    pattern: /^<[\s\S]+>$/,
    inside: {
      directive: {
        pattern: /(^<\/?)[#@][a-z]\w*/i,
        lookbehind: !0,
        alias: "keyword"
      },
      punctuation: /^<\/?|\/?>$/,
      content: {
        pattern: /\s*\S[\s\S]*/,
        alias: "ftl",
        inside: t
      }
    }
  },
  "ftl-interpolation": {
    pattern: /^\$\{[\s\S]*\}$/,
    inside: {
      punctuation: /^\$\{|\}$/,
      content: {
        pattern: /\s*\S[\s\S]*/,
        alias: "ftl",
        inside: t
      }
    }
  }
};
i.hooks.add("before-tokenize", (r) => {
  var o = RegExp(/<#--[\s\S]*?-->|<\/?[#@][a-zA-Z](?:<expr>)*?>|\$\{(?:<expr>)*?\}/.source.replace(/<expr>/g, e), "gi");
  n["markup-templating"].buildPlaceholders(r, "ftl", o);
});
i.hooks.add("after-tokenize", (r) => {
  n["markup-templating"].tokenizePlaceholders(r, "ftl");
});
//# sourceMappingURL=ftl.js.map
