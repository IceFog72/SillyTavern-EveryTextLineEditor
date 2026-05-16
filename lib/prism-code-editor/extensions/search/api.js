import { c as createSearchAPI } from "../../search-CRvSzFe6.js";
import { insertText } from "../../utils/index.js";
import { s as scrollToEl } from "../../local-VpqO7_GV.js";
import { b as addTextareaListener } from "../../index-BltwYS88.js";
const createReplaceAPI = (editor) => {
  const getSelection = editor.getSelection;
  const search = createSearchAPI(editor);
  const container = search.container;
  const matches = search.matches;
  const closest = () => {
    const caretPos = getSelection()[0];
    const l = matches.length;
    for (let i = l; i; ) {
      if (caretPos >= matches[--i][1])
        return (i + (matches[i][0] < caretPos)) % l;
    }
    return l ? 0 : -1;
  };
  const toggleClasses = () => {
    currentLine?.classList.toggle("match-highlight");
    currentMatch?.classList.toggle("match");
  };
  const removeSelection = () => {
    if (hasSelected) {
      toggleClasses();
      hasSelected = false;
    }
  };
  let currentLine;
  let currentMatch;
  let hasSelected = false;
  addTextareaListener(editor, "focus", removeSelection);
  return Object.assign(search, {
    next() {
      const cursor = getSelection()[1];
      const l = matches.length;
      for (let i = 0, match; i < l; i++) {
        match = matches[i];
        if (match[0] - (match[0] == match[1]) >= cursor)
          return i;
      }
      return l ? 0 : -1;
    },
    prev() {
      const cursor = getSelection()[0];
      const l = matches.length;
      for (let i = l, match; i; ) {
        match = matches[--i];
        if (match[1] + (match[0] == match[1]) <= cursor)
          return i;
      }
      return l - 1;
    },
    closest,
    selectMatch(index, scrollPadding) {
      removeSelection();
      if (matches[index]) {
        editor.setSelection(...matches[index]);
        currentLine = editor.activeLine;
        currentMatch = container.children[index];
        hasSelected = true;
        toggleClasses();
        if (currentMatch) {
          scrollToEl(editor, currentMatch, scrollPadding);
        }
      }
    },
    replace(str) {
      if (matches[0]) {
        let index = closest();
        let [start, end] = matches[index];
        let [caretStart, caretEnd] = getSelection();
        let notSelected = start != caretStart || end != caretEnd;
        if (notSelected)
          return index;
        if (editor.value.slice(start, end) == str)
          return matches[++index] ? index : 0;
        return insertText(editor, str);
      }
    },
    replaceAll(str) {
      if (!matches[0])
        return;
      let value = editor.value;
      let [start, end] = getSelection();
      let newLen = str.length;
      let newStart = start;
      let newEnd = end;
      let newValue = "";
      let l = matches.length;
      for (let i = 0; i < l; i++) {
        const [matchStart, matchEnd] = matches[i];
        const lengthDiff = newLen - matchEnd + matchStart;
        const move = (pos) => matchStart > pos ? 0 : pos >= matchEnd ? lengthDiff : lengthDiff < 0 && pos > matchStart + newLen ? newLen + matchStart - pos : 0;
        newEnd += move(end);
        newStart += move(start);
        newValue += i ? value.slice(matches[i - 1][1], matchStart) + str : str;
      }
      insertText(editor, newValue, matches[0][0], matches[l - 1][1], newStart, newEnd);
    },
    destroy() {
      editor.textarea.removeEventListener("focus", removeSelection);
      removeSelection();
      container.remove();
    }
  });
};
export {
  createReplaceAPI,
  createSearchAPI
};
//# sourceMappingURL=api.js.map
