import { l as e, i as a } from "../prismCore-AxbjJFmh.js";
import "./php.js";
import "./javadoclike.js";
import "./markup-templating.js";
import "./markup.js";
var r = /(?:\b[a-zA-Z]\w*|[|\\[\]])+/.source;
e.phpdoc = e.extend("javadoclike", {
  parameter: {
    pattern: RegExp("(@(?:global|param|property(?:-read|-write)?|var)\\s+(?:" + r + "\\s+)?)\\$\\w+"),
    lookbehind: !0
  }
});
a("phpdoc", "keyword", {
  "class-name": [
    {
      pattern: RegExp("(@(?:global|package|param|property(?:-read|-write)?|return|subpackage|throws|var)\\s+)" + r),
      lookbehind: !0,
      inside: {
        keyword: /\b(?:array|bool|boolean|callback|double|false|float|int|integer|mixed|null|object|resource|self|string|true|void)\b/,
        punctuation: /[|\\[\]()]/
      }
    }
  ]
});
e.javadoclike.addSupport("php", e.phpdoc);
//# sourceMappingURL=phpdoc.js.map
