import { l as e } from "../prismCore-AxbjJFmh.js";
e.livescript = {
  comment: /#.*|\/\*[\s\S]*?\*\//,
  "interpolated-string": {
    /* Look-behind and look-ahead prevents wrong behavior of the greedy pattern
    * forcing it to match """-quoted string when it would otherwise match "-quoted first. */
    pattern: /(^|[^"])("""|")(?:\\[\s\S]|(?!\2)[^\\])*\2(?!")/,
    lookbehind: !0,
    greedy: !0,
    inside: {
      variable: {
        pattern: /(^|[^\\])#[a-z_](?:-?[a-z]|[\d_])*/m,
        lookbehind: !0
      },
      interpolation: {
        pattern: /(^|[^\\])#\{[^}]+\}/m,
        lookbehind: !0,
        inside: {
          "interpolation-punctuation": {
            pattern: /^#\{|\}$/,
            alias: "variable"
          }
          // See rest below
        }
      },
      string: /[\s\S]+/
    }
  },
  string: [
    {
      pattern: /('''|')(?:\\[\s\S]|(?!\1)[^\\])*\1/,
      greedy: !0
    },
    {
      pattern: /<\[[\s\S]*?\]>/,
      greedy: !0
    },
    /\\[^\s,;\])}]+/
  ],
  regex: [
    {
      pattern: /\/\/(?:\[[^\r\n\]]*\]|\\.|(?!\/\/)[^\\\[])+\/\/[gimyu]{0,5}/,
      greedy: !0,
      inside: {
        comment: /#.*/
      }
    },
    {
      pattern: /\/(?:\[[^\r\n\]]*\]|\\.|[^/\\\r\n\[])+\/[gimyu]{0,5}/,
      greedy: !0
    }
  ],
  keyword: {
    pattern: /(^|(?!-).)\b(?:break|case|catch|class|const|continue|default|do|else|extends|fallthrough|finally|for(?: ever)?|function|if|implements|it|let|loop|new|null|otherwise|own|return|super|switch|that|then|this|throw|try|unless|until|var|void|when|while|yield)(?!-)\b/m,
    lookbehind: !0
  },
  "keyword-operator": {
    pattern: /(^|[^-])\b(?:(?:delete|require|typeof)!|(?:and|by|delete|export|from|import(?: all)?|in|instanceof|is(?: not|nt)?|not|of|or|til|to|typeof|with|xor)(?!-)\b)/m,
    lookbehind: !0,
    alias: "operator"
  },
  boolean: {
    pattern: /(^|[^-])\b(?:false|no|off|on|true|yes)(?!-)\b/m,
    lookbehind: !0
  },
  argument: {
    // Don't match .&. nor &&
    pattern: /(^|(?!\.&\.)[^&])&(?!&)\d*/m,
    lookbehind: !0,
    alias: "variable"
  },
  number: /\b(?:\d+~[\da-z]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[a-z]\w*)?)/i,
  identifier: /[a-z_](?:-?[a-z]|[\d_])*/i,
  operator: [
    // Spaced .
    {
      pattern: /( )\.(?= )/,
      lookbehind: !0
    },
    // Full list, in order:
    // .= .~ .. ...
    // .&. .^. .<<. .>>. .>>>.
    // := :: ::=
    // &&
    // || |>
    // < << <<< <<<<
    // <- <-- <-! <--!
    // <~ <~~ <~! <~~!
    // <| <= <?
    // > >> >= >?
    // - -- -> -->
    // + ++
    // @ @@
    // % %%
    // * **
    // ! != !~=
    // !~> !~~>
    // !-> !-->
    // ~ ~> ~~> ~=
    // = ==
    // ^ ^^
    // / ?
    /\.(?:[=~]|\.\.?)|\.(?:[&|^]|<<|>>>?)\.|:(?:=|:=?)|&&|\|[|>]|<(?:<<?<?|--?!?|~~?!?|[|=?])?|>[>=?]?|-(?:->?|>)?|\+\+?|@@?|%%?|\*\*?|!(?:~?=|--?>|~?~>)?|~(?:~?>|=)?|==?|\^\^?|[\/?]/
  ],
  punctuation: /[(){}\[\]|.,:;`]/
};
e.livescript["interpolated-string"].inside.interpolation.inside.rest = e.livescript;
//# sourceMappingURL=livescript.js.map
