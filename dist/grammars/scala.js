import { l as t, i as n } from "../prismCore-AxbjJFmh.js";
import "./java.js";
import "./clike.js";
var e = t.scala = t.extend("java", {
  "triple-quoted-string": {
    pattern: /"""[\s\S]*?"""/,
    greedy: !0,
    alias: "string"
  },
  string: {
    pattern: /("|')(?:\\.|(?!\1)[^\\\r\n])*\1/,
    greedy: !0
  },
  keyword: /<-|=>|\b(?:abstract|case|catch|class|def|derives|do|else|enum|extends|extension|final|finally|for|forSome|given|if|implicit|import|infix|inline|lazy|match|new|null|object|opaque|open|override|package|private|protected|return|sealed|self|super|this|throw|trait|transparent|try|type|using|val|var|while|with|yield)\b/,
  number: /\b0x(?:[\da-f]*\.)?[\da-f]+|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e\d+)?[dfl]?/i,
  builtin: /\b(?:Any|AnyRef|AnyVal|Boolean|Byte|Char|Double|Float|Int|Long|Nothing|Short|String|Unit)\b/,
  symbol: /'[^\d\s\\]\w*/
});
n("scala", "triple-quoted-string", {
  "string-interpolation": {
    pattern: /\b[a-z]\w*(?:"""(?:[^$]|\$(?:[^{]|\{(?:[^{}]|\{[^{}]*\})*\}))*?"""|"(?:[^$"\r\n]|\$(?:[^{]|\{(?:[^{}]|\{[^{}]*\})*\}))*")/i,
    greedy: !0,
    inside: {
      id: {
        pattern: /^\w+/,
        greedy: !0,
        alias: "function"
      },
      escape: {
        pattern: /\\\$"|\$[$"]/,
        greedy: !0,
        alias: "symbol"
      },
      interpolation: {
        pattern: /\$(?:\w+|\{(?:[^{}]|\{[^{}]*\})*\})/,
        greedy: !0,
        inside: {
          punctuation: /^\$\{?|\}$/,
          expression: {
            pattern: /[\s\S]+/,
            inside: e
          }
        }
      },
      string: /[\s\S]+/
    }
  }
});
delete e["class-name"];
delete e.function;
delete e.constant;
//# sourceMappingURL=scala.js.map
