import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, r as extend } from "../../language-CXbc22uF.js";
import "./clike.js";
//#region src/prism/languages/processing.js
insertBefore(languages.processing = extend("clike", {
	"keyword": /\b(?:break|case|catch|class|continue|default|else|extends|final|for|if|implements|import|new|null|private|public|return|static|super|switch|this|try|void|while)\b/,
	"function": /\b\w+(?=\s*\()/,
	"operator": />>|<<|&&?|\|\|?|[%?]|[!=<>/*+-]=?/
}), "number", {
	"constant": /\b(?!XML\b)[A-Z][A-Z\d_]+\b/,
	"type": {
		pattern: /\b(?:boolean|byte|char|color|double|float|int|[A-Z]\w*)\b/,
		alias: "class-name"
	}
});
//#endregion

//# sourceMappingURL=processing.js.map