import { l as e } from "../prismCore-AxbjJFmh.js";
e.ignore = {
  // https://git-scm.com/docs/gitignore
  comment: /^#.*/m,
  entry: {
    pattern: /\S(?:.*(?:(?:\\ )|\S))?/,
    alias: "string",
    inside: {
      operator: /^!|\*\*?|\?/,
      regex: {
        pattern: /(^|[^\\])\[[^\[\]]*\]/,
        lookbehind: !0
      },
      punctuation: /\//
    }
  }
};
e.gitignore = e.ignore;
e.hgignore = e.ignore;
e.npmignore = e.ignore;
//# sourceMappingURL=ignore.js.map
