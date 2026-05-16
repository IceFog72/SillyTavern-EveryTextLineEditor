import { l as t } from "../prismCore-AxbjJFmh.js";
var e = [
  {
    // Allow for one nested level of braces inside interpolation
    pattern: /(^|[^\\])\$\{(?:[^'"{}]|\{[^}]*\}|(["'])(?:(?!\2)[^\\]|\\[\s\S])*\2)+\}/,
    lookbehind: !0,
    inside: {
      "short-variable": {
        // Negative look-ahead prevent wrong highlighting of functions
        pattern: /(^\$\{)(?!\w+\()(?:::)?\w+(?:::\w+)*/,
        lookbehind: !0,
        alias: "variable",
        inside: {
          punctuation: /::/
        }
      },
      delimiter: {
        pattern: /^\$/,
        alias: "variable"
      }
    }
  },
  {
    pattern: /(^|[^\\])\$(?:::)?\w+(?:::\w+)*/,
    lookbehind: !0,
    alias: "variable",
    inside: {
      punctuation: /::/
    }
  }
];
e[0].inside.rest = t.puppet = {
  heredoc: [
    // Matches the content of a quoted heredoc string (subject to interpolation)
    {
      pattern: /(@\("([^"\r\n\/):]+)"(?:\/[nrts$uL]*)?\).*(?:\r?\n|\r))(?:.*(?:\r?\n|\r(?!\n)))*?[ \t]*(?:\|[ \t]*)?(?:-[ \t]*)?\2/,
      lookbehind: !0,
      alias: "string",
      inside: {
        // Matches the end tag
        punctuation: /(?=\S).*\S(?= *$)/,
        // See interpolation below
        interpolation: e
      }
    },
    // Matches the content of an unquoted heredoc string (no interpolation)
    {
      pattern: /(@\(([^"\r\n\/):]+)(?:\/[nrts$uL]*)?\).*(?:\r?\n|\r))(?:.*(?:\r?\n|\r(?!\n)))*?[ \t]*(?:\|[ \t]*)?(?:-[ \t]*)?\2/,
      lookbehind: !0,
      greedy: !0,
      alias: "string",
      inside: {
        // Matches the end tag
        punctuation: /(?=\S).*\S(?= *$)/
      }
    },
    // Matches the start tag of heredoc strings
    {
      pattern: /@\("?(?:[^"\r\n\/):]+)"?(?:\/[nrts$uL]*)?\)/,
      alias: "string",
      inside: {
        punctuation: {
          pattern: /(\().+?(?=\))/,
          lookbehind: !0
        }
      }
    }
  ],
  "multiline-comment": {
    pattern: /\/\*[\s\S]*?\*\//,
    greedy: !0,
    alias: "comment"
  },
  regex: {
    // Must be prefixed with the keyword "node" or a non-word char
    pattern: /((?:\bnode\s+|[~=\(\[\{,]\s*|[=+]>\s*|^\s*))\/(?:[^\/\\]|\\[\s\S])+\/(?:[imx]+\b|\B)/,
    lookbehind: !0,
    greedy: !0,
    inside: {
      // Extended regexes must have the x flag. They can contain single-line comments.
      "extended-regex": {
        pattern: /^\/(?:[^\/\\]|\\[\s\S])+\/[im]*x[im]*$/,
        inside: {
          comment: /#.*/
        }
      }
    }
  },
  comment: {
    pattern: /#.*/,
    greedy: !0
  },
  string: {
    // Allow for one nested level of double quotes inside interpolation
    pattern: /(["'])(?:\$\{(?:[^'"}]|(["'])(?:(?!\2)[^\\]|\\[\s\S])*\2)+\}|\$(?!\{)|(?!\1)[^\\$]|\\[\s\S])*\1/,
    greedy: !0,
    inside: {
      "double-quoted": {
        pattern: /^"[\s\S]*"$/,
        inside: {
          interpolation: e
        }
      }
    }
  },
  variable: {
    pattern: /\$(?:::)?\w+(?:::\w+)*/,
    inside: {
      punctuation: /::/
    }
  },
  "attr-name": /(?:\b\w+|\*)(?=\s*=>)/,
  function: [
    {
      pattern: /(\.)(?!\d)\w+/,
      lookbehind: !0
    },
    /\b(?:contain|debug|err|fail|include|info|notice|realize|require|tag|warning)\b|\b(?!\d)\w+(?=\()/
  ],
  number: /\b(?:0x[a-f\d]+|\d+(?:\.\d+)?(?:e-?\d+)?)\b/i,
  boolean: /\b(?:false|true)\b/,
  // Includes words reserved for future use
  keyword: /\b(?:application|attr|case|class|consumes|default|define|else|elsif|function|if|import|inherits|node|private|produces|type|undef|unless)\b/,
  datatype: {
    pattern: /\b(?:Any|Array|Boolean|Callable|Catalogentry|Class|Collection|Data|Default|Enum|Float|Hash|Integer|NotUndef|Numeric|Optional|Pattern|Regexp|Resource|Runtime|Scalar|String|Struct|Tuple|Type|Undef|Variant)\b/,
    alias: "symbol"
  },
  operator: /=[=~>]?|![=~]?|<(?:<\|?|[=~|-])?|>[>=]?|->?|~>|\|>?>?|[*\/%+?]|\b(?:and|in|or)\b/,
  punctuation: /[\[\]{}().,;]|:+/
};
//# sourceMappingURL=puppet.js.map
