import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, r as extend } from "../../language-CXbc22uF.js";
import "./javadoclike.js";
import "./php.js";
//#region src/prism/languages/phpdoc.js
insertBefore(languages.phpdoc = extend("javadoclike", { "parameter": {
	pattern: /(@(?:global|param|property(?:-read|-write)?|var)\s+(?:(?:\b[a-zA-Z]\w*|[|\\[\]])+\s+)?)\$\w+/,
	lookbehind: true
} }), "keyword", { "class-name": [{
	pattern: /(@(?:global|package|param|property(?:-read|-write)?|return|subpackage|throws|var)\s+)(?:\b[a-zA-Z]\w*|[|\\[\]])+/,
	lookbehind: true,
	inside: {
		"keyword": /\b(?:array|bool|boolean|callback|double|false|true|float|int|integer|mixed|null|object|resource|self|string|void)\b/,
		"punctuation": /[|\\()[\]]/
	}
}] });
//#endregion

//# sourceMappingURL=phpdoc.js.map