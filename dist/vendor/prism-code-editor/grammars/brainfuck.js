import { l as a } from "../prismCore-AxbjJFmh.js";
a.brainfuck = {
  pointer: {
    pattern: /<|>/,
    alias: "keyword"
  },
  increment: {
    pattern: /\+/,
    alias: "inserted"
  },
  decrement: {
    pattern: /-/,
    alias: "deleted"
  },
  branching: {
    pattern: /\[|\]/,
    alias: "important"
  },
  operator: /[.,]/,
  comment: /\S+/
};
//# sourceMappingURL=brainfuck.js.map
