import { l as a } from "../prismCore-AxbjJFmh.js";
var n = /\b(?:align|allowzero|and|anyframe|anytype|asm|async|await|break|cancel|catch|comptime|const|continue|defer|else|enum|errdefer|error|export|extern|fn|for|if|inline|linksection|nakedcc|noalias|nosuspend|null|or|orelse|packed|promise|pub|resume|return|stdcallcc|struct|suspend|switch|test|threadlocal|try|undefined|union|unreachable|usingnamespace|var|volatile|while)\b/, o = "\\b(?!" + n.source + ")(?!\\d)\\w+\\b", e = /align\s*\((?:[^()]|\([^()]*\))*\)/.source, t = /(?:\?|\bpromise->|(?:\[[^[\]]*\]|\*(?!\*)|\*\*)(?:\s*<ALIGN>|\s*const\b|\s*volatile\b|\s*allowzero\b)*)/.source.replace(/<ALIGN>/g, e), s = /(?:\bpromise\b|(?:\berror\.)?<ID>(?:\.<ID>)*(?!\s+<ID>))/.source.replace(/<ID>/g, o), r = "(?!\\s)(?:!?\\s*(?:" + t + "\\s*)*" + s + ")+";
a.zig = {
  comment: [
    {
      pattern: /\/\/[/!].*/,
      alias: "doc-comment"
    },
    /\/{2}.*/
  ],
  string: [
    {
      // "string" and c"string"
      pattern: /(^|[^\\@])c?"(?:[^"\\\r\n]|\\.)*"/,
      lookbehind: !0,
      greedy: !0
    },
    {
      // multiline strings and c-strings
      pattern: /([\r\n])([ \t]+c?\\{2}).*(?:(?:\r\n?|\n)\2.*)*/,
      lookbehind: !0,
      greedy: !0
    }
  ],
  char: {
    // characters 'a', '\n', '\xFF', '\u{10FFFF}'
    pattern: /(^|[^\\])'(?:[^'\\\r\n]|[\uD800-\uDFFF]{2}|\\(?:.|x[a-fA-F\d]{2}|u\{[a-fA-F\d]{1,6}\}))'/,
    lookbehind: !0,
    greedy: !0
  },
  builtin: /\B@(?!\d)\w+(?=\s*\()/,
  label: {
    pattern: /(\b(?:break|continue)\s*:\s*)\w+\b|\b(?!\d)\w+\b(?=\s*:\s*(?:\{|while\b))/,
    lookbehind: !0
  },
  "class-name": [
    // const Foo = struct {};
    /\b(?!\d)\w+(?=\s*=\s*(?:(?:extern|packed)\s+)?(?:enum|struct|union)\s*[({])/,
    {
      // const x: i32 = 9;
      // var x: Bar;
      // fn foo(x: bool, y: f32) void {}
      pattern: RegExp(/(:\s*)<TYPE>(?=\s*(?:<ALIGN>\s*)?[=;,)])|<TYPE>(?=\s*(?:<ALIGN>\s*)?\{)/.source.replace(/<TYPE>/g, r).replace(/<ALIGN>/g, e)),
      lookbehind: !0,
      inside: "zig"
    },
    {
      // extern fn foo(x: f64) f64; (optional alignment)
      pattern: RegExp(/(\)\s*)<TYPE>(?=\s*(?:<ALIGN>\s*)?;)/.source.replace(/<TYPE>/g, r).replace(/<ALIGN>/g, e)),
      lookbehind: !0,
      inside: "zig"
    }
  ],
  "builtin-type": {
    pattern: /\b(?:anyerror|bool|c_u?(?:int|long|longlong|short)|c_longdouble|c_void|comptime_(?:float|int)|f(?:16|32|64|128)|[iu](?:8|16|32|64|128|size)|noreturn|type|void)\b/,
    alias: "keyword"
  },
  keyword: n,
  function: /\b(?!\d)\w+(?=\s*\()/,
  number: /\b(?:0b[01]+|0o[0-7]+|0x[a-fA-F\d]+(?:\.[a-fA-F\d]*)?(?:[pP][+-]?[a-fA-F\d]+)?|\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)\b/,
  boolean: /\b(?:false|true)\b/,
  operator: /\.[*?]|\.{2,3}|[-=]>|\*\*|\+\+|\|\||(?:<<|>>|[-+*]%|[-+*/%^&|<>!=])=?|[?~]/,
  punctuation: /[.:,;(){}[\]]/
};
//# sourceMappingURL=zig.js.map
