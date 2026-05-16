import { l as a } from "../prismCore-AxbjJFmh.js";
import "./markup.js";
var e = (n, s = "") => RegExp(
  n.replace(/<MOD>/g, "(?:\\([^|()\\n]+\\)|\\[[^\\]\\n]+\\]|\\{[^}\\n]+\\})").replace(/<PAR>/g, "(?:\\)|\\((?![^|()\\n]+\\)))"),
  s
), i = {
  css: {
    pattern: /\{[^{}]+\}/,
    inside: "css"
  },
  "class-id": {
    pattern: /(\()[^()]+(?=\))/,
    lookbehind: !0,
    alias: "attr-value"
  },
  lang: {
    pattern: /(\[)[^\[\]]+(?=\])/,
    lookbehind: !0,
    alias: "attr-value"
  },
  // Anything else is punctuation (the first pattern is for row/col spans inside tables)
  punctuation: /[\\\/]\d+|\S/
}, r = a.textile = a.extend("markup", {
  phrase: {
    pattern: /(^|\r|\n)\S[\s\S]*?(?=$|\r?\n\r?\n|\r\r)/,
    lookbehind: !0,
    inside: {
      // h1. Header 1
      "block-tag": {
        pattern: e("^[a-z]\\w*(?:<MOD>|<PAR>|[<>=])*\\."),
        inside: {
          modifier: {
            pattern: e("(^[a-z]\\w*)(?:<MOD>|<PAR>|[<>=])+(?=\\.)"),
            lookbehind: !0,
            inside: i
          },
          tag: /^[a-z]\w*/,
          punctuation: /\.$/
        }
      },
      // # List item
      // * List item
      list: {
        pattern: e("^[*#]+<MOD>*\\s+\\S.*", "m"),
        inside: {
          modifier: {
            pattern: e("(^[*#]+)<MOD>+"),
            lookbehind: !0,
            inside: i
          },
          punctuation: /^[*#]+/
        }
      },
      // | cell | cell | cell |
      table: {
        // Modifiers can be applied to the row: {color:red}.|1|2|3|
        // or the cell: |{color:red}.1|2|3|
        pattern: e(/^(?:(?:<MOD>|<PAR>|[<>=^~])+\.\s*)?(?:\|(?:(?:<MOD>|<PAR>|[<>=^~_]|[\\/]\d+)+\.|(?!(?:<MOD>|<PAR>|[<>=^~_]|[\\/]\d+)+\.))[^|]*)+\|/.source, "m"),
        inside: {
          modifier: {
            // Modifiers for rows after the first one are
            // preceded by a pipe and a line feed
            pattern: e(/(^|\|(?:\r?\n|\r)?)(?:<MOD>|<PAR>|[<>=^~_]|[\\/]\d+)+(?=\.)/.source),
            lookbehind: !0,
            inside: i
          },
          punctuation: /\||^\./
        }
      },
      inline: {
        // eslint-disable-next-line regexp/no-super-linear-backtracking
        pattern: e(/(^|[^a-zA-Z\d])(\*\*|__|\?\?|[*_%@+\-^~])<MOD>*.+?\2(?![a-zA-Z\d])/.source),
        lookbehind: !0,
        inside: {
          // Note: superscripts and subscripts are not handled specifically
          // *bold*, **bold**
          bold: {
            // eslint-disable-next-line regexp/no-super-linear-backtracking
            pattern: e(/(^(\*\*?)<MOD>*).+?(?=\2)/.source),
            lookbehind: !0
          },
          // _italic_, __italic__
          italic: {
            // eslint-disable-next-line regexp/no-super-linear-backtracking
            pattern: e(/(^(__?)<MOD>*).+?(?=\2)/.source),
            lookbehind: !0
          },
          // ??cite??
          cite: {
            // eslint-disable-next-line regexp/no-super-linear-backtracking
            pattern: e(/(^\?\?<MOD>*).+?(?=\?\?)/.source),
            lookbehind: !0,
            alias: "string"
          },
          // @code@
          code: {
            // eslint-disable-next-line regexp/no-super-linear-backtracking
            pattern: e("(^@<MOD>*).+?(?=@)"),
            lookbehind: !0,
            alias: "keyword"
          },
          // +inserted+
          inserted: {
            // eslint-disable-next-line regexp/no-super-linear-backtracking
            pattern: e("(^\\+<MOD>*).+?(?=\\+)"),
            lookbehind: !0
          },
          // -deleted-
          deleted: {
            // eslint-disable-next-line regexp/no-super-linear-backtracking
            pattern: e("(^-<MOD>*).+?(?=-)"),
            lookbehind: !0
          },
          // %span%
          span: {
            // eslint-disable-next-line regexp/no-super-linear-backtracking
            pattern: e("(^%<MOD>*).+?(?=%)"),
            lookbehind: !0
          },
          modifier: {
            pattern: e("(^\\*\\*|__|\\?\\?|[*_%@+\\-^~])<MOD>+"),
            lookbehind: !0,
            inside: i
          },
          punctuation: /[*_%?@+\-^~]+/
        }
      },
      // [alias]http://example.com
      "link-ref": {
        pattern: /^\[[^\]]+\]\S+$/m,
        inside: {
          string: {
            pattern: /(^\[)[^\]]+(?=\])/,
            lookbehind: !0
          },
          url: {
            pattern: /(^\])\S+$/,
            lookbehind: !0
          },
          punctuation: /[\[\]]/
        }
      },
      // "text":http://example.com
      // "text":link-ref
      link: {
        // eslint-disable-next-line regexp/no-super-linear-backtracking
        pattern: e(/"<MOD>*[^"]+":.+?(?=[^\w/]?(?:\s|$))/.source),
        inside: {
          text: {
            // eslint-disable-next-line regexp/no-super-linear-backtracking
            pattern: e(/(^"<MOD>*)[^"]+(?=")/.source),
            lookbehind: !0
          },
          modifier: {
            pattern: e(/(^")<MOD>+/.source),
            lookbehind: !0,
            inside: i
          },
          url: {
            pattern: /(:).+/,
            lookbehind: !0
          },
          punctuation: /[":]/
        }
      },
      // !image.jpg!
      // !image.jpg(Title)!:http://example.com
      image: {
        pattern: e(/!(?:<MOD>|<PAR>|[<>=])*(?![<>=])[^!\s()]+(?:\([^)]+\))?!(?::.+?(?=[^\w/]?(?:\s|$)))?/.source),
        inside: {
          source: {
            pattern: e(/(^!(?:<MOD>|<PAR>|[<>=])*)(?![<>=])[^!\s()]+(?:\([^)]+\))?(?=!)/.source),
            lookbehind: !0,
            alias: "url"
          },
          modifier: {
            pattern: e(/(^!)(?:<MOD>|<PAR>|[<>=])+/.source),
            lookbehind: !0,
            inside: i
          },
          url: {
            pattern: /(:).+/,
            lookbehind: !0
          },
          punctuation: /[!:]/
        }
      },
      // Footnote[1]
      footnote: {
        pattern: /\b\[\d+\]/,
        alias: "comment",
        inside: {
          punctuation: /\[|\]/
        }
      },
      // CSS(Cascading Style Sheet)
      acronym: {
        pattern: /\b[A-Z\d]+\([^)]+\)/,
        inside: {
          comment: {
            pattern: /(\()[^()]+(?=\))/,
            lookbehind: !0
          },
          punctuation: /[()]/
        }
      },
      // Prism(C)
      mark: {
        pattern: /\b\((?:C|R|TM)\)/,
        alias: "comment",
        inside: {
          punctuation: /[()]/
        }
      }
    }
  }
}), t = r.phrase.inside, o = {
  inline: t.inline,
  link: t.link,
  image: t.image,
  footnote: t.footnote,
  acronym: t.acronym,
  mark: t.mark
};
r.tag.pattern = /<\/?(?!\d)[a-z0-9]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i;
var d = t.inline.inside, u = t.table.inside, l = r["markup-bracket"];
delete r["markup-bracket"];
r["markup-bracket"] = l;
["bold", "italic", "inserted", "deleted", "span"].forEach((n) => d[n].inside = o);
["inline", "link", "image", "footnote", "acronym", "mark"].forEach((n) => u[n] = o[n]);
//# sourceMappingURL=textile.js.map
