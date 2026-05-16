import { l as n } from "../prismCore-AxbjJFmh.js";
var e = /\/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|<self>)*\*\//.source, a = {
  pattern: /b?"(?:\\[\s\S]|[^\\"])*"|b?r(#*)"(?:[^"]|"(?!\1))*"\1/,
  greedy: !0
}, t = {
  "closure-punctuation": {
    pattern: /^\||\|$/,
    alias: "punctuation"
  }
};
for (var r = 0; r < 2; r++)
  e = e.replace(/<self>/g, e);
e = e.replace(/<self>/g, "[^\\s\\S]");
t.rest = n.rust = {
  comment: {
    pattern: RegExp("//.*|" + e),
    greedy: !0
  },
  string: a,
  char: {
    pattern: /b?'(?:\\(?:x[0-7][\da-fA-F]|u\{(?:[\da-fA-F]_*){1,6}\}|.)|[^\\\r\n\t'])'/,
    greedy: !0
  },
  attribute: {
    pattern: /#!?\[(?:[^\[\]"]|"(?:\\[\s\S]|[^\\"])*")*\]/,
    greedy: !0,
    alias: "attr-name",
    inside: {
      string: a
    }
  },
  // Closure params should not be confused with bitwise OR |
  "closure-params": {
    pattern: /([=(,:]\s*|\bmove\s*)\|[^|]*\||\|[^|]*\|(?=\s*(?:\{|->))/,
    lookbehind: !0,
    greedy: !0,
    inside: t
  },
  "lifetime-annotation": {
    pattern: /'\w+/,
    alias: "symbol"
  },
  "fragment-specifier": {
    pattern: /(\$\w+:)[a-z]+/,
    lookbehind: !0,
    alias: "punctuation"
  },
  variable: /\$\w+/,
  "function-definition": {
    pattern: /(\bfn\s+)\w+/,
    lookbehind: !0,
    alias: "function"
  },
  "type-definition": {
    pattern: /(\b(?:enum|struct|trait|type|union)\s+)\w+/,
    lookbehind: !0,
    alias: "class-name"
  },
  "module-declaration": [
    {
      pattern: /(\b(?:crate|mod)\s+)[a-z][a-z_\d]*/,
      lookbehind: !0,
      alias: "namespace"
    },
    {
      pattern: /(\b(?:crate|self|super)\s*)::\s*[a-z][a-z_\d]*\b(?:\s*::(?:\s*[a-z][a-z_\d]*\s*::)*)?/,
      lookbehind: !0,
      alias: "namespace",
      inside: {
        punctuation: /::/
      }
    }
  ],
  // https://github.com/rust-lang/reference/blob/master/src/keywords.md
  // primitives and str
  // https://doc.rust-lang.org/stable/rust-by-example/primitives.html
  keyword: /\b(?:Self|abstract|as|async|await|become|box|break|const|continue|crate|do|dyn|else|enum|extern|final|fn|for|if|impl|in|let|loop|macro|match|mod|move|mut|override|priv|pub|ref|return|self|static|struct|super|trait|try|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield|bool|char|f(?:32|64)|[ui](?:8|16|32|64|128|size)|str)\b/,
  // functions can technically start with an upper-case letter, but this will introduce a lot of false positives
  // and Rust's naming conventions recommend snake_case anyway.
  // https://doc.rust-lang.org/1.0.0/style/style/naming/README.html
  function: /\b[a-z_]\w*(?=\s*(?:::\s*<|\())/,
  macro: {
    pattern: /\b\w+!/,
    alias: "property"
  },
  constant: /\b[A-Z_][A-Z_\d]+\b/,
  "class-name": /\b[A-Z]\w*\b/,
  namespace: {
    pattern: /(?:\b[a-z][a-z_\d]*\s*::\s*)*\b[a-z][a-z_\d]*\s*::(?!\s*<)/,
    inside: {
      punctuation: /::/
    }
  },
  // Hex, oct, bin, dec numbers with visual separators and type suffix
  number: /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:f32|f64|[iu](?:8|16|32|64|size)?))?\b/,
  boolean: /\b(?:false|true)\b/,
  punctuation: /->|\.\.=|\.{1,3}|::|[{}[\];(),:]/,
  operator: /[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?=?|[@?]/
};
//# sourceMappingURL=rust.js.map
