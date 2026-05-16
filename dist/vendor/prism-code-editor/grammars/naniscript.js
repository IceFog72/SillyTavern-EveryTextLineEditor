import { l as p, P as m } from "../prismCore-AxbjJFmh.js";
var o = /\{[^\r\n\[\]{}]*\}/, l = {
  "quoted-string": {
    pattern: /"(?:[^"\\]|\\.)*"/,
    alias: "operator"
  },
  "command-param-id": {
    pattern: /(\s)\w+:/,
    lookbehind: !0,
    alias: "property"
  },
  "command-param-value": [
    {
      pattern: o,
      alias: "selector"
    },
    {
      pattern: /([\t ])\S+/,
      lookbehind: !0,
      greedy: !0,
      alias: "operator"
    },
    {
      pattern: /\S(?:.*\S)?/,
      alias: "operator"
    }
  ]
};
p.nani = p.naniscript = {
  // ; ...
  comment: {
    pattern: /^([\t ]*);.*/m,
    lookbehind: !0
  },
  // > ...
  // Define is a control line starting with '>' followed by a word, a space and a text.
  define: {
    pattern: /^>.+/m,
    alias: "tag",
    inside: {
      value: {
        pattern: /(^>\w+[\t ]+)(?!\s)[^{}\r\n]+/,
        lookbehind: !0,
        alias: "operator"
      },
      key: {
        pattern: /(^>)\w+/,
        lookbehind: !0
      }
    }
  },
  // # ...
  label: {
    pattern: /^([\t ]*)#[\t ]*\w+[\t ]*$/m,
    lookbehind: !0,
    alias: "regex"
  },
  command: {
    pattern: /^([\t ]*)@\w+(?=[\t ]|$).*/m,
    lookbehind: !0,
    alias: "function",
    inside: {
      "command-name": /^@\w+/,
      expression: {
        pattern: o,
        greedy: !0,
        alias: "selector"
      },
      "command-params": {
        pattern: /\s*\S[\s\S]*/,
        inside: l
      }
    }
  },
  // Generic is any line that doesn't start with operators: ;>#@
  "generic-text": {
    pattern: /(^[ \t]*)[^#@>;\s].*/m,
    lookbehind: !0,
    alias: "punctuation",
    inside: {
      // \{ ... \} ... \[ ... \] ... \"
      "escaped-char": /\\[{}\[\]"]/,
      expression: {
        pattern: o,
        greedy: !0,
        alias: "selector"
      },
      "inline-command": {
        pattern: /\[[\t ]*\w[^\r\n\[\]]*\]/,
        greedy: !0,
        alias: "function",
        inside: {
          "command-params": {
            pattern: /(^\[[\t ]*\w+\b)[\s\S]+(?=\]$)/,
            lookbehind: !0,
            inside: l
          },
          "command-param-name": {
            pattern: /^(\[[\t ]*)\w+/,
            lookbehind: !0,
            alias: "name"
          },
          "start-stop-char": /[\[\]]/
        }
      }
    }
  }
};
m.hooks.add("after-tokenize", (e) => {
  if (e.language.slice(0, 4) == "nani")
    for (var n = e.tokens, r = 0, i = n.length; r < i; ) {
      var t = n[r++];
      if (t.type == "generic-text") {
        var a = s(t);
        d(a) && (t.type = "bad-line", t.content = a);
      }
    }
});
var d = (e) => {
  for (var n = "[]{}", r = [], i = 0, t = e.length; i < t; ) {
    var a = n.indexOf(e[i++]);
    if (a + 1)
      if (a % 2) {
        if (r.pop() != a)
          return !0;
      } else
        r.push(a + 1);
  }
  return r.length;
}, s = (e) => typeof e == "string" ? e : Array.isArray(e) ? e.map(s).join("") : s(e.content);
//# sourceMappingURL=naniscript.js.map
