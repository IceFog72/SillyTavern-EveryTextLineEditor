import { l as e, i as r } from "../prismCore-AxbjJFmh.js";
import "./css.js";
e.sass = e.extend("css", {
  // Sass comments don't need to be closed, only indented
  comment: {
    pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t].+)*/m,
    lookbehind: !0,
    greedy: !0
  }
});
r("sass", "atrule", {
  // We want to consume the whole line
  "atrule-line": {
    // Includes support for = and + shortcuts
    pattern: /^(?:[ \t]*)[@+=].+/m,
    greedy: !0,
    inside: {
      atrule: /(?:@[\w-]+|[+=])/
    }
  }
});
delete e.sass.atrule;
var t = /\$[-\w]+|#\{\$[-\w]+\}/, a = [
  /[+*\/%]|[=!]=|<=?|>=?|\b(?:and|not|or)\b/,
  {
    pattern: /(\s)-(?=\s)/,
    lookbehind: !0
  }
];
r("sass", "property", {
  // We want to consume the whole line
  "variable-line": {
    pattern: /^[ \t]*\$.+/m,
    greedy: !0,
    inside: {
      punctuation: /:/,
      variable: t,
      operator: a
    }
  },
  // We want to consume the whole line
  "property-line": {
    pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s].*)/m,
    greedy: !0,
    inside: {
      property: [
        /[^:\s]+(?=\s*:)/,
        {
          pattern: /(:)[^:\s]+/,
          lookbehind: !0
        }
      ],
      punctuation: /:/,
      variable: t,
      operator: a,
      important: e.sass.important
    }
  }
});
delete e.sass.property;
delete e.sass.important;
r("sass", "punctuation", {
  selector: {
    pattern: /^([ \t]*)\S(?:,[^,\r\n]+|[^,\r\n]*)(?:,[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,[^,\r\n]+|[^,\r\n]*)(?:,[^,\r\n]+)*)*/m,
    lookbehind: !0,
    greedy: !0
  }
});
//# sourceMappingURL=sass.js.map
