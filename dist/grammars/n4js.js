import { l as e, i as t } from "../prismCore-AxbjJFmh.js";
import "./javascript.js";
import "./clike.js";
e.n4js = e.extend("javascript", {
  // Keywords from N4JS language spec: https://numberfour.github.io/n4js/spec/N4JSSpec.html
  keyword: /\b(?:Array|any|boolean|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|module|new|null|number|package|private|protected|public|return|set|static|string|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/
});
t("n4js", "constant", {
  // Annotations in N4JS spec: https://numberfour.github.io/n4js/spec/N4JSSpec.html#_annotations
  annotation: {
    pattern: /@+\w+/,
    alias: "operator"
  }
});
e.n4jsd = e.n4js;
//# sourceMappingURL=n4js.js.map
