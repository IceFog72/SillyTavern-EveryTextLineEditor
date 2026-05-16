import { l as e, i as t } from "../prismCore-AxbjJFmh.js";
import "./clike.js";
var s = e.js = e.javascript = e.extend("clike", {
  "class-name": [
    {
      pattern: /(\b(?:class|extends|implements|instanceof|interface|new)\s+)(?!\d)(?:(?!\s)[$\w.\\\xA0-\uFFFF])+/,
      lookbehind: !0,
      inside: {
        punctuation: /[.\\]/
      }
    },
    {
      pattern: /(^|[^$\w\xA0-\uFFFF]|\s)(?![\da-z])(?:(?!\s)[$\w\xA0-\uFFFF])+(?=\.(?:constructor|prototype)\b)/,
      lookbehind: !0
    }
  ],
  keyword: [
    {
      pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|export|from(?=\s*(?:['"]|$))|import)\b/,
      lookbehind: !0,
      alias: "module"
    },
    {
      pattern: /(^|[^.]|\.\.\.\s*)\b(?:await|break|case|catch|continue|default|do|else|finally|for|if|return|switch|throw|try|while|yield)\b/,
      lookbehind: !0,
      alias: "control-flow"
    },
    {
      pattern: /(^|[^.]|\.\.\.\s*)\b(?:async(?=\s*(?:[($\w\xA0-\uFFFF]|$))|class|const|debugger|delete|enum|extends|function|(?:get|set)(?=\s*(?:[#[$\w\xA0-\uFFFF]|$))|implements|in|instanceof|interface|let|new|null|of|package|private|protected|public|static|super|this|typeof|undefined|var|void|with)\b/,
      lookbehind: !0
    }
  ],
  // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
  function: /#?(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  number: {
    pattern: /(^|[^\w$])(?:NaN|Infinity|0[bB][01]+(?:_[01]+)*n?|0[oO][0-7]+(?:_[0-7]+)*n?|0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?|\d+(?:_\d+)*n|(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?)(?![\w$])/,
    lookbehind: !0
  },
  operator: /--|\+\+|\*\*=?|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\?\?=?|\?\.?|[~:]/
});
t("js", "keyword", {
  regex: {
    pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}|(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7})(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
    lookbehind: !0,
    greedy: !0,
    inside: {
      "regex-flags": /\w+$/,
      "regex-delimiter": /^\/|\/$/,
      "regex-source": {
        pattern: /[\s\S]+/,
        alias: "language-regex",
        inside: "regex"
      }
    }
  },
  // This must be declared before keyword because we use "function" inside the look-forward
  "function-variable": {
    pattern: /#?(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+)\s*=>))/,
    alias: "function"
  },
  parameter: [
    /(function(?:\s+(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
    /(^|[^$\w\xA0-\uFFFF]|\s)(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+(?=\s*=>)/,
    /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
    /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/
  ].map((n) => ({
    pattern: n,
    lookbehind: !0,
    inside: s
  })),
  constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
});
t("js", "string", {
  hashbang: {
    pattern: /^#!.*/,
    greedy: !0,
    alias: "comment"
  },
  "template-string": {
    pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})*\}|(?!\$\{)[^\\`])*`/g,
    greedy: !0,
    inside: {
      "template-punctuation": {
        pattern: /^`|`$/,
        alias: "string"
      },
      interpolation: {
        pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})*\}/,
        lookbehind: !0,
        inside: {
          "interpolation-punctuation": {
            pattern: /^\$\{|\}$/,
            alias: "punctuation"
          },
          rest: s
        }
      },
      string: /[\s\S]+/
    }
  },
  "string-property": {
    pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
    lookbehind: !0,
    greedy: !0,
    alias: "property"
  }
});
t("javascript", "operator", {
  "literal-property": {
    pattern: /((?:^|[,{])[ \t]*)(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+(?=\s*:)/m,
    lookbehind: !0,
    alias: "property"
  },
  spread: {
    pattern: /\.{3}/,
    alias: "operator"
  },
  arrow: {
    pattern: /=>/,
    alias: "operator"
  }
});
//# sourceMappingURL=javascript.js.map
