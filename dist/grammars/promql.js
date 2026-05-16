import { l as a } from "../prismCore-AxbjJFmh.js";
var e = [
  "sum",
  "min",
  "max",
  "avg",
  "group",
  "stddev",
  "stdvar",
  "count",
  "count_values",
  "bottomk",
  "topk",
  "quantile"
], t = [
  "on",
  "ignoring",
  "group_right",
  "group_left",
  "by",
  "without"
], n = ["offset"], r = e.concat(t, n);
a.promql = {
  comment: {
    pattern: /(^[ \t]*)#.*/m,
    lookbehind: !0
  },
  "vector-match": {
    // Match the comma-separated label lists inside vector matching:
    pattern: new RegExp("((?:" + t.join("|") + ")\\s*)\\([^)]*\\)"),
    lookbehind: !0,
    inside: {
      "label-key": {
        pattern: /\b[^,]+\b/,
        alias: "attr-name"
      },
      punctuation: /[(),]/
    }
  },
  "context-labels": {
    pattern: /\{[^{}]*\}/,
    inside: {
      "label-key": {
        pattern: /\b[a-z_]\w*(?=\s*(?:=|![=~]))/,
        alias: "attr-name"
      },
      "label-value": {
        pattern: /(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/,
        greedy: !0,
        alias: "attr-value"
      },
      punctuation: /\{|\}|=~?|![=~]|,/
    }
  },
  "context-range": [
    {
      pattern: /\[[\w\s:]+\]/,
      // [1m]
      inside: {
        punctuation: /\[|\]|:/,
        "range-duration": {
          pattern: /\b(?:\d+(?:[smhdwy]|ms))+\b/i,
          alias: "number"
        }
      }
    },
    {
      pattern: /(\boffset\s+)\w+/,
      // offset 1m
      lookbehind: !0,
      inside: {
        "range-duration": {
          pattern: /\b(?:\d+(?:[smhdwy]|ms))+\b/i,
          alias: "number"
        }
      }
    }
  ],
  keyword: new RegExp("\\b(?:" + r.join("|") + ")\\b", "i"),
  function: /\b[a-z_]\w*(?=\s*\()/i,
  number: /[-+]?(?:(?:\b\d+(?:\.\d+)?|\B\.\d+)(?:e[-+]?\d+)?\b|\b(?:0x[0-9a-f]+|nan|inf)\b)/i,
  operator: /[\^*/%+-]|==|!=|<=|<|>=|>|\b(?:and|or|unless)\b/i,
  punctuation: /[{};()`,.[\]]/
};
//# sourceMappingURL=promql.js.map
