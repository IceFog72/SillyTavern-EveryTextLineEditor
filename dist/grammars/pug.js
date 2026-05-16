import { l as n, i as a } from "../prismCore-AxbjJFmh.js";
import "./markup.js";
import "./javascript.js";
import "./clike.js";
var t = n.js, s = /(^([\t ]*)):<filter_name>(?:(?:\r?\n|\r(?!\n))(?:\2[\t ].+|\s*?(?=\r?\n|\r)))+/.source, l = {
  atpl: "twig",
  coffee: "coffeescript",
  sass: "scss"
}, i = {};
n.pug = {
  // Multiline stuff should appear before the rest
  // This handles both single-line and multi-line comments
  comment: {
    pattern: /(^([\t ]*))\/\/.*(?:(?:\r?\n|\r)\2[\t ].+)*/m,
    lookbehind: !0
  },
  // All the tag-related part is in lookbehind
  // so that it can be highlighted by the "tag" pattern
  "multiline-script": {
    pattern: /(^([\t ]*)script\b.*\.[\t ]*)(?:(?:\r?\n|\r(?!\n))(?:\2[\t ].+|\s*?(?=\r?\n|\r)))+/m,
    lookbehind: !0,
    inside: t
  },
  // See at the end of the file for known filters
  filter: {
    pattern: /(^([\t ]*)):.+(?:(?:\r?\n|\r(?!\n))(?:\2[\t ].+|\s*?(?=\r?\n|\r)))+/m,
    lookbehind: !0,
    inside: {
      "filter-name": {
        pattern: /^:[\w-]+/,
        alias: "variable"
      },
      text: /\S[\s\S]*/
    }
  },
  "multiline-plain-text": {
    pattern: /(^([\t ]*)[\w\-#.]+\.[\t ]*)(?:(?:\r?\n|\r(?!\n))(?:\2[\t ].+|\s*?(?=\r?\n|\r)))+/m,
    lookbehind: !0
  },
  markup: {
    pattern: /(^[\t ]*)<.+/m,
    lookbehind: !0,
    inside: n.markup
  },
  doctype: {
    pattern: /((?:^|\n)[\t ]*)doctype(?: .+)?/,
    lookbehind: !0
  },
  // This handle all conditional and loop keywords
  "flow-control": {
    pattern: /(^[\t ]*)(?:case|default|each|else|if|unless|when|while)\b(?: .+)?/m,
    lookbehind: !0,
    inside: {
      each: {
        pattern: /^each .+? in\b/,
        inside: {
          keyword: /\b(?:each|in)\b/,
          punctuation: /,/
        }
      },
      branch: {
        pattern: /^(?:case|default|else|if|unless|when|while)\b/,
        alias: "keyword"
      },
      rest: t
    }
  },
  keyword: {
    pattern: /(^[\t ]*)(?:append|block|extends|include|prepend)\b.+/m,
    lookbehind: !0
  },
  mixin: [
    // Declaration
    {
      pattern: /(^[\t ]*)mixin .+/m,
      lookbehind: !0,
      inside: {
        keyword: /^mixin/,
        function: /\w+(?=\s*\(|\s*$)/,
        punctuation: /[(),.]/
      }
    },
    // Usage
    {
      pattern: /(^[\t ]*)\+.+/m,
      lookbehind: !0,
      inside: {
        name: {
          pattern: /^\+\w+/,
          alias: "function"
        },
        rest: t
      }
    }
  ],
  script: {
    pattern: /(^[\t ]*script(?:(?:&[^(]+)?\([^)]+\))*[\t ]).+/m,
    lookbehind: !0,
    inside: t
  },
  "plain-text": {
    pattern: /(^[\t ]*(?!-)[\w\-#.]*[\w\-](?:(?:&[^(]+)?\([^)]+\))*\/?[\t ]).+/m,
    lookbehind: !0
  },
  tag: {
    pattern: /(^[\t ]*)(?!-)[\w\-#.]*[\w\-](?:(?:&[^(]+)?\([^)]+\))*\/?:?/m,
    lookbehind: !0,
    inside: {
      attributes: [
        {
          pattern: /&[^(]+\([^)]+\)/,
          inside: t
        },
        {
          pattern: /\([^)]+\)/,
          inside: {
            "attr-value": {
              pattern: /(=\s*(?!\s))(?:\{[^}]*\}|[^,)\r\n]+)/,
              lookbehind: !0,
              inside: t
            },
            "attr-name": /[\w-]+(?=\s*!?=|\s*[,)])/,
            punctuation: /[!=(),]+/
          }
        }
      ],
      punctuation: /:/,
      "attr-id": /#[\w\-]+/,
      "attr-class": /\.[\w\-]+/
    }
  },
  code: [
    {
      pattern: /(^[\t ]*(?:-|!?=)).+/m,
      lookbehind: !0,
      inside: t
    }
  ],
  punctuation: /[.\-!=|]+/
};
[
  "atpl",
  "coffee",
  "ejs",
  "handlebars",
  "less",
  "livescript",
  "markdown",
  "sass",
  "stylus"
].forEach((e) => {
  var r = l[e] || e;
  i["filter-" + e] = {
    pattern: RegExp(s.replace("<filter_name>", e), "m"),
    lookbehind: !0,
    inside: {
      "filter-name": {
        pattern: /^:[\w-]+/,
        alias: "variable"
      },
      text: {
        pattern: /\S[\s\S]*/,
        alias: "language-" + r,
        inside: r
      }
    }
  };
});
a("pug", "filter", i);
//# sourceMappingURL=pug.js.map
