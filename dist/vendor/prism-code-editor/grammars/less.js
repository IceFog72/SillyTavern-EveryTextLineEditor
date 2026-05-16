import { l as s, i as e } from "../prismCore-AxbjJFmh.js";
import "./css.js";
s.less = s.extend("css", {
  comment: /\/\/.*|\/\*[\s\S]*?\*\//,
  atrule: {
    pattern: /@[\w-](?:\((?:[^(){}]|\([^(){}]*\))*\)|[^(){};\s]|\s+(?!\s))*?(?=\s*\{)/,
    inside: {
      punctuation: /[:()]/
    }
  },
  // selectors and mixins are considered the same
  selector: {
    pattern: /(?:@\{[\w-]+\}|[^{};\s@])(?:@\{[\w-]+\}|\((?:[^(){}]|\([^(){}]*\))*\)|[^(){};@\s]|\s+(?!\s))*?(?=\s*\{)/,
    inside: {
      // mixin parameters
      variable: /@+[\w-]+/
    }
  },
  property: /(?:@\{[\w-]+\}|[\w-])+(?:\+_?)?(?=\s*:)/,
  operator: /[+\-*\/]/
});
e("less", "property", {
  variable: [
    // Variable declaration (the colon must be consumed!)
    {
      pattern: /@[\w-]+\s*:/,
      inside: {
        punctuation: /:/
      }
    },
    // Variable usage
    /@@?[\w-]+/
  ],
  "mixin-usage": {
    pattern: /([{;]\s*)[.#](?!\d)[\w-].*?(?=[(;])/,
    lookbehind: !0,
    alias: "function"
  }
});
//# sourceMappingURL=less.js.map
