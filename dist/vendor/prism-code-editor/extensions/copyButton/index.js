import { a as l } from "../../index-svJglgH1.js";
import "../../prismCore-AxbjJFmh.js";
const i = l(
  '<button dir="ltr" style="display:none;" class="pce-copy" aria-label="Copy"><svg width="1.2em" viewbox="0 0 48 48" overflow="visible" stroke-width="4" stroke-linecap="round" fill="none" stroke="currentColor"><rect x="16" y="16" width="30" height="30" rx="3"/><path d="M32 9V5a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v24a3 3 0 0 0 3 3h4"/></svg></button>',
  "display:flex;align-items:flex-start;justify-content:flex-end;"
), o = navigator.clipboard, s = () => ({
  update(e) {
    this.update = () => {
    };
    const a = i.cloneNode(!0), t = a.firstChild;
    t.addEventListener("click", () => {
      t.setAttribute("aria-label", "Copied!"), o ? o.writeText(e.extensions.codeFold?.fullCode ?? e.value) : (e.textarea.select(), document.execCommand("copy"), e.setSelection(0));
    }), t.addEventListener("pointerenter", () => t.setAttribute("aria-label", "Copy")), e.overlays.append(a);
  }
});
export {
  s as copyButton
};
//# sourceMappingURL=index.js.map
