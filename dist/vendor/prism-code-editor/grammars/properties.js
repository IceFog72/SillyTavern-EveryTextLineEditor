import { l as t } from "../prismCore-AxbjJFmh.js";
t.properties = {
  comment: /^[ \t]*[#!].*$/m,
  value: {
    pattern: /(^[ \t]*(?:\\(?:\r\n|[\s\S])|[^\\\s:=])+(?: *[=:] *(?! )| ))(?:\\(?:\r\n|[\s\S])|[^\\\r\n])+/m,
    lookbehind: !0,
    alias: "attr-value"
  },
  key: {
    pattern: /^[ \t]*(?:\\(?:\r\n|[\s\S])|[^\\\s:=])+(?= *[=:]| )/m,
    alias: "attr-name"
  },
  punctuation: /[=:]/
};
//# sourceMappingURL=properties.js.map
