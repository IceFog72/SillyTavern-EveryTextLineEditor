import { a as languages } from "../../core-Dr0o9A-8.js";
import { n as braces } from "../../jsx-shared-BgBgis07.js";
import { r as xmlComment, t as entity } from "../../xml-shared-ONZRGEwv.js";
import { n as astroTag, t as addInlined } from "../../markup-shared-j1rm_aoA.js";
//#region src/prism/languages/astro.js
var expression = {
	pattern: RegExp(braces, "g"),
	alias: "language-tsx",
	inside: "tsx"
};
var tag = astroTag(expression);
var tagInside = tag.inside;
languages.astro = {
	"comment": xmlComment,
	"front-matter-block": {
		pattern: /^---(?!.)[^]*?\n---/g,
		inside: {
			"punctuation": /^---|---$/,
			"language-typescript": {
				pattern: /[^]+/,
				inside: "ts"
			}
		}
	},
	"script": addInlined("script", tagInside, (code) => {
		return /^[^>]+?[\s"'}]is:inline\b/.test(code) ? "javascript" : "typescript";
	}),
	"style": addInlined("style", tagInside, (code) => {
		return /^[^>]+?[\s"'}]lang\s*=\s*(["']?)(less|s[ac]ss|stylus)\b\1/.exec(code)?.[2] || "css";
	}),
	"expression": expression,
	"tag": tag,
	"entity": entity
};
//#endregion

//# sourceMappingURL=astro.js.map