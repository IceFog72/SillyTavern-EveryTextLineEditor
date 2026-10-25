import { T as voidlessLangs, _ as addTextareaListener, n as getClosestToken, w as voidTags } from "../utils--SPWoSa0.js";
//#region src/extensions/matchTags.ts
/**
* Function that adds tag matching to the editor.
* @returns An object containing all tags and pairs.
*/
var createTagMatcher = (editor) => {
	let pairMap = [];
	let code;
	let tags = [];
	let tagIndex;
	let sp;
	let stack = [];
	let matchTags = (tokens, language, value) => {
		code = value;
		tags.length = pairMap.length = tagIndex = sp = 0;
		matchTagsRecursive(tokens, language, 0);
	};
	let matchTagsRecursive = (tokens, language, position) => {
		let noVoidTags = voidlessLangs.has(language);
		let i = 0;
		let l = tokens.length;
		for (; i < l;) {
			const token = tokens[i++];
			const content = token.content;
			const length = token.length;
			if (Array.isArray(content)) {
				if (token.type == "tag" && code[position] == "<") {
					const openLen = content[0].length;
					const name = content[2] ? code.substr(position + openLen, content[1].length) : "";
					const tagName = noVoidTags ? name : name.toLowerCase();
					const notSelfClosing = content[content.length - 1].length < 2 && (noVoidTags || !voidTags.test(tagName));
					if (content[2]) matchTagsRecursive(content, language, position);
					if (notSelfClosing) {
						if (openLen > 1) {
							for (let i = sp; i;) if (tagName == stack[--i][1]) {
								pairMap[pairMap[tagIndex] = stack[sp = i][0]] = tagIndex;
								i = 0;
							}
						} else stack[sp++] = [tagIndex, tagName];
					}
					tags[tagIndex++] = [
						token,
						position,
						position + length,
						tagName,
						openLen > 1,
						notSelfClosing
					];
				} else {
					let lang = token.alias || token.type;
					matchTagsRecursive(content, lang.slice(0, 9) == "language-" ? lang.slice(9) : language, position);
				}
			}
			position += length;
		}
	};
	editor.on("tokenize", matchTags);
	matchTags(editor.tokens, editor.options.language, editor.value);
	return {
		tags,
		pairs: pairMap
	};
};
var getClosestTagIndex = (pos, tags) => {
	for (let i = 0, l = tags.length; i < l; i++) if (tags[i][1] <= pos && tags[i][2] >= pos) return i;
};
/**
* Extension that adds an `active-tagname` class to matching HTML/XML/JSX tags when the
* cursor is on either tag. If the editor doesn't have a {@link TagMatcher}, one is
* created. Use the CSS selector `.active-tagname` to style the elements. Obviously don't
* add this if the languages used don't have tags.
*/
var matchTags = () => (editor) => {
	let openEl, closeEl;
	const { tags, pairs } = editor.extensions.matchTags ||= createTagMatcher(editor);
	const highlight = (remove) => [openEl, closeEl].forEach((el) => {
		el && el.classList.toggle("active-tagname", !remove);
	});
	editor.on("selectionChange", ([start, end]) => {
		let newEl1;
		let newEl2;
		let index;
		if (start == end && editor.focused) {
			index = getClosestTagIndex(start, tags);
			if (index + 1) {
				index = pairs[index];
				if (index + 1 && (newEl1 = getClosestToken(editor, ".tag>.tag"))) newEl2 = getClosestToken(editor, ".tag>.tag", 2, 0, tags[index][1]);
			}
		}
		if (openEl != newEl1) {
			highlight(true);
			openEl = newEl1;
			closeEl = newEl2;
			highlight();
		}
	});
};
/**
* Extension that highlights `<` and `>` punctuation in XML tags.
* @param className Class added to the active punctuation you can use to style them with CSS.
* @param alwaysHighlight If true, the punctuation will always be highlighted when the cursor
* is inside a tag. If not it will only be highlighted when the cursor is on the punctuation.
*/
var highlightTagPunctuation = (className, alwaysHighlight) => (editor) => {
	let openEl, closeEl;
	const { tags } = editor.extensions.matchTags ||= createTagMatcher(editor);
	const getPunctuation = (pos) => getClosestToken(editor, ".tag>.punctuation", 0, 0, pos);
	const highlight = (remove) => [openEl, closeEl].forEach((el) => {
		el && el.classList.toggle(className, !remove);
	});
	const selectionChange = () => {
		let [start, end] = editor.getSelection();
		let newEl1;
		let newEl2;
		if (start == end && editor.focused) {
			let tag = tags[getClosestTagIndex(start, tags)];
			if (tag && (alwaysHighlight || !getClosestToken(editor, ".tag>.tag") && getPunctuation())) {
				newEl1 = getPunctuation(tag[1]);
				newEl2 = getPunctuation(tag[2] - 1);
			}
		}
		if (openEl != newEl1 || closeEl != newEl2) {
			highlight(true);
			openEl = newEl1;
			closeEl = newEl2;
			highlight();
		}
	};
	editor.on("selectionChange", selectionChange);
	addTextareaListener(editor, "focus", selectionChange);
	addTextareaListener(editor, "blur", selectionChange);
};
//#endregion
export { createTagMatcher, highlightTagPunctuation, matchTags };

//# sourceMappingURL=matchTags.js.map