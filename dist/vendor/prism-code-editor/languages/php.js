import { s as languageMap } from "../core-BIWFpCIO.js";
import { n as getClosestToken, w as voidTags } from "../utils--SPWoSa0.js";
import { d as xmlOpeningTag, i as clikeComment, n as autoCloseTags, o as htmlAutoIndent, s as markupComment } from "../shared-DXMiLwjC.js";
//#region src/languages/php.ts
languageMap.php = {
	comments: clikeComment,
	getComments: (editor, position) => {
		if (getClosestToken(editor, ".php", 0, 0, position)) return clikeComment;
		return markupComment;
	},
	autoIndent: htmlAutoIndent(xmlOpeningTag, voidTags),
	autoCloseTags: ([start, end], value, editor) => {
		return !value.includes("<?") || getClosestToken(editor, ".php", 0, 0, start) ? "" : autoCloseTags(editor, start, end, value, xmlOpeningTag, voidTags);
	}
};
//#endregion

//# sourceMappingURL=php.js.map