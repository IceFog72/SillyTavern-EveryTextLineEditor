import { l as a, P as i } from "../prismCore-AxbjJFmh.js";
import "./markup-templating.js";
import "./markup.js";
var l = /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, n = /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|\b0x[\dA-F]+\b/;
a.soy = {
  comment: {
    pattern: /\/\*[\s\S]*?\*\/|(\s)\/\/.*/,
    lookbehind: !0,
    greedy: !0
  },
  "command-arg": {
    pattern: /(\{+\/?\s*(?:alias|call|delcall|delpackage|deltemplate|namespace|template)\s+)\.?[\w.]+/,
    lookbehind: !0,
    alias: "string",
    inside: {
      punctuation: /\./
    }
  },
  parameter: {
    pattern: /(\{+\/?\s*@?param\??\s+)\.?[\w.]+/,
    lookbehind: !0,
    alias: "variable"
  },
  keyword: [
    {
      pattern: /(\{+\/?[^\S\r\n]*)(?:\\[nrt]|alias|call|case|css|default|delcall|delpackage|deltemplate|else(?:if)?|fallbackmsg|for(?:each)?|if(?:empty)?|lb|let|literal|msg|namespace|nil|@?param\??|rb|sp|switch|template|xid)/,
      lookbehind: !0
    },
    /\b(?:any|as|attributes|bool|css|float|html|in|int|js|list|map|null|number|string|uri)\b/
  ],
  delimiter: {
    pattern: /^\{+\/?|\/?\}+$/,
    alias: "punctuation"
  },
  property: /\w+(?==)/,
  variable: {
    pattern: /\$[^\W\d]\w*(?:\??(?:\.\w+|\[[^\]]+\]))*/,
    inside: {
      string: {
        pattern: l,
        greedy: !0
      },
      number: n,
      punctuation: /[\[\].?]/
    }
  },
  string: {
    pattern: l,
    greedy: !0
  },
  function: [
    /\w+(?=\()/,
    {
      pattern: /(\|[^\S\r\n]*)\w+/,
      lookbehind: !0
    }
  ],
  boolean: /\b(?:false|true)\b/,
  number: n,
  operator: /\?:?|<=?|>=?|==?|!=|[+*/%-]|\b(?:and|not|or)\b/,
  punctuation: /[{}()\[\]|.,:]/
};
i.hooks.add("before-tokenize", (e) => {
  var s = /\{\{.+?\}\}|\{.+?\}|\s\/\/.*|\/\*[\s\S]*?\*\//g, o = "{literal}", p = "{/literal}", t = !1;
  a["markup-templating"].buildPlaceholders(e, "soy", s, (r) => (r === p && (t = !1), t ? !1 : (r === o && (t = !0), !0)));
});
i.hooks.add("after-tokenize", (e) => {
  a["markup-templating"].tokenizePlaceholders(e, "soy");
});
//# sourceMappingURL=soy.js.map
