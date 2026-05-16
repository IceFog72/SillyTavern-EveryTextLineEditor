import { P as g, l as t } from "../prismCore-AxbjJFmh.js";
var p = (n) => RegExp(`(\\()(?:${n})(?=[\\s\\)])`), d = (n) => RegExp(`([\\s([])(?:${n})(?=[\\s)])`), e = /(?!\d)[-+*/~!@$%^=<>{}\w]+/.source, c = "&" + e, r = "(\\()", m = "(?=\\))", u = "(?=\\s)", o = /(?:[^()]|\((?:[^()]|\((?:[^()]|\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\))*\))*\))*/.source, a = {
  // Three or four semicolons are considered a heading.
  // See https://www.gnu.org/software/emacs/manual/html_node/elisp/Comment-Tips.html
  heading: {
    pattern: /;;;.*/,
    alias: ["comment", "title"]
  },
  comment: /;.*/,
  string: {
    pattern: /"(?:[^"\\]|\\.)*"/,
    greedy: !0,
    inside: {
      argument: /[-A-Z]+(?=[.,\s])/,
      symbol: RegExp("`" + e + "'")
    }
  },
  "quoted-symbol": {
    pattern: RegExp("#?'" + e),
    alias: ["variable", "symbol"]
  },
  "lisp-property": {
    pattern: RegExp(":" + e),
    alias: "property"
  },
  splice: {
    pattern: RegExp(",@?" + e),
    alias: ["symbol", "variable"]
  },
  keyword: [
    {
      pattern: RegExp(
        r + "(?:and|(?:cl-)?letf|cl-loop|cond|cons|error|if|(?:lexical-)?let\\*?|message|not|null|or|provide|require|setq|unless|use-package|when|while)" + u
      ),
      lookbehind: !0
    },
    {
      pattern: RegExp(
        r + "(?:append|by|collect|concat|do|finally|for|in|return)" + u
      ),
      lookbehind: !0
    }
  ],
  declare: {
    pattern: p(/declare/.source),
    lookbehind: !0,
    alias: "keyword"
  },
  interactive: {
    pattern: p(/interactive/.source),
    lookbehind: !0,
    alias: "keyword"
  },
  boolean: {
    pattern: d(/nil|t/.source),
    lookbehind: !0
  },
  number: {
    pattern: d(/[-+]?\d+(?:\.\d*)?/.source),
    lookbehind: !0
  },
  defvar: {
    pattern: RegExp(r + "def(?:const|custom|group|var)\\s+" + e),
    lookbehind: !0,
    inside: {
      keyword: /^def[a-z]+/,
      variable: RegExp(e)
    }
  },
  defun: {
    pattern: RegExp(`${r}(?:cl-)?(?:defmacro|defun\\*?)\\s+${e}\\s+\\(${o}\\)`),
    lookbehind: !0,
    greedy: !0,
    inside: {
      keyword: /^(?:cl-)?def\S+/,
      // See below, this property needs to be defined later so that it can
      // reference the language object.
      arguments: null,
      function: {
        pattern: RegExp("(^\\s)" + e),
        lookbehind: !0
      },
      punctuation: /[()]/
    }
  },
  lambda: {
    pattern: RegExp(r + "lambda\\s+\\(\\s*(?:&?" + e + "(?:\\s+&?" + e + ")*\\s*)?\\)"),
    lookbehind: !0,
    greedy: !0,
    inside: {
      keyword: /^lambda/,
      // See below, this property needs to be defined later so that it can
      // reference the language object.
      arguments: null,
      punctuation: /[()]/
    }
  },
  car: {
    pattern: RegExp(r + e),
    lookbehind: !0
  },
  punctuation: [
    // open paren, brackets, and close paren
    /(?:['`,]?\(|[)\[\]])/,
    // cons
    {
      pattern: /(\s)\.(?=\s)/,
      lookbehind: !0
    }
  ]
}, s = {
  "lisp-marker": RegExp(c),
  varform: {
    pattern: RegExp(`\\(${e}\\s+(?=\\S)${o}\\)`),
    inside: a
  },
  argument: {
    pattern: RegExp("(^|[\\s(])" + e),
    lookbehind: !0,
    alias: "variable"
  },
  rest: a
}, i = "\\S+(?:\\s+\\S+)*", l = {
  pattern: RegExp(r + o + m),
  lookbehind: !0,
  inside: {
    "rest-vars": {
      pattern: RegExp("&(?:body|rest)\\s+" + i),
      inside: s
    },
    "other-marker-vars": {
      pattern: RegExp("&(?:aux|optional)\\s+" + i),
      inside: s
    },
    keys: {
      pattern: RegExp("&key\\s+" + i + "(?:\\s+&allow-other-keys)?"),
      inside: s
    },
    argument: {
      pattern: RegExp(e),
      alias: "variable"
    },
    punctuation: /[()]/
  }
};
a.lambda.inside.arguments = l;
a.defun.inside.arguments = g.util.clone(l);
a.defun.inside.arguments.inside.sublist = l;
t["emacs-lisp"] = t.emacs = t.elisp = t.lisp = a;
//# sourceMappingURL=lisp.js.map
