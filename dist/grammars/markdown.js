import { l as u, i as f, P as p } from "../prismCore-AxbjJFmh.js";
import "./markup.js";
var $ = /(?:\\.|[^\\\n\r]|(?:\n|\r\n?)(?![\r\n]))/.source, o = (e) => RegExp(`((?:^|[^\\\\])(?:\\\\{2})*)(?:${e.source.replace(/<inner>/g, $)})`), c = /(?:\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\|\r\n`])+/.source, n = /\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|(?![\s\S]))/.source.replace(/__/g, c), b = /\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/.source, r = u.markdown = u.md = u.extend("markup", {});
f("markdown", "prolog", {
  "front-matter-block": {
    pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
    lookbehind: !0,
    greedy: !0,
    inside: {
      punctuation: /^---|---$/,
      "front-matter": {
        pattern: /\S+(?:\s+\S+)*/,
        alias: "language-yaml",
        inside: "yaml"
      }
    }
  },
  blockquote: {
    // > ...
    pattern: /^>(?:[\t ]*>)*/m,
    alias: "punctuation"
  },
  table: {
    pattern: RegExp("^" + n + b + "(?:" + n + ")*", "m"),
    inside: {
      "table-data-rows": {
        pattern: RegExp("^(" + n + b + ")(?:" + n + ")*$"),
        lookbehind: !0,
        inside: {
          "table-data": {
            pattern: RegExp(c),
            inside: r
          },
          punctuation: /\|/
        }
      },
      "table-line": {
        pattern: RegExp("^(" + n + ")" + b + "$"),
        lookbehind: !0,
        inside: {
          punctuation: /\||:?-{3,}:?/
        }
      },
      "table-header-row": {
        pattern: RegExp("^" + n + "$"),
        inside: {
          "table-header": {
            pattern: RegExp(c),
            alias: "important",
            inside: r
          },
          punctuation: /\|/
        }
      }
    }
  },
  code: [
    {
      // Prefixed by 4 spaces or 1 tab and preceded by an empty line
      pattern: /(^[ \t]*(?:\n|\r\n?))(?:    |\t).+(?:(?:\n|\r\n?)(?:    |\t).+)*/m,
      lookbehind: !0,
      alias: "keyword"
    },
    {
      // ```optional language
      // code block
      // ```
      pattern: /^```[\s\S]*?^```$/m,
      greedy: !0,
      inside: {
        punctuation: /^```/m,
        "code-language": /^.+/,
        "code-block": {
          pattern: /^(\n|\r\n?)[\s\S]+(?=(?:\n|\r\n?)$)/,
          lookbehind: !0
        }
      }
    }
  ],
  title: [
    {
      // title 1
      // =======
      // title 2
      // -------
      pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
      alias: "important",
      inside: {
        punctuation: /==+$|--+$/
      }
    },
    {
      // # title 1
      // ###### title 6
      pattern: /(^\s*)#.+/m,
      lookbehind: !0,
      alias: "important",
      inside: {
        punctuation: /^#+|#+$/
      }
    }
  ],
  hr: {
    // ***
    // ---
    // * * *
    // -----------
    pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
    lookbehind: !0,
    alias: "punctuation"
  },
  list: {
    // * item
    // + item
    // - item
    // 1. item
    pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
    lookbehind: !0,
    alias: "punctuation"
  },
  "url-reference": {
    // [id]: http://example.com "Optional title"
    // [id]: http://example.com 'Optional title'
    // [id]: http://example.com (Optional title)
    // [id]: <http://example.com> "Optional title"
    pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
    inside: {
      variable: {
        pattern: /^(!?\[)[^\]]+/,
        lookbehind: !0
      },
      string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
      punctuation: /^[\[\]!:]|[<>]/
    },
    alias: "url"
  },
  bold: {
    // **strong**
    // __strong__
    // allow one nested instance of italic text using the same delimiter
    pattern: o(/\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\b|\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/),
    lookbehind: !0,
    greedy: !0,
    inside: {
      content: {
        pattern: /(^..)[\s\S]+(?=..)/,
        lookbehind: !0,
        inside: {}
        // see below
      },
      punctuation: /../
    }
  },
  italic: {
    // *em*
    // _em_
    // allow one nested instance of bold text using the same delimiter
    pattern: o(/\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/),
    lookbehind: !0,
    greedy: !0,
    inside: {
      content: {
        pattern: /(?!^)[\s\S]+(?=.)/,
        inside: {}
        // see below
      },
      punctuation: /./
    }
  },
  strike: {
    // ~~strike through~~
    // ~strike~
    // eslint-disable-next-line regexp/strict
    pattern: o(/(~~?)(?:(?!~)<inner>)+\2/),
    lookbehind: !0,
    greedy: !0,
    inside: {
      punctuation: /^~~?|~~?$/,
      content: {
        pattern: /[\s\S]+/,
        inside: {}
        // see below
      }
    }
  },
  "code-snippet": {
    // `code`
    // ``code``
    pattern: /(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,
    lookbehind: !0,
    greedy: !0,
    alias: ["code", "keyword"]
  },
  url: {
    // [example](http://example.com "Optional title")
    // [example][id]
    // [example] [id]
    pattern: o(/!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)|[ \t]?\[(?:(?!\])<inner>)+\])/),
    lookbehind: !0,
    greedy: !0,
    inside: {
      operator: /^!/,
      content: {
        pattern: /(^\[)[^\]]+(?=\])/,
        lookbehind: !0,
        inside: {
          "markup-bracket": r["markup-bracket"]
        }
      },
      variable: {
        pattern: /(^\][ \t]?\[)[^\]]+(?=\]$)/,
        lookbehind: !0
      },
      url: {
        pattern: /(^\]\()[^\s)]+/,
        lookbehind: !0
      },
      string: {
        pattern: /(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/,
        lookbehind: !0
      },
      "markup-bracket": r["markup-bracket"]
    }
  }
});
["url", "bold", "italic", "strike"].forEach((e) => {
  ["url", "bold", "italic", "strike", "code-snippet"].forEach((t) => {
    e != t && (r[e].inside.content.inside[t] = r[t]);
  });
});
var h = (e) => {
  if (Array.isArray(e))
    for (var t = 0, g = e.length; t < g; t++) {
      var s = e[t], k = s.type;
      if (k)
        if (k != "code")
          h(s.content);
        else {
          var [, l, , a] = s.content;
          if (l && a && a.type && l.type) {
            var d = (/[a-z][\w-]*/i.exec(
              l.content.replace(/\b#/g, "sharp").replace(/\b\+\+/g, "pp")
            ) || [""])[0].toLowerCase(), _ = a.content, m = u[d];
            if (a.alias = "language-" + d, m) {
              var i = { code: _, language: d, grammar: m };
              p.hooks.run("before-tokenize", i), a.content = i.tokens = p.tokenize(i.code, i.grammar), p.hooks.run("after-tokenize", i);
            }
          }
        }
    }
};
p.hooks.add("after-tokenize", (e) => {
  (e.language == "markdown" || e.language == "md") && h(e.tokens);
});
//# sourceMappingURL=markdown.js.map
