import { l as a, i as u } from "../prismCore-AxbjJFmh.js";
import "./clike.js";
var t = (e, r) => e.replace(/<<(\d+)>>/g, (n, b) => "(?:" + r[+b] + ")"), i = (e, r, n) => RegExp(t(e, r), n || ""), c = (e, r) => {
  for (var n = 0; n < r; n++)
    e = e.replace(/<<self>>/g, `(?:${e})`);
  return e.replace(/<<self>>/g, "[^\\s\\S]");
}, p = /\b(?:Adj|BigInt|Bool|Ctl|Double|false|Int|One|Pauli|PauliI|PauliX|PauliY|PauliZ|Qubit|Range|Result|String|true|Unit|Zero|Adjoint|adjoint|apply|as|auto|body|borrow|borrowing|Controlled|controlled|distribute|elif|else|fail|fixup|for|function|if|in|internal|intrinsic|invert|is|let|mutable|namespace|new|newtype|open|operation|repeat|return|self|set|until|use|using|while|within)\b/, g = /\b[A-Za-z_]\w*\b/.source, o = t(/<<0>>(?:\s*\.\s*<<0>>)*/.source, [g]), s = {
  keyword: p,
  punctuation: /[<>()?,.:[\]]/
}, d = /"(?:\\.|[^\\"])*"/.source;
a.qs = a.qsharp = a.extend("clike", {
  comment: /\/\/.*/,
  string: [
    {
      pattern: i(/(^|[^$\\])<<0>>/.source, [d]),
      lookbehind: !0,
      greedy: !0
    }
  ],
  "class-name": [
    {
      // open Microsoft.Quantum.Canon;
      // open Microsoft.Quantum.Canon as CN;
      pattern: i(/(\b(?:as|open)\s+)<<0>>(?=\s*(?:;|as\b))/.source, [o]),
      lookbehind: !0,
      inside: s
    },
    {
      // namespace Quantum.App1;
      pattern: i(/(\bnamespace\s+)<<0>>(?=\s*\{)/.source, [o]),
      lookbehind: !0,
      inside: s
    }
  ],
  keyword: p,
  number: /(?:\b0(?:x[\da-f]+|b[01]+|o[0-7]+)|(?:\B\.\d+|\b\d+(?:\.\d*)?)(?:e[-+]?\d+)?)l?\b/i,
  operator: /\band=|\bor=|\band\b|\bnot\b|\bor\b|<[-=]|[-=]>|>>>=?|<<<=?|\^\^\^=?|\|\|\|=?|&&&=?|w\/=?|~~~|[*\/+\-^=!%]=?/,
  punctuation: /::|[{}[\];(),.:]/
});
u("qsharp", "number", {
  range: {
    pattern: /\.\./,
    alias: "operator"
  }
});
var l = c(t(/\{(?:[^"{}]|<<0>>|<<self>>)*\}/.source, [d]), 2);
u("qsharp", "string", {
  "interpolation-string": {
    pattern: i(/\$"(?:\\.|<<0>>|[^\\"{])*"/.source, [l]),
    greedy: !0,
    inside: {
      interpolation: {
        pattern: i(/((?:^|[^\\])(?:\\\\)*)<<0>>/.source, [l]),
        lookbehind: !0,
        inside: {
          punctuation: /^\{|\}$/,
          expression: {
            pattern: /[\s\S]+/,
            alias: "language-qsharp",
            inside: a.qs
          }
        }
      },
      string: /[\s\S]+/
    }
  }
});
//# sourceMappingURL=qsharp.js.map
