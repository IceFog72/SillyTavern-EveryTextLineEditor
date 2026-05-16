import { l as e, i as s } from "../prismCore-AxbjJFmh.js";
import "./javascript.js";
import "./javadoclike.js";
import "./typescript.js";
import "./clike.js";
var a = e.js, t = /\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})+\}/.source, r = `(@(?:arg|argument|param|property)\\s+(?:${t}\\s+)?)`;
e.jsdoc = e.extend("javadoclike", {
  parameter: {
    // @param {string} foo - foo bar
    pattern: RegExp(r + /(?:(?!\s)[$\w\xA0-\uFFFF.])+(?=\s|$)/.source),
    lookbehind: !0,
    inside: {
      punctuation: /\./
    }
  }
});
s("jsdoc", "keyword", {
  "optional-parameter": {
    // @param {string} [baz.foo="bar"] foo bar
    pattern: RegExp(r + /\[(?:(?!\s)[$\w\xA0-\uFFFF.])+(?:=[^[\]]+)?\](?!\S)/.source),
    lookbehind: !0,
    inside: {
      code: {
        pattern: /(=)[\s\S]+(?=.)/,
        lookbehind: !0,
        inside: a,
        alias: "language-javascript"
      },
      punctuation: /[=[\]]/,
      parameter: {
        pattern: /[\s\S]+/,
        inside: {
          punctuation: /\./
        }
      }
    }
  },
  "class-name": [
    {
      pattern: RegExp(/(@(?:augments|class|extends|interface|memberof!?|template|this|typedef)\s+(?:<TYPE>\s+)?)[A-Z]\w*(?:\.[A-Z]\w*)*/.source.replace(/<TYPE>/g, t)),
      lookbehind: !0,
      inside: {
        punctuation: /\./
      }
    },
    {
      pattern: RegExp("(@[a-z]+\\s+)" + t),
      lookbehind: !0,
      inside: {
        string: a.string,
        number: a.number,
        boolean: a.boolean,
        keyword: e.ts.keyword,
        operator: /=>|\.\.\.|[&|?:*]/,
        punctuation: /[.,;=<>{}()[\]]/
      }
    }
  ],
  example: {
    pattern: /(@example\s+(?!\s))(?:[^@\s]|\s+(?!\s))+?(?=\s*(?:\*\s*)?(?:@\w|\*\/))/,
    lookbehind: !0,
    inside: {
      code: {
        pattern: /^([\t ]*(?:\*\s*)?)\S.*$/m,
        lookbehind: !0,
        inside: a,
        alias: "language-javascript"
      }
    }
  }
});
e.javadoclike.addSupport("javascript", e.jsdoc);
//# sourceMappingURL=jsdoc.js.map
