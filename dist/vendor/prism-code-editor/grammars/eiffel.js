import { l as e } from "../prismCore-AxbjJFmh.js";
e.eiffel = {
  comment: /--.*/,
  string: [
    // Aligned-verbatim-strings
    {
      pattern: /"([^[]*)\[[\s\S]*?\]\1"/,
      greedy: !0
    },
    // Non-aligned-verbatim-strings
    {
      pattern: /"([^{]*)\{[\s\S]*?\}\1"/,
      greedy: !0
    },
    // Single-line string
    {
      pattern: /"(?:%(?:(?!\n)\s)*\n\s*%|%\S|[^%"\r\n])*"/,
      greedy: !0
    }
  ],
  // normal char | special char | char code
  char: /'(?:%.|[^%'\r\n])+'/,
  keyword: /\b(?:across|agent|alias|all|and|as|assign|attached|attribute|check|class|convert|create|Current|debug|deferred|detachable|do|else|elseif|end|ensure|expanded|export|external|feature|from|frozen|if|implies|inherit|inspect|invariant|like|local|loop|not|note|obsolete|old|once|or|Precursor|redefine|rename|require|rescue|Result|retry|select|separate|some|then|undefine|until|variant|Void|when|xor)\b/i,
  boolean: /\b(?:False|True)\b/i,
  // Convention: class-names are always all upper-case characters
  "class-name": /\b[A-Z][\dA-Z_]*\b/,
  number: [
    // hexa | octal | bin
    /\b0[xcb][\da-f](?:_*[\da-f])*\b/i,
    // Decimal
    /(?:\b\d(?:_*\d)*)?\.(?:(?:\d(?:_*\d)*)?e[+-]?)?\d(?:_*\d)*\b|\b\d(?:_*\d)*\b\.?/i
  ],
  punctuation: /:=|<<|>>|\(\||\|\)|->|\.(?=\w)|[{}[\];(),:?]/,
  operator: /\\\\|\|\.\.\||\.\.|\/[~\/=]?|[><]=?|[-+*^=~]/
};
//# sourceMappingURL=eiffel.js.map
