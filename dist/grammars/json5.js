import { l as r } from "../prismCore-AxbjJFmh.js";
import "./json.js";
var e = /("|')(?:\\(?:\r\n?|\n|.)|(?!\1)[^\\\r\n])*\1/;
r.json5 = r.extend("json", {
  property: [
    {
      pattern: RegExp(e.source + "(?=\\s*:)"),
      greedy: !0
    },
    {
      pattern: /(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+(?=\s*:)/,
      alias: "unquoted"
    }
  ],
  string: {
    pattern: e,
    greedy: !0
  },
  number: /[+-]?\b(?:NaN|Infinity|0x[a-fA-F\d]+)\b|[+-]?(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[eE][+-]?\d+\b)?/
});
//# sourceMappingURL=json5.js.map
