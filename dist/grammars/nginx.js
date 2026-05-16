import { l as t } from "../prismCore-AxbjJFmh.js";
var e = /\$(?:\w[a-z\d]*(?:_[^\x00-\x1F\s"'\\()$]*)?|\{[^}\s"'\\]+\})/i;
t.nginx = {
  comment: {
    pattern: /(^|[\s{};])#.*/,
    lookbehind: !0,
    greedy: !0
  },
  directive: {
    pattern: /(^|\s)\w(?:[^;{}"'\\\s]|\\.|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\s+(?:#.*(?!.)|(?![#\s])))*?(?=\s*[;{])/,
    lookbehind: !0,
    greedy: !0,
    inside: {
      string: {
        pattern: /((?:^|[^\\])(?:\\\\)*)(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/,
        lookbehind: !0,
        greedy: !0,
        inside: {
          escape: {
            pattern: /\\["'\\nrt]/,
            alias: "entity"
          },
          variable: e
        }
      },
      comment: {
        pattern: /(\s)#.*/,
        lookbehind: !0,
        greedy: !0
      },
      keyword: {
        pattern: /^\S+/,
        greedy: !0
      },
      // other patterns
      boolean: {
        pattern: /(\s)(?:off|on)(?!\S)/,
        lookbehind: !0
      },
      number: {
        pattern: /(\s)\d+[a-z]*(?!\S)/i,
        lookbehind: !0
      },
      variable: e
    }
  },
  punctuation: /[{};]/
};
//# sourceMappingURL=nginx.js.map
