import { a as createTemplate, b as addTextareaListener, p as preventDefault } from "../../index-BltwYS88.js";
import { addTooltip } from "../../tooltips.js";
import { prevSelection, getModifierCode, getLineBefore, insertText, getLanguage } from "../../utils/index.js";
import { s as searchTemplate } from "../../search-CRvSzFe6.js";
import { u as updateMatched, a as updateNode } from "../../utils-BwjmoXco.js";
import { c, f } from "../../utils-BwjmoXco.js";
import { g as getStyleValue } from "../../local-VpqO7_GV.js";
let count = 0;
const template = createTemplate("<div class=pce-ac-tooltip><ul role=listbox>");
const rowTemplate = createTemplate(
  "<li class=pce-ac-row role=option><div></div><div> </div><div class=pce-ac-details> "
);
const map = {};
const registerCompletions = (langs, definition) => {
  langs.forEach((lang) => map[lang] = definition);
};
const autoComplete = (config) => (editor, options) => {
  let isOpen;
  let shouldOpen;
  let currentOptions;
  let numOptions;
  let activeIndex;
  let active;
  let pos;
  let offset;
  let rowHeight;
  let cursor;
  let stops;
  let activeStop;
  let currentSelection;
  let prevLength;
  let isDeleteForwards;
  const windowSize = 13;
  const textarea = editor.textarea;
  const getSelection = editor.getSelection;
  const tooltip = template();
  const tabStopsContainer = searchTemplate();
  const [show, _hide] = addTooltip(editor, tooltip);
  const list = tooltip.firstChild;
  const id = list.id = "pce-ac-" + count++;
  const rows = list.children;
  const add = editor.addListener;
  const prevIcons = [];
  const hide = () => {
    if (isOpen) {
      _hide();
      textarea.removeAttribute("aria-haspopup");
      textarea.removeAttribute("aria-activedescendant");
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
    updateNode(detailsEl.firstChild, completion.detail || "");
    if (prevIcons[index] != icon) {
      iconEl.className = `pce-ac-icon pce-ac-icon-${prevIcons[index] = icon}`;
      iconEl.style.color = `var(--pce-ac-icon-${icon})`;
    }
  };
  const scrollActiveIntoView = () => {
    setRowHeight();
    const scrollTop = tooltip.scrollTop;
    const lower = rowHeight * activeIndex;
    const upper = rowHeight * (activeIndex + 1) - tooltip.clientHeight;
    tooltip.scrollTop = scrollTop > lower ? lower : scrollTop < upper ? upper : scrollTop;
  };
  const updateActive = () => {
    const newActive = rows[activeIndex - offset];
    if (newActive != active) {
      active?.removeAttribute("aria-selected");
      if (newActive) {
        textarea.setAttribute("aria-activedescendant", newActive.id);
        newActive.setAttribute("aria-selected", true);
      } else {
        textarea.removeAttribute("aria-activedescendant");
      }
      active = newActive;
    }
  };
  const move = (decrement) => {
    if (decrement)
      activeIndex = activeIndex ? activeIndex - 1 : numOptions - 1;
    else
      activeIndex = activeIndex + 1 < numOptions ? activeIndex + 1 : 0;
    scrollActiveIntoView();
    updateActive();
  };
  const insertOption = (index) => {
    if (options.readOnly)
      return;
    let [, , start, end, completion] = currentOptions[index];
    let { label, tabStops = [], insert } = completion;
    let l = tabStops.length;
    tabStops = tabStops.map((stop) => stop + start);
    if (insert) {
      let indent = "\n" + getLineBefore(editor.value, pos).match(/\s*/)[0];
      let tab = options.insertSpaces == false ? "	" : " ".repeat(options.tabSize || 2);
      let temp = tabStops.slice();
      insert = insert.replace(/\n|	/g, (match, index2) => {
        let replacement = match == "	" ? tab : indent;
        let diff = replacement.length - 1;
        let i = 0;
        while (i < l) {
          if (temp[i] > index2 + start)
            tabStops[i] += diff;
          i++;
        }
        return replacement;
      });
    } else
      insert = label;
    if (l % 2)
      tabStops[l] = tabStops[l - 1];
    insertText(editor, insert, start, end, tabStops[0], tabStops[1]);
    if (l > 2) {
      stops = tabStops;
      activeStop = 0;
      prevLength = editor.value.length;
      updateStops();
      currentSelection = getSelection();
      if (!tabStopsContainer.parentNode)
        editor.overlays.append(tabStopsContainer);
    }
    cursor.scrollIntoView();
  };
  const moveActiveStop = (offset2) => {
    activeStop += offset2;
    editor.setSelection(stops[activeStop], stops[activeStop + 1]);
    cursor.scrollIntoView();
  };
  const clearStops = () => {
    tabStopsContainer.remove();
    stops = null;
  };
  const updateStops = () => {
    let sorted = [];
    let i = 0;
    for (; i < stops.length; )
      sorted[i / 2] = [stops[i++], stops[i++]];
    sorted.sort((a, b) => a[0] - b[0]);
    updateMatched(tabStopsContainer, sorted.flat(), editor.value);
  };
  const startQuery = (explicit = false) => {
    const [start, end, dir] = getSelection();
    const language = getLanguage(editor, pos = dir < "f" ? start : end);
    const definition = map[language];
    if (definition && (explicit || start == end) && !options.readOnly) {
      const value = editor.value;
      const lineBefore = getLineBefore(value, pos);
      const before = value.slice(0, pos);
      const context = {
        before,
        lineBefore,
        language,
        explicit,
        pos
      };
      const newContext = Object.assign(context, definition.context?.(context, editor));
      const filter = config.filter;
      currentOptions = [];
      definition.sources.forEach((source) => {
        const result = source(newContext, editor);
        if (result) {
          const from = result.from;
          const query = before.slice(from);
          result.options.forEach((option) => {
            const filterResult = filter(query, option.label);
            if (filterResult) {
              filterResult[0] += option.boost || 0;
              filterResult.push(from, result.to ?? end, option);
              currentOptions.push(filterResult);
            }
          });
        }
      });
      if (currentOptions[0]) {
        currentOptions.sort((a, b) => b[0] - a[0] || a[4].label.localeCompare(b[4].label));
        numOptions = currentOptions.length;
        activeIndex = offset = 0;
        for (let i = 0, l = numOptions < windowSize ? numOptions : windowSize; i < l; ) {
          updateRow(i++);
        }
        if (!isOpen) {
          const { clientHeight, clientWidth } = editor.scrollContainer;
          const pos2 = cursor.getPosition();
          const max = Math.max(pos2.bottom, pos2.top);
          tooltip.style.width = `min(25em, ${clientWidth}px - var(--padding-left) - 1em)`;
          tooltip.style.maxHeight = `min(17em, ${max}px + .25em, ${clientHeight}px - 2em)`;
        }
        list.style.paddingTop = "";
        list.style.height = rowHeight ? rowHeight * numOptions + "px" : 1.4 * numOptions + "em";
        tooltip.scrollTop = 0;
        isOpen = true;
        show(config.preferAbove);
        textarea.setAttribute("aria-haspopup", "listbox");
        updateActive();
      } else
        hide();
    } else
      hide();
  };
  const addSelectionHandler = () => {
    if (!cursor && (cursor = editor.extensions.cursor)) {
      add("selectionChange", (selection) => {
        if (stops && (selection[0] < stops[activeStop] || selection[1] > stops[activeStop + 1])) {
          clearStops();
        }
        if (shouldOpen) {
          shouldOpen = false;
          startQuery();
        } else
          hide();
      });
    }
  };
  tabStopsContainer.className = "pce-tabstops";
  textarea.setAttribute("aria-controls", id);
  textarea.setAttribute("aria-autocomplete", "list");
  for (let i = 0; i < windowSize; ) {
    list.append(rowTemplate());
    rows[i].id = id + "-" + i++;
  }
  tooltip.onscroll = () => {
    setRowHeight();
    const newOffset = Math.min(Math.floor(tooltip.scrollTop / rowHeight), numOptions - windowSize);
    if (newOffset == offset || newOffset < 0)
      return;
    offset = newOffset;
    for (let i = 0; i < windowSize; i) {
      updateRow(i++);
    }
    list.style.paddingTop = offset * rowHeight + "px";
    updateActive();
  };
  add("update", () => {
    addSelectionHandler();
    if (stops) {
      let value = editor.value;
      let diff = prevLength - (prevLength = value.length);
      let [start, end] = currentSelection;
      let i = 0;
      let l = stops.length;
      let activeStart = stops[activeStop];
      let activeEnd = stops[activeStop + 1];
      if (start < stops[activeStop] || end > activeEnd) {
        clearStops();
      } else {
        if (isDeleteForwards)
          end++;
        if (end <= activeEnd)
          stops[activeStop + 1] -= diff;
        if (end <= activeStart && diff > 0)
          stops[activeStop] -= diff;
        for (; i < l; i += 2) {
          if (i != activeStop && stops[i] >= activeEnd) {
            stops[i] = Math.max(stops[i] - diff, stops[activeStop + 1]);
            stops[i + 1] = Math.max(stops[i + 1] - diff, stops[activeStop + 1]);
          }
        }
        updateStops();
      }
      isDeleteForwards = false;
      currentSelection = getSelection();
    }
  });
  addTextareaListener(editor, "mousedown", () => {
    if (stops) {
      setTimeout(() => {
        const [start, end] = getSelection();
        if (stops && (start < stops[activeStop] || end > stops[activeStop + 1])) {
          for (let i = 0, l = stops.length; i < stops.length; i += 2) {
            if (start >= stops[i] && end <= stops[i + 1]) {
              if (i + 3 > l)
                clearStops();
              else
                activeStop = i;
              break;
            }
          }
        }
      });
    }
  });
  addTextareaListener(
    editor,
    "beforeinput",
    (e) => {
      let inputType = e.inputType;
      let isDelete = inputType[0] == "d";
      let isInsert = inputType == "insertText";
      let data = e.data;
      if (isOpen && isInsert && !prevSelection && data && !data[1] && currentOptions[activeIndex][4].commitChars?.includes(data)) {
        insertOption(activeIndex);
      }
      if (stops) {
        currentSelection = getSelection();
        isDeleteForwards = isDelete && inputType[13] == "F" && currentSelection[0] == currentSelection[1];
      }
      shouldOpen = !config.explicitOnly && (shouldOpen || isInsert && !prevSelection || isDelete && isOpen);
    },
    true
  );
  addTextareaListener(editor, "blur", (e) => {
    if (config.closeOnBlur != false && !tooltip.contains(e.relatedTarget))
      hide();
  });
  addTextareaListener(
    editor,
    "keydown",
    (e) => {
      const key = e.key;
      const code = getModifierCode(e);
      if (key == " " && code == 2) {
        addSelectionHandler();
        if (cursor)
          startQuery(true);
        preventDefault(e);
      } else if (!code && isOpen) {
        if (/^Arrow[UD]/.test(key)) {
          move(key[5] == "U");
          preventDefault(e);
        } else if (/Tab|Enter/.test(key)) {
          insertOption(activeIndex);
          preventDefault(e);
        } else if (key == "Escape") {
          hide();
          preventDefault(e);
        } else if (key.slice(0, 4) == "Page") {
          setRowHeight();
          let top = tooltip.scrollTop;
          let height = tooltip.clientHeight;
          let newActive;
          if (key[4] == "U") {
            newActive = Math.ceil(top / rowHeight);
            activeIndex = activeIndex == newActive || newActive - 1 == activeIndex ? Math.ceil(Math.max(0, (top - height) / rowHeight + 1)) : newActive;
          } else {
            top += height + 1;
            newActive = Math.ceil(top / rowHeight - 2);
            activeIndex = activeIndex == newActive || newActive + 1 == activeIndex ? Math.ceil(Math.min(numOptions - 1, (top + height) / rowHeight - 3)) : newActive;
          }
          scrollActiveIntoView();
          updateActive();
          preventDefault(e);
        }
      } else if ((code & 7) == 0 && !isOpen && key == "Tab" && stops) {
        if (!code) {
          moveActiveStop(2);
          if (activeStop + 3 > stops.length)
            clearStops();
          preventDefault(e);
        } else if (activeStop) {
          moveActiveStop(-2);
          preventDefault(e);
        }
      } else if (!isOpen && !code && key == "Escape") {
        clearStops();
        preventDefault(e);
      }
    },
    true
  );
  list.onmousedown = (e) => {
    insertOption([].indexOf.call(rows, e.target.closest("li")) + offset);
    preventDefault(e);
  };
  tooltip.addEventListener("focusout", (e) => {
    if (config.closeOnBlur != false && e.relatedTarget != textarea)
      hide();
  });
};
const fuzzyFilter = (query, option) => {
  const optionLen = option.length;
  const queryLen = query.length;
  if (queryLen > optionLen)
    return;
  if (queryLen == 1 || queryLen == optionLen)
    return strictFilter(query, option);
  const queryLc = query.toLowerCase();
  const optionLc = option.toLowerCase();
  const matched = [];
  const fullMatch = optionLc.indexOf(queryLc);
  let score = 0;
  let i = 0;
  let prevPos = 0;
  let j = 0;
  for (; i < queryLen; i++) {
    const char = queryLc[i];
    const pos = fullMatch > -1 ? i + fullMatch : optionLc.indexOf(char, prevPos);
    const hasSkipped = pos > prevPos;
    if (pos < 0)
      return;
    if (hasSkipped)
      score -= 800;
    if (hasSkipped || !j) {
      matched[j++] = pos;
      matched[j++] = pos + 1;
    } else {
      matched[j - 1] = pos + 1;
    }
    if (char != query[i] ^ optionLc[pos] != option[pos])
      score -= 100;
    prevPos = pos + 1;
  }
  return [score - optionLen - (queryLen < optionLen ? 100 : 0), matched];
};
const strictFilter = (query, option) => {
  const optionLen = option.length;
  const queryLen = query.length;
  if (queryLen > optionLen)
    return;
  const start = option.slice(0, queryLen);
  const score = start == query ? 0 : query.toLowerCase() == start.toLowerCase() ? -200 : null;
  if (score == null)
    return;
  return [query ? score - optionLen - (queryLen < optionLen ? 100 : 0) : 0, [0, queryLen]];
};
export {
  autoComplete,
  c as completeSnippets,
  f as findWords,
  fuzzyFilter,
  registerCompletions,
  strictFilter
};
//# sourceMappingURL=index.js.map
