import { l as n } from "../prismCore-AxbjJFmh.js";
var t = {
  // https://en.wikipedia.org/wiki/Universally_unique_identifier#Format
  pattern: /\{[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}\}/i,
  alias: "constant",
  inside: {
    punctuation: /[{}]/
  }
};
n["solution-file"] = {
  comment: {
    pattern: /#.*/,
    greedy: !0
  },
  string: {
    pattern: /"[^"\r\n]*"|'[^'\r\n]*'/,
    greedy: !0,
    inside: {
      guid: t
    }
  },
  object: {
    // Foo
    //   Bar("abs") = 9
    //   EndBar
    //   Prop = TRUE
    // EndFoo
    pattern: /^([ \t]*)(?:([A-Z]\w*)\b(?=.*(?:\r\n?|\n)(?:\1[ \t].*(?:\r\n?|\n))*\1End\2(?=[ \t]*$))|End[A-Z]\w*(?=[ \t]*$))/m,
    lookbehind: !0,
    greedy: !0,
    alias: "keyword"
  },
  property: {
    pattern: /^([ \t]*)(?!\s)[^\r\n"#=()]*[^\s"#=()](?=\s*=)/m,
    lookbehind: !0,
    inside: {
      guid: t
    }
  },
  guid: t,
  number: /\b\d+(?:\.\d+)*\b/,
  boolean: /\b(?:FALSE|TRUE)\b/,
  operator: /=/,
  punctuation: /[(),]/
};
n.sln = n["solution-file"];
//# sourceMappingURL=solution-file.js.map
