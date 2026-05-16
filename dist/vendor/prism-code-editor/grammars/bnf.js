import { l as n } from "../prismCore-AxbjJFmh.js";
n.bnf = {
  string: /"[^\r\n"]*"|'[^\r\n']*'/,
  definition: {
    pattern: /<[^<>\r\n\t]+>(?=\s*::=)/,
    alias: ["rule", "keyword"],
    inside: {
      punctuation: /^<|>$/
    }
  },
  rule: {
    pattern: /<[^<>\r\n\t]+>/,
    inside: {
      punctuation: /^<|>$/
    }
  },
  operator: /::=|[|()[\]{}*+?]|\.{3}/
};
n.rbnf = n.bnf;
//# sourceMappingURL=bnf.js.map
