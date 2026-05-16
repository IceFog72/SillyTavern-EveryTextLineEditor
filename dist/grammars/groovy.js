import { l as e, i as t } from "../prismCore-AxbjJFmh.js";
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
n.inside = e.groovy = e.extend("clike", {
  string: {
    // https://groovy-lang.org/syntax.html#_dollar_slashy_string
    pattern: /'''(?:[^\\]|\\[\s\S])*?'''|'(?:\\.|[^\\'\r\n])*'/,
    greedy: !0
  },
  keyword: /\b(?:abstract|as|assert|boolean|break|byte|case|catch|char|class|const|continue|def|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|in|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|trait|transient|try|void|volatile|while)\b/,
  number: /\b(?:0b[01_]+|0x[\da-f_]+(?:\.[\da-f_p\-]+)?|[\d_]+(?:\.[\d_]+)?(?:e[+-]?\d+)?)[glidf]?\b/i,
  operator: {
    pattern: /(^|[^.])(?:~|==?~?|\?[.:]?|\*(?:[.=]|\*=?)?|\.[@&]|\.\.<|\.\.(?!\.)|-[-=>]?|\+[+=]?|!=?|<(?:<=?|=>?)?|>(?:>>?=?|=)?|&[&=]?|\|[|=]?|\/=?|\^=?|%=?)/,
    lookbehind: !0
  },
  punctuation: /\.+|[{}[\];(),:$]/
});
t("groovy", "string", {
  shebang: {
    pattern: /#!.+/,
    alias: "comment",
    greedy: !0
  },
  "interpolation-string": {
    // TODO: Slash strings (e.g. /foo/) can contain line breaks but this will cause a lot of trouble with
    // simple division (see JS regex), so find a fix maybe?
    pattern: /"""(?:[^\\]|\\[\s\S])*?"""|(["/])(?:\\.|(?!\1)[^\\\r\n])*\1|\$\/(?:[^/$]|\$(?:[/$]|(?![/$]))|\/(?!\$))*\/\$/,
    greedy: !0,
    inside: {
      interpolation: r,
      string: /[\s\S]+/
    }
  }
});
t("groovy", "punctuation", {
  "spock-block": /\b(?:and|cleanup|expect|given|setup|then|when|where):/
});
t("groovy", "function", {
  annotation: {
    pattern: /(^|[^.])@\w+/,
    lookbehind: !0,
    alias: "punctuation"
  }
});
//# sourceMappingURL=groovy.js.map
