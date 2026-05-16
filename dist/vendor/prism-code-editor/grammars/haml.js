import { l as n, i } from "../prismCore-AxbjJFmh.js";
import "./ruby.js";
import "./clike.js";
n.haml = {
  // Multiline stuff should appear before the rest
  "multiline-comment": {
    pattern: /((?:^|\r?\n|\r)([\t ]*))(?:\/|-#).*(?:(?:\r?\n|\r)\2[\t ].+)*/,
    lookbehind: !0,
    alias: "comment"
  },
  "multiline-code": [
    {
      pattern: /((?:^|\r?\n|\r)([\t ]*)(?:[~-]|[&!]?=)).*,[\t ]*(?:(?:\r?\n|\r)\2[\t ].*,[\t ]*)*(?:(?:\r?\n|\r)\2[\t ].+)/,
      lookbehind: !0,
      inside: "ruby"
    },
    {
      pattern: /((?:^|\r?\n|\r)([\t ]*)(?:[~-]|[&!]?=)).*\|[\t ]*(?:(?:\r?\n|\r)\2[\t ].*\|[\t ]*)*/,
      lookbehind: !0,
      inside: "ruby"
    }
  ],
  // See at the end of the file for known filters
  filter: {
    pattern: /((?:^|\r?\n|\r)([\t ]*)):[\w-]+(?:(?:\r?\n|\r)(?:\2[\t ].+|\s*?(?=\r?\n|\r)))+/,
    lookbehind: !0,
    inside: {
      "filter-name": {
        pattern: /^:[\w-]+/,
        alias: "symbol"
      }
    }
  },
  markup: {
    pattern: /((?:^|\r?\n|\r)[\t ]*)<.+/,
    lookbehind: !0,
    inside: "markup"
  },
  doctype: {
    pattern: /((?:^|\r?\n|\r)[\t ]*)!!!(?: .+)?/,
    lookbehind: !0
  },
  tag: {
    // Allows for one nested group of braces
    pattern: /((?:^|\r?\n|\r)[\t ]*)[%.#][\w\-#.]*[\w\-](?:\([^)]+\)|\{(?:\{[^}]+\}|[^{}])+\}|\[[^\]]+\])*[\/<>]*/,
    lookbehind: !0,
    inside: {
      attributes: [
        {
          // Lookbehind tries to prevent interpolations from breaking it all
          // Allows for one nested group of braces
          pattern: /(^|[^#])\{(?:\{[^}]+\}|[^{}])+\}/,
          lookbehind: !0,
          inside: "ruby"
        },
        {
          pattern: /\([^)]+\)/,
          inside: {
            "attr-value": {
              pattern: /(=\s*)(?:"(?:\\.|[^\\"\r\n])*"|[^)\s]+)/,
              lookbehind: !0
            },
            "attr-name": /[\w:-]+(?=\s*!?=|\s*[,)])/,
            punctuation: /[=(),]/
          }
        },
        {
          pattern: /\[[^\]]+\]/,
          inside: "ruby"
        }
      ],
      punctuation: /[<>]/
    }
  },
  code: {
    pattern: /((?:^|\r?\n|\r)[\t ]*(?:[~-]|[&!]?=)).+/,
    lookbehind: !0,
    inside: "ruby"
  },
  // Interpolations in plain text
  interpolation: {
    pattern: /#\{[^}]+\}/,
    inside: {
      delimiter: {
        pattern: /^#\{|\}$/,
        alias: "punctuation"
      },
      ruby: {
        pattern: /[\s\S]+/,
        inside: "ruby"
      }
    }
  },
  punctuation: {
    pattern: /((?:^|\r?\n|\r)[\t ]*)[~=\-&!]+/,
    lookbehind: !0
  }
};
var a = "((?:^|\\r?\\n|\\r)([\\t ]*)):{{filter_name}}(?:(?:\\r?\\n|\\r)(?:\\2[\\t ].+|\\s*?(?=\\r?\\n|\\r)))+", e = {};
[
  "css",
  "coffee",
  "erb",
  "javascript",
  "less",
  "markdown",
  "ruby",
  "scss",
  "textile"
].forEach((t) => {
  var r = t == "coffee" ? "coffeescript" : t;
  e["filter-" + t] = {
    pattern: RegExp(a.replace("{{filter_name}}", t)),
    lookbehind: !0,
    inside: {
      "filter-name": {
        pattern: /^:[\w-]+/,
        alias: "symbol"
      },
      text: {
        pattern: /[\s\S]+/,
        alias: "language-" + r,
        inside: r
      }
    }
  };
});
i("haml", "filter", e);
//# sourceMappingURL=haml.js.map
