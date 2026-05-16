import { l as t, i as e } from "../prismCore-AxbjJFmh.js";
import "./clike.js";
import "./cpp.js";
import "./c.js";
t.chaiscript = t.extend("clike", {
  string: {
    pattern: /(^|[^\\])'(?:[^'\\]|\\[\s\S])*'/,
    lookbehind: !0,
    greedy: !0
  },
  "class-name": [
    {
      // e.g. class Rectangle { ... }
      pattern: /(\bclass\s+)\w+/,
      lookbehind: !0
    },
    {
      // e.g. attr Rectangle::height, def Rectangle::area() { ... }
      pattern: /(\b(?:attr|def)\s+)\w+(?=\s*::)/,
      lookbehind: !0
    }
  ],
  keyword: /\b(?:attr|auto|break|case|catch|class|continue|def|default|else|finally|for|fun|global|if|return|switch|this|try|var|while)\b/,
  number: [
    t.cpp.number,
    /\b(?:Infinity|NaN)\b/
  ],
  operator: />>=?|<<=?|\|\||&&|:[:=]?|--|\+\+|[=!<>+\-*/%|&^]=?|[?~]|`[^`\r\n]{1,4}`/
});
e("chaiscript", "operator", {
  "parameter-type": {
    // e.g. def foo(int x, Vector y) {...}
    pattern: /([,(]\s*)\w+(?=\s+\w)/,
    lookbehind: !0,
    alias: "class-name"
  }
});
e("chaiscript", "string", {
  "string-interpolation": {
    pattern: /(^|[^\\])"(?:[^"$\\]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})*"/,
    lookbehind: !0,
    greedy: !0,
    inside: {
      interpolation: {
        pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/,
        lookbehind: !0,
        inside: {
          "interpolation-expression": {
            pattern: /(..)[\s\S]+(?=.)/,
            lookbehind: !0,
            inside: t.chaiscript
          },
          "interpolation-punctuation": {
            pattern: /.+/,
            alias: "punctuation"
          }
        }
      },
      string: /[\s\S]+/
    }
  }
});
//# sourceMappingURL=chaiscript.js.map
