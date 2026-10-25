import { a as languages, c as tokenize, u as withoutTokenizer } from "../../core-Dr0o9A-8.js";
import { n as clone } from "../../language-CXbc22uF.js";
import { n as tag, r as xmlComment, t as entity } from "../../xml-shared-ONZRGEwv.js";
import { t as addInlined } from "../../markup-shared-j1rm_aoA.js";
//#region src/prism/languages/vue.js
var vueTag = clone(tag);
var tagInside = vueTag.inside;
var currentLang;
var expression = {
	pattern: /(\{\{)[^]+?(?=\}\})/g,
	lookbehind: true
};
var attrLang = { pattern: /[^]+/ };
var attrInside = { "punctuation": /^["']|["']$/g };
tagInside["attr-value"].unshift({
	pattern: /([\s"'](?::|@|v-)[^\s/=>]+\s*=\s*)(?:"[^"]*"|'[^']*'|[^\s>]+)/g,
	lookbehind: true,
	alias: "script",
	inside: attrInside
}, {
	pattern: /([\s"']style\s*=\s*)(?:"[^"]*"|'[^']*'|[^\s>]+)/g,
	lookbehind: true,
	alias: "style",
	inside: {
		"punctuation": /^["']|["']$/g,
		"language-css": {
			pattern: /[^]+/,
			inside: "css"
		}
	}
});
tagInside["attr-name"].inside = { "punctuation": /[[\].:@#]/ };
tagInside["tag"].inside["class-name"] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/;
languages.vue = {
	"comment": xmlComment,
	"script": addInlined("script", tagInside, (code) => {
		return /^[^>]+?[\s"']lang\s*=\s*(["']?)([jt]sx?)\b\1/.exec(code)?.[2] || "js";
	}),
	"style": addInlined("style", tagInside, (code) => {
		return /^[^>]+?[\s"']lang\s*=\s*(["']?)(less|s[ac]ss|stylus)\b\1/.exec(code)?.[2] || "css";
	}),
	"expression": expression,
	"tag": vueTag,
	"entity": entity,
	"punctuation": /\{\{|\}\}|[()[\]{}]/,
	[tokenize](code, grammar) {
		var lang = /<script\s(?:[^>]*?[\s"'])?lang\s*=\s*(["']?)([jt]s)x?\b\1/.exec(code)?.[2] || "js";
		if (lang != currentLang) {
			expression.alias = "language-" + lang;
			delete attrInside["language-" + currentLang];
			attrInside["language-" + lang] = attrLang;
			expression.inside = attrLang.inside = currentLang = lang;
		}
		return withoutTokenizer(code, grammar);
	}
};
//#endregion

//# sourceMappingURL=vue.js.map