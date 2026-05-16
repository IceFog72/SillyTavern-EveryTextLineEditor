import { l as t } from "../prismCore-AxbjJFmh.js";
var r = /\\(?:(?!\2)|\2(?:[^()\r\n]|\([^()]*\)))/.source, n = `"""(?:[^\\\\"]|"(?!""\\2)|<esc>)*"""|'''(?:[^\\\\']|'(?!''\\2)|<esc>)*'''|"(?:[^\\\\\\r\\n"]|"(?!\\2)|<esc>)*"|'(?:[^\\\\\\r\\n']|'(?!\\2)|<esc>)*'`, a = "(?:" + n.replace(/<esc>/g, r) + ")", e = {
  pattern: /[\s\S]+/
};
e.inside = t.cue = {
  comment: {
    pattern: /\/\/.*/,
    greedy: !0
  },
  "string-literal": {
    // eslint-disable-next-line regexp/strict
    pattern: RegExp(/(^|[^#"'\\])(#*)/.source + a + /(?!["'])\2/.source),
    lookbehind: !0,
    greedy: !0,
    inside: {
      // I'm using dirty hack here. We have to know the number hashes at the start of the string somehow,
      // but we can't look back. So instead, we will use a lookahead, go to the end of the string, and
      // capture the hashes at the end of the string.
      escape: {
        pattern: /(?=[\s\S]*["'](#*)$)\\\1(?:U[a-fA-F0-9]{1,8}|u[a-fA-F0-9]{1,4}|x[a-fA-F0-9]{1,2}|\d{2,3}|[^(])/,
        greedy: !0,
        alias: "string"
      },
      interpolation: {
        pattern: /(?=[\s\S]*["'](#*)$)\\\1\([^()]*\)/,
        greedy: !0,
        inside: {
          punctuation: /^\\#*\(|\)$/,
          expression: e
        }
      },
      string: /[\s\S]+/
    }
  },
  keyword: {
    pattern: /(^|[^\w$])(?:for|if|import|in|let|null|package)(?![\w$])/,
    lookbehind: !0
  },
  boolean: {
    pattern: /(^|[^\w$])(?:false|true)(?![\w$])/,
    lookbehind: !0
  },
  builtin: {
    pattern: /(^|[^\w$])(?:bool|bytes|float|float(?:32|64)|u?int(?:8|16|32|64|128)?|number|rune|string)(?![\w$])/,
    lookbehind: !0
  },
  attribute: {
    pattern: /@[\w$]+(?=\s*\()/,
    alias: "function"
  },
  function: {
    pattern: /(^|[^\w$])[a-z_$][\w$]*(?=\s*\()/i,
    lookbehind: !0
  },
  number: {
    pattern: /(^|[^\w$.])(?:0b[01]+(?:_[01]+)*|0o[0-7]+(?:_[0-7]+)*|0[xX][0-9A-Fa-f]+(?:_[0-9A-Fa-f]+)*|(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[eE][+-]?\d+(?:_\d+)*)?(?:[KMGTP]i?)?)(?![\w$])/,
    lookbehind: !0
  },
  operator: /\.{3}|_\|_|&&?|\|\|?|[=!]~|[<>=!]=?|[+\-*/?]/,
  punctuation: /[()[\]{},.:]/
};
//# sourceMappingURL=cue.js.map
