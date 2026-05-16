import { l as t, i } from "../prismCore-AxbjJFmh.js";
import "./c.js";
import "./clike.js";
t.bison = t.extend("c", {});
i("bison", "comment", {
  bison: {
    // This should match all the beginning of the file
    // including the prologue(s), the bison declarations and
    // the grammar rules.
    pattern: /^(?:[^%]|%(?!%))*%%[\s\S]*?%%/,
    inside: {
      c: {
        // Allow for one level of nested braces
        pattern: /%\{[\s\S]*?%\}|\{(?:\{[^}]*\}|[^{}])*\}/,
        inside: {
          delimiter: {
            pattern: /^%?\{|%?\}$/,
            alias: "punctuation"
          },
          "bison-variable": {
            pattern: /[$@](?:<[^\s>]+>)?[\w$]+/,
            alias: "variable",
            inside: {
              punctuation: /<|>/
            }
          },
          rest: t.c
        }
      },
      comment: t.c.comment,
      string: t.c.string,
      property: /\S+(?=:)/,
      keyword: /%\w+/,
      number: {
        pattern: /(^|[^@])\b(?:0x[\da-f]+|\d+)/i,
        lookbehind: !0
      },
      punctuation: /%[%?]|[|:;\[\]<>]/
    }
  }
});
//# sourceMappingURL=bison.js.map
