var c = Object.defineProperty;
var p = (t, e, r) => e in t ? c(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var d = (t, e, r) => (p(t, typeof e != "symbol" ? e + "" : e, r), r);
import { updateTheme as b, minimalEditor as h, basicEditor as m, fullEditor as g, readonlyEditor as E } from "./setups/index.js";
import "./index-svJglgH1.js";
import "./prismCore-AxbjJFmh.js";
import "./themes/index.js";
const i = {
  language: (t) => t || "text",
  "tab-size": (t) => +t,
  "insert-spaces": (t) => t != null,
  "line-numbers": (t) => t != null,
  readonly: (t) => t != null,
  "word-wrap": (t) => t != null,
  rtl: (t) => t != null,
  theme: (t) => t || "vs-code-dark"
}, u = {
  language: "language",
  "tab-size": "tabSize",
  "insert-spaces": "insertSpaces",
  "line-numbers": "lineNumbers",
  readonly: "readOnly",
  "word-wrap": "wordWrap",
  rtl: "rtl",
  theme: "theme"
}, f = Object.keys(i), y = (t) => {
  const e = {};
  for (let r in i)
    e[u[r]] = i[r](t.getAttribute(r));
  return e.value = t.textContent, t.textContent = "", e;
}, n = (t, e) => {
  var r;
  customElements.define(
    t,
    (r = class extends HTMLElement {
      constructor() {
        super();
        d(this, "editor");
        this.editor = e(
          this,
          y(this),
          () => this.dispatchEvent(new CustomEvent("ready"))
        );
        for (const [s, a] of Object.entries(u))
          Object.defineProperty(this, a, {
            enumerable: !0,
            // @ts-ignore
            get: () => i[s](this.getAttribute(s)),
            set: /language|theme|tab-size/.test(s) ? (o) => this.setAttribute(s, o) : (o) => this.toggleAttribute(s, o)
          });
      }
      get value() {
        return this.editor.value;
      }
      set value(s) {
        this.editor.setOptions({ value: s });
      }
      attributeChangedCallback(s, a, o) {
        const l = i[s](o);
        i[s](a) != l && (s == "theme" ? b(this.editor, l) : this.editor.setOptions({
          [u[s]]: l
        }));
      }
    }, d(r, "observedAttributes", f), r)
  );
}, k = (t) => n(t, h), z = (t) => n(t, m), M = (t) => n(t, g), j = (t) => n(t, E);
export {
  z as addBasicEditor,
  M as addFullEditor,
  k as addMinimalEditor,
  j as addReadonlyEditor
};
//# sourceMappingURL=webComponent.js.map
