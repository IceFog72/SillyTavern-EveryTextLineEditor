import { l as e, i as t } from "../prismCore-AxbjJFmh.js";
import "./javascript.js";
import "./clike.js";
var i = /#(?!\{).+/, n = {
  pattern: /#\{[^}]+\}/,
  alias: "variable"
}, r = e.coffee = e.coffeescript = e.extend("js", {
  comment: i,
  string: [
    // Strings are multiline
    {
      pattern: /'(?:\\[\s\S]|[^\\'])*'/,
      greedy: !0
    },
    {
      // Strings are multiline
      pattern: /"(?:\\[\s\S]|[^\\"])*"/,
      greedy: !0,
      inside: {
        interpolation: n
      }
    }
  ],
  keyword: /\b(?:and|break|by|catch|class|continue|debugger|delete|do|each|else|extend|extends|false|finally|for|if|in|instanceof|is|isnt|let|loop|namespace|new|no|not|null|of|off|on|or|own|return|super|switch|then|this|throw|true|try|typeof|undefined|unless|until|when|while|window|with|yes|yield)\b/,
  "class-member": {
    pattern: /@(?!\d)\w+/,
    alias: "variable"
  }
});
t("coffeescript", "comment", {
  "multiline-comment": {
    pattern: /###[\s\S]+?###/,
    alias: "comment"
  },
  // Block regexp can contain comments and interpolation
  "block-regex": {
    pattern: /\/{3}[\s\S]*?\/{3}/,
    alias: "regex",
    inside: {
      comment: i,
      interpolation: n
    }
  }
});
t("coffeescript", "string", {
  "inline-javascript": {
    pattern: /`(?:\\[\s\S]|[^\\`])*`/,
    inside: {
      delimiter: {
        pattern: /^`|`$/,
        alias: "punctuation"
      },
      script: {
        pattern: /[\s\S]+/,
        alias: "language-javascript",
        inside: "js"
      }
    }
  },
  // Block strings
  "multiline-string": [
    {
      pattern: /'''[\s\S]*?'''/,
      greedy: !0,
      alias: "string"
    },
    {
      pattern: /"""[\s\S]*?"""/,
      greedy: !0,
      alias: "string",
      inside: {
        interpolation: n
      }
    }
  ]
});
t("coffeescript", "keyword", {
  // Object property
  property: /(?!\d)\w+(?=\s*:(?!:))/
});
delete r["template-string"];
//# sourceMappingURL=coffeescript.js.map
