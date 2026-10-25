import { s as languageMap } from "./core-BIWFpCIO.js";
import { a as getLineBefore, n as getClosestToken, w as voidTags } from "./utils--SPWoSa0.js";
import { n as re } from "./shared-oTKIFAwH.js";
import { n as braces } from "./jsx-shared-BgBgis07.js";
//#region src/languages/shared/index.ts
var clikeIndent = /[([{][^)\]}]*$|^[^.]*\b(?:case .+?|default):\s*$/;
var isBracketPair = /\[]|\(\)|{}/;
var xmlOpeningTag = /<(?![\d?!#@])([^\s/=>$<%]+)(?:\s(?:\s*[^\s/"'=>]+(?:\s*=\s*(?!\s)(?:"[^"]*"|'[^']*'|[^\s"'=>]+(?=[\s>]))?|(?=[\s/>])))+)?\s*>[ 	]*$/;
var xmlClosingTag = /^<\/(?!\d)[^\s/=>$<%]+\s*>/;
var openBracket = /[([{][^)\]}]*$/;
var astroOpeningTag = /* @__PURE__ */ re("<(?:(?![\\d!])([^\\s%=<>/]+)(?:\\s(?:\\s*(?:[^\\s{=<>/]+(?:\\s*=\\s*(?!\\s)(?:\"[^\"]*\"|'[^']*'|[^\\s{=<>/\"']+(?=[\\s/>])|<0>)?|(?=[\\s/>]))|<0>))*)?\\s*)?>[ 	]*$", [braces]);
var testBracketPair = ([start, end], value) => {
	return isBracketPair.test(value[start - 1] + value[end]);
};
var clikeComment = {
	line: "//",
	block: ["/*", "*/"]
};
var isOpen = (match, voidTags) => !!match && !voidTags?.test(match[1]);
var htmlAutoIndent = (tagPattern, voidTags) => [([start], value) => isOpen(value.slice(0, start).match(tagPattern), voidTags) || openBracket.test(getLineBefore(value, start)), (selection, value) => testBracketPair(selection, value) || isOpen(value.slice(0, selection[0]).match(tagPattern), voidTags) && xmlClosingTag.test(value.slice(selection[1]))];
var markupComment = { block: ["<!--", "-->"] };
var markupLanguage = (comment = markupComment, tagPattern = xmlOpeningTag, voidTags) => ({
	comments: comment,
	autoIndent: htmlAutoIndent(tagPattern, voidTags),
	autoCloseTags: ([start, end], value, editor) => {
		return autoCloseTags(editor, start, end, value, tagPattern, voidTags);
	}
});
var autoCloseTags = (editor, start, end, value, tagPattern, voidTags) => {
	if (start == end) {
		let match = tagPattern.exec(value.slice(0, start) + ">");
		let tagMatcher = editor.extensions.matchTags;
		if (match && (match = match[1] || "", !voidTags?.test(match))) {
			if (tagMatcher) {
				let { pairs, tags } = tagMatcher;
				for (let i = tags.length; i;) {
					let tag = tags[--i];
					if (tag[1] >= start && tag[4] && tag[5] && tag[3] == match && pairs[i] == null) return;
				}
			}
			return `</${match}>`;
		}
	}
};
var bracketIndenting = (comments = clikeComment, indentPattern = openBracket) => ({
	comments,
	autoIndent: [([start], value) => indentPattern.test(getLineBefore(value, start)), testBracketPair]
});
var markupTemplateLang = (name, comments) => languageMap[name] = {
	comments,
	autoIndent: htmlAutoIndent(xmlOpeningTag, voidTags),
	autoCloseTags: ([start, end], value, editor) => {
		return getClosestToken(editor, "." + name, 0, 0, start) ? "" : autoCloseTags(editor, start, end, value, xmlOpeningTag, voidTags);
	}
};
//#endregion
export { clikeIndent as a, markupLanguage as c, xmlOpeningTag as d, clikeComment as i, markupTemplateLang as l, autoCloseTags as n, htmlAutoIndent as o, bracketIndenting as r, markupComment as s, astroOpeningTag as t, testBracketPair as u };

//# sourceMappingURL=shared-DXMiLwjC.js.map