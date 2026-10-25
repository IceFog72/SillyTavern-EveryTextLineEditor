import { l as preventDefault, s as languageMap } from "./core-BIWFpCIO.js";
import { _ as addTextareaListener, a as getLineBefore, f as isMac, g as setSelection, h as regexEscape, i as getLanguage, m as prevSelection, o as getLines, s as getModifierCode, u as insertText, v as getLineEnd, x as getStyleValue, y as getLineStart } from "./utils--SPWoSa0.js";
import { c as normalizeKey, s as mod, t as addEditorHotkey } from "./utils-CCBdbU1o.js";
//#region src/extensions/commands/commands.ts
var ignoreTab = false;
/**
* Sets whether editors should ignore tab or use it for indentation. Users can toggle
* this using `Ctrl` + `M` / `Ctrl` + `Shift` + `M` (Mac) when the {@link defaultKeymap}
* or {@link defaultCommands} extension is used.
*/
var setIgnoreTab = (newState) => ignoreTab = newState;
var whitespaceEnd = (str) => str.search(/\S|$/);
var getIndent = ({ options: { insertSpaces = true, tabSize } }) => [insertSpaces ? " " : "	", insertSpaces ? tabSize || 2 : 1];
var scroll = (editor) => !editor.options.readOnly && !editor.extensions.cursor?.scrollIntoView();
/**
* Inserts slightly altered lines while keeping the same selection.
* Used when toggling comments and indenting.
*/
var insertLines = (editor, old, newL, start, end, selectionStart, selectionEnd) => {
	let newLines = newL.join("\n");
	if (newLines == old.join("\n")) return;
	const last = old.length - 1;
	const lastLine = newL[last];
	const oldLastLine = old[last];
	const lastDiff = oldLastLine.length - lastLine.length;
	const firstDiff = newL[0].length - old[0].length;
	const firstInsersion = start + whitespaceEnd((firstDiff < 0 ? newL : old)[0]);
	const lastInsersion = end - oldLastLine.length + whitespaceEnd(lastDiff > 0 ? lastLine : oldLastLine);
	const offset = start - end + newLines.length + lastDiff;
	const newCursorStart = firstInsersion > selectionStart ? selectionStart : Math.max(firstInsersion, selectionStart + firstDiff);
	const newCursorEnd = selectionEnd + start - end + newLines.length;
	insertText(editor, newLines, start, end, newCursorStart, selectionEnd < lastInsersion ? newCursorEnd + lastDiff : Math.max(lastInsersion + offset, newCursorEnd));
};
/**
* Command that indents or outdents all user-selected lines in the editor unless the
* editor is `readOnly`.
* @param editor Editor to execute the command on.
* @param less By default lines are indented. By passing `true`, lines are outdented
* instead.
*/
var indentSelectedLines = (editor, less) => {
	const [start, end] = editor.getSelection();
	const [lines, start1, end1] = getLines(editor.value, start, end);
	const [indentChar, tabSize] = getIndent(editor);
	insertLines(editor, lines, lines.map(less ? (str) => str.slice(whitespaceEnd(str) ? tabSize - whitespaceEnd(str) % tabSize : 0) : (str) => str && indentChar.repeat(tabSize - whitespaceEnd(str) % tabSize) + str), start1, end1, start, end);
	return scroll(editor);
};
/**
* Command that inserts spaces if `insertSpaces` isn't `false` or a tab character
* otherwise at the specified position unless the editor is `readOnly`.
* @param editor Editor to execute the command on.
* @param pos Position to insert the tab.
*/
var insertTab = (editor, pos) => {
	const [indentChar, tabSize] = getIndent(editor);
	insertText(editor, indentChar.repeat(tabSize - (pos - getLineStart(editor.value, pos)) % tabSize));
	return scroll(editor);
};
/**
* Command that inserts a new line replacing the current selection unless the editor is
* `readOnly`. It uses the `autoIndent` behavior of the current language to determine
* whether to preserve the indentation or increase it.
* @param editor Editor to execute the command on.
* @param eol If `true`, the new line is inserted at the end of the line instead of at
* the cursor's position.
*/
var insertLineAndIndent = (editor, eol) => {
	let selection = editor.getSelection();
	let value = editor.value;
	if (eol) selection[0] = selection[1] = getLineEnd(value, selection[1]);
	const [indentChar, tabSize] = getIndent(editor);
	const [start, end] = selection;
	const autoIndent = languageMap[getLanguage(editor, start)]?.autoIndent;
	const indenationCount = Math.floor(whitespaceEnd(getLineBefore(value, start)) / tabSize) * tabSize;
	const extraIndent = autoIndent?.[0]?.(selection, value, editor) ? tabSize : 0;
	const extraLine = autoIndent?.[1]?.(selection, value, editor);
	const newText = "\n" + indentChar.repeat(indenationCount + extraIndent) + (extraLine ? "\n" + indentChar.repeat(indenationCount) : "");
	if (newText[1] || value[end]) {
		insertText(editor, newText, start, end, start + indenationCount + extraIndent + 1);
		return scroll(editor);
	}
};
/**
* Command that moves all selected lines unless the editor is `readOnly`.
* @param editor Editor to execute the command on.
* @param up Whether to move the lines up. Defaults to `false`.
*/
var moveSelectedLines = (editor, up) => {
	const [start, end] = editor.getSelection();
	const value = editor.value;
	const newStart = up ? getLineStart(value, start) - 1 : start;
	const newEnd = up ? end : value.indexOf("\n", end) + 1;
	if (newStart > -1 && newEnd > 0) {
		const [lines, start1, end1] = getLines(value, newStart, newEnd);
		const line = lines[up ? "shift" : "pop"]();
		const offset = (line.length + 1) * (up ? -1 : 1);
		lines[up ? "push" : "unshift"](line);
		insertText(editor, lines.join("\n"), start1, end1, start + offset, end + offset);
	}
	return scroll(editor);
};
/**
* Command that copies all selected lines unless the editor is `readOnly`.
* @param editor Editor to execute the command on.
* @param up Whether or not the selection should remain on the top copy. Defaults to
* `false`.
*/
var copySelectedLines = (editor, up) => {
	const [start, end] = editor.getSelection();
	const value = editor.value;
	const [lines, start1, end1] = getLines(value, start, end);
	const str = lines.join("\n");
	const offset = up ? 0 : str.length + 1;
	insertText(editor, str + "\n" + str, start1, end1, start + offset, end + offset);
	return scroll(editor);
};
/**
* Command that scrolls the editor by one line.
* @param editor Editor to execute the command on.
* @param up Whether to scroll up. Defaults to `false`.
*/
var scrollByOneLine = (editor, up) => {
	editor.container.scrollBy(0, getStyleValue(editor.container, "lineHeight") * (up ? -1 : 1));
	return true;
};
/**
* Command that deletes all selected lines unless the editor is `readOnly`.
* @param editor Editor to execute the command on.
*/
var deleteSelectedLines = (editor) => {
	const [start, end, dir] = editor.getSelection();
	const value = editor.value;
	const [lines, start1, end1] = getLines(value, start, end);
	const column = dir > "f" ? end - end1 + lines.pop().length : start - start1;
	const newLineLen = getLineEnd(value, end1 + 1) - end1 - 1;
	insertText(editor, "", start1 - !!start1, end1 + !start1, start1 + Math.min(column, newLineLen));
	return scroll(editor);
};
/**
* Command that toggles the comment around the current selection unless the editor is
* `readOnly`. Comment syntax is determined using the current {@link Language}. It will
* use the `getComments()` method if present and the `comments` property otherwise.
* @param editor Editor to execute the command on.
* @param isBlock Whether or not to toggle the comment using block syntax.
*/
var toggleComment = (editor, isBlock) => {
	const [start, end] = editor.getSelection();
	const value = editor.value;
	const position = isBlock ? start : getLineStart(value, start);
	const lang = languageMap[getLanguage(editor, position)] || {};
	const { line, block } = lang.getComments?.(editor, position, value) || lang.comments || {};
	const [lines, start1, end1] = getLines(value, start, end);
	const last = lines.length - 1;
	if (isBlock) {
		if (block) {
			const [open, close] = block;
			const text = value.slice(start, end);
			const pos = value.slice(0, start).search(regexEscape(open) + " ?$");
			if (pos + 1 && RegExp("^ ?" + regexEscape(close)).test(value.slice(end))) insertText(editor, text, pos, end + (value[end] == " ") + close.length, pos, pos + end - start);
			else insertText(editor, `${open} ${text} ${close}`, start, end, start + open.length + 1, end + open.length + 1);
		}
	} else if (line) {
		const escaped = regexEscape(line);
		const regex = RegExp(`^\\s*(${escaped} ?|$)`);
		const regex2 = RegExp(escaped + " ?");
		const allWhiteSpace = !/\S/.test(value.slice(start1, end1));
		insertLines(editor, lines, lines.map(!allWhiteSpace && lines.every((line) => regex.test(line)) ? (str) => str.replace(regex2, "") : (str) => allWhiteSpace || /\S/.test(str) ? str.replace(/(?!\s)/, line + " ") : str), start1, end1, start, end);
	} else if (block) {
		const [open, close] = block;
		const first = lines[0];
		const insertionPoint = whitespaceEnd(first);
		const hasComment = first.startsWith(open, insertionPoint) && lines[last].endsWith(close);
		lines[0] = first.replace(hasComment ? RegExp(regexEscape(open) + " ?") : /(?!\s)/, hasComment ? "" : open + " ");
		let diff = lines[0].length - first.length;
		lines[last] = hasComment ? lines[last].replace(RegExp(` ?${regexEscape(close)}$`), "") : lines[last] + " " + close;
		let newText = lines.join("\n");
		let firstInsersion = insertionPoint + start1;
		let newStart = firstInsersion > start ? start : Math.max(start + diff, firstInsersion);
		let newEnd = firstInsersion > end - (start != end) ? end : Math.min(Math.max(firstInsersion, end + diff), start1 + newText.length);
		insertText(editor, newText, start1, end1, newStart, Math.max(newStart, newEnd));
	}
	return block || line && !isBlock ? scroll(editor) : false;
};
/**
* Default keymapping that includes the following commands:
*
* - `Alt` + `ArrowUp`: Move line up
* - `Alt` + `ArrowDown`: Move line down
* - `Ctrl` + `ArrowUp`: Scroll one line up (Windows/Linux)
* - `Ctrl` + `ArrowDown`: Scroll one line down (Windows/Linux)
* - `Ctrl` + `PageUp`: Scroll one line up (Mac)
* - `Ctrl` + `PageDown`: Scroll one line down (Mac)
* - `Shift` + `Alt` + `ArrowUp`: Copy line up
* - `Shift` + `Alt` + `ArrowDown`: Copy line down
* - `Enter`: Insert line and indent
* - `Shift` + `Enter`: Insert line and indent
* - `Mod` + `Enter`: Insert blank line
* - `Mod` + `]`: Indent line
* - `Mod` + `[`: Outdent line
* - `Tab`: Indent line (Tab capture enabled)
* - `Shift` + `Tab`: Outdent line (Tab capture enabled)
* - `Shift` + `Mod` + `K`: Delete line
* - `Mod` + `/`: Toggle comment
* - `Shift` + `Alt` + `A`: Toggle block comment
* - `Ctrl` + `M`: Toggle tab capturing (Windows/Linux)
* - `Ctrl` + `Shift` + `M`: Toggle tab capturing (Mac)
*
* Here, `Mod` refers to `Cmd` on Mac and `Ctrl` otherwise.
*/
var defaultKeymap = {
	Tab(editor) {
		if (!ignoreTab) {
			const [start, end] = editor.getSelection();
			return start == end ? insertTab(editor, start) : indentSelectedLines(editor);
		}
	},
	"8+Tab": (editor) => !ignoreTab && indentSelectedLines(editor, true),
	"1+ArrowDown": (editor) => moveSelectedLines(editor),
	"1+ArrowUp": (editor) => moveSelectedLines(editor, true),
	"9+ArrowDown": (editor) => copySelectedLines(editor),
	"9+ArrowUp": (editor) => copySelectedLines(editor, true),
	Enter: (editor) => insertLineAndIndent(editor),
	"8+Enter": (editor) => insertLineAndIndent(editor),
	"Mod+Enter": (editor) => insertLineAndIndent(editor, true),
	"Mod+]": (editor) => indentSelectedLines(editor),
	"Mod+[": (editor) => indentSelectedLines(editor, true),
	"8+Mod+k": deleteSelectedLines,
	"Mod+/": (editor) => toggleComment(editor),
	"9+a": (editor) => toggleComment(editor, true),
	[isMac ? "10+m" : "2+m"]: () => (ignoreTab = !ignoreTab, true),
	[`2+${isMac ? "Page" : "Arrow"}Down`]: (editor) => scrollByOneLine(editor),
	[`2+${isMac ? "Page" : "Arrow"}Up`]: (editor) => scrollByOneLine(editor, true)
};
//#endregion
//#region src/extensions/commands/deprecated.ts
/**
* Extension that will add automatic indentation and closing of brackets, quotes, and
* tags along with the commands presented later.
*
* ## Commands
*
* Here, `Mod` refers to `Cmd` on Mac and `Ctrl` otherwise.
*
* - `Alt` + `ArrowUp`: Move line up
* - `Alt` + `ArrowDown`: Move line down
* - `Ctrl` + `ArrowUp`: Scroll one line up (Windows/Linux only)
* - `Ctrl` + `ArrowDown`: Scroll one line down (Windows/Linux only)
* - `Shift` + `Alt` + `ArrowUp`: Copy line up
* - `Shift` + `Alt` + `ArrowDown`: Copy line down
* - `Mod` + `Enter`: Insert blank line
* - `Mod` + `]`: Indent line
* - `Mod` + `[`: Outdent line
* - `Tab`: Indent line (Tab capture enabled)
* - `Shift` + `Tab`: Outdent line (Tab capture enabled)
* - `Shift` + `Mod` + `K`: Delete line
* - `Mod` + `/`: Toggle comment
* - `Shift` + `Alt` + `A`: Toggle block comment
* - `Ctrl` + `M`: Toggle tab capturing (Windows/Linux)
* - `Ctrl` + `Shift` + `M`: Toggle tab capturing (Mac)
*
* @param selfClosePairs Pairs of self-closing brackets and quotes.
* Must be an array of strings with 2 characters each.
* Defaults to `['""', "''", '``', '()', '[]', '{}']`.
* @param selfCloseRegex Regex controlling whether or not a bracket/quote should
* automatically close based on the character before and after the cursor.
* Defaults to ``/([^$\w'"`]["'`]|.[[({])[.,:;\])}>\s]|.[[({]`/s``.
*
* @deprecated Consider using {@link editorCommands} instead. This will be removed in next
* major release.
*/
var defaultCommands = (selfClosePairs = [
	"\"\"",
	"''",
	"``",
	"()",
	"[]",
	"{}"
], selfCloseRegex = /([^$\w'"`]["'`]|.[[({])[.,:;\])}>\s]|.[[({]`/s) => {
	return (editor, options) => {
		let prevCopy;
		const { keyCommandMap, inputCommandMap, getSelection, container } = editor;
		const clipboard = navigator.clipboard;
		const getIndent = ({ insertSpaces = true, tabSize } = options) => [insertSpaces ? " " : "	", insertSpaces ? tabSize || 2 : 1];
		const scroll = () => !options.readOnly && !editor.extensions.cursor?.scrollIntoView();
		/**
		* Automatically closes quotes and brackets if text is selected,
		* or if the character before and after the cursor matches a regex
		* @param wrapOnly If true, the character will only be closed if text is selected.
		*/
		const selfClose = ([start, end], [open, close], value, wrapOnly) => (start < end || !wrapOnly && selfCloseRegex.test((value[end - 1] || " ") + open + (value[end] || " "))) && !insertText(editor, open + value.slice(start, end) + close, null, null, start + 1, end + 1);
		const skipIfEqual = ([start, end], char, value) => start == end && value[end] == char && !setSelection(editor, start + 1);
		/**
		* Inserts slightly altered lines while keeping the same selection.
		* Used when toggling comments and indenting.
		*/
		const insertLines = (old, newL, start, end, selectionStart, selectionEnd) => {
			let newLines = newL.join("\n");
			if (newLines != old.join("\n")) {
				const last = old.length - 1;
				const lastLine = newL[last];
				const oldLastLine = old[last];
				const lastDiff = oldLastLine.length - lastLine.length;
				const firstDiff = newL[0].length - old[0].length;
				const firstInsersion = start + whitespaceEnd((firstDiff < 0 ? newL : old)[0]);
				const lastInsersion = end - oldLastLine.length + whitespaceEnd(lastDiff > 0 ? lastLine : oldLastLine);
				const offset = start - end + newLines.length + lastDiff;
				const newCursorStart = firstInsersion > selectionStart ? selectionStart : Math.max(firstInsersion, selectionStart + firstDiff);
				const newCursorEnd = selectionEnd + start - end + newLines.length;
				insertText(editor, newLines, start, end, newCursorStart, selectionEnd < lastInsersion ? newCursorEnd + lastDiff : Math.max(lastInsersion + offset, newCursorEnd));
			}
		};
		const indent = (outdent, lines, start1, end1, start, end, indentChar, tabSize) => {
			insertLines(lines, lines.map(outdent ? (str) => str.slice(whitespaceEnd(str) ? tabSize - whitespaceEnd(str) % tabSize : 0) : (str) => str && indentChar.repeat(tabSize - whitespaceEnd(str) % tabSize) + str), start1, end1, start, end);
		};
		inputCommandMap["<"] = (_e, selection, value) => selfClose(selection, "<>", value, true);
		selfClosePairs.forEach(([open, close]) => {
			const isQuote = open == close;
			inputCommandMap[open] = (_e, selection, value) => (isQuote && skipIfEqual(selection, close, value) || selfClose(selection, open + close, value)) && scroll();
			if (!isQuote) inputCommandMap[close] = (_e, selection, value) => skipIfEqual(selection, close, value) && scroll();
		});
		inputCommandMap[">"] = (e, selection, value) => {
			const closingTag = languageMap[getLanguage(editor)]?.autoCloseTags?.(selection, value, editor);
			if (closingTag) {
				insertText(editor, ">" + closingTag, null, null, selection[0] + 1);
				preventDefault(e);
			}
		};
		keyCommandMap.Tab = (e, [start, end], value) => {
			if (ignoreTab || options.readOnly || getModifierCode(e) & 7) return;
			const [indentChar, tabSize] = getIndent();
			const shiftKey = e.shiftKey;
			const [lines, start1, end1] = getLines(value, start, end);
			if (start < end || shiftKey) indent(shiftKey, lines, start1, end1, start, end, indentChar, tabSize);
			else insertText(editor, indentChar.repeat(tabSize - (start - start1) % tabSize));
			return scroll();
		};
		keyCommandMap.Enter = (e, selection, value) => {
			const code = getModifierCode(e) & 7;
			if (!code || code == mod) {
				if (code) selection[0] = selection[1] = getLines(value, selection[1])[2];
				const [indentChar, tabSize] = getIndent();
				const [start, end] = selection;
				const autoIndent = languageMap[getLanguage(editor, start)]?.autoIndent;
				const indenationCount = Math.floor(whitespaceEnd(getLineBefore(value, start)) / tabSize) * tabSize;
				const extraIndent = autoIndent?.[0]?.(selection, value, editor) ? tabSize : 0;
				const extraLine = autoIndent?.[1]?.(selection, value, editor);
				const newText = "\n" + indentChar.repeat(indenationCount + extraIndent) + (extraLine ? "\n" + indentChar.repeat(indenationCount) : "");
				if (newText[1] || value[end]) {
					insertText(editor, newText, start, end, start + indenationCount + extraIndent + 1);
					return scroll();
				}
			}
		};
		keyCommandMap.Backspace = (_e, [start, end], value) => {
			if (start == end) {
				const line = getLineBefore(value, start);
				const tabSize = options.tabSize || 2;
				const isPair = selfClosePairs.includes(value.slice(start - 1, start + 1));
				const indenationCount = /[^ ]/.test(line) ? 0 : (line.length - 1) % tabSize + 1;
				if (isPair || indenationCount > 1) {
					insertText(editor, "", start - (isPair ? 1 : indenationCount), start + isPair);
					return scroll();
				}
			}
		};
		for (let i = 0; i < 2; i++) keyCommandMap[i ? "ArrowDown" : "ArrowUp"] = (e, [start, end], value) => {
			const code = getModifierCode(e);
			if (code == 1) {
				const newStart = i ? start : getLineStart(value, start) - 1;
				const newEnd = i ? value.indexOf("\n", end) + 1 : end;
				if (newStart > -1 && newEnd > 0) {
					const [lines, start1, end1] = getLines(value, newStart, newEnd);
					const line = lines[i ? "pop" : "shift"]();
					const offset = (line.length + 1) * (i ? 1 : -1);
					lines[i ? "unshift" : "push"](line);
					insertText(editor, lines.join("\n"), start1, end1, start + offset, end + offset);
				}
				return scroll();
			} else if (code == 9) {
				const [lines, start1, end1] = getLines(value, start, end);
				const str = lines.join("\n");
				const offset = i ? str.length + 1 : 0;
				insertText(editor, str + "\n" + str, start1, end1, start + offset, end + offset);
				return scroll();
			} else if (code == 2 && !isMac) {
				container.scrollBy(0, getStyleValue(container, "lineHeight") * (i ? 1 : -1));
				return true;
			}
		};
		addTextareaListener(editor, "keydown", (e) => {
			const code = getModifierCode(e);
			const keyCode = e.keyCode;
			const [start, end, dir] = getSelection();
			if (code == mod && (keyCode == 221 || keyCode == 219)) {
				indent(keyCode == 219, ...getLines(editor.value, start, end), start, end, ...getIndent());
				scroll();
				preventDefault(e);
			} else if (code == (isMac ? 10 : 2) && keyCode == 77) {
				setIgnoreTab(!ignoreTab);
				preventDefault(e);
			} else if (keyCode == 191 && code == mod || keyCode == 65 && code == 9) {
				const value = editor.value;
				const isBlock = code == 9;
				const position = isBlock ? start : getLineStart(value, start);
				const language = languageMap[getLanguage(editor, position)] || {};
				const { line, block } = language.getComments?.(editor, position, value) || language.comments || {};
				const [lines, start1, end1] = getLines(value, start, end);
				const last = lines.length - 1;
				if (isBlock) {
					if (block) {
						const [open, close] = block;
						const text = value.slice(start, end);
						const pos = value.slice(0, start).search(regexEscape(open) + " ?$");
						if (pos + 1 && RegExp("^ ?" + regexEscape(close)).test(value.slice(end))) insertText(editor, text, pos, end + (value[end] == " ") + close.length, pos, pos + end - start);
						else insertText(editor, `${open} ${text} ${close}`, start, end, start + open.length + 1, end + open.length + 1);
						scroll();
						preventDefault(e);
					}
				} else if (line) {
					const escaped = regexEscape(line);
					const regex = RegExp(`^\\s*(${escaped} ?|$)`);
					const regex2 = RegExp(escaped + " ?");
					const allWhiteSpace = !/\S/.test(value.slice(start1, end1));
					const newLines = lines.map(!allWhiteSpace && lines.every((line) => regex.test(line)) ? (str) => str.replace(regex2, "") : (str) => allWhiteSpace || /\S/.test(str) ? str.replace(/(?!\s)/, line + " ") : str);
					insertLines(lines, newLines, start1, end1, start, end);
					scroll();
					preventDefault(e);
				} else if (block) {
					const [open, close] = block;
					const first = lines[0];
					const insertionPoint = whitespaceEnd(first);
					const hasComment = first.startsWith(open, insertionPoint) && lines[last].endsWith(close);
					lines[0] = first.replace(hasComment ? RegExp(regexEscape(open) + " ?") : /(?!\s)/, hasComment ? "" : open + " ");
					let diff = lines[0].length - first.length;
					lines[last] = hasComment ? lines[last].replace(RegExp(` ?${regexEscape(close)}$`), "") : lines[last] + " " + close;
					let newText = lines.join("\n");
					let firstInsersion = insertionPoint + start1;
					let newStart = firstInsersion > start ? start : Math.max(start + diff, firstInsersion);
					let newEnd = firstInsersion > end - (start != end) ? end : Math.min(Math.max(firstInsersion, end + diff), start1 + newText.length);
					insertText(editor, newText, start1, end1, newStart, Math.max(newStart, newEnd));
					scroll();
					preventDefault(e);
				}
			} else if (code == 8 + mod && keyCode == 75) {
				const value = editor.value;
				const [lines, start1, end1] = getLines(value, start, end);
				const column = dir > "f" ? end - end1 + lines.pop().length : start - start1;
				const newLineLen = getLineEnd(value, end1 + 1) - end1 - 1;
				insertText(editor, "", start1 - !!start1, end1 + !start1, start1 + Math.min(column, newLineLen));
				scroll();
				preventDefault(e);
			}
		});
		[
			"copy",
			"cut",
			"paste"
		].forEach((type) => addTextareaListener(editor, type, (e) => {
			const [start, end] = getSelection();
			if (start == end && clipboard) {
				const [[line], start1, end1] = getLines(editor.value, start, end);
				if (type == "paste") {
					if (e.clipboardData.getData("text/plain") == prevCopy) {
						insertText(editor, prevCopy + "\n", start1, start1, start + prevCopy.length + 1);
						scroll();
						preventDefault(e);
					}
				} else {
					clipboard.writeText(prevCopy = line);
					if (type == "cut") insertText(editor, "", start1, end1 + 1), scroll();
					preventDefault(e);
				}
			}
		}));
	};
};
//#endregion
//#region src/extensions/commands/format.ts
var macModifiers = {
	2: "⌃",
	1: "⌥",
	8: "⇧",
	4: "⌘"
};
var winModifiers = {
	2: "Ctrl",
	1: "Alt",
	8: "Shift",
	4: "Win"
};
var keyDisplay = {
	arrowdown: "↓",
	arrowleft: "←",
	arrowright: "→",
	arrowup: "↑",
	delete: "Del",
	escape: "Esc",
	pagedown: "PageDown",
	pageup: "PageUp",
	" ": "Space"
};
/**
* Utility that formats a hotkey to display in a user interface. Modifier keys use symbols
* on Mac and labels otherwise.
*
* @param hotkey Hotkey to format for display.
* @param separator String to join the segments together with. Defaults to `" "` on Mac
* and `"+"` otherwise.
* @returns Formatted key for display.
*
* @example
* // On Mac
* formatHotkey("mod+s") // "⌘ S"
* formatHotkey("12+escape") // "⇧ ⌘ Esc"
* formatHotkey("arrowup") // "↑"
*
* // On Windows/Linux
* formatHotkey("mod+s") // "Ctrl+S"
* formatHotkey("12+escape") // "Shift+Win+Esc"
* formatHotkey("arrowup") // "↑"
*/
var formatHotkey = (hotkey, separator = isMac ? " " : "+") => {
	const [code, key] = normalizeKey(hotkey).split("+");
	const result = [];
	const modifiers = isMac ? macModifiers : winModifiers;
	for (let c in modifiers) if (+code & +c) result.push(modifiers[c]);
	result.push(key ? keyDisplay[key] || key[0].toUpperCase() + key.slice(1) : "+");
	return result.join(separator);
};
/**
* Array of keyboard shortcuts and descriptions for {@link defaultKeymap}. Useful for
* documenting key bindings to users. It consists of tuples containing two string each
* where the first string is the key binding and the second is the description.
*
* @example
* for (const [key, description] of defaultKeymapLabels) {
*   console.log(formatHotkey(key), description)
* }
*/
var defaultKeymapLabels = [
	["1+ArrowDown", "Move lines down"],
	["1+ArrowUp", "Move lines up"],
	["9+ArrowDown", "Copy lines down"],
	["9+ArrowUp", "Copy lines up"],
	[`2+${isMac ? "Page" : "Arrow"}Down`, "Scroll one line down"],
	[`2+${isMac ? "Page" : "Arrow"}Up`, "Scroll one line up"],
	["Enter", "Insert line and indent"],
	["Mod+Enter", "Insert blank line"],
	["Mod+]", "Indent lines"],
	["Mod+[", "Outdent lines"],
	["8+Mod+k", "Delete lines"],
	["Mod+/", "Toggle line comment"],
	["9+a", "Toggle block comment"],
	[isMac ? "10+m" : "2+m", "Toggle tab capturing"],
	["Tab", "Indent lines"],
	["8+Tab", "Outdent lines"]
];
/**
* Array of keyboard shortcuts and descriptions for the {@link autoComplete} extension.
* Useful for documenting key bindings to users. It consists of tuples containing two
* string each where the first string is the key binding and the second is the description.
*
* @example
* for (const [key, description] of autoCompleteShortcutLabels) {
*   console.log(formatHotkey(key), description)
* }
*/
var autoCompleteShortcutLabels = [
	["2+ ", "Trigger suggestion"],
	["mod+i", "Trigger suggestion"],
	...isMac ? [["1+Escape", "Trigger suggestion"]] : [],
	["2+ ", "Toggle suggestion documentation"],
	["mod+i", "Toggle suggestion documentation"],
	["Tab", "Insert suggestion"],
	["Enter", "Insert suggestion"],
	["Escape", "Close completion widget"],
	["Escape", "Clear tab stops"],
	["Tab", "Select next tab stop"],
	["8+Tab", "Select previous tab stop"],
	["ArrowUp", "Select previous suggestion"],
	["ArrowDown", "Select next suggestion"],
	["PageUp", "Select first visible suggestion"],
	["PageDown", "Select last visible suggestion"]
];
var modifiers = isMac ? 5 : 1;
/**
* Array of keyboard shortcuts and descriptions for the {@link searchWidget} extension.
* Useful for documenting key bindings to users. It consists of tuples containing two
* string each where the first string is the key binding and the second is the description.
*
* @example
* for (const [key, description] of searchShortcutLabels) {
*   console.log(formatHotkey(key), description)
* }
*/
var searchShortcutLabels = [
	["mod+f", "Start search"],
	[isMac ? "5+f" : "2+h", "Start replacing"],
	["mod+g", "Find next match"],
	["mod+8+g", "Find previous match"],
	["f3", "Find next match"],
	["8+f3", "Find previous match"],
	["Enter", "Select next match"],
	["8+Enter", "Select previous match"],
	["Escape", "Close search widget"],
	["Enter", "Replace match"],
	[`${isMac ? 4 : 3}+Enter`, "Replace all matches"],
	[modifiers + "+r", "Toggle regex search"],
	[modifiers + "+p", "Toggle case preservation"],
	[modifiers + "+w", "Toggle whole word search"],
	[modifiers + "+l", "Toggle find in selection"]
];
//#endregion
//#region src/extensions/commands/index.ts
/**
* Extension that will add automatic closing of brackets, quotes, and tags along
* with the specified commands.
*
* @param hotkeyMap Commands that will be added to the editor.
* @param selfClosePairs Pairs of self-closing brackets and quotes.
* Must be an array of strings with 2 characters each.
* Defaults to `['""', "''", '``', '()', '[]', '{}']`.
* @param selfCloseRegex Regex controlling whether or not a bracket/quote should
* automatically close based on the character before and after the cursor.
* Defaults to ``/([^$\w'"`]["'`]|.[[({])[.,:;\])}>\s]|.[[({]`/s``.
*/
var editorCommands = (hotkeyMap, selfClosePairs = [
	"\"\"",
	"''",
	"``",
	"()",
	"[]",
	"{}"
], selfCloseRegex = /([^$\w'"`]["'`]|.[[({])[.,:;\])}>\s]|.[[({]`/s) => {
	return (editor, options) => {
		let prevCopy;
		const inputCommandMap = editor.inputCommandMap;
		const clipboard = navigator.clipboard;
		/**
		* Automatically closes quotes and brackets if text is selected,
		* or if the character before and after the cursor matches a regex
		* @param wrapOnly If true, the character will only be closed if text is selected.
		*/
		const selfClose = ([start, end], [open, close], value, wrapOnly) => (start < end || !wrapOnly && selfCloseRegex.test((value[end - 1] || " ") + open + (value[end] || " "))) && !insertText(editor, open + value.slice(start, end) + close, null, null, start + 1, end + 1);
		const skipIfEqual = ([start, end], char, value) => start == end && value[end] == char && !setSelection(editor, start + 1);
		const backspaceCommand = () => {
			const [start, end] = editor.getSelection();
			if (start == end) {
				const value = editor.value;
				const line = getLineBefore(value, start);
				const tabSize = options.tabSize || 2;
				const isPair = selfClosePairs.includes(value.slice(start - 1, start + 1));
				const indenationCount = /[^ ]/.test(line) ? 0 : (line.length - 1) % tabSize + 1;
				if ((isPair || indenationCount > 1) && start == end) {
					insertText(editor, "", start - (isPair ? 1 : indenationCount), start + isPair);
					return scroll(editor);
				}
			}
		};
		inputCommandMap["<"] = (_e, selection, value) => selfClose(selection, "<>", value, true);
		selfClosePairs.forEach(([open, close]) => {
			const isQuote = open == close;
			inputCommandMap[open] = (_e, selection, value) => (isQuote && skipIfEqual(selection, close, value) || selfClose(selection, open + close, value)) && scroll(editor);
			if (!isQuote) inputCommandMap[close] = (_e, selection, value) => skipIfEqual(selection, close, value) && scroll(editor);
		});
		inputCommandMap[">"] = (e, selection, value) => {
			const closingTag = languageMap[getLanguage(editor)]?.autoCloseTags?.(selection, value, editor);
			if (closingTag) {
				insertText(editor, ">" + closingTag, null, null, selection[0] + 1);
				preventDefault(e);
			}
		};
		addEditorHotkey(editor, "Backspace", backspaceCommand);
		addEditorHotkey(editor, "8+Backspace", backspaceCommand);
		for (const key in hotkeyMap) addEditorHotkey(editor, key, hotkeyMap[key]);
		[
			"copy",
			"cut",
			"paste"
		].forEach((type) => addTextareaListener(editor, type, (e) => {
			const [start, end] = editor.getSelection();
			if (start == end && clipboard) {
				const [[line], start1, end1] = getLines(editor.value, start, end);
				if (type == "paste") {
					if (e.clipboardData.getData("text/plain") == prevCopy) {
						insertText(editor, prevCopy + "\n", start1, start1, start + prevCopy.length + 1);
						scroll(editor);
						preventDefault(e);
					}
				} else {
					clipboard.writeText(prevCopy = line);
					if (type == "cut") insertText(editor, "", start1, end1 + 1), scroll(editor);
					preventDefault(e);
				}
			}
		}));
	};
};
/**
* History extension that overrides the undo/redo behavior of the browser.
*
* Without this extension, the browser's native undo/redo is used, which can be sufficient
* in some cases.
*
* Once added to an editor, this extension can be accessed from `editor.extensions.history`.
*
* If you want to create a new editor with different extensions while keeping the undo/redo
* history of an old editor, you can! Just add the old editor's history extension instance
* to the new editor. Keep in mind that this will fully break the undo/redo behavior of the
* old editor.
*
* @param historyLimit The maximum size of the history stack. Defaults to 999.
*/
var editHistory = (historyLimit = 999) => {
	let sp = 0;
	let currentEditor;
	let allowMerge;
	let isTyping = false;
	let prevInputType;
	let prevData;
	let prevTime;
	let isMerge;
	let textarea;
	let getSelection;
	const stack = [];
	const update = (index) => {
		if (index >= historyLimit) {
			index--;
			stack.shift();
		}
		stack.splice(sp = index, historyLimit, [
			currentEditor.value,
			getSelection(),
			getSelection()
		]);
	};
	const setEditorState = (index) => {
		if (stack[index]) {
			textarea.value = stack[index][0];
			textarea.setSelectionRange(...stack[index][index < sp ? 2 : 1]);
			currentEditor.update();
			currentEditor.extensions.cursor?.scrollIntoView();
			sp = index;
			allowMerge = false;
		}
	};
	const self = (editor, options) => {
		editor.extensions.history = self;
		currentEditor = editor;
		getSelection = editor.getSelection;
		textarea || update(0);
		textarea = editor.textarea;
		editor.on("selectionChange", () => {
			allowMerge = isTyping;
			isTyping = false;
		});
		addTextareaListener(editor, "beforeinput", (e) => {
			let data = e.data;
			let inputType = e.inputType;
			let time = e.timeStamp;
			if (/history/.test(inputType)) {
				setEditorState(sp + (inputType[7] == "U" ? -1 : 1));
				preventDefault(e);
			} else if (!(isMerge = allowMerge && (prevInputType == inputType || time - prevTime < 99 && inputType.slice(-4) == "Drop") && !prevSelection && (data != " " || prevData == data))) stack[sp][2] = prevSelection || getSelection();
			isTyping = true;
			prevData = data;
			prevTime = time;
			prevInputType = inputType;
		});
		addTextareaListener(editor, "input", () => update(sp + !isMerge));
		addTextareaListener(editor, "keydown", (e) => {
			if (!options.readOnly) {
				const code = getModifierCode(e);
				const keyCode = e.keyCode;
				const isUndo = code == mod && keyCode == 90;
				const isRedo = code == mod + 8 && keyCode == 90 || !isMac && code == mod && keyCode == 89;
				if (isUndo) {
					setEditorState(sp - 1);
					preventDefault(e);
				} else if (isRedo) {
					setEditorState(sp + 1);
					preventDefault(e);
				}
			}
		});
		editor.addExtensions({ update() {
			if (editor.value != textarea.value) reset();
		} });
	};
	const reset = self.clear = () => {
		update(0);
		allowMerge = false;
	};
	self.has = (offset) => sp + offset in stack;
	self.go = (offset) => setEditorState(sp + offset);
	return self;
};
//#endregion
export { setIgnoreTab as _, formatHotkey as a, copySelectedLines as c, ignoreTab as d, indentSelectedLines as f, scrollByOneLine as g, moveSelectedLines as h, defaultKeymapLabels as i, defaultKeymap as l, insertTab as m, editorCommands as n, searchShortcutLabels as o, insertLineAndIndent as p, autoCompleteShortcutLabels as r, defaultCommands as s, editHistory as t, deleteSelectedLines as u, toggleComment as v };

//# sourceMappingURL=commands-jZ0uQlAY.js.map