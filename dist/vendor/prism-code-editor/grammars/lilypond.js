import { l as r } from "../prismCore-AxbjJFmh.js";
import "./scheme.js";
var e = /\((?:[^();"#\\]|\\[\s\S]|;.*(?!.)|"(?:[^"\\]|\\.)*"|#(?:\{(?:(?!#\})[\s\S])*#\}|[^{])|<expr>)*\)/.source;
for (var n = 0; n < 5; n++)
  e = e.replace(/<expr>/g, e);
e = e.replace(/<expr>/g, /[^\s\S]/.source);
var t = {
  pattern: /[\s\S]+/,
  alias: "language-lilypond"
};
t.inside = r.ly = r.lilypond = {
  comment: /%(?:(?!\{).*|\{[\s\S]*?%\})/,
  "embedded-scheme": {
    pattern: RegExp(/(^|[=\s])#(?:"(?:[^"\\]|\\.)*"|[^\s()"]*(?:[^\s()]|<expr>))/.source.replace(/<expr>/g, e), "m"),
    lookbehind: !0,
    greedy: !0,
    inside: {
      scheme: {
        pattern: /(?!^)[\s\S]+/,
        alias: "language-scheme",
        inside: {
          "embedded-lilypond": {
            pattern: /#\{[\s\S]*?#\}/,
            greedy: !0,
            inside: {
              punctuation: /^#\{|#\}$/,
              lilypond: t
            }
          },
          rest: r.scheme
        }
      },
      punctuation: /#/
    }
  },
  string: {
    pattern: /"(?:[^"\\]|\\.)*"/,
    greedy: !0
  },
  "class-name": {
    pattern: /(\\new\s+)[\w-]+/,
    lookbehind: !0
  },
  keyword: {
    pattern: /\\[a-z][-\w]*/i,
    inside: {
      punctuation: /^\\/
    }
  },
  operator: /[=|]|<<|>>/,
  punctuation: {
    pattern: /(^|[a-z\d])(?:'+|,+|[_^]?-[_^]?(?:[-+^!>._]|(?=\d))|[_^]\.?|[.!])|[{}()[\]<>^~]|\\[()[\]<>\\!]|--|__/,
    lookbehind: !0
  },
  number: /\b\d+(?:\/\d+)?\b/
};
//# sourceMappingURL=lilypond.js.map
