import { l as e, i as r } from "../prismCore-AxbjJFmh.js";
import "./clike.js";
e["firestore-security-rules"] = e.extend("clike", {
  comment: /\/\/.*/,
  keyword: /\b(?:allow|function|if|match|null|return|rules_version|service)\b/,
  operator: /&&|\|\||[<>!=]=?|[-+*/%]|\b(?:in|is)\b/
});
delete e["firestore-security-rules"]["class-name"];
r("firestore-security-rules", "keyword", {
  path: {
    pattern: /(^|[\s(),])(?:\/(?:[\w\xA0-\uFFFF]+|\{[\w\xA0-\uFFFF]+(?:=\*\*)?\}|\$\([\w\xA0-\uFFFF.]+\)))+/,
    lookbehind: !0,
    greedy: !0,
    inside: {
      variable: {
        pattern: /\{[\w\xA0-\uFFFF]+(?:=\*\*)?\}|\$\([\w\xA0-\uFFFF.]+\)/,
        inside: {
          operator: /=/,
          keyword: /\*\*/,
          punctuation: /[.$(){}]/
        }
      },
      punctuation: /\//
    }
  },
  method: {
    // to make the pattern shorter, the actual method names are omitted
    pattern: /(\ballow\s+)[a-z]+(?:\s*,\s*[a-z]+)*(?=\s*[:;])/,
    lookbehind: !0,
    alias: "builtin",
    inside: {
      punctuation: /,/
    }
  }
});
//# sourceMappingURL=firestore-security-rules.js.map
