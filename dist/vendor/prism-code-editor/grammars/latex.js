import { l as a } from "../prismCore-AxbjJFmh.js";
var t = /\\(?:[^a-z()[\]]|[a-z*]+)/i, e = {
  "equation-command": {
    pattern: t,
    alias: "regex"
  }
};
a.context = a.tex = a.latex = {
  comment: /%.*/,
  // the verbatim environment prints whitespace to the document
  cdata: {
    pattern: /(\\begin\{((?:lstlisting|verbatim)\*?)\})[\s\S]*?(?=\\end\{\2\})/,
    lookbehind: !0
  },
  /*
   * equations can be between $$ $$ or $ $ or \( \) or \[ \]
   * (all are multiline)
   */
  equation: [
    {
      pattern: /\$\$(?:\\[\s\S]|[^\\$])+\$\$|\$(?:\\[\s\S]|[^\\$])+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/,
      inside: e,
      alias: "string"
    },
    {
      pattern: /(\\begin\{((?:align|eqnarray|equation|gather|math|multline)\*?)\})[\s\S]*?(?=\\end\{\2\})/,
      lookbehind: !0,
      inside: e,
      alias: "string"
    }
  ],
  /*
   * arguments which are keywords or references are highlighted
   * as keywords
   */
  keyword: {
    pattern: /(\\(?:begin|cite|documentclass|end|label|ref|usepackage)(?:\[[^\]]+\])?\{)[^}]+(?=\})/,
    lookbehind: !0
  },
  url: {
    pattern: /(\\url\{)[^}]+(?=\})/,
    lookbehind: !0
  },
  /*
   * section or chapter headlines are highlighted as bold so that
   * they stand out more
   */
  headline: {
    pattern: /(\\(?:chapter|frametitle|paragraph|part|section|subparagraph|subsection|subsubparagraph|subsubsection|subsubsubparagraph)\*?(?:\[[^\]]+\])?\{)[^}]+(?=\})/,
    lookbehind: !0,
    alias: "class-name"
  },
  function: {
    pattern: t,
    alias: "selector"
  },
  punctuation: /[[\]{}&]/
};
//# sourceMappingURL=latex.js.map
