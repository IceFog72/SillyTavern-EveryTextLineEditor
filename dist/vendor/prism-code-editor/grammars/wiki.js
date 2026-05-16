import { l as i, i as e } from "../prismCore-AxbjJFmh.js";
import "./markup.js";
var t = i.markup.tag.inside;
i.wiki = i.extend("markup", {
  "block-comment": {
    pattern: /(^|[^\\])\/\*[\s\S]*?\*\//,
    lookbehind: !0,
    alias: "comment"
  },
  heading: {
    pattern: /^(=+)[^=\r\n].*?\1/m,
    inside: {
      punctuation: /^=+|=+$/,
      important: /.+/
    }
  },
  emphasis: {
    // TODO Multi-line
    pattern: /('{2,5}).+?\1/,
    inside: {
      "bold-italic": {
        pattern: /(''''').+?(?=\1)/,
        lookbehind: !0,
        alias: ["bold", "italic"]
      },
      bold: {
        pattern: /(''')[^'](?:.*?[^'])?(?=\1)/,
        lookbehind: !0
      },
      italic: {
        pattern: /('')[^'](?:.*?[^'])?(?=\1)/,
        lookbehind: !0
      },
      punctuation: /^''+|''+$/
    }
  },
  hr: {
    pattern: /^-{4,}/m,
    alias: "punctuation"
  },
  url: [
    /ISBN +(?:97[89][ -]?)?(?:\d[ -]?){9}[\dx]\b|(?:PMID|RFC) +\d+/i,
    /\[\[.+?\]\]|\[.+?\]/
  ],
  variable: [
    /__[A-Z]+__/,
    // FIXME Nested structures should be handled
    // {{formatnum:{{#expr:{{{3}}}}}}}
    /\{{3}.+?\}{3}/,
    /\{\{.+?\}\}/
  ],
  symbol: [
    /^#redirect/im,
    /~{3,5}/
  ],
  // Handle table attrs:
  // {|
  // ! style="text-align:left;"| Item
  // |}
  "table-tag": {
    pattern: /((?:^|[|!])[|!])[^|\r\n]+\|(?!\|)/m,
    lookbehind: !0,
    inside: {
      "table-bar": {
        pattern: /\|$/,
        alias: "punctuation"
      },
      rest: t
    }
  },
  punctuation: /^(?:\{\||\|\}|\|-|[*#:;!|])|\|\||!!/m
});
e("wiki", "tag", {
  // Prevent highlighting inside <nowiki>, <source> and <pre> tags
  nowiki: {
    pattern: /<(nowiki|pre|source)\b[^>]*>[\s\S]*?<\/\1>/i,
    inside: {
      tag: {
        pattern: /<(?:nowiki|pre|source)\b[^>]*>|<\/(?:nowiki|pre|source)>/i,
        inside: t
      }
    }
  }
});
delete i.wiki["markup-bracket"];
//# sourceMappingURL=wiki.js.map
