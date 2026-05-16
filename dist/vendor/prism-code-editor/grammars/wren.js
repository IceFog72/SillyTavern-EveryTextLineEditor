import { l as t } from "../prismCore-AxbjJFmh.js";
t.wren = {
  // Multiline comments in Wren can have nested multiline comments
  // Comments: // and /* */
  comment: {
    // support 3 levels of nesting
    // regex: \/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|<self>)*\*\/
    pattern: /\/\/.*|\/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|\/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|\/\*(?:[^*/]|\*(?!\/)|\/(?!\*))*\*\/)*\*\/)*\*\//,
    greedy: !0
  },
  // Triple quoted strings are multiline but cannot have interpolation (raw strings)
  // Based on prism-python.js
  "triple-quoted-string": {
    pattern: /"""[\s\S]*?"""/,
    greedy: !0,
    alias: "string"
  },
  "string-literal": {
    // A single quote string is multiline and can have interpolation (similar to JS backticks ``)
    pattern: /(^|[^\\"])"(?:[^\\"%]|\\[\s\S]|%(?!\()|%\((?:[^()]|\((?:[^()]|\([^)]*\))*\))*\))*"/,
    lookbehind: !0,
    greedy: !0,
    inside: {
      interpolation: {
        // "%(interpolation)"
        pattern: /((?:^|[^\\])(?:\\{2})*)%\((?:[^()]|\((?:[^()]|\([^)]*\))*\))*\)/,
        lookbehind: !0,
        inside: {
          expression: {
            pattern: /^(..)[\s\S]+(?=.)/,
            lookbehind: !0,
            inside: "wren"
          },
          "interpolation-punctuation": {
            pattern: /.+/,
            alias: "punctuation"
          }
        }
      },
      string: /[\s\S]+/
    }
  },
  // #!/usr/bin/env wren on the first line
  hashbang: {
    pattern: /^#!\/.+/,
    greedy: !0,
    alias: "comment"
  },
  // Attributes are special keywords to add meta data to classes
  attribute: {
    // #! attributes are stored in class properties
    // #!myvar = true
    // #attributes are not stored and dismissed at compilation
    pattern: /#!?[ \t\u3000]*\w+/,
    alias: "keyword"
  },
  "class-name": [
    {
      // class definition
      // class Meta {}
      pattern: /(\bclass\s+)\w+/,
      lookbehind: !0
    },
    // A class must always start with an uppercase.
    // File.read
    /\b[A-Z][a-z\d_]*\b/
  ],
  // A constant can be a variable, class, property or method. Just named in all uppercase letters
  constant: /\b[A-Z][A-Z\d_]*\b/,
  null: {
    pattern: /\bnull\b/,
    alias: "keyword"
  },
  keyword: /\b(?:as|break|class|construct|continue|else|for|foreign|if|import|in|is|return|static|super|this|var|while)\b/,
  boolean: /\b(?:false|true)\b/,
  number: /\b(?:0x[\da-f]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b/i,
  // Functions can be Class.method()
  function: /\b[a-z_]\w*(?=\s*[({])/i,
  operator: /<<|>>|[=!<>]=?|&&|\|\||[-+*/%~^&|?:]|\.{2,3}/,
  punctuation: /[\[\](){}.,;]/
};
//# sourceMappingURL=wren.js.map
