import { l as r } from "../prismCore-AxbjJFmh.js";
var e = /(?:\((?:[^()\\]|\\[\s\S])*\)|\{(?:[^{}\\]|\\[\s\S])*\}|\[(?:[^[\]\\]|\\[\s\S])*\]|<(?:[^<>\\]|\\[\s\S])*>)/.source;
r.perl = {
  comment: [
    {
      // POD
      pattern: /(^\s*)=\w[\s\S]*?=cut.*/m,
      lookbehind: !0,
      greedy: !0
    },
    {
      pattern: /(^|[^\\$])#.*/,
      lookbehind: !0,
      greedy: !0
    }
  ],
  // TODO Could be nice to handle Heredoc too.
  string: {
    pattern: RegExp(
      `\\b(?:q|qq|qw|qx)(?![a-zA-Z0-9])\\s*(?:([^a-zA-Z0-9\\s{(\\[<])(?:(?!\\1)[^\\\\]|\\\\[\\s\\S])*\\1|([a-zA-Z0-9])(?:(?!\\2)[^\\\\]|\\\\[\\s\\S])*\\2|${e})|("|\`)(?:(?!\\3)[^\\\\]|\\\\[\\s\\S])*\\3|'(?:[^'\\\\\\r\\n]|\\\\.)*'`,
      "g"
    ),
    greedy: !0
  },
  regex: [
    {
      pattern: RegExp(
        `\\b(?:m|qr)(?![a-zA-Z0-9])\\s*(?:([^a-zA-Z0-9\\s{(\\[<])(?:(?!\\1)[^\\\\]|\\\\[\\s\\S])*\\1|([a-zA-Z0-9])(?:(?!\\2)[^\\\\]|\\\\[\\s\\S])*\\2|${e})[msixpodualngc]*`,
        "g"
      ),
      greedy: !0
    },
    // The lookbehinds prevent -s from breaking
    {
      pattern: RegExp(
        `(^|[^-])\\b(?:s|tr|y)(?![a-zA-Z0-9])\\s*(?:([^a-zA-Z0-9\\s{(\\[<])(?:(?!\\2)[^\\\\]|\\\\[\\s\\S])*\\2(?:(?!\\2)[^\\\\]|\\\\[\\s\\S])*\\2|([a-zA-Z0-9])(?:(?!\\3)[^\\\\]|\\\\[\\s\\S])*\\3(?:(?!\\3)[^\\\\]|\\\\[\\s\\S])*\\3|${e}\\s*${e})[msixpodualngcer]*`,
        "g"
      ),
      lookbehind: !0,
      greedy: !0
    },
    // /.../
    // The look-ahead tries to prevent two divisions on
    // the same line from being highlighted as regex.
    // This does not support multi-line regex.
    {
      pattern: /\/(?:[^\/\\\r\n]|\\.)*\/[msixpodualngc]*(?=\s*(?:$|[\r\n,.;})&|\-+*~<>!?^]|(?:and|cmp|eq|ge|gt|le|lt|ne|not|or|x|xor)\b))/,
      greedy: !0
    }
  ],
  // FIXME Not sure about the handling of ::, ', and #
  variable: /[&*$@%](?:\{\^[A-Z]+\}|\^[A-Z_]|#?(?=\{)|#?(?:(?:::)*'?(?!\d)[\w$]+(?![\w$]))+(?:::)*|\d+)|(?!%=)[$@%][!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]/,
  filehandle: {
    // <>, <FOO>, _
    pattern: /<(?![<=])\S*?>|\b_\b/,
    alias: "symbol"
  },
  "v-string": {
    // v1.2, 1.2.3
    pattern: /v\d+(?:\.\d+)*|\d+(?:\.\d+){2,}/,
    alias: "string"
  },
  function: {
    pattern: /(\bsub[ \t]+)\w+/,
    lookbehind: !0
  },
  keyword: /\b(?:any|break|continue|default|delete|die|do|else|elsif|eval|for|foreach|given|goto|if|last|local|my|next|our|package|print|redo|require|return|say|state|sub|switch|undef|unless|until|use|when|while)\b/,
  number: /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)\b/,
  operator: /-[rwxoRWXOezsfdlpSbctugkTBMAC]\b|\+[+=]?|-[-=>]?|\*\*?=?|\/\/?=?|=[=~>]?|~[~=]?|\|\|?=?|&&?=?|<(?:=>?|<=?)?|>>?=?|![~=]?|[%^]=?|\.(?:=|\.\.?)?|[\\?]|\bx(?:=|\b)|\b(?:and|cmp|eq|ge|gt|le|lt|ne|not|or|xor)\b/,
  punctuation: /[{}[\];(),:]/
};
//# sourceMappingURL=perl.js.map
