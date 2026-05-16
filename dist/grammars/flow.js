import { l as t, i as a } from "../prismCore-AxbjJFmh.js";
import "./javascript.js";
import "./clike.js";
var e = t.flow = t.extend("js", {});
a("flow", "keyword", {
  type: [
    {
      pattern: /\b(?:[Bb]oolean|Function|[Nn]umber|[Ss]tring|[Ss]ymbol|any|mixed|null|void)\b/,
      alias: "class-name"
    }
  ]
});
e["function-variable"].pattern = /(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+(?=\s*=\s*(?:function\b|(?:\([^()]*\)(?:\s*:\s*\w+)?|(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+)\s*=>))/i;
delete e.parameter;
a("flow", "operator", {
  "flow-punctuation": {
    pattern: /\{\||\|\}/,
    alias: "punctuation"
  }
});
Array.isArray(e.keyword) || (e.keyword = [e.keyword]);
e.keyword.unshift(
  {
    pattern: /(^|[^$]\b)(?:Class|declare|opaque|type)\b(?!\$)/,
    lookbehind: !0
  },
  {
    pattern: /(^|[^$]\B)\$(?:Diff|Enum|Exact|Keys|ObjMap|PropertyType|Record|Shape|Subtype|Supertype|await)\b(?!\$)/,
    lookbehind: !0
  }
);
//# sourceMappingURL=flow.js.map
