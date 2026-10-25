import { a as languages, r as highlightText } from "./core-Dr0o9A-8.js";
import { l as preventDefault, r as createTemplate, t as addListener } from "./core-BIWFpCIO.js";
import { C as updateNode, a as getLineBefore, f as isMac, g as setSelection, i as getLanguage, m as prevSelection, s as getModifierCode, t as addOverlay, u as insertText, x as getStyleValue } from "./utils--SPWoSa0.js";
import { n as matchTemplate, r as searchTemplate } from "./search-CGcHFW7r.js";
import { addTooltip } from "./tooltips.js";
//#region src/extensions/autocomplete/utils.ts
var optionsFromKeys = (obj, icon) => Object.keys(obj).map((tag) => ({
	label: tag,
	icon
}));
var updateMatched = (container, matched, text) => {
	let nodes = container.childNodes;
	let nodeCount = nodes.length - 1;
	let pos = 0;
	let i = 0;
	let l = matched.length;
	for (; i < l;) {
		if (i >= nodeCount) nodes[i].before("", matchTemplate());
		updateNode(nodes[i], text.slice(pos, pos = matched[i++]));
		updateNode(nodes[i].firstChild, text.slice(pos, pos = matched[i++]));
	}
	for (; nodeCount > i;) nodes[--nodeCount].remove();
	updateNode(nodes[l], text.slice(pos));
};
/**
* Completion source that returns a list of options if `path` property of the context
* is present and only contains a single string.
* @param options Options to complete.
*/
var completeFromList = (options) => {
	return ({ path, explicit, pos }) => {
		if (path?.length == 1 && (path[0] || explicit)) return {
			from: pos - path[0].length,
			options
		};
	};
};
/**
* Utility that searches the editor's {@link TokenStream} for strings. This utility will
* only search parts of the document whose language has the same completion definition
* registered.
* @param context Current completion context.
* @param editor Editor to search in.
* @param filter Function used to filter tokens you want to search in. It's called with
* the type of the token and its starting position. If the filter returns true, the token
* will be searched.
* @param pattern Pattern used to search for words. Must have the `g` flag.
* @param init Words that should be completed even if they're not found in the document.
* @param tokensOnly If `true` only the text of tokens whose `content` is a string will
* be searched. If `false`, any string inside the {@link TokenStream} can be searched.
* @returns A set with found identifers/words.
*/
var findWords = (context, editor, filter, pattern, init, tokensOnly) => {
	const cursorPos = context.pos;
	const definition = map[context.language];
	const result = new Set(init);
	const search = (tokens, pos, isCorrectLang) => {
		let i = 0;
		let token;
		for (; token = tokens[i++];) {
			if (typeof token == "string") {
				if (!tokensOnly && isCorrectLang) match(token, pos);
			} else {
				const type = token.type;
				const content = token.content;
				const aliasType = token.alias || type;
				if (Array.isArray(content)) {
					if (!isCorrectLang || filter(type, pos)) search(content, pos, aliasType.slice(0, 9) == "language-" ? definition == map[aliasType.slice(9)] : isCorrectLang);
				} else if (isCorrectLang && filter(type, pos)) match(content, pos);
			}
			pos += token.length;
		}
	};
	const match = (token, pos) => {
		let match;
		while (match = pattern.exec(token)) {
			let start = pos + match.index;
			let str = match[0];
			if (start > cursorPos || start + str.length < cursorPos) result.add(str);
		}
	};
	search(editor.tokens, 0, definition == map[editor.options.language]);
	return result;
};
var attrSnippet = (name, quotes, icon, boost) => ({
	label: name,
	icon,
	insert: name + "=" + quotes,
	tabStops: [
		name.length + 2,
		name.length + 2,
		name.length + 3
	],
	boost
});
var completionsFromRecords = (records, icon) => {
	const names = /* @__PURE__ */ new Set();
	records.forEach((tags) => {
		for (let key in tags) names.add(key);
	});
	return Array.from(names, (name) => ({
		label: name,
		icon
	}));
};
var createPre = /* @__PURE__ */ createTemplate("<pre>");
/**
* @param snippet String of code to highlight.
* @param language Language to highlight the snippet with.
* @param className Additional classes to add to the `<pre>` element.
* @returns `<pre><code>` element with the snippet highlighted using the specified
* language.
*/
var renderSnippet = (snippet, language, className) => {
	const pre = createPre();
	pre.innerHTML = `<code>${highlightText(snippet, languages[language] || {})}</code>`;
	pre.className = `language-${language}${className ? " " + className : ""}`;
	return pre;
};
//#endregion
//#region src/extensions/autocomplete/tooltip.ts
var count = 0;
var template = /* @__PURE__ */ createTemplate("<div class=\"pce-ac-wrapper pce-ac-top\"><div class=pce-ac-tooltip><ul role=listbox></ul></div><div class=pce-ac-docs tabindex=-1><button class=pce-ac-close tabindex=-1 title=Close></button><button class=pce-ac-toggle tabindex=-1 title=\"Read More\"></button><div class=pce-ac-content>");
var rowTemplate = /* @__PURE__ */ createTemplate("<li class=pce-ac-row role=option><div></div><div class=pce-ac-label> </div><div class=pce-ac-details><span> ");
var map = {};
/**
* Registers completion sources for a set of languages.
* If any of the languages already have completion sources, they're overridden.
* @param langs Array of languages you want the completions to apply for.
* @param definition Defines the completion sources for the languages along with additional
* properties on the context passed to the completion sources.
*/
var registerCompletions = (langs, definition) => {
	langs.forEach((lang) => map[lang] = definition);
};
/**
* Extension adding basic autocomplete to an editor. For autocompletion to work, you need to
* {@link registerCompletions} for specific languages.
*
* @param config Object used to configure the extension. The `filter` property is required.
*
* Requires the {@link cursorPosition} extension to work.
*
* Requires styling from `prism-code-editor/autocomplete.css` in addition to a stylesheet
* for icons. `prism-code-editor/autocomplete-icons.css` adds some icons from VSCode, but
* you can use your own icons instead.
*
* @see {@link Completion.icon} for how to style your own icons.
*
* ## Keyboard shortcuts
*
* Here, `Mod` refers to `Cmd` on Mac and `Ctrl` otherwise.
*
* - `Ctrl` + `Space`: Trigger suggestion
* - `Mod` + `I`: Trigger suggestion
* - `Alt` + `Escape`: Trigger suggestion (Mac only)
* - `Ctrl` + `Space`: Toggle suggestion documentation
* - `Mod` + `I`: Toggle suggestion documentation
* - `Tab`: Insert completion
* - `Enter`: Insert completion
* - `Escape`: Close completion widget
* - `Escape`: Clear tab stops
* - `Tab`: Select next tab stop
* - `Shift` + `Tab`: Select previous tab stop
* - `ArrowUp`: Select previous suggestion
* - `ArrowDown`: Select next suggestion
* - `PageUp`: Select first visible suggestion
* - `PageDown`: Select last visible suggestion
*/
var autoComplete = (config) => {
	const self = (editor, options) => {
		let isOpen;
		let isTyping;
		let currentOptions;
		let numOptions;
		let activeIndex;
		let active;
		let pos;
		let offset;
		let rowHeight;
		let stops;
		let activeStop;
		let currentSelection;
		let prevLength;
		let isDeleteForwards;
		let tooltipPlacement;
		let docsOption;
		let docsEnabled;
		let context;
		let prevStart;
		let prevEnd;
		const windowSize = 13;
		const container = editor.container;
		const textarea = editor.textarea;
		const getSelection = editor.getSelection;
		const wrapper = template();
		const tabStopsContainer = searchTemplate();
		const [show, _hide] = addTooltip(editor, wrapper);
		const [tooltip, docsWrapper] = wrapper.children;
		const [docsClose, docsToggle, docs] = docsWrapper.children;
		const list = tooltip.firstChild;
		const id = list.id = "pce-ac-" + count++;
		const rows = list.children;
		const prevIcons = [];
		const hide = () => {
			if (isOpen) {
				_hide();
				textarea.removeAttribute("aria-controls");
				textarea.removeAttribute("aria-haspopup");
				textarea.removeAttribute("aria-activedescendant");
				if (docsEnabled) docsWrapper.remove();
				isOpen = false;
			}
		};
		const setRowHeight = () => {
			rowHeight = getStyleValue(rows[0], "height");
		};
		const updateRow = (index) => {
			const option = currentOptions[index + offset];
			const [iconEl, labelEl, detailsEl] = rows[index].children;
			const completion = option[4];
			const icon = completion.icon || "variable";
			updateMatched(labelEl, option[1], completion.label);
			updateNode(detailsEl.firstChild.firstChild, completion.detail || "");
			if (prevIcons[index] != icon) {
				iconEl.className = `pce-ac-icon pce-ac-icon-${prevIcons[index] = icon}`;
				iconEl.style.color = `var(--pce-ac-icon-${icon})`;
			}
			rows[index].setAttribute("aria-posinset", index + offset);
		};
		const scrollActiveIntoView = () => {
			setRowHeight();
			const scrollTop = tooltip.scrollTop;
			const lower = rowHeight * activeIndex;
			const upper = rowHeight * (activeIndex + 1) - tooltip.clientHeight;
			tooltip.scrollTop = scrollTop > lower ? lower : scrollTop < upper ? upper : scrollTop;
			updateOffset();
			updateActive();
		};
		const updateActive = () => {
			const oldActive = active;
			active = rows[activeIndex - offset];
			oldActive?.removeAttribute("aria-selected");
			oldActive?.removeAttribute("aria-describedby");
			docsToggle.remove();
			if (active) {
				textarea.setAttribute("aria-activedescendant", active.id);
				active.setAttribute("aria-selected", true);
				if (currentOptions[activeIndex][4].renderDocs) {
					active.append(docsToggle);
					docsEnabled = !docsEnabled;
					toggleDocs();
				} else docsWrapper.remove();
			} else if (oldActive) textarea.removeAttribute("aria-activedescendant");
		};
		const move = (decrement) => {
			if (decrement) activeIndex = activeIndex ? activeIndex - 1 : numOptions - 1;
			else activeIndex = activeIndex + 1 < numOptions ? activeIndex + 1 : 0;
			scrollActiveIntoView();
		};
		const updateOffset = () => {
			const newOffset = Math.min(Math.floor(tooltip.scrollTop / rowHeight), numOptions - windowSize);
			if (newOffset == offset || newOffset < 0) return true;
			offset = newOffset;
			for (let i = 0; i < windowSize;) updateRow(i++);
			list.style.paddingTop = offset * rowHeight + "px";
		};
		const insertOption = (index) => insertCompletion(currentOptions[index][4], currentOptions[index][2], currentOptions[index][3]);
		const insertCompletion = self.insertCompletion = (completion, start, end = start) => {
			if (options.readOnly) return;
			let { label, tabStops = [], insert } = completion;
			let l = tabStops.length;
			tabStops = tabStops.map((stop) => stop + start);
			if (insert) {
				let indent = "\n" + getLineBefore(editor.value, pos).match(/\s*/)[0];
				let tab = options.insertSpaces == false ? "	" : " ".repeat(options.tabSize || 2);
				let temp = tabStops.slice();
				insert = insert.replace(/\n|	/g, (match, index) => {
					let replacement = match == "	" ? tab : indent;
					let diff = replacement.length - 1;
					let i = 0;
					while (i < l) {
						if (temp[i] > index + start) tabStops[i] += diff;
						i++;
					}
					return replacement;
				});
			} else insert = label;
			if (l % 2) tabStops[l] = tabStops[l - 1];
			insertText(editor, insert, start, end, tabStops[0], tabStops[1]);
			if (l > 2) {
				if (!stops) addOverlay(editor, tabStopsContainer);
				stops = tabStops;
				activeStop = 0;
				prevLength = editor.value.length;
				updateStops();
				currentSelection = getSelection();
				scrollTabStop();
			} else editor.extensions.cursor?.scrollIntoView();
		};
		const scrollTabStop = () => {
			tabStopsContainer.children[activeStop / 2].scrollIntoView({ block: "nearest" });
		};
		const moveActiveStop = (offset) => {
			activeStop += offset;
			setSelection(editor, stops[activeStop], stops[activeStop + 1]);
			scrollTabStop();
		};
		const clearStops = () => {
			tabStopsContainer.remove();
			stops = null;
		};
		const updateStops = () => {
			let sorted = [];
			let i = 0;
			for (; i < stops.length;) sorted[i / 2] = [stops[i++], stops[i++]];
			sorted.sort((a, b) => a[0] - b[0]);
			updateMatched(tabStopsContainer, sorted.flat(), editor.value);
		};
		const getDocsPosition = () => {
			const width = container.clientWidth;
			const scroll = Math.abs(container.scrollLeft);
			const pos = editor.extensions.cursor.getPosition();
			const offset = options.rtl ? pos.right : pos.left;
			const fontSize = getStyleValue(container, "fontSize");
			if (width >= 46 * fontSize) {
				if (offset + 45.5 * fontSize < scroll + width) return tooltipPlacement + "-end";
				if (offset - 20.5 * fontSize > scroll) return tooltipPlacement + "-start";
			}
			return tooltipPlacement;
		};
		const setDocsPosition = () => {
			wrapper.className = `pce-ac-wrapper pce-ac-${getDocsPosition()}`;
		};
		const showDocs = () => {
			const option = currentOptions[activeIndex][4];
			if (option.renderDocs) {
				if (!docsWrapper.parentNode) wrapper.append(docsWrapper);
				if (docsOption != option) {
					docsOption = option;
					docs.textContent = "";
					docs.append(...option.renderDocs(option, context, editor));
				}
				active?.setAttribute("aria-describedby", id + "d");
			}
		};
		const toggleDocs = () => {
			if (docsEnabled) docsWrapper.remove();
			else showDocs();
			docsEnabled = !docsEnabled;
		};
		const startQuery = self.startQuery = (explicit) => {
			const [start, end, dir] = getSelection();
			const language = getLanguage(editor, pos = dir < "f" ? start : end);
			const definition = map[language];
			const cursor = editor.extensions.cursor;
			if (cursor && definition && (explicit || start == end) && !options.readOnly) {
				const value = editor.value;
				const lineBefore = getLineBefore(value, pos);
				const before = value.slice(0, pos);
				const filter = config.filter;
				context = {
					before,
					lineBefore,
					language,
					explicit: !!explicit,
					pos
				};
				Object.assign(context, definition.context?.(context, editor));
				currentOptions = [];
				definition.sources.forEach((source) => {
					const result = source(context, editor);
					const from = result?.from;
					result?.options.forEach((option) => {
						const filterResult = filter(before.slice(option.from ?? from), option.label);
						if (filterResult) {
							filterResult[0] += option.boost || 0;
							filterResult.push(from, result.to ?? end, option);
							currentOptions.push(filterResult);
						}
					});
				});
				if (currentOptions[0]) {
					currentOptions.sort((a, b) => b[0] - a[0] || a[4].label.localeCompare(b[4].label));
					numOptions = currentOptions.length;
					activeIndex = offset = 0;
					for (let i = 0, l = numOptions < windowSize ? numOptions : windowSize; i < l;) {
						rows[i].setAttribute("aria-setsize", numOptions);
						updateRow(i++);
					}
					if (!isOpen) {
						const { clientHeight, clientWidth } = container;
						const pos = cursor.getPosition();
						const max = Math.max(pos.bottom, pos.top);
						docsWrapper.style.maxWidth = tooltip.style.width = `min(25em, ${clientWidth}px - var(--padding-left) - 1em)`;
						wrapper.style.maxHeight = `min(${max}px + .25em, ${clientHeight}px - 2em)`;
					}
					list.style.paddingTop = "";
					list.style.height = rowHeight ? rowHeight * numOptions + "px" : 1.4 * numOptions + "em";
					tooltip.scrollTop = 0;
					updateActive();
					isOpen = true;
					show(config.preferAbove);
					tooltipPlacement = wrapper.parentElement.style.top == "auto" ? "top" : "bottom";
					setDocsPosition();
					textarea.setAttribute("aria-controls", id);
					textarea.setAttribute("aria-haspopup", "listbox");
				} else hide();
			} else hide();
		};
		tabStopsContainer.className = "pce-tabstops";
		textarea.setAttribute("aria-autocomplete", "list");
		for (let i = 0; i < windowSize;) {
			list.append(rowTemplate());
			rows[i].id = id + "-" + i++;
		}
		addListener(tooltip, "scroll", () => {
			setRowHeight();
			if (!updateOffset()) updateActive();
		});
		editor.on("update", () => {
			if (stops) {
				let value = editor.value;
				let diff = prevLength - (prevLength = value.length);
				let [start, end] = currentSelection;
				let i = 0;
				let l = stops.length;
				let activeStart = stops[activeStop];
				let activeEnd = stops[activeStop + 1];
				if (start < stops[activeStop] || end > activeEnd) clearStops();
				else {
					if (isDeleteForwards) end++;
					if (end <= activeEnd) stops[activeStop + 1] -= diff;
					if (end <= activeStart && diff > 0) stops[activeStop] -= diff;
					for (; i < l; i += 2) if (i != activeStop && stops[i] >= activeEnd) {
						stops[i] = Math.max(stops[i] - diff, stops[activeStop + 1]);
						stops[i + 1] = Math.max(stops[i + 1] - diff, stops[activeStop + 1]);
					}
					updateStops();
				}
				isDeleteForwards = false;
				currentSelection = getSelection();
			}
		});
		editor.on("selectionChange", ([start, end]) => {
			if (stops) {
				if (start < stops[activeStop] || end > stops[activeStop + 1]) {
					for (let i = 0; i < stops.length; i += 2) if (start >= stops[i] && end <= stops[i + 1]) {
						activeStop = i;
						break;
					}
				}
				if (activeStop + 3 > stops.length || start < stops[activeStop] || end > stops[activeStop + 1]) clearStops();
			}
			if (isTyping) {
				isTyping = false;
				startQuery();
			} else if (prevStart != start || prevEnd != end) hide();
			prevStart = start;
			prevEnd = end;
		});
		addListener(textarea, "beforeinput", (e) => {
			let inputType = e.inputType;
			let isDelete = inputType[0] == "d";
			let isInsert = inputType == "insertText";
			let data = e.data;
			if (isOpen && isInsert && !prevSelection && data && !data[1] && currentOptions[activeIndex][4].commitChars?.includes(data)) insertOption(activeIndex);
			if (stops) {
				currentSelection = getSelection();
				isDeleteForwards = isDelete && inputType[13] == "F" && currentSelection[0] == currentSelection[1];
			}
			isTyping = !config.explicitOnly && (isTyping || isInsert && !prevSelection || isDelete && isOpen);
		}, true);
		addListener(textarea, "blur", (e) => {
			if (config.closeOnBlur != false && !wrapper.contains(e.relatedTarget)) hide();
		});
		addListener(textarea, "keydown", (e) => {
			let key = e.key;
			let code = getModifierCode(e);
			let top;
			let height;
			let newActive;
			if (code == 2 && key == " " || code == (isMac ? 4 : 2) && key == "i" || isMac && !isOpen && code == 1 && key == "Escape") {
				if (isOpen) toggleDocs();
				else startQuery(true);
				preventDefault(e);
			} else if (isOpen) {
				if (!code) {
					if (/^Arrow[UD]/.test(key)) {
						move(key[5] == "U");
						preventDefault(e);
					} else if (key == "Tab" || key == "Enter") {
						insertOption(activeIndex);
						hide();
						preventDefault(e);
					} else if (key == "Escape") {
						hide();
						preventDefault(e);
					} else if (key.slice(0, 4) == "Page") {
						setRowHeight();
						top = tooltip.scrollTop;
						height = tooltip.clientHeight;
						if (key[4] == "U") {
							newActive = Math.ceil(top / rowHeight);
							activeIndex = activeIndex == newActive || newActive - 1 == activeIndex ? Math.ceil(Math.max(0, (top - height) / rowHeight + 1)) : newActive;
						} else {
							top += height + 1;
							newActive = Math.ceil(top / rowHeight - 2);
							activeIndex = activeIndex == newActive || newActive + 1 == activeIndex ? Math.ceil(Math.min(numOptions - 1, (top + height) / rowHeight - 3)) : newActive;
						}
						scrollActiveIntoView();
						preventDefault(e);
					}
				}
			} else if (stops) {
				if (!(code & 7) && key == "Tab") {
					if (!code) {
						moveActiveStop(2);
						preventDefault(e);
					} else if (activeStop) {
						moveActiveStop(-2);
						preventDefault(e);
					}
				} else if (!code && key == "Escape") {
					clearStops();
					preventDefault(e);
				}
			}
		}, true);
		addListener(list, "mousedown", (e) => {
			if (e.target != docsToggle) {
				insertOption([].indexOf.call(rows, e.target.closest("li")) + offset);
				hide();
			}
			preventDefault(e);
		});
		addListener(wrapper, "focusout", (e) => {
			if (config.closeOnBlur != false && e.relatedTarget != textarea) hide();
		});
		addListener(container, "scroll", () => {
			if (isOpen) setDocsPosition();
		});
		addListener(docsClose, "click", toggleDocs);
		addListener(docsClose, "mousedown", preventDefault);
		addListener(docsToggle, "click", toggleDocs);
		docsWrapper.id = id + "d";
		docsToggle.remove();
		docsWrapper.remove();
		editor.extensions.autoComplete = self;
	};
	self.startQuery = self.insertCompletion = () => {};
	return self;
};
//#endregion
export { completionsFromRecords as a, renderSnippet as c, completeFromList as i, registerCompletions as n, findWords as o, attrSnippet as r, optionsFromKeys as s, autoComplete as t };

//# sourceMappingURL=tooltip-CuDNNcdN.js.map