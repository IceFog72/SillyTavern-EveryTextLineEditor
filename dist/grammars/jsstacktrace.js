import { l as n } from "../prismCore-AxbjJFmh.js";
n.jsstacktrace = {
  "error-message": {
    pattern: /^\S.*/m,
    alias: "string"
  },
  "stack-frame": {
    pattern: /(^[ \t]+)at[ \t].*/m,
    lookbehind: !0,
    inside: {
      "not-my-code": {
        pattern: /^at[ \t]+(?!\s)(?:node\.js|<unknown>|.*(?:node_modules|\(<anonymous>\)|\(<unknown>|<anonymous>$|\(internal\/|\(node\.js)).*/m,
        alias: "comment"
      },
      filename: {
        pattern: /(\bat\s+(?!\s)|\()(?:[a-zA-Z]:)?[^():]+(?=:)/,
        lookbehind: !0,
        alias: "url"
      },
      function: {
        pattern: /(\bat\s+(?:new\s+)?)(?![\d>.])(?:(?!\s)[.$\w\xA0-\uFFFF<>])+/,
        lookbehind: !0,
        inside: {
          punctuation: /\./
        }
      },
      punctuation: /[()]/,
      keyword: /\b(?:at|new)\b/,
      alias: {
        pattern: /\[(?:as\s+)?(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+\]/,
        alias: "variable"
      },
      "line-number": {
        pattern: /:\d+(?::\d+)?\b/,
        alias: "number",
        inside: {
          punctuation: /:/
        }
      }
    }
  }
};
//# sourceMappingURL=jsstacktrace.js.map
