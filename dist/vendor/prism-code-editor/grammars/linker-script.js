import { l as t } from "../prismCore-AxbjJFmh.js";
t["linker-script"] = {
  comment: {
    pattern: /(^|\s)\/\*[\s\S]*?(?:$|\*\/)/,
    lookbehind: !0,
    greedy: !0
  },
  identifier: {
    pattern: /"[^"\r\n]*"/,
    greedy: !0
  },
  "location-counter": {
    pattern: /\B\.\B/,
    alias: "important"
  },
  section: {
    pattern: /(^|[^\w*])\.\w+\b/,
    lookbehind: !0,
    alias: "keyword"
  },
  function: /\b[A-Z][A-Z_]*(?=\s*\()/,
  number: /\b(?:0[xX][a-fA-F0-9]+|\d+)[KM]?\b/,
  operator: />>=?|<<=?|->|\+\+|--|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?/,
  punctuation: /[(){},;]/
};
t.ld = t["linker-script"];
//# sourceMappingURL=linker-script.js.map
