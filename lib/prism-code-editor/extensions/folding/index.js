import { a as createTemplate, n as numLines, l as languageMap } from "../../index-BltwYS88.js";
import { getLineBefore } from "../../utils/index.js";
import { c as addListener, b as getLineEnd } from "../../local-VpqO7_GV.js";
const template = createTemplate("<div class=pce-fold><div> ");
const template2 = createTemplate("<div class=pce-unfold> <span title=Unfold>   </span> ");
const isMultiline = (str, start, end) => str.slice(start, end).includes("\n");
const readOnlyCodeFolding = (...providers) => {
  let cEditor;
  let value;
  let code;
  let lines;
  let lineNumberWidth;
  let textarea;
  let foldPositions;
  const foldToggles = [];
  const foldPlaceholders = [];
  const foldedLines = /* @__PURE__ */ new Set();
  const foldedRanges = /* @__PURE__ */ new Set();
  const getPosition = (pos) => {
    let result = pos;
    for (let [start, end] of foldedRanges) {
      if (pos > start) {
        if (pos < end)
          return -1;
        result -= end - start - 3;
      }
    }
    return result;
  };
  const toggleFold = (line) => {
    const start = foldPositions[line][0];
    const addFold = (line2) => {
      let [start2, end] = foldPositions[line2];
      let expanded;
      for (let range of foldedRanges) {
        if (start2 <= range[0] && end > range[0]) {
          if (expanded)
            foldedRanges.delete(range);
          else {
            range[0] = start2;
            if (end > range[1])
              range[1] = end;
            expanded = true;
          }
        }
      }
      if (!expanded)
        foldedRanges.add([start2, end]);
    };
    if (foldedLines.has(line)) {
      foldedLines.delete(line);
      for (let range of foldedRanges) {
        if (start == range[0]) {
          foldedRanges.delete(range);
          for (let currentLine of foldedLines) {
            const pos = foldPositions[currentLine][0];
            if (pos > start)
              addFold(currentLine);
          }
          break;
        }
      }
    } else {
      foldedLines.add(line);
      addFold(line);
    }
  };
  const update = (line) => {
    value = "";
    let pos = 0;
    let ln = 1;
    let skippedLines = [];
    let sortedRanges = [...foldedRanges].sort((a, b) => a[0] - b[0]);
    for (let [start, end] of sortedRanges) {
      value += code.slice(pos, start) + "   ";
      skippedLines[ln += numLines(code, pos, start) - 1] = numLines(code, start, pos = end);
    }
    textarea.value = value += code.slice(pos);
    if (line)
      textarea.setSelectionRange(pos = getPosition(foldPositions[line][0]), pos);
    cEditor.update();
    for (let i = 1, j = 0, l = lines.length; i < l; i++)
      lines[i].setAttribute("data-line", j += skippedLines[i - 1] || 1);
    cEditor.scrollContainer.style.setProperty("--number-width", lineNumberWidth);
    updateFolds();
  };
  const updateFolds = () => {
    for (let line = 0, l = foldPositions.length, prev; line < l; line++) {
      if (!foldPositions[line])
        continue;
      let pos = getPosition(foldPositions[line][0]);
      if (pos + 1) {
        let parent = lines[numLines(value, 0, pos)];
        let el = foldToggles[line];
        let isClosed = foldedLines.has(line);
        let pos2 = getPosition(foldPositions[line][1]);
        if (!el) {
          el = foldToggles[line] = template();
          el.onclick = () => toggleAndUpdate(line);
        }
        if (parent != el.parentNode && parent != prev)
          parent.prepend(el);
        prev = parent;
        el.classList.toggle("closed-fold", isClosed);
        el.title = `${isClosed ? "Unf" : "F"}old line`;
        el = foldPlaceholders[line];
        if (isClosed) {
          if (!el) {
            el = foldPlaceholders[line] = template2();
            el.onclick = () => toggleAndUpdate(line);
          }
          el.firstChild.data = getLineBefore(value, pos);
          el.lastChild.data = value.slice(pos2, getLineEnd(value, pos2));
          if (parent != el.parentNode)
            parent.prepend(el);
        } else
          el?.remove();
      }
    }
  };
  const toggleAndUpdate = (line) => {
    toggleFold(line);
    update(line);
  };
  const createFolds = () => {
    foldPositions = [];
    foldedRanges.clear();
    foldedLines.clear();
    value = code = cEditor.value;
    lineNumberWidth = Math.ceil(Math.log10(numLines(code))) + ".001ch";
    const folds = [];
    const { matchTags, matchBrackets } = cEditor.extensions;
    if (matchTags) {
      let { tags, pairs } = matchTags;
      for (let i = 0, j, l = pairs.length; i < l; i++) {
        if ((j = pairs[i]) > i && isMultiline(value, tags[i][2], tags[j][1])) {
          folds.push([tags[i][2], tags[j][1]]);
        }
      }
    }
    if (matchBrackets) {
      let { brackets, pairs } = matchBrackets;
      for (let i = 0, j, l = pairs.length; i < l; i++) {
        if ((j = pairs[i]) > i && brackets[i][3] != "(" && isMultiline(value, brackets[i][1], brackets[j][1]))
          folds.push([brackets[i][1] + brackets[i][3].length, brackets[j][1]]);
      }
    }
    providers.forEach((clb) => folds.push(...clb(cEditor, folds)));
    for (let i = 0, l = folds.length; i < l; i++) {
      const [start, end] = folds[i], index = numLines(value, 0, start);
      if (!foldPositions[index] || end > foldPositions[index][1])
        foldPositions[index] = [start, end];
    }
    updateFolds();
  };
  return {
    update(editor, options) {
      if (!cEditor) {
        cEditor = editor;
        textarea = editor.textarea;
        editor.extensions.codeFold = this;
        lines = editor.wrapper.children;
        if (editor.tokens[0])
          createFolds();
      }
      editor.scrollContainer.style.setProperty(
        "--padding-left",
        options.lineNumbers == false ? "calc(var(--_pse) + var(--_ns))" : ""
      );
      setTimeout(addListener(editor, "update", createFolds));
    },
    get fullCode() {
      return code;
    },
    toggleFold: (lineNumber, force) => !!foldPositions[lineNumber] && foldedLines.has(lineNumber) != force && !toggleFold(lineNumber),
    updateFolds: () => update()
  };
};
const blockCommentFolding = ({ tokens, value, options: { language } }) => {
  const folds = [];
  const findBlockComments = (tokens2, position, language2) => {
    for (let i = 0, l = tokens2.length; i < l; ) {
      const token = tokens2[i++];
      const content = token.content;
      const length = token.length;
      const aliasType = token.alias || token.type;
      if (aliasType == "comment" && isMultiline(value, position, position + length)) {
        let comment = languageMap[language2]?.comments?.block;
        if (comment && value.indexOf(comment[0], position) == position)
          folds.push([position + comment[0].length, position + length - comment[1].length]);
      } else if (Array.isArray(content)) {
        findBlockComments(
          content,
          position,
          aliasType.slice(0, 9) == "language-" ? aliasType.slice(9) : language2
        );
      }
      position += length;
    }
  };
  findBlockComments(tokens, 0, language);
  return folds;
};
const markdownFolding = ({ tokens, value, options: { language } }) => {
  let folds = [];
  let pos = 0;
  let openTitles = [];
  let levels;
  let closeTitles = (level) => {
    for (let end = value.slice(0, pos).trimEnd().length; level <= levels; ) {
      folds.push([openTitles[level++], end]);
    }
  };
  if (language == "markdown" || language == "md") {
    for (let i = 0, l = tokens.length; i < l; ) {
      const token = tokens[i++];
      const length = token.length;
      const type = token.type;
      if (type == "code" && !token.alias) {
        let content = token.content;
        folds.push([
          pos + content[0].length + (content[1].content || "").length,
          pos + length - content[content.length - 1].length - 1
        ]);
      }
      if (type == "title") {
        let [token1, token2] = token.content;
        let level = token1.type ? token1.length - 1 : token2.content[0] == "=" ? 0 : 1;
        closeTitles(level);
        openTitles[levels = level] = pos + (token1.type ? length : token1.length - 1);
      }
      pos += length;
    }
    closeTitles(0);
  }
  return folds;
};
export {
  blockCommentFolding,
  markdownFolding,
  readOnlyCodeFolding
};
//# sourceMappingURL=index.js.map
