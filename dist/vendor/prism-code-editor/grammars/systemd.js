import { l as r } from "../prismCore-AxbjJFmh.js";
var t = {
  pattern: /^[;#].*/m,
  greedy: !0
}, e = /"(?:[^\r\n"\\]|\\(?:[^\r]|\r\n?))*"(?!\S)/.source;
r.systemd = {
  comment: t,
  section: {
    pattern: /^\[[^\n\r\[\]]*\](?=[ \t]*$)/m,
    greedy: !0,
    inside: {
      punctuation: /^\[|\]$/,
      "section-name": {
        pattern: /[\s\S]+/,
        alias: "selector"
      }
    }
  },
  key: {
    pattern: /^[^\s=]+(?=[ \t]*=)/m,
    greedy: !0,
    alias: "attr-name"
  },
  value: {
    // This pattern is quite complex because of two properties:
    //  1) Quotes (strings) must be preceded by a space. Since we can't use lookbehinds, we have to "resolve"
    //     the lookbehind. You will see this in the main loop where spaces are handled separately.
    //  2) Line continuations.
    //     After line continuations, empty lines and comments are ignored so we have to consume them.
    pattern: RegExp(
      `(=[ \\t]*(?!\\s))(?:${e}|(?=[^"\r
]))(?:[^\\s\\\\]|[ 	]+(?:(?![ 	"])|${e})|\\\\[\\r\\n]+(?:[#;].*[\\r\\n]+)*(?![#;]))*`,
      "g"
    ),
    lookbehind: !0,
    greedy: !0,
    alias: "attr-value",
    inside: {
      comment: t,
      quoted: {
        pattern: RegExp("(^|\\s)" + e, "g"),
        lookbehind: !0,
        greedy: !0
      },
      punctuation: /\\$/m,
      boolean: {
        pattern: /^(?:false|no|off|on|true|yes)$/,
        greedy: !0
      }
    }
  },
  punctuation: /=/
};
//# sourceMappingURL=systemd.js.map
