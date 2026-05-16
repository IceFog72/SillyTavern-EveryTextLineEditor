import { l as i, i as n } from "../prismCore-AxbjJFmh.js";
import "./css.js";
var e = i.css, r = {
  pattern: /(\b\d+)(?:%|[a-z]+(?![\w-]))/,
  lookbehind: !0
}, a = {
  pattern: /(^|[^\w.-])-?(?:\d+(?:\.\d+)?|\.\d+)/,
  lookbehind: !0
};
e.selector.inside = e.atrule.inside["selector-function-argument"].inside = {
  "pseudo-element": /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
  "pseudo-class": /:[-\w]+/,
  class: /\.[-\w]+/,
  id: /#[-\w]+/,
  attribute: {
    pattern: /\[(?:[^[\]"']|("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1)*\]/,
    greedy: !0,
    inside: {
      punctuation: /^\[|\]$/,
      "case-sensitivity": {
        pattern: /(\s)[si]$/i,
        lookbehind: !0,
        alias: "keyword"
      },
      namespace: {
        pattern: /^(\s*)(?:(?!\s)[-*\w\xA0-\uFFFF])*\|(?!=)/,
        lookbehind: !0,
        inside: {
          punctuation: /\|$/
        }
      },
      "attr-name": {
        pattern: /^(\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+/,
        lookbehind: !0
      },
      "attr-value": [
        /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        {
          pattern: /(=\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+(?=\s*$)/,
          lookbehind: !0
        }
      ],
      operator: /[|~*^$]?=/
    }
  },
  "n-th": [
    {
      pattern: /(\(\s*)[+-]?\d*[\dn](?:\s*[+-]\s*\d+)?(?=\s*\))/,
      lookbehind: !0,
      inside: {
        number: /[\dn]+/,
        operator: /[+-]/
      }
    },
    {
      pattern: /(\(\s*)(?:even|odd)(?=\s*\))/i,
      lookbehind: !0
    }
  ],
  combinator: />|\+|~|\|\|/,
  // the `tag` token has been existed and removed.
  // because we can't find a perfect tokenize to match it.
  // if you want to add it, please read https://github.com/PrismJS/prism/pull/2373 first.
  punctuation: /[(),]/
};
n("css", "property", {
  variable: {
    pattern: /(^|[^-\w\xA0-\uFFFF])--(?!\d)(?:(?!\s)[-\w\xA0-\uFFFF])*/i,
    lookbehind: !0
  }
});
n("css", "function", {
  operator: {
    pattern: /(\s)[+\-*\/](?=\s)/,
    lookbehind: !0
  },
  // CAREFUL!
  // Previewers and Inline color use hexcode and color.
  hexcode: {
    pattern: /\B#[\da-f]{3,8}\b/i,
    alias: "color"
  },
  color: [
    {
      pattern: /(^|[^\w-])(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGr[ae]y|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGr[ae]y|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGr[ae]y|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gr[ae]y|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGr[ae]y|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGr[ae]y|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|RebeccaPurple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGr[ae]y|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Transparent|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)(?![\w-])/i,
      lookbehind: !0
    },
    {
      pattern: /\b(?:hsl|rgb)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:hsl|rgb)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B/i,
      inside: {
        unit: r,
        number: a,
        function: /[\w-]+(?=\()/,
        punctuation: /[(),]/
      }
    }
  ],
  // it's important that there is no boundary assertion after the hex digits
  entity: /\\[\da-f]{1,8}/i,
  unit: r,
  number: a
});
//# sourceMappingURL=css-extras.js.map
