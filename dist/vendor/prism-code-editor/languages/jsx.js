import { s as languageMap } from "../core-BIWFpCIO.js";
import { a as getLineBefore, n as getClosestToken } from "../utils--SPWoSa0.js";
import { n as re } from "../shared-oTKIFAwH.js";
import { n as braces, r as space } from "../jsx-shared-BgBgis07.js";
import { a as clikeIndent, i as clikeComment, n as autoCloseTags, u as testBracketPair } from "../shared-DXMiLwjC.js";
//#region src/languages/jsx.ts
var openingTag = re("(?:^|[^\\w$])<(?:(?!\\d)([^\\s%=<>/]+)(?:(?:<0>|<0>*<(?:[^<>=]|=[^<]|=?<(?:[^<>]|<[^<>]*>)*>)*>)(?:<0>*(?:[^\\s\"'{=<>/*]+(?:<0>*=<0>*(?!\\s)(?:\"[^\"]*\"|'[^']*'|<1>)?|(?=[\\s/>]))|<1>))*)?<0>*)?>[ 	]*$", [space, braces]);
var closingTag = /^<\/(?!\d)[^\s%=<>/]*\s*>/;
var inJsxContext = ({ tags, pairs }, { brackets, pairs: bracketPairs }, position) => {
	for (let i = tags.length, tag, min = 0; tag = tags[--i];) if (tag[2] > position && tag[1] < position) min = tag[1];
	else if (!tag[4] && tag[5] && tag[1] >= min && tag[2] <= position && !(tags[pairs[i]]?.[1] < position)) {
		for (let i = brackets.length, bracket; bracket = brackets[--i];) if (bracket[1] >= tag[2] && bracket[1] < position && bracket[4] == "{" && !(brackets[bracketPairs[i]]?.[1] < position)) return;
		return true;
	}
};
var jsxComment = { block: ["{/*", "*/}"] };
languageMap.jsx = languageMap.tsx = {
	comments: clikeComment,
	getComments(editor, position) {
		const { matchBrackets, matchTags } = editor.extensions;
		return (matchBrackets && matchTags ? inJsxContext(matchTags, matchBrackets, position) : getClosestToken(editor, ".plain-text", 0, 0, position)) ? jsxComment : clikeComment;
	},
	autoIndent: [([start], value) => openingTag.test(value.slice(0, start)) || clikeIndent.test(getLineBefore(value, start)), (selection, value) => testBracketPair(selection, value) || openingTag.test(value.slice(0, selection[0])) && closingTag.test(value.slice(selection[1]))],
	autoCloseTags: ([start, end], value, editor) => {
		return autoCloseTags(editor, start, end, value, openingTag);
	}
};
//#endregion

//# sourceMappingURL=jsx.js.map