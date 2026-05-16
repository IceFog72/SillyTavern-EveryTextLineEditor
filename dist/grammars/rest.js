import { l as t } from "../prismCore-AxbjJFmh.js";
t.rest = {
  table: [
    {
      pattern: /(^[\t ]*)(?:\+[=-]+)+\+(?:\r?\n|\r)(?:\1[+|].+[+|](?:\r?\n|\r))+\1(?:\+[=-]+)+\+/m,
      lookbehind: !0,
      inside: {
        punctuation: /\||(?:\+[=-]+)+\+/
      }
    },
    {
      pattern: /(^[\t ]*)=+ [ =]*=(?:(?:\r?\n|\r)\1.+)+(?:\r?\n|\r)\1=+ [ =]*=(?=(?:\r?\n|\r){2}|\s*$)/m,
      lookbehind: !0,
      inside: {
        punctuation: /[=-]+/
      }
    }
  ],
  // Directive-like patterns
  "substitution-def": {
    pattern: /(^[\t ]*\.\. )\|(?:[^|\s](?:[^|]*[^|\s])?)\| [^:]+::/m,
    lookbehind: !0,
    inside: {
      substitution: {
        pattern: /^\|(?:[^|\s]|[^|\s][^|]*[^|\s])\|/,
        alias: "attr-value",
        inside: {
          punctuation: /^\||\|$/
        }
      },
      directive: {
        pattern: /( )(?! )[^:]+::/,
        lookbehind: !0,
        alias: "function",
        inside: {
          punctuation: /::$/
        }
      }
    }
  },
  "link-target": [
    {
      pattern: /(^[\t ]*\.\. )\[[^\]]+\]/m,
      lookbehind: !0,
      alias: "string",
      inside: {
        punctuation: /^\[|\]$/
      }
    },
    {
      pattern: /(^[\t ]*\.\. )_(?:`[^`]+`|(?:[^:\\]|\\.)+):/m,
      lookbehind: !0,
      alias: "string",
      inside: {
        punctuation: /^_|:$/
      }
    }
  ],
  directive: {
    pattern: /(^[\t ]*\.\. )[^:]+::/m,
    lookbehind: !0,
    alias: "function",
    inside: {
      punctuation: /::$/
    }
  },
  comment: {
    // The two alternatives try to prevent highlighting of blank comments
    pattern: /(^[\t ]*\.\.)(?:(?: .+)?(?:(?:\r?\n|\r).+)+| .+)(?=(?:\r?\n|\r){2}|$)/m,
    lookbehind: !0
  },
  title: [
    // Overlined and underlined
    {
      pattern: /^(([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])\2+)(?:\r?\n|\r).+(?:\r?\n|\r)\1$/m,
      inside: {
        punctuation: /^[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]+|[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]+$/,
        important: /.+/
      }
    },
    // Underlined only
    {
      pattern: /(^|(?:\r?\n|\r){2}).+(?:\r?\n|\r)([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])\2+(?=\r?\n|\r|$)/,
      lookbehind: !0,
      inside: {
        punctuation: /[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]+$/,
        important: /.+/
      }
    }
  ],
  hr: {
    pattern: /((?:\r?\n|\r){2})([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])\2{3,}(?=(?:\r?\n|\r){2})/,
    lookbehind: !0,
    alias: "punctuation"
  },
  field: {
    pattern: /(^[\t ]*):[^:\r\n]+:(?= )/m,
    lookbehind: !0,
    alias: "attr-name"
  },
  "command-line-option": {
    pattern: /(^[\t ]*)(?:[+-][a-z\d]|(?:--|\/)[a-z\d-]+)(?:[ =](?:[a-z][\w-]*|<[^<>]+>))?(?:, (?:[+-][a-z\d]|(?:--|\/)[a-z\d-]+)(?:[ =](?:[a-z][\w-]*|<[^<>]+>))?)*(?=(?:\r?\n|\r)? {2,}\S)/im,
    lookbehind: !0,
    alias: "symbol"
  },
  "literal-block": {
    pattern: /::(?:\r?\n|\r){2}([ \t]+)(?![ \t]).+(?:(?:\r?\n|\r)\1.+)*/,
    inside: {
      "literal-block-punctuation": {
        pattern: /^::/,
        alias: "punctuation"
      }
    }
  },
  "quoted-literal-block": {
    pattern: /::(?:\r?\n|\r){2}([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~]).*(?:(?:\r?\n|\r)\1.*)*/,
    inside: {
      "literal-block-punctuation": {
        pattern: /^(?:::|([!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~])\1*)/m,
        alias: "punctuation"
      }
    }
  },
  "list-bullet": {
    pattern: /(^[\t ]*)(?:[*+\-•‣⁃]|\(?(?:\d+|[a-z]|[ivxdclm]+)\)|(?:\d+|[a-z]|[ivxdclm]+)\.)(?= )/im,
    lookbehind: !0,
    alias: "punctuation"
  },
  "doctest-block": {
    pattern: /(^[\t ]*)>>> .+(?:(?:\r?\n|\r).+)*/m,
    lookbehind: !0,
    inside: {
      punctuation: /^>>>/
    }
  },
  inline: [
    {
      pattern: /(^|[\s\-:\/'"<(\[{])(?::[^:]+:`.*?`|`.*?`:[^:]+:|(\*\*?|``?|\|)(?!\s)(?:(?!\2).)*\S\2(?=[\s\-.,:;!?\\\/'")\]}]|$))/m,
      lookbehind: !0,
      inside: {
        bold: {
          pattern: /(^\*\*).+(?=\*\*$)/,
          lookbehind: !0
        },
        italic: {
          pattern: /(^\*).+(?=\*$)/,
          lookbehind: !0
        },
        "inline-literal": {
          pattern: /(^``).+(?=``$)/,
          lookbehind: !0,
          alias: "symbol"
        },
        role: {
          pattern: /^:[^:]+:|:[^:]+:$/,
          alias: "function",
          inside: {
            punctuation: /^:|:$/
          }
        },
        "interpreted-text": {
          pattern: /(^`).+(?=`$)/,
          lookbehind: !0,
          alias: "attr-value"
        },
        substitution: {
          pattern: /(^\|).+(?=\|$)/,
          lookbehind: !0,
          alias: "attr-value"
        },
        punctuation: /\*\*?|``?|\|/
      }
    }
  ],
  link: [
    {
      pattern: /\[[^\[\]]+\]_(?=[\s\-.,:;!?\\\/'")\]}]|$)/,
      alias: "string",
      inside: {
        punctuation: /^\[|\]_$/
      }
    },
    {
      pattern: /(?:\b[a-z\d]+(?:[_.:+][a-z\d]+)*_?_|`[^`]+`_?_|_`[^`]+`)(?=[\s\-.,:;!?\\\/'")\]}]|$)/i,
      alias: "string",
      inside: {
        punctuation: /^_?`|`$|`?_?_$/
      }
    }
  ],
  // Line block start,
  // quote attribution,
  // explicit markup start,
  // and anonymous hyperlink target shortcut (__)
  punctuation: {
    pattern: /(^[\t ]*)(?:\|(?= |$)|(?:---?|—|\.\.|__)(?= )|\.\.$)/m,
    lookbehind: !0
  }
};
//# sourceMappingURL=rest.js.map
