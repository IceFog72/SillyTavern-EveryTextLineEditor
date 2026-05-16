import { l as t, i as e } from "../prismCore-AxbjJFmh.js";
import "./clike.js";
var n = {
  pattern: /[\s\S]+/
}, r = {
  pattern: /((?:^|[^\\$])(?:\\{2})*)\$(?:\w+|\{[^{}]*\})/,
  lookbehind: !0,
  inside: {
    "interpolation-punctuation": {
      pattern: /^\$\{?|\}$/,
      alias: "punctuation"
    },
    expression: n
  }
};
n.inside = t.gradle = t.extend("clike", {
  string: {
    pattern: /'''(?:[^\\]|\\[\s\S])*?'''|'(?:\\.|[^\\'\r\n])*'/,
    greedy: !0
  },
  keyword: /\b(?:apply|def|dependencies|else|if|implementation|import|plugin|plugins|project|repositories|repository|sourceSets|tasks|val)\b/,
  number: /\b(?:0b[01_]+|0x[\da-f_]+(?:\.[\da-f_p\-]+)?|[\d_]+(?:\.[\d_]+)?(?:e[+-]?\d+)?)[glidf]?\b/i,
  operator: {
    pattern: /(^|[^.])(?:~|==?~?|\?[.:]?|\*(?:[.=]|\*=?)?|\.[@&]|\.\.<|\.\.(?!\.)|-[-=>]?|\+[+=]?|!=?|<(?:<=?|=>?)?|>(?:>>?=?|=)?|&[&=]?|\|[|=]?|\/=?|\^=?|%=?)/,
    lookbehind: !0
  },
  punctuation: /\.+|[{}[\];(),:$]/
});
e("gradle", "string", {
  shebang: {
    pattern: /#!.+/,
    alias: "comment",
    greedy: !0
  },
  "interpolation-string": {
    pattern: /"""(?:[^\\]|\\[\s\S])*?"""|(["/])(?:\\.|(?!\1)[^\\\r\n])*\1|\$\/(?:[^/$]|\$(?:[/$]|(?![/$]))|\/(?!\$))*\/\$/,
    greedy: !0,
    inside: {
      interpolation: r,
      string: /[\s\S]+/
    }
  }
});
e("gradle", "punctuation", {
  "spock-block": /\b(?:and|cleanup|expect|given|setup|then|when|where):/
});
e("gradle", "function", {
  annotation: {
    pattern: /(^|[^.])@\w+/,
    lookbehind: !0,
    alias: "punctuation"
  }
});
//# sourceMappingURL=gradle.js.map
