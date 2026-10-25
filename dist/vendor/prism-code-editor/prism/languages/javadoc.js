import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, n as clone } from "../../language-CXbc22uF.js";
import { o as dotPunctuation } from "../../patterns-DSInPV_c.js";
import { r as replace } from "../../shared-oTKIFAwH.js";
import "./markup.js";
import "./java.js";
import "./javadoclike.js";
//#region src/prism/languages/javadoc.js
var codeLinePattern = /(^[ 	]*(?:\*\s*)*)[^\s*].*/m;
var reference = replace("(?:\\b[a-zA-Z]\\w+\\s*\\.\\s*)*\\b[A-Z]\\w*(?:\\s*<0>)?|<0>", ["#\\s*\\w+(?:\\s*\\([^()]*\\))?"]);
var java = languages.java;
var markup = languages.markup;
var javadoc = languages.javadoc = clone(languages.javadoclike);
insertBefore(javadoc, "keyword", {
	"reference": {
		pattern: RegExp(`(@(?:exception|link|linkplain|see|throws|value)\\s+(?:\\*\\s*)?)(?:${reference})`),
		lookbehind: true,
		inside: {
			"function": {
				pattern: /(#\s*)\w+(?=\s*\()/,
				lookbehind: true
			},
			"field": {
				pattern: /(#\s*)\w+/,
				lookbehind: true
			},
			"namespace": {
				pattern: /\b(?:[a-z]\w*\s*\.\s*)+/,
				inside: dotPunctuation
			},
			"class-name": /\b[A-Z]\w*/,
			"keyword": java.keyword,
			"punctuation": /[()[\].,#]/
		}
	},
	"class-name": {
		pattern: /(@param\s+)<[A-Z]\w*>/,
		lookbehind: true,
		inside: { "punctuation": /[.<>]/ }
	},
	"code-section": [{
		pattern: /(\{@code\s+(?!\s))(?:[^\s{}]|\s+(?![\s}])|\{(?:[^{}]|\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})*\})*\})+(?=\s*\})/,
		lookbehind: true,
		inside: { "code": {
			pattern: codeLinePattern,
			lookbehind: true,
			alias: "language-java",
			inside: java
		} }
	}, {
		pattern: /(<(code|pre|tt)>(?!<code>)\s*)\S(?:\S|\s+\S)*?(?=\s*<\/\2>)/,
		lookbehind: true,
		inside: { "line": {
			pattern: codeLinePattern,
			lookbehind: true,
			inside: {
				"tag": markup.tag,
				"entity": markup.entity,
				"code": {
					pattern: /.+/,
					alias: "language-java",
					inside: java
				}
			}
		} }
	}],
	"tag": markup.tag,
	"entity": markup.entity
});
//#endregion

//# sourceMappingURL=javadoc.js.map