import { l as t, P as n, i as r } from "../prismCore-AxbjJFmh.js";
import "./javascript.js";
import "./clike.js";
var e = t.ts = t.typescript = t.extend("js", {
  "class-name": {
    pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
    lookbehind: !0,
    greedy: !0
  },
  builtin: /\b(?:Array|Function|Promise|any|boolean|never|number|string|symbol|unknown)\b/
});
e.keyword.push(
  /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
  // keywords that have to be followed by an identifier
  /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
  // This is for `import type *, {}`
  /\btype\b(?=\s*(?:[\{*]|$))/
);
delete e.parameter;
delete e["literal-property"];
var s = n.util.clone(e);
delete s["class-name"];
e["class-name"].inside = s;
r("typescript", "function", {
  decorator: {
    pattern: /@[$\w\xA0-\uFFFF]+/,
    inside: {
      at: {
        pattern: /^@/,
        alias: "operator"
      },
      function: /^[\s\S]+/
    }
  },
  "generic-function": {
    // e.g. foo<T extends "bar" | "baz">( ...
    pattern: /#?(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
    greedy: !0,
    inside: {
      function: /^#?(?!\d)(?:(?!\s)[$\w\xA0-\uFFFF])+/,
      generic: {
        pattern: /<[\s\S]+/,
        // everything after the first <
        alias: "class-name",
        inside: s
      }
    }
  }
});
//# sourceMappingURL=typescript.js.map
