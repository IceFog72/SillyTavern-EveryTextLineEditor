import { i as doc, r as createTemplate } from "../core-BIWFpCIO.js";
//#region src/extensions/guides.ts
/** @module guides */
var template = /* @__PURE__ */ createTemplate("<div class=guide-indents>	");
/**
* Extension adding indent guides to an editor. Does not work with word wrap.
* Requires styles from `prism-code-editor/guides.css`
*/
var indentGuides = () => {
	let tabSize;
	let prevLength = 0;
	let lineIndentMap;
	let active;
	let currentEditor;
	let lines = [];
	let indents = [];
	let container;
	let update = (code) => {
		lineIndentMap = [];
		const newIndents = getIndentGuides(code, tabSize);
		const l = newIndents.length;
		for (let i = 0, prev = [], next = newIndents[0]; next; i++) {
			const style = (lines[i] ||= doc.createElement("div")).style;
			const [top, left, height] = next;
			const old = indents[i];
			next = newIndents[i + 1];
			if (top != old?.[0]) style.top = top + "00%";
			if (left != old?.[1]) style.left = left + "00%";
			if (height != old?.[2]) style.height = height + "00%";
			const isSingleIndent = prev[0] != top && next?.[0] != top, isSingleOutdent = prev[0] + prev[1] != top + height && next?.[0] + next?.[1] != top + height;
			for (let j = -isSingleIndent, l = height + isSingleOutdent; j < l; j++) lineIndentMap[j + top] = i;
			prev = indents[i] = newIndents[i];
		}
		for (let i = l; i < prevLength;) lines[i++].remove();
		container.append(...lines.slice(prevLength, prevLength = l));
	};
	let updateActive = () => {
		const newActive = lines[lineIndentMap[currentEditor.activeLine - 1]];
		if (newActive != active) {
			if (active) active.className = "";
			if (newActive) newActive.className = "active-indent";
			active = newActive;
		}
	};
	return { update(editor, options) {
		if (currentEditor != editor) {
			currentEditor = editor;
			let overlays = editor.lines[0];
			if (container = overlays.querySelector(".guide-indents")) {
				lines.push(...container.children);
				active = lines.find((line) => line.className);
			} else overlays.append(container = template());
			editor.on("update", update);
			editor.on("selectionChange", updateActive);
		}
		container.style.display = options.wordWrap ? "none" : "";
		if (tabSize != (tabSize = options.tabSize || 2)) {
			update(editor.value);
			updateActive();
		}
	} };
};
/**
* Calculates the position and height of indentation guides for a string of code.
* @param code Code you want to calculate indentation lines for.
* @param tabSize Number of spaces a tab is equal to.
* @returns An array of indentation guides.
* Each guide is a tuple containing 3 numbers with the following values:
* - The starting line of the guide.
* - How many tabs the guide is offset to the right.
* - How many lines tall the guide is.
*/
var getIndentGuides = (code, tabSize) => {
	const lines = code.split("\n");
	const l = lines.length;
	const stack = [];
	const results = [];
	for (let prevIndent = 0, emptyPos = -1, i = 0, p = 0;; i++) {
		let last = i == l;
		let line = lines[i];
		let pos = last ? 0 : line.search(/\S/);
		let indent = 0;
		let j = 0;
		if (pos < 0) {
			if (emptyPos < 0) emptyPos = i;
		} else {
			for (; j < pos;) indent += line[j++] == "	" ? tabSize - indent % tabSize : 1;
			if (indent) indent = Math.ceil(indent / tabSize);
			for (j = indent; j < prevIndent; j++) stack[j][2] = (emptyPos < 0 || j == indent && !last ? i : emptyPos) - stack[j][0];
			for (j = prevIndent; j < indent;) results[p++] = stack[j] = [
				emptyPos < 0 || j > prevIndent ? i : emptyPos,
				j++,
				0
			];
			emptyPos = -1;
			prevIndent = indent;
		}
		if (last) break;
	}
	return results;
};
//#endregion
export { getIndentGuides, indentGuides };

//# sourceMappingURL=guides.js.map