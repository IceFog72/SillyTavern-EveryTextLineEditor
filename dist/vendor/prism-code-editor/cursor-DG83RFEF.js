import { r as createTemplate } from "./core-BIWFpCIO.js";
import { C as updateNode, S as scrollToEl, _ as addTextareaListener, a as getLineBefore, b as getPosition, t as addOverlay, v as getLineEnd } from "./utils--SPWoSa0.js";
//#region src/extensions/cursor/position.ts
var cursorTemplate = /* @__PURE__ */ createTemplate("<div style=position:absolute;top:0;opacity:0;padding-inline-end:inherit> <span><span></span> ");
/**
* Extension which can be used to calculate the position of the cursor and scroll it into view.
* This is used by the {@link defaultCommands} extension to keep the cursor in view while typing.
*
* The extension can also be accessed from `editor.extensions.cursor` when added.
*/
var cursorPosition = () => {
	let cEditor;
	const cursorContainer = cursorTemplate();
	const [before, span] = cursorContainer.childNodes;
	const [cursor, after] = span.childNodes;
	const update = () => {
		const selection = cEditor.getSelection();
		const value = cEditor.value;
		const activeLine = cEditor.lines[cEditor.activeLine];
		const position = selection[selection[2] < "f" ? 0 : 1];
		updateNode(before, getLineBefore(value, position));
		updateNode(after, value.slice(position, getLineEnd(value, position)) + "\n");
		if (cursorContainer.parentNode != activeLine) activeLine.prepend(cursorContainer);
	};
	const scrollIntoView = () => {
		update();
		scrollToEl(cEditor, cursor);
	};
	const self = (editor) => {
		cEditor = editor;
		editor.extensions.cursor = self;
		addTextareaListener(editor, "input", (e) => {
			if (/history/.test(e.inputType)) scrollIntoView();
		});
	};
	self.getPosition = () => {
		update();
		return getPosition(cEditor, cursor);
	};
	self.scrollIntoView = scrollIntoView;
	self.element = cursor;
	return self;
};
//#endregion
//#region src/extensions/cursor/custom.ts
var template = createTemplate("<div class=pce-cursor>");
/**
* Extension that overrides the browser's default cursor.
*
* Due to a known issue, it's **not recommended** to use this extension with `wordWrap`
* enabled.
*
* Use the `--pce-cursor` CSS variable to change the cursor's color and the `.pce-cursor`
* selector for other styling.
*
* Requires the {@link cursorPosition} extension and styling from
* `prism-code-editor/cursor.css` to work.
*/
var customCursor = () => {
	return (editor) => {
		let cursor = template();
		let textareaStyle = editor.textarea.style;
		let toggle;
		editor.on("selectionChange", () => {
			const pos = editor.extensions.cursor?.getPosition();
			if (pos) {
				textareaStyle.zIndex = textareaStyle.caretColor = "auto";
				cursor.style = `left:${pos.left}px;top:${pos.top}px;height:${pos.height}px;animation-name:pce-blink${toggle = +!toggle}`;
			}
		});
		addTextareaListener(editor, "dragover", () => {
			textareaStyle.caretColor = "";
		});
		addOverlay(editor, cursor);
	};
};
//#endregion
export { cursorPosition as n, customCursor as t };

//# sourceMappingURL=cursor-DG83RFEF.js.map