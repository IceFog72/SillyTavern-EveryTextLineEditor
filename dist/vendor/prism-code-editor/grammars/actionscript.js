import { l as t, i } from "../prismCore-AxbjJFmh.js";
import "./javascript.js";
import "./clike.js";
var e = t.actionscript = t.extend("javascript", {
  keyword: /\b(?:as|break|case|catch|class|const|default|delete|do|dynamic|each|else|extends|final|finally|for|function|get|if|implements|import|in|include|instanceof|interface|internal|is|namespace|native|new|null|override|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|use|var|void|while|with)\b/,
  operator: /\+\+|--|(?:[+\-*\/%^]|&&?|\|\|?|<<?|>>?>?|[!=]=?)=?|[~?@]/
});
e["class-name"].alias = "function";
delete e.parameter;
delete e["literal-property"];
i("actionscript", "string", {
  xml: {
    pattern: /(^|[^.])<\/?\w+(?:\s+[^\s>\/=]+=("|')(?:\\[\s\S]|(?!\2)[^\\])*\2)*\s*\/?>/,
    lookbehind: !0,
    inside: "markup"
  }
});
//# sourceMappingURL=actionscript.js.map
