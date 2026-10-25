import { a as languages, c as tokenize, u as withoutTokenizer } from "../../core-Dr0o9A-8.js";
import { n as re } from "../../shared-oTKIFAwH.js";
import { n as braces } from "../../jsx-shared-BgBgis07.js";
import { r as xmlComment, t as entity } from "../../xml-shared-ONZRGEwv.js";
import { n as astroTag, t as addInlined } from "../../markup-shared-j1rm_aoA.js";
//#region src/prism/languages/svelte.js
var currentLang;
var expression = { pattern: RegExp(braces, "g") };
var tag = astroTag(expression);
var tagInside = tag.inside;
var blockInside = {
	"punctuation": /^\W|\}$/,
	"keyword": /^\w+|\bthen\b(?!\s*[^\s[{$\w\xa0-\uffff])/
};
var blockLang = { pattern: /[^]+/ };
tagInside["attr-value"].inside["expression"] = expression;
languages.svelte = {
	"comment": xmlComment,
	"script": addInlined("script", tagInside, (code) => {
		return /^[^>]+?[\s"'}]lang\s*=\s*(["']?)ts\b\1/.test(code) ? "ts" : "js";
	}),
	"style": addInlined("style", tagInside, (code) => {
		return /^[^>]+?[\s"'}]lang\s*=\s*(["']?)(less|s[ac]ss|stylus)\b\1/.exec(code)?.[2] || "css";
	}),
	"block": {
		pattern: re("\\{[#@:/]\\w*(?:\\s(?:[^{}]|<0>)*)?\\}", [braces], "g"),
		inside: blockInside
	},
	"tag": tag,
	"expression": expression,
	"entity": entity,
	"punctuation": /[()[\]{}]/,
	[tokenize](code, grammar) {
		var lang = /<script\s(?:[^>]*?[\s"'}])?lang\s*=\s*(["'])ts\1/.test(code) ? "ts" : "js";
		if (lang != currentLang) {
			expression.alias = "language-" + lang;
			delete blockInside["language-" + currentLang];
			blockInside["language-" + lang] = blockLang;
			expression.inside = blockLang.inside = currentLang = lang;
		}
		return withoutTokenizer(code, grammar);
	}
};
//#endregion

//# sourceMappingURL=svelte.js.map