import { l as a, i as n, P as e } from "../prismCore-AxbjJFmh.js";
import "./clike.js";
import "./markup-templating.js";
import "./php.js";
import "./markup.js";
a.latte = {
  comment: /^\{\*[\s\S]*/,
  "latte-tag": {
    // https://latte.nette.org/en/tags
    pattern: /(^\{(?:\/(?=[a-z]))?)(?:[=_]|[a-z]\w*\b(?!\())/i,
    lookbehind: !0,
    alias: "important"
  },
  delimiter: {
    pattern: /^\{\/?|\}$/,
    alias: "punctuation"
  },
  php: {
    pattern: /\S(?:[\s\S]*\S)?/,
    alias: "language-php",
    inside: "php"
  }
};
var i = a.extend("markup", {});
n("inside", "attr-value", {
  "n-attr": {
    pattern: /n:[\w-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+))?/,
    inside: {
      "attr-name": {
        pattern: /^[^\s=]+/,
        alias: "important"
      },
      "attr-value": {
        pattern: /=[\s\S]+/,
        inside: {
          punctuation: [
            /^=/,
            {
              pattern: /^(\s*)["']|["']$/,
              lookbehind: !0
            }
          ],
          php: {
            pattern: /\S(?:[\s\S]*\S)?/,
            inside: "php"
          }
        }
      }
    }
  }
}, i.tag);
e.hooks.add("before-tokenize", (t) => {
  if (t.language == "latte") {
    var r = /\{\*[\s\S]*?\*\}|\{[^'"\s{}*](?:[^"'/{}]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|\/\*(?:[^*]|\*(?!\/))*\*\/)*\}/g;
    a["markup-templating"].buildPlaceholders(t, "latte", r), t.grammar = i;
  }
});
e.hooks.add("after-tokenize", (t) => {
  a["markup-templating"].tokenizePlaceholders(t, "latte");
});
//# sourceMappingURL=latte.js.map
