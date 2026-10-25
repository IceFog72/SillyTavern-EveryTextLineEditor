import { i as doc, t as addListener } from "../core-BIWFpCIO.js";
import { T as voidlessLangs, c as getTokenLanguage, t as addOverlay, w as voidTags } from "../utils--SPWoSa0.js";
import { t as createHoverTooltip } from "../hover-B7bReumq.js";
import { t as testBracket } from "../bracket-CStGDfC7.js";
import { createCopyButton } from "../extensions/copyButton/index.js";
//#region src/client/hover.ts
var sp;
/**
* Utility that makes it easier to add hover descriptions to tokens.
* @param codeBlock Code block to add the functionality to.
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
* @param options Options for configuring the size and position of the tooltip.
*/
var addHoverDescriptions = (codeBlock, callback, options = {}) => {
	const [show, hide, tooltip] = createHoverTooltip(codeBlock, callback, options);
	addListener(tooltip, "pointerleave", hide);
	addListener(codeBlock.wrapper, "pointerover", (e) => {
		const target = e.target;
		if (!tooltip.contains(target)) {
			if (target.matches(".token") && (e.pointerType != "mouse" || !e.buttons) && (options.allowChildren || !target.childElementCount)) show(target);
			else hide();
		}
	});
};
/**
* Highlights bracket pairs when hovered. Clicking on a pair keeps it highlighted.
* Clicking anywhere inside the container removes the highlight.
*
* This will match all brackets under the container together. If there are multiple code
* blocks underneath, then brackets from different code blocks might get matched together.
*
* Note that there should not be any editors inside your container as this can cause
* issues.
*
* @param container Container to add bracket pair highlighting to.
* @param pairs Which characters to match together. The opening character must be followed
* by the corresponding closing character. Defaults to "()[]{}".
*/
var highlightBracketPairsOnHover = (container, pairs = "()[]{}") => {
	highlightPairsOnHover(container, "active-bracket", "punctuation", (token, stack, map) => {
		const text = token.textContent;
		const last = text.length - 1;
		const bracketType = testBracket(text, pairs, last);
		if (bracketType) {
			if (bracketType % 2) stack[sp++] = [token, bracketType + 1];
			else for (let i = sp; i;) {
				let [el, type] = stack[--i];
				if (bracketType == type) {
					map.set(token, el);
					map.set(el, token);
					if (el.nextSibling == token) {
						el.textContent += token.textContent;
						token.textContent = "";
					}
					sp = i;
					i = 0;
				}
			}
		}
	});
};
/**
* Highlights tag pairs when a tag name is hovered. Clicking on a pair keeps it
* highlighted. Clicking anywhere inside the container removes the highlight.
*
* This will match all tags under the container together. If there are multiple code
* blocks underneath, then tags from different code blocks might get matched together.
*
* Note that there should not be any editors inside your container as this can cause
* issues.
*
* @param container Container to add tag pair highlighting to.
*/
var highlightTagPairsOnHover = (container) => {
	const partialTags = [];
	const matchTag = (nameEl, isClosing, lastChild, stack, map) => {
		const noVoidTags = voidlessLangs.has(getTokenLanguage(nameEl));
		const name = nameEl.textContent;
		const tagName = noVoidTags ? name : name.toLowerCase();
		if (!lastChild.textContent[1] && (noVoidTags || !voidTags.test(tagName))) {
			if (isClosing) {
				for (let i = sp, entry; entry = stack[--i];) if (tagName == entry[1]) {
					map.set(nameEl, entry[0]);
					map.set(entry[0], nameEl);
					sp = i;
					break;
				}
			} else stack[sp++] = [nameEl, tagName];
		}
	};
	highlightPairsOnHover(container, "active-tagname", "tag", (token, stack, map) => {
		const children = token.children;
		const text = token.textContent;
		const lastChild = children[children.length - 1];
		const second = children[1];
		const hasClosingPunctuation = lastChild?.matches(".punctuation");
		if (second?.matches(".tag")) {
			if (hasClosingPunctuation) matchTag(second, text[1] == "/", lastChild, stack, map);
			else partialTags.push([second, text[1] == "/"]);
		} else if (hasClosingPunctuation && partialTags[0]) matchTag(...partialTags.pop(), lastChild, stack, map);
	});
};
var highlightPairsOnHover = (container, highlightClass, tokenName, forEachToken) => {
	let cache;
	const active = [[], []];
	const element = container instanceof Node ? container : container.wrapper;
	const toggleHighlight = (index, add) => active[index].forEach((el) => el.classList.toggle(highlightClass, !!add));
	const setCache = () => {
		cache = /* @__PURE__ */ new WeakMap();
		let tokens = element.getElementsByClassName(tokenName);
		let i = sp = 0;
		let stack = [];
		let token;
		while (token = tokens[i++]) forEachToken(token, stack, cache);
	};
	const handler = (e) => {
		const target = e.target.closest("." + tokenName);
		const index = e.type == "click" ? 0 : 1;
		if (active[0].includes(target)) return;
		if (index && (e.pointerType != "mouse" || e.buttons)) return;
		if (!cache) setCache();
		toggleHighlight(index);
		active[index] = [];
		const other = cache.get(target);
		if (other) {
			active[1] = [];
			active[index] = [target, other];
			toggleHighlight(index, true);
		}
	};
	addListener(element, "click", handler);
	addListener(element, "pointerover", handler);
	addListener(element, "pointerleave", () => {
		toggleHighlight(1);
		active[1] = [];
	});
};
//#endregion
//#region src/client/code-block.ts
/** @module code-blocks */
/**
* Runs a callback function for each code block under the root in document order. If a
* callback has previously been run for a code block, it's skipped.
*
* The callback function takes the code block as the first argument. The second parameter
* is any additional properties passed when the code block was created. These options
* were stringified to JSON and parsed.
* @param root Root to search for code blocks under.
* @param callback Function to run for each code block.
* @returns An array with all visited code blocks in document order.
*/
var forEachCodeBlock = (root, callback) => {
	let els = root.getElementsByClassName("prism-code-editor");
	let i = 0;
	let result = [];
	while (i < els.length) {
		const element = els[i++];
		const json = element.dataset.props;
		if (!json) continue;
		const wrapper = element.firstChild;
		const codeBlock = {
			container: element,
			wrapper,
			lines: wrapper.children,
			code: wrapper.textContent.slice(0, -1),
			language: /language-(\S*)/.exec(element.className)[1]
		};
		element.removeAttribute("data-props");
		callback(codeBlock, JSON.parse(json));
		result.push(codeBlock);
	}
	return result;
};
/**
* @param selector Selector used to specify which lines to omit from the resulting code.
* @returns A function that returns the code inside a code block without any lines that
* match the specified selector.
*/
var omitLines = (selector) => (codeBlock) => {
	let result = "";
	let lines = codeBlock.lines;
	let i = 0;
	let line;
	while (line = lines[++i]) if (!line.matches(selector)) result += line.textContent;
	return result.slice(0, -1);
};
/**
* Adds a copy button to a code block. Requires styles from
* `prism-code-editor/copy-button.css`.
*
* By default, the copy button is only shown when the code block is hovered. To always
* show it, change the default opacity with the following CSS:
*
* ```less
* button.pce-copy {
*   opacity: 1; // or a lower value for a semi-transparent button
* }
* ```
* @param codeBlock Code block to add the copy button to.
* @param getCode Function used to get the copied code. Can be used to e.g. omit deleted
* lines.
* @param label `aria-label` for the button. Defaults to `"Copy"`.
* @param copiedLabel Temporary `aria-label` for the button after it has been clicked.
* Defaults to `"Copied!"`.
*/
var addCopyButton = (codeBlock, getCode, label = "Copy", copiedLabel = "Copied!") => {
	const container = createCopyButton();
	const btn = container.firstChild;
	const setLabel = (label) => btn.setAttribute("aria-label", label);
	addListener(btn, "click", () => {
		setLabel(copiedLabel);
		if (!navigator.clipboard?.writeText(getCode ? getCode(codeBlock) : codeBlock.code)) {
			const selection = getSelection();
			const range = new Range();
			selection.removeAllRanges();
			selection.addRange(range);
			range.setStartAfter(codeBlock.lines[0]);
			range.setEndAfter(codeBlock.wrapper);
			doc.execCommand("copy");
			range.collapse();
		}
	});
	addListener(btn, "pointerenter", () => setLabel(label));
	setLabel(label);
	addOverlay(codeBlock, container);
};
//#endregion
export { addCopyButton, addHoverDescriptions, forEachCodeBlock, highlightBracketPairsOnHover, highlightTagPairsOnHover, omitLines };

//# sourceMappingURL=code-block.js.map