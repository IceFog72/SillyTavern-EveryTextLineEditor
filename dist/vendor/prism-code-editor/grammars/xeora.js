import { l as t, i } from "../prismCore-AxbjJFmh.js";
import "./markup.js";
var n = t.xeoracube = t.xeora = t.extend("markup", {
  constant: {
    pattern: /\$(?:DomainContents|PageRenderDuration)\$/,
    inside: {
      punctuation: /\$/
    }
  },
  variable: {
    pattern: /\$@?(?:#+|[-+*~=^])?[\w.]+\$/,
    inside: {
      punctuation: /[$.]/,
      operator: /#+|[-+*~=^@]/
    }
  },
  "function-inline": {
    pattern: /\$F:[-\w.]+\?[-\w.]+(?:,(?:(?:@[-#]*\w+\.[\w+.]\.*)*\|)*(?:(?:[\w+]|[-#*.~^]+[\w+]|=\S)(?:[^$=]|=+[^=])*=*|(?:@[-#]*\w+\.[\w+.]\.*)+(?:(?:[\w+]|[-#*~^][-#*.~^]*[\w+]|=\S)(?:[^$=]|=+[^=])*=*)?)?)?\$/,
    inside: {
      variable: {
        pattern: /(?:[,|])@?(?:#+|[-+*~=^])?[\w.]+/,
        inside: {
          punctuation: /[,.|]/,
          operator: /#+|[-+*~=^@]/
        }
      },
      punctuation: /\$\w:|[$:?.,|]/
    },
    alias: "function"
  },
  "function-block": {
    pattern: /\$XF:\{[-\w.]+\?[-\w.]+(?:,(?:(?:@[-#]*\w+\.[\w+.]\.*)*\|)*(?:(?:[\w+]|[-#*.~^]+[\w+]|=\S)(?:[^$=]|=+[^=])*=*|(?:@[-#]*\w+\.[\w+.]\.*)+(?:(?:[\w+]|[-#*~^][-#*.~^]*[\w+]|=\S)(?:[^$=]|=+[^=])*=*)?)?)?\}:XF\$/,
    inside: {
      punctuation: /[$:{}?.,|]/
    },
    alias: "function"
  },
  "directive-inline": {
    pattern: /\$\w(?:#\d+\+?)?(?:\[[-\w.]+\])?:[-\/\w.]+\$/,
    inside: {
      punctuation: {
        pattern: /\$(?:\w:|C(?:\[|#\d))?|[:{[\]]/,
        inside: {
          tag: /#\d/
        }
      }
    },
    alias: "function"
  },
  "directive-block-open": {
    pattern: /\$\w+:\{|\$\w(?:#\d+\+?)?(?:\[[-\w.]+\])?:[-\w.]+:\{(?:![A-Z]+)?/,
    inside: {
      punctuation: {
        pattern: /\$(?:\w:|C(?:\[|#\d))?|[:{[\]]/,
        inside: {
          tag: /#\d/
        }
      },
      attribute: {
        pattern: /![A-Z]+$/,
        inside: {
          punctuation: /!/
        },
        alias: "keyword"
      }
    },
    alias: "function"
  },
  "directive-block-separator": {
    pattern: /\}:[-\w.]+:\{/,
    inside: {
      punctuation: /[:{}]/
    },
    alias: "function"
  },
  "directive-block-close": {
    pattern: /\}:[-\w.]+\$/,
    inside: {
      punctuation: /[:{}$]/
    },
    alias: "function"
  }
}), a = n["markup-bracket"];
delete n["markup-bracket"];
n["markup-bracket"] = a;
i("inside", "punctuation", {
  variable: n["function-inline"].inside.variable
}, n["function-block"]);
//# sourceMappingURL=xeora.js.map
