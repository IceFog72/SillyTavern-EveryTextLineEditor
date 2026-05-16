import { getClosestToken } from "../../utils/index.js";
import { b as addTextareaListener } from "../../index-BltwYS88.js";
const highlightBracketPairs = () => (editor) => {
  let brackets, matcher, pairs, activeID = -1, els = [], selectionChange = () => {
    matcher || (matcher = editor.extensions.matchBrackets);
    let [start, end] = editor.getSelection();
    let newID = start == end && editor.focused && matcher ? closest(end) || -1 : -1;
    if (newID != activeID) {
      toggleActive();
      if (newID + 1) {
        let opening = brackets[pairs[newID]];
        let closing = brackets[newID];
        els = [opening, closing].map(
          (bracket) => getClosestToken(editor, ".punctuation", 0, -1, bracket[1])
        );
        if (els[0] != els[1] && opening[1] + opening[3].length == closing[1]) {
          els[0].textContent += els[1].textContent;
          els[1].textContent = "";
          els[1] = els[0];
        }
        toggleActive(true);
      } else
        els = [];
      activeID = newID;
    }
  }, closest = (offset) => {
    ({ brackets, pairs } = matcher);
    for (let i = 0, bracket; bracket = brackets[++i]; ) {
      if (!bracket[4] && bracket[5] >= offset && brackets[pairs[i]]?.[1] <= offset) {
        return i;
      }
    }
  }, toggleActive = (add) => els.forEach((el) => el.classList.toggle("active-bracket", !!add));
  addTextareaListener(editor, "focus", selectionChange);
  addTextareaListener(editor, "blur", selectionChange);
  editor.addListener("selectionChange", selectionChange);
  editor.addListener("update", () => {
    toggleActive();
    activeID = -1;
  });
};
export {
  highlightBracketPairs
};
//# sourceMappingURL=highlight.js.map
