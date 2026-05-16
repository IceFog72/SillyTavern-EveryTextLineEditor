import { l as e, i } from "../prismCore-AxbjJFmh.js";
import "./markup.js";
import "./java.js";
import "./javadoclike.js";
import "./clike.js";
var n = /(^(?:[\t ]*(?:\*\s*)*))[^*\s].*$/m, r = /#\s*\w+(?:\s*\([^()]*\))?/.source, o = /(?:\b[a-zA-Z]\w+\s*\.\s*)*\b[A-Z]\w*(?:\s*<mem>)?|<mem>/.source.replace(/<mem>/g, r), t = e.java, a = e.markup, s = e.javadoc = e.extend("javadoclike", {});
i("javadoc", "keyword", {
  reference: {
    pattern: RegExp(`(@(?:exception|link|linkplain|see|throws|value)\\s+(?:\\*\\s*)?)(?:${o})`),
    lookbehind: !0,
    inside: {
      function: {
        pattern: /(#\s*)\w+(?=\s*\()/,
        lookbehind: !0
      },
      field: {
        pattern: /(#\s*)\w+/,
        lookbehind: !0
      },
      namespace: {
        pattern: /\b(?:[a-z]\w*\s*\.\s*)+/,
        inside: {
          punctuation: /\./
        }
      },
      "class-name": /\b[A-Z]\w*/,
      keyword: t.keyword,
      punctuation: /[#()[\],.]/
    }
  },
  "class-name": {
    // @param <T> the first generic type parameter
    pattern: /(@param\s+)<[A-Z]\w*>/,
    lookbehind: !0,
    inside: {
      punctuation: /[.<>]/
    }
  },
  "code-section": [
    {
      pattern: /(\{@code\s+(?!\s))(?:[^\s{}]|\s+(?![\s}])|\{(?:[^{}]|\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})*\})+(?=\s*\})/,
      lookbehind: !0,
      inside: {
        code: {
          // there can't be any HTML inside of {@code} tags
          pattern: n,
          lookbehind: !0,
          inside: t,
          alias: "language-java"
        }
      }
    },
    {
      pattern: /(<(code|pre|tt)>(?!<code>)\s*)\S(?:\S|\s+\S)*?(?=\s*<\/\2>)/,
      lookbehind: !0,
      inside: {
        line: {
          pattern: n,
          lookbehind: !0,
          inside: {
            // highlight HTML tags and entities
            tag: a.tag,
            entity: a.entity,
            code: {
              // everything else is Java code
              pattern: /.+/,
              inside: t,
              alias: "language-java"
            }
          }
        }
      }
    }
  ],
  tag: a.tag,
  entity: a.entity
});
e.javadoclike.addSupport("java", s);
//# sourceMappingURL=javadoc.js.map
