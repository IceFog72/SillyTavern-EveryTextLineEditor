import { l as e, i as a } from "../prismCore-AxbjJFmh.js";
import "./clike.js";
var s = [
  /\b(?:async|sync|yield)\*/,
  /\b(?:abstract|assert|async|await|break|case|catch|class|const|continue|covariant|default|deferred|do|dynamic|else|enum|export|extends|extension|external|factory|final|finally|for|get|hide|if|implements|import|in|interface|library|mixin|new|null|on|operator|part|rethrow|return|set|show|static|super|switch|sync|this|throw|try|typedef|var|void|while|with|yield)\b/
], r = /(^|[^\w.])(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source, t = {
  pattern: RegExp(r + /[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source),
  lookbehind: !0,
  inside: {
    namespace: {
      pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
      inside: {
        punctuation: /\./
      }
    }
  }
};
e.dart = e.extend("clike", {
  "class-name": [
    t,
    {
      // variables and parameters
      // this to support class names (or generic parameters) which do not contain a lower case letter (also works for methods)
      pattern: RegExp(r + /[A-Z]\w*(?=\s+\w+\s*[;,=()])/.source),
      lookbehind: !0,
      inside: t.inside
    }
  ],
  keyword: s,
  operator: /\bis!|\b(?:as|is)\b|\+\+|--|&&|\|\||<<=?|>>=?|~(?:\/=?)?|[+\-*\/%&^|=!<>]=?|\?/
});
a("dart", "string", {
  "string-literal": {
    pattern: /r?(?:("""|''')[\s\S]*?\1|(["'])(?:\\.|(?!\2)[^\\\r\n])*\2(?!\2))/,
    greedy: !0,
    inside: {
      interpolation: {
        pattern: /((?:^|[^\\])(?:\\{2})*)\$(?:\w+|\{(?:[^{}]|\{[^{}]*\})*\})/,
        lookbehind: !0,
        inside: {
          punctuation: /^\$\{?|\}$/,
          expression: {
            pattern: /[\s\S]+/,
            inside: e.dart
          }
        }
      },
      string: /[\s\S]+/
    }
  },
  string: void 0
});
a("dart", "class-name", {
  metadata: {
    pattern: /@\w+/,
    alias: "function"
  }
});
a("dart", "class-name", {
  generics: {
    pattern: /<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<(?:[\w\s,.&?]|<[\w\s,.&?]*>)*>)*>)*>/,
    inside: {
      "class-name": t,
      keyword: s,
      punctuation: /[<>(),.:]/,
      operator: /[?&|]/
    }
  }
});
//# sourceMappingURL=dart.js.map
