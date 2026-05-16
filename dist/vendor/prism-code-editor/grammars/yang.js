import { l as e } from "../prismCore-AxbjJFmh.js";
e.yang = {
  // https://tools.ietf.org/html/rfc6020#page-34
  // http://www.yang-central.org/twiki/bin/view/Main/YangExamples
  comment: /\/\*[\s\S]*?\*\/|\/\/.*/,
  string: {
    pattern: /"(?:[^\\"]|\\.)*"|'[^']*'/,
    greedy: !0
  },
  keyword: {
    pattern: /(^|[{};\r\n][ \t]*)[a-z_][\w.-]*/i,
    lookbehind: !0
  },
  namespace: {
    pattern: /(\s)[a-z_][\w.-]*(?=:)/i,
    lookbehind: !0
  },
  boolean: /\b(?:false|true)\b/,
  operator: /\+/,
  punctuation: /[{};:]/
};
//# sourceMappingURL=yang.js.map
