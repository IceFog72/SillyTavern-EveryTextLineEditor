import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, r as extend } from "../../language-CXbc22uF.js";
import "./javascript.js";
import { n as tag } from "../../xml-shared-ONZRGEwv.js";
//#region src/prism/languages/actionscript.js
var actionscript = languages.actionscript = extend("javascript", {
	"keyword": /\b(?:as|break|case|catch|class|const|default|delete|do|dynamic|each|else|extends|final|finally|for|function|[gs]et|if|implements|import|in|include|instanceof|interface|internal|is|namespace|native|new|null|override|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|use|var|void|while|with)\b/,
	"operator": /--|\+\+|[!=]==|(?:&&|\|\||<<|>>>?|[%&|^!=<>/*+-])=?|[~?@]/
});
actionscript["class-name"].alias = "function";
delete actionscript["parameter"];
delete actionscript["literal-property"];
insertBefore(actionscript, "regex", { "tag": tag });
//#endregion

//# sourceMappingURL=actionscript.js.map