import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, r as extend } from "../../language-CXbc22uF.js";
import "./javascript.js";
//#region src/prism/languages/n4js.js
insertBefore(languages.n4jsd = languages.n4js = extend("js", { "keyword": /\b(?:Array|any|boolean|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|true|finally|for|from|function|[gls]et|if|implements|import|in|instanceof|interface|module|new|null|number|package|private|protected|public|return|static|string|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/ }), "constant", { "annotation": {
	pattern: /@+\w+/,
	alias: "operator"
} });
//#endregion

//# sourceMappingURL=n4js.js.map