import { l as t } from "../prismCore-AxbjJFmh.js";
t.bbcode = {
  tag: {
    pattern: /\[\/?[^\s=\]]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'"\]=]+))?(?:\s+[^\s=\]]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'"\]=]+))*\s*\]/,
    inside: {
      tag: {
        pattern: /^\[\/?[^\s=\]]+/,
        inside: {
          punctuation: /^\[\/?/
        }
      },
      "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'"\]=]+)/,
        inside: {
          punctuation: [
            /^=/,
            {
              pattern: /^(\s*)["']|["']$/,
              lookbehind: !0
            }
          ]
        }
      },
      punctuation: /\]/,
      "attr-name": /[^\s=\]]+/
    }
  }
};
t.shortcode = t.bbcode;
//# sourceMappingURL=bbcode.js.map
