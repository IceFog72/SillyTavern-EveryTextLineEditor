import { l as e } from "../prismCore-AxbjJFmh.js";
e.gcode = {
  comment: /;.*|\B\(.*?\)\B/,
  string: {
    pattern: /"(?:""|[^"])*"/,
    greedy: !0
  },
  keyword: /\b[GM]\d+(?:\.\d+)?\b/,
  property: /\b[A-Z]/,
  checksum: {
    pattern: /(\*)\d+/,
    lookbehind: !0,
    alias: "number"
  },
  // T0:0:0
  punctuation: /[:*]/
};
//# sourceMappingURL=gcode.js.map
