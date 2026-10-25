import { c as numLines, r as createTemplate, s as languageMap, t as addListener } from "../../core-BIWFpCIO.js";
import { C as updateNode, a as getLineBefore, v as getLineEnd } from "../../utils--SPWoSa0.js";
//#region src/extensions/folding/index.ts
/** @module code-folding */
var template = /* @__PURE__ */ createTemplate("<div><div> ");
var template2 = /* @__PURE__ */ createTemplate("<div class=pce-unfold> <span title=Unfold>\xA0\xA0\xA0</span> ");
var isMultiline = (str, start, end) => str.slice(start, end).includes("\n");
/**
* Extension only supporting read-only editors which adds code folding to the editor.
*
* @param providers By default, this extension does not add any foldable ranges and you
* must add folding range providers. This package defines multiple folding range providers
* you can import like {@link bracketFolding}, {@link tagFolding},
* {@link blockCommentFolding}, and {@link markdownFolding}. You can also define your own
* providers.
*
* Very minimal downsides to adding this extension dynamically.
*
* Requires styles from `prism-code-editor/code-folding.css`
*/
var readOnlyCodeFolding = (...providers) => {
	let cEditor;
	let value;
	let code;
	let lines;
	let lineNumberWidth;
	let textarea;
	let foldPositions;
	const foldToggles = [];
	const foldPlaceholders = [];
	const foldedLines = /* @__PURE__ */ new Set();
	const foldedRanges = /* @__PURE__ */ new Set();
	const getPosition = (pos) => {
		let result = pos;
		for (let [start, end] of foldedRanges) if (pos > start) {
			if (pos < end) return -1;
			result -= end - start - 3;
		}
		return result;
	};
	const toggleFold = (line) => {
		const start = foldPositions[line][0];
		const addFold = (line) => {
			let [start, end] = foldPositions[line];
			let expanded;
			for (let range of foldedRanges) if (start <= range[0] && end > range[0]) {
				if (expanded) foldedRanges.delete(range);
				else {
					range[0] = start;
					if (end > range[1]) range[1] = end;
					expanded = true;
				}
			}
			if (!expanded) foldedRanges.add([start, end]);
		};
		if (foldedLines.has(line)) {
			foldedLines.delete(line);
			for (let range of foldedRanges) if (start == range[0]) {
				foldedRanges.delete(range);
				for (let currentLine of foldedLines) if (foldPositions[currentLine][0] > start) addFold(currentLine);
				break;
			}
		} else {
			foldedLines.add(line);
			addFold(line);
		}
	};
	const update = (line) => {
		value = "";
		let pos = 0;
		for (let [start, end] of [...foldedRanges].sort((a, b) => a[0] - b[0])) {
			value += code.slice(pos, start) + "\xA0\xA0\xA0";
			pos = end;
		}
		textarea.value = value += code.slice(pos);
		if (line) textarea.setSelectionRange(pos = getPosition(foldPositions[line][0]), pos);
		cEditor.update();
		cEditor.container.style.setProperty("--number-width", lineNumberWidth);
		updateFolds();
	};
	const updateFolds = () => {
		for (let line = 0, l = foldPositions.length, prev; line < l; line++) {
			if (!foldPositions[line]) continue;
			let pos = getPosition(foldPositions[line][0]);
			if (pos + 1) {
				let parent = lines[numLines(value, 0, pos)];
				let el = foldToggles[line];
				let isClosed = foldedLines.has(line);
				let pos2 = getPosition(foldPositions[line][1]);
				if (!el) {
					el = foldToggles[line] = template();
					addListener(el, "click", () => toggleAndUpdate(line));
				}
				if (parent != el.parentNode && parent != prev) parent.prepend(el);
				prev = parent;
				el.className = `pce-fold${isClosed ? " closed-fold" : ""}`;
				el.title = `${isClosed ? "Unf" : "F"}old line`;
				el = foldPlaceholders[line];
				if (isClosed) {
					if (!el) {
						el = foldPlaceholders[line] = template2();
						addListener(el, "click", () => toggleAndUpdate(line));
					}
					el.style.counterIncrement = `line ${numLines(code, ...foldPositions[line]) - 1}`;
					updateNode(el.firstChild, getLineBefore(value, pos));
					updateNode(el.lastChild, value.slice(pos2, getLineEnd(value, pos2)));
					if (parent != el.parentNode) parent.prepend(el);
				} else el?.remove();
			}
		}
	};
	const toggleAndUpdate = (line) => {
		toggleFold(line);
		update(line);
	};
	const createFolds = () => {
		foldPositions = [];
		foldedRanges.clear();
		foldedLines.clear();
		value = code = cEditor.value;
		lineNumberWidth = (0 | Math.log10(numLines(code))) + 1 + ".001ch";
		const folds = [];
		providers.forEach((clb) => folds.push(...clb(cEditor, folds) || []));
		for (let i = 0, l = folds.length; i < l; i++) {
			const [start, end] = folds[i];
			const index = numLines(value, 0, start);
			if (!foldPositions[index] || end > foldPositions[index][1]) foldPositions[index] = [start, end];
		}
		updateFolds();
	};
	return {
		update(editor, options) {
			if (cEditor != editor) {
				cEditor = editor;
				textarea = editor.textarea;
				editor.extensions.codeFold = this;
				lines = editor.lines;
				if (editor.tokens[0]) createFolds();
			}
			editor.container.style.setProperty("--padding-left", options.lineNumbers == false ? "calc(var(--_pse) + var(--_ns))" : "");
			setTimeout(editor.on("update", createFolds));
		},
		get fullCode() {
			return code;
		},
		toggleFold: (lineNumber, force) => !!foldPositions[lineNumber] && foldedLines.has(lineNumber) != force && !toggleFold(lineNumber),
		updateFolds: () => update()
	};
};
/**
* Folding range provider that adds folding of square, round, and curly brackets.
* Requires a {@link BracketMatcher} added to the editor to work.
*/
var bracketFolding = ({ value, extensions: { matchBrackets } }) => {
	if (matchBrackets) {
		let folds = [];
		let { brackets, pairs } = matchBrackets;
		let i = 0;
		let j;
		let l = pairs.length;
		for (; i < l; i++) if ((j = pairs[i]) > i && isMultiline(value, brackets[i][1], brackets[j][1])) folds.push([brackets[i][2], brackets[j][1]]);
		return folds;
	}
};
/**
* Folding range provider that adds folding of HTML/XML elements.
* Requires a {@link TagMatcher} added to the editor to work.
*/
var tagFolding = ({ value, extensions: { matchTags } }) => {
	if (matchTags) {
		let folds = [];
		let { tags, pairs } = matchTags;
		let i = 0;
		let j;
		let l = pairs.length;
		for (; i < l; i++) if ((j = pairs[i]) > i && isMultiline(value, tags[i][2], tags[j][1])) folds.push([tags[i][2], tags[j][1]]);
		return folds;
	}
};
/**
* Folding range provider that allows folding of block comments. For this to work,
* you need to befine block comments in the {@link languageMap} for the language.
*
* Simply pass this function as one of the arguments when calling {@link readOnlyCodeFolding}.
*/
var blockCommentFolding = ({ tokens, value, options: { language } }) => {
	const folds = [];
	const findBlockComments = (tokens, position, language) => {
		for (let i = 0, l = tokens.length; i < l;) {
			const token = tokens[i++];
			const content = token.content;
			const length = token.length;
			const aliasType = token.alias || token.type;
			if (aliasType == "comment" && isMultiline(value, position, position + length)) {
				let comment = languageMap[language]?.comments?.block;
				if (comment && value.indexOf(comment[0], position) == position) folds.push([position + comment[0].length, position + length - comment[1].length]);
			} else if (Array.isArray(content)) findBlockComments(content, position, aliasType.slice(0, 9) == "language-" ? aliasType.slice(9) : language);
			position += length;
		}
	};
	findBlockComments(tokens, 0, language);
	return folds;
};
/**
* Folding range provider that allows folding of titles and code blocks in markdown.
*
* Simply pass this function as one of the arguments when calling {@link readOnlyCodeFolding}.
*/
var markdownFolding = ({ tokens, value, options: { language } }) => {
	if (language == "markdown" || language == "md") {
		let folds = [];
		let pos = 0;
		let openTitles = [];
		let levels;
		let closeTitles = (level) => {
			for (let end = value.slice(0, pos).trimEnd().length; level <= levels;) folds.push([openTitles[level++], end]);
		};
		let i = 0;
		let l = tokens.length;
		for (; i < l;) {
			const token = tokens[i++];
			const length = token.length;
			const type = token.type;
			if (type == "code" && !token.alias) {
				let content = token.content;
				folds.push([pos + content[0].length + (content[1].content || "").length, pos + length - content[content.length - 1].length - 1]);
			}
			if (type == "title") {
				let [token1, token2] = token.content;
				let level = token1.type ? token1.length - 1 : token2.content[0] == "=" ? 0 : 1;
				closeTitles(level);
				openTitles[levels = level] = pos + (token1.type ? length : token1.length - 1);
			}
			pos += length;
		}
		closeTitles(0);
		return folds;
	}
};
//#endregion
export { blockCommentFolding, bracketFolding, markdownFolding, readOnlyCodeFolding, tagFolding };

//# sourceMappingURL=index.js.map