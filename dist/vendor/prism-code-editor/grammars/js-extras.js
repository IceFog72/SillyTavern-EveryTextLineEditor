import { l as o, i as t } from "../prismCore-AxbjJFmh.js";
import "./javascript.js";
import "./clike.js";
var a = o.js, r = (s) => RegExp(
  s.source.replace(/<ID>/g, "(?!\\d)(?:(?!\\s)[$$\\w\\xA0-\\uFFFF])+")
);
t("js", "function-variable", {
  "method-variable": {
    pattern: RegExp("(\\.\\s*)" + a["function-variable"].pattern.source),
    lookbehind: !0,
    alias: ["function-variable", "method", "function", "property-access"]
  }
});
t("js", "function", {
  method: {
    pattern: RegExp("(\\.\\s*)" + a.function.source),
    lookbehind: !0,
    alias: ["function", "property-access"]
  }
});
t("js", "constant", {
  "known-class-name": [
    {
      // standard built-ins
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
      pattern: /\b(?:(?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)?Array|ArrayBuffer|BigInt|Boolean|DataView|Date|Error|Function|Intl|JSON|(?:Weak)?(?:Map|Set)|Math|Number|Object|Promise|Proxy|Reflect|RegExp|String|Symbol|WebAssembly)\b/,
      alias: "class-name"
    },
    {
      // errors
      pattern: /\b(?:[A-Z]\w*)Error\b/,
      alias: "class-name"
    }
  ]
});
t("js", "keyword", {
  imports: {
    // https://tc39.es/ecma262/#sec-imports
    pattern: r(/(\bimport\b\s*)(?:<ID>(?:\s*,\s*(?:\*\s*as\s+<ID>|\{[^{}]*\}))?|\*\s*as\s+<ID>|\{[^{}]*\})(?=\s*\bfrom\b)/),
    lookbehind: !0,
    inside: a
  },
  exports: {
    // https://tc39.es/ecma262/#sec-exports
    pattern: r(/(\bexport\b\s*)(?:\*(?:\s*as\s+<ID>)?(?=\s*\bfrom\b)|\{[^{}]*\})/),
    lookbehind: !0,
    inside: a
  }
});
t("js", "punctuation", {
  "property-access": {
    pattern: r(/(\.\s*)#?<ID>/),
    lookbehind: !0
  },
  "maybe-class-name": {
    pattern: /(^|[^$\w\xA0-\uFFFF]|\s)[A-Z][$\w\xA1-\uFFFF]+/,
    lookbehind: !0
  },
  dom: {
    // this contains only a few commonly used DOM variables
    pattern: /\b(?:document|(?:local|session)Storage|location|navigator|performance|window)\b/,
    alias: "variable"
  },
  console: {
    pattern: /\bconsole(?=\s*\.)/,
    alias: "class-name"
  }
});
["function", "function-variable", "method", "method-variable", "property-access"].forEach((s) => {
  var e = a[s];
  e instanceof RegExp && (e = a[s] = {
    pattern: e
  }), (e.inside || (e.inside = {}))["maybe-class-name"] = /^[A-Z][\s\S]*/;
});
//# sourceMappingURL=js-extras.js.map
