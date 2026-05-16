import { l as r } from "../prismCore-AxbjJFmh.js";
var e = /(?:\B-|\b_|\b)[A-Za-z][\w-]*(?![\w-])/.source, n = `(?:\\b(?:unsigned\\s+)?long\\s+long(?![\\w-])|\\b(?:unrestricted|unsigned)\\s+[a-z]+(?![\\w-])|(?!(?:unrestricted|unsigned)\\b)${e}(?:\\s*<(?:[^<>]|<[^<>]*>)*>)?)(?:\\s*\\?)?`, t = {};
r["web-idl"] = {
  comment: {
    pattern: /\/\/.*|\/\*[\s\S]*?\*\//,
    greedy: !0
  },
  string: {
    pattern: /"[^"]*"/,
    greedy: !0
  },
  namespace: {
    pattern: RegExp(/(\bnamespace\s+)/.source + e),
    lookbehind: !0
  },
  "class-name": [
    {
      pattern: /(^|[^\w-])(?:iterable|maplike|setlike)\s*<(?:[^<>]|<[^<>]*>)*>/,
      lookbehind: !0,
      inside: t
    },
    {
      pattern: RegExp(/(\b(?:attribute|const|deleter|getter|optional|setter)\s+)/.source + n),
      lookbehind: !0,
      inside: t
    },
    {
      // callback return type
      pattern: RegExp(`(\\bcallback\\s+${e}\\s*=\\s*)${n}`),
      lookbehind: !0,
      inside: t
    },
    {
      // typedef
      pattern: RegExp(/(\btypedef\b\s*)/.source + n),
      lookbehind: !0,
      inside: t
    },
    {
      pattern: RegExp(/(\b(?:callback|dictionary|enum|interface(?:\s+mixin)?)\s+)(?!(?:interface|mixin)\b)/.source + e),
      lookbehind: !0
    },
    {
      // inheritance
      pattern: RegExp("(:\\s*)" + e),
      lookbehind: !0
    },
    // includes and implements
    RegExp(e + "(?=\\s+(?:implements|includes)\\b)"),
    {
      pattern: RegExp("(\\b(?:implements|includes)\\s+)" + e),
      lookbehind: !0
    },
    {
      // function return type, parameter types, and dictionary members
      pattern: RegExp(`${n}(?=\\s*(?:\\.{3}\\s*)?${e}\\s*[(),;=])`),
      inside: t
    }
  ],
  builtin: /\b(?:ArrayBuffer|BigInt64Array|BigUint64Array|ByteString|DOMString|DataView|Float32Array|Float64Array|FrozenArray|Int16Array|Int32Array|Int8Array|ObservableArray|Promise|USVString|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray)\b/,
  keyword: [
    /\b(?:async|attribute|callback|const|constructor|deleter|dictionary|enum|getter|implements|includes|inherit|interface|mixin|namespace|null|optional|or|partial|readonly|required|setter|static|stringifier|typedef|unrestricted)\b/,
    // type keywords
    /\b(?:any|bigint|boolean|byte|double|float|iterable|long|maplike|object|octet|record|sequence|setlike|short|symbol|undefined|unsigned|void)\b/
  ],
  boolean: /\b(?:false|true)\b/,
  number: {
    pattern: /(^|[^\w-])-?(?:0x[0-9a-f]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|NaN|Infinity)(?![\w-])/i,
    lookbehind: !0
  },
  operator: /\.{3}|[=:?<>-]/,
  punctuation: /[(){}[\].,;]/
};
for (var i in r["web-idl"])
  i !== "class-name" && (t[i] = r["web-idl"][i]);
r.webidl = r["web-idl"];
//# sourceMappingURL=web-idl.js.map
