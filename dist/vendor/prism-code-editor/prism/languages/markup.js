import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, n as clone } from "../../language-CXbc22uF.js";
import "./xml.js";
//#region src/prism/languages/markup.js
var addLang = (grammar, lang) => {
	grammar["language-" + lang] = {
		pattern: /[^]+/,
		inside: lang
	};
	return grammar;
};
var addInlined = (tagName, lang) => ({
	pattern: RegExp(`(<${tagName}[^>]*>)(?!</${tagName}>)(?:<!\\[CDATA\\[(?:[^\\]]|\\](?!\\]>))*\\]\\]>|(?!<!\\[CDATA\\[)[^])+?(?=</${tagName}>)`, "gi"),
	lookbehind: true,
	inside: addLang({ "included-cdata": {
		pattern: /<!\[CDATA\[[^]*?\]\]>/i,
		inside: addLang({ "cdata": /^<!\[CDATA\[|\]\]>$/i }, lang)
	} }, lang)
});
var addAttribute = (attrName, lang, alias = attrName) => ({
	pattern: RegExp(`([\\s"']${attrName}\\s*=\\s*)(?:"[^"]*"|'[^']*'|[^\\s>]+)`, "gi"),
	lookbehind: true,
	alias,
	inside: addLang({ "punctuation": /^["']|["']$/g }, lang)
});
var markup = languages.svg = languages.mathml = languages.html = languages.markup = clone(languages.xml);
markup.tag.inside["attr-value"].unshift(addAttribute("style", "css"), addAttribute("on[a-z]+", "javascript", "script"));
insertBefore(markup, "cdata", {
	"style": addInlined("style", "css"),
	"script": addInlined("script", "javascript")
});
//#endregion

//# sourceMappingURL=markup.js.map