import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore } from "../../language-CXbc22uF.js";
import "./markup.js";
//#region src/prism/languages/xml-doc.js
/**
* If the given language is present, it will insert the given doc comment grammar token into it.
*
* @param {string} lang
* @param {any} docComment
*/
var insertDocComment = (lang, docComment) => {
	if (languages[lang]) insertBefore(languages[lang], "comment", { "doc-comment": docComment });
};
var tag = languages.markup.tag;
var slashDocComment = {
	pattern: /\/\/\/.*/g,
	alias: "comment",
	inside: { "tag": tag }
};
var tickDocComment = {
	pattern: /'''.*/g,
	alias: "comment",
	inside: { "tag": tag }
};
insertDocComment("csharp", slashDocComment);
insertDocComment("fsharp", slashDocComment);
insertDocComment("vbnet", tickDocComment);
//#endregion

//# sourceMappingURL=xml-doc.js.map