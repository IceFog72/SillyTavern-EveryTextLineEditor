import { s } from "../../widget-CG99fbys.js";
import { a, h } from "../../selection-C1jc115I.js";
import { c as createSearchAPI } from "../../search-CRvSzFe6.js";
const showInvisibles = (alwaysShow) => {
  return (editor) => {
    let prev;
    const searchAPI = createSearchAPI(editor);
    const matches = searchAPI.matches;
    const container = searchAPI.container;
    const nodes = container.children;
    const tabs = [];
    const update = () => {
      const value = editor.value;
      const [start, end] = editor.getSelection();
      if (!alwaysShow || prev != (prev = value)) {
        searchAPI.search(" |	", true, false, true, alwaysShow ? void 0 : [start, end]);
        for (let i = 0, l = matches.length; i < l; i++) {
          if (value[matches[i][0]] == "	" == !tabs[i]) {
            nodes[i].className = (tabs[i] = !tabs[i]) ? "pce-tab" : "";
          }
        }
      }
    };
    container.className = "pce-invisibles";
    if (editor.value)
      update();
    editor.addListener("selectionChange", update);
  };
};
export {
  a as highlightCurrentWord,
  h as highlightSelectionMatches,
  s as searchWidget,
  showInvisibles
};
//# sourceMappingURL=index.js.map
