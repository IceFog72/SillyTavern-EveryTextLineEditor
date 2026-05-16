import { l as t, P as u, i as p } from "../prismCore-AxbjJFmh.js";
var s = [
  {
    pattern: /&[\da-z]{1,8};/i,
    alias: "named-entity"
  },
  /&#x?[\da-f]{1,8};/i
], i = [], r = (a, e) => ({
  pattern: RegExp(`(<${a}[^>]*>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[\\s\\S])*?(?=<\\/${a}>)`, "i"),
  lookbehind: !0,
  greedy: !0,
  inside: {
    "included-cdata": {
      pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
      inside: {
        cdata: /^<!\[CDATA\[|\]\]>$/i,
        ["language-" + e]: {
          pattern: /[\s\S]+/,
          inside: e
        }
      }
    },
    ["language-" + e]: {
      pattern: /[\s\S]+/,
      inside: e
    }
  }
}), n = (a, e) => ({
  pattern: RegExp(`(^|["'\\s])(?:${a})\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s'">=]+)`, "i"),
  lookbehind: !0,
  inside: {
    "attr-name": /^[^\s=]+/,
    "attr-value": {
      pattern: /=[\s\S]+/,
      inside: {
        value: {
          pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
          lookbehind: !0,
          alias: "language-" + e,
          inside: e
        },
        punctuation: [
          {
            pattern: /^=/,
            alias: "attr-equals"
          },
          /"|'/
        ]
      }
    }
  }
}), d = t.svg = t.mathml = t.html = t.markup = {
  comment: {
    pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
    greedy: !0
  },
  prolog: {
    pattern: /<\?[\s\S]+?\?>/,
    greedy: !0
  },
  doctype: {
    // https://www.w3.org/TR/xml/#NT-doctypedecl
    pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: !0,
    inside: {
      "internal-subset": {
        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
        lookbehind: !0,
        greedy: !0,
        inside: "xml"
      },
      string: {
        pattern: /"[^"]*"|'[^']*'/,
        greedy: !0
      },
      punctuation: /^<!|>$|[[\]]/,
      "doctype-tag": /^DOCTYPE/i,
      name: /[^\s<>'"]+/
    }
  },
  cdata: {
    pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    greedy: !0
  },
  tag: {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=\S))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: !0,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/,
        inside: {
          punctuation: /^<\/?/,
          namespace: /^[^:]+:/
        }
      },
      "special-attr": i,
      "attr-value": {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)?/,
        inside: {
          punctuation: [
            {
              pattern: /^=/,
              alias: "attr-equals"
            },
            {
              pattern: /^(\s*)["']|["']$/,
              lookbehind: !0
            }
          ],
          entity: s
        }
      },
      punctuation: /\/?>/,
      "attr-name": {
        pattern: /[^\s/]+/,
        inside: {
          namespace: /^[^:]+:/
        }
      }
    }
  },
  entity: s,
  "markup-bracket": {
    pattern: /[[\](){}]/,
    alias: "punctuation"
  }
};
t.rss = t.atom = t.ssml = t.xml = u.util.clone(d);
i.push(
  n("style", "css"),
  n(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source, "javascript")
);
p("markup", "cdata", {
  style: r("style", "css"),
  script: r("script", "javascript")
});
//# sourceMappingURL=markup.js.map
