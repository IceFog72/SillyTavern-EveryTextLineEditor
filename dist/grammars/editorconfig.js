import { l as t } from "../prismCore-AxbjJFmh.js";
t.editorconfig = {
  // https://editorconfig-specification.readthedocs.io
  comment: /[;#].*/,
  section: {
    pattern: /(^[ \t]*)\[.+\]/m,
    lookbehind: !0,
    alias: "selector",
    inside: {
      regex: /\\\\[\[\]{},!?.*]/,
      // Escape special characters with '\\'
      operator: /[!?]|\.\.|\*{1,2}/,
      punctuation: /[\[\]{},]/
    }
  },
  key: {
    pattern: /(^[ \t]*)[^\s=]+(?=[ \t]*=)/m,
    lookbehind: !0,
    alias: "attr-name"
  },
  value: {
    pattern: /=.*/,
    alias: "attr-value",
    inside: {
      punctuation: /^=/
    }
  }
};
//# sourceMappingURL=editorconfig.js.map
