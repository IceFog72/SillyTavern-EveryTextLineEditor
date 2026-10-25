import { t as addListener } from "../core-BIWFpCIO.js";
import { _ as addTextareaListener } from "../utils--SPWoSa0.js";
import { t as createHoverTooltip } from "../hover-B7bReumq.js";
//#region src/extensions/hover.ts
/**
* The editor lines have `pointer-events: none` which means that all pointer and mouse
* events are captured by the `textarea` element itself. This utlity can be used to add
* a subset of pointer and mouse listeners that will be called with the token the pointer
* is on. If the pointer isn't on a token, then the line itself will be passed to the
* listener.
*
* @param editor Editor to add the listener to.
* @param type Event to listen to.
* @param listener Listener called with the event and target token.
* @param lineFilter If a line won't have any tokens the listener is interested in, then
* this filter can return false to skip computing the target token at the cursor's
* position for a performance boost. If ommitted, the listener will be called for all
* lines.
* @returns Cleanup function to remove the listener.
*/
var addPointerListener = (editor, type, listener, lineFilter) => {
	let listeners = listenerMap.get(editor);
	if (!listeners) listenerMap.set(editor, listeners = {});
	const [handlers, cleanUp] = listeners[type] ||= [/* @__PURE__ */ new Set(), addTextareaListener(editor, type, (e) => {
		let layerY = e.layerY;
		let lines = editor.lines;
		let target;
		let targetComputed;
		for (let i = lines.length; i > 1;) {
			const line = lines[--i];
			if (line.offsetTop <= layerY) {
				for (const [listener, lineFilter] of handlers) if (!lineFilter || lineFilter(line, i, e)) {
					if (!targetComputed) {
						targetComputed = true;
						line.style.pointerEvents = "auto";
						target = line.getRootNode().elementsFromPoint(e.clientX, e.clientY).find((el) => el.matches(".token,.pce-line"));
						line.style.pointerEvents = "";
					}
					if (target) listener(e, target);
				}
				break;
			}
		}
	})];
	const entry = [listener, lineFilter];
	handlers.add(entry);
	return () => {
		handlers.delete(entry);
		if (!handlers.size) {
			cleanUp();
			delete listeners[type];
		}
	};
};
/**
* Utility that makes it easier to add hover descriptions to tokens.
* @param callback Function called when a token with only textual children is hovered.
*
* The function gets called with the following arguments:
* - `types`: Array with the token's type as the first element, followed by any alises.
* - `language`: The language at the token's position.
* - `text`: The `textContent` of the token.
* - `element`: The `<span>` element of the hovered token.
*
* Lastly, the function should return an array of children that get added to the tooltip.
* If `null` or `undefined` is returned, no tooltip is shown for the token.
* @param options Options for configuring the size and position of the tooltip and the
* line filter for better performance.
*/
var editorHoverDescriptions = (callback, options = {}) => {
	return (editor) => {
		const [show, hide, tooltip] = createHoverTooltip(editor, callback, options);
		const handler = (e, target) => {
			if (target.matches(".token") && (e.pointerType != "mouse" || !e.buttons) && (options.allowChildren || !target.childElementCount)) show(target);
			else hide();
		};
		addListener(editor.textarea, "mouseleave", (e) => {
			if (!tooltip.contains(e.relatedTarget)) hide();
		});
		addPointerListener(editor, "pointermove", handler, options.filter);
		addPointerListener(editor, "pointerdown", handler, options.filter);
		editor.on("selectionChange", hide);
	};
};
var listenerMap = /* @__PURE__ */ new WeakMap();
//#endregion
export { addPointerListener, editorHoverDescriptions };

//# sourceMappingURL=hover.js.map