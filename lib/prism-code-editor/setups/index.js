import { g as getElement, c as createEditor } from "../index-BltwYS88.js";
import { loadTheme } from "../themes/index.js";
const addStyles = (shadow, styles, id) => {
  const style = document.createElement("style");
  style.textContent = styles;
  if (id)
    style.id = id;
  shadow.append(style);
};
const updateTheme = (editor, theme) => {
  const el = editor.scrollContainer.parentNode;
  if (el instanceof ShadowRoot) {
    const style = el.getElementById("theme");
    if (style)
      loadTheme(theme).then((theme2) => {
        theme2 && (style.textContent = theme2);
      });
  }
};
const minimalEditor = (container, options, readyCallback) => {
  const el = getElement(container);
  const shadow = el.shadowRoot || el.attachShadow({ mode: "open" });
  const editor = createEditor();
  Promise.all([import("../styles-DkWLhBOf.js"), loadTheme(options.theme)]).then(([style, theme]) => {
    if (!editor.removed) {
      addStyles(shadow, style.default);
      addStyles(shadow, theme || "", "theme");
      shadow.append(editor.scrollContainer);
      editor.setOptions(options);
      readyCallback && readyCallback();
    }
  });
  return editor;
};
const basicEditor = (container, options, readyCallback) => {
  import("../common-vQBcBSOy.js").then((mod) => {
    editor.addExtensions(...mod.common());
  });
  const editor = minimalEditor(container, options, readyCallback);
  return editor;
};
const fullEditor = (container, options, readyCallback) => {
  import("../common-vQBcBSOy.js").then((mod) => {
    editor.addExtensions(...mod.common());
  });
  const el = getElement(container);
  const editor = minimalEditor(el, options, readyCallback);
  import("../search-BHXmT5sB.js").then((module) => {
    editor.removed || addStyles(el.shadowRoot, module.default);
  });
  import("../full-BpXCZbX5.js").then((mod) => {
    editor.addExtensions(...mod.full());
  });
  return editor;
};
const readonlyEditor = (container, options, readyCallback) => {
  import("../readonly-BheOKAId.js").then((mod) => {
    mod.addExtensions(editor);
    editor.removed || addStyles(el.shadowRoot, mod.style);
  });
  const el = getElement(container);
  const editor = minimalEditor(el, options, readyCallback);
  return editor;
};
export {
  basicEditor,
  fullEditor,
  minimalEditor,
  readonlyEditor,
  updateTheme
};
//# sourceMappingURL=index.js.map
