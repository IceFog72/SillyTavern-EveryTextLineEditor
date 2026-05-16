import { l as e } from "../prismCore-AxbjJFmh.js";
e.gedcom = {
  "line-value": {
    // Preceded by level, optional pointer, and tag
    pattern: /(^[\t ]*\d+ +(?:@\w[\w!"$%&'()*+,\-./:;<=>?[\\\]^`{|}~\x80-\xfe #]*@ +)?\w+ ).+/m,
    lookbehind: !0,
    inside: {
      pointer: {
        pattern: /^@\w[\w!"$%&'()*+,\-./:;<=>?[\\\]^`{|}~\x80-\xfe #]*@$/,
        alias: "variable"
      }
    }
  },
  record: {
    // Preceded by level and optional pointer
    pattern: /(^[\t ]*\d+ +(?:@\w[\w!"$%&'()*+,\-./:;<=>?[\\\]^`{|}~\x80-\xfe #]*@ +)?)\w+/m,
    lookbehind: !0,
    alias: "tag"
  },
  level: {
    pattern: /(^[\t ]*)\d+/m,
    lookbehind: !0,
    alias: "number"
  },
  pointer: {
    pattern: /@\w[\w!"$%&'()*+,\-./:;<=>?[\\\]^`{|}~\x80-\xfe #]*@/,
    alias: "variable"
  }
};
//# sourceMappingURL=gedcom.js.map
