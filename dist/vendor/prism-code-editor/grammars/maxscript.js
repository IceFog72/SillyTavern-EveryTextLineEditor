import { l as e } from "../prismCore-AxbjJFmh.js";
var t = /\b(?:about|and|animate|as|at|attributes|by|case|catch|collect|continue|coordsys|do|else|exit|fn|for|from|function|global|if|in|local|macroscript|mapped|max|not|of|off|on|or|parameters|persistent|plugin|rcmenu|return|rollout|set|struct|then|throw|to|tool|try|undo|utility|when|where|while|with)\b/i;
e.maxscript = {
  comment: {
    pattern: /\/\*[\s\S]*?(?:\*\/|$)|--.*/g,
    greedy: !0
  },
  string: {
    pattern: /(^|[^"\\@])(?:"(?:[^"\\]|\\[\s\S])*"|@"[^"]*")/g,
    lookbehind: !0,
    greedy: !0
  },
  path: {
    pattern: /\$(?:[\w/\\.*?]|'[^']*')*/g,
    greedy: !0,
    alias: "string"
  },
  "function-call": {
    pattern: RegExp(`((?:^|[;=<>+\\-*/^({\\[]|\\b(?:and|by|case|catch|collect|do|else|if|in|not|or|return|then|to|try|where|while|with)\\b)[ 	]*)(?!${t.source})[a-z_]\\w*\\b(?=[ 	]*(?:(?!${t.source})[a-z_]|\\d|-\\.?\\d|[({'"$@#?]))`, "img"),
    lookbehind: !0,
    greedy: !0,
    alias: "function"
  },
  "function-definition": {
    pattern: /(\b(?:fn|function)\s+)\w+\b/i,
    lookbehind: !0,
    alias: "function"
  },
  argument: {
    pattern: /\b[a-z_]\w*(?=:)/i,
    alias: "attr-name"
  },
  keyword: t,
  boolean: /\b(?:false|true)\b/,
  time: {
    pattern: /(^|[^\w.])(?:(?:(?:\d+(?:\.\d*)?|\.\d+)(?:[eEdD][+-]\d+|[LP])?[msft])+|\d+:\d+(?:\.\d*)?)(?![\w.:])/,
    lookbehind: !0,
    alias: "number"
  },
  number: [
    {
      pattern: /(^|[^\w.])(?:(?:\d+(?:\.\d*)?|\.\d+)(?:[eEdD][+-]\d+|[LP])?|0x[a-fA-F0-9]+)(?![\w.:])/,
      lookbehind: !0
    },
    /\b(?:e|pi)\b/
  ],
  constant: /\b(?:dontcollect|ok|silentValue|undefined|unsupplied)\b/,
  color: {
    pattern: /\b(?:black|blue|brown|gray|green|orange|red|white|yellow)\b/i,
    alias: "constant"
  },
  operator: /[-+*/<>=!]=?|[&^?]|#(?!\()/,
  punctuation: /[()\[\]{}.:,;]|#(?=\()|\\$/m
};
//# sourceMappingURL=maxscript.js.map
