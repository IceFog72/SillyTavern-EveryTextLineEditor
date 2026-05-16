import { l as i } from "../prismCore-AxbjJFmh.js";
var s = {
  pattern: /(^[ \t]*| {2}|\t)#.*/m,
  lookbehind: !0,
  greedy: !0
}, o = {
  pattern: /((?:^|[^\\])(?:\\{2})*)[$@&%]\{(?:[^{}\r\n]|\{[^{}\r\n]*\})*\}/,
  lookbehind: !0,
  inside: {
    punctuation: /^[$@&%]\{|\}$/
  }
}, e = (d, p) => {
  var t = {};
  return t["section-header"] = {
    pattern: /^ ?\*{3}.+?\*{3}/,
    alias: "keyword"
  }, Object.assign(t, p), t.tag = {
    pattern: /([\r\n](?: {2}|\t)[ \t]*)\[[-\w]+\]/,
    lookbehind: !0,
    inside: {
      punctuation: /\[|\]/
    }
  }, t.variable = o, t.comment = s, {
    pattern: RegExp(/^ ?\*{3}[ \t]*<name>[ \t]*\*{3}(?:.|[\r\n](?!\*{3}))*/.source.replace(/<name>/g, d), "im"),
    alias: "section",
    inside: t
  };
}, n = {
  pattern: /(\[Documentation\](?: {2}|\t)[ \t]*)(?![ \t]|#)(?:.|(?:\r\n?|\n)[ \t]*\.{3})+/,
  lookbehind: !0,
  alias: "string"
}, r = {
  pattern: /([\r\n] ?)(?!#)(?:\S(?:[ \t]\S)*)+/,
  lookbehind: !0,
  alias: "function",
  inside: {
    variable: o
  }
}, a = {
  pattern: /([\r\n](?: {2}|\t)[ \t]*)(?!\[|\.{3}|#)(?:\S(?:[ \t]\S)*)+/,
  lookbehind: !0,
  inside: {
    variable: o
  }
};
i.robot = i.robotframework = {
  settings: e("Settings", {
    documentation: {
      pattern: /([\r\n] ?Documentation(?: {2}|\t)[ \t]*)(?![ \t]|#)(?:.|(?:\r\n?|\n)[ \t]*\.{3})+/,
      lookbehind: !0,
      alias: "string"
    },
    property: {
      pattern: /([\r\n] ?)(?!\.{3}|#)(?:\S(?:[ \t]\S)*)+/,
      lookbehind: !0
    }
  }),
  variables: e("Variables"),
  "test-cases": e("Test Cases", {
    "test-name": r,
    documentation: n,
    property: a
  }),
  keywords: e("Keywords", {
    "keyword-name": r,
    documentation: n,
    property: a
  }),
  tasks: e("Tasks", {
    "task-name": r,
    documentation: n,
    property: a
  }),
  comment: s
};
//# sourceMappingURL=robotframework.js.map
