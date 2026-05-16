import { l as e } from "../prismCore-AxbjJFmh.js";
var a = /\b(?:abstype|and|andalso|as|case|datatype|do|else|end|eqtype|exception|fn|fun|functor|handle|if|in|include|infix|infixr|let|local|nonfix|of|op|open|orelse|raise|rec|sharing|sig|signature|struct|structure|then|type|val|where|while|with|withtype)\b/i, t = {
  // This is only an approximation since the real grammar is context-free
  //
  // Why the main loop so complex?
  // The main loop is approximately the same as /(?:\s*(?:[*,]|->)\s*<TERMINAL>)*/ which is, obviously, a lot
  // simpler. The difference is that if a comma is the last iteration of the loop, then the terminal must be
  // followed by a long identifier.
  pattern: RegExp(
    /((?:^|[^:]):\s*)<TERMINAL>(?:\s*(?:(?:\*|->)\s*<TERMINAL>|,\s*<TERMINAL>(?:(?=\s*(?:[*,]|->))|(?!\s*(?:[*,]|->))\s+<LONG-ID>)))*/.source.replace(
      /<TERMINAL>/g,
      /(?:'[\w']*|<LONG-ID>|\((?:[^()]|\([^()]*\))*\)|\{(?:[^{}]|\{[^{}]*\})*\})(?:\s+<LONG-ID>)*/.source
    ).replace(/<LONG-ID>/g, `(?!${a.source})[a-z\\d_][\\w'.]*`),
    "i"
  ),
  lookbehind: !0,
  greedy: !0
};
t.inside = e.smlnj = e.sml = {
  // allow one level of nesting
  comment: /\(\*(?:[^*(]|\*(?!\))|\((?!\*)|\(\*(?:[^*(]|\*(?!\))|\((?!\*))*\*\))*\*\)/,
  string: {
    pattern: /#?"(?:[^"\\]|\\.)*"/,
    greedy: !0
  },
  "class-name": [
    t,
    {
      pattern: /((?:^|[^\w'])(?:datatype|exception|functor|signature|structure|type)\s+)[a-z_][\w'.]*/i,
      lookbehind: !0
    }
  ],
  function: {
    pattern: /((?:^|[^\w'])fun\s+)[a-z_][\w'.]*/i,
    lookbehind: !0
  },
  keyword: a,
  variable: {
    pattern: /(^|[^\w'])'[\w']*/,
    lookbehind: !0
  },
  number: /~?\b(?:\d+(?:\.\d+)?(?:e~?\d+)?|0x[\da-f]+)\b/i,
  word: {
    pattern: /\b0w(?:\d+|x[\da-f]+)\b/i,
    alias: "constant"
  },
  boolean: /\b(?:false|true)\b/i,
  operator: /\.\.\.|:[>=:]|=>?|->|[<>]=?|[!+\-*/^#|@~]/,
  punctuation: /[(){}\[\].:,;]/
};
//# sourceMappingURL=sml.js.map
