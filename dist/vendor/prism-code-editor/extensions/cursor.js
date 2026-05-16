import { a as v } from "../index-svJglgH1.js";
import { g as x, s as y } from "../utils-qtFp4SO6.js";
import "../prismCore-AxbjJFmh.js";
const B = v(
  " <span></span> ",
  "position:absolute;top:0;opacity:0;padding:inherit"
), T = () => {
  let r = !1, o, c = " ", l = " ", n = B.cloneNode(!0), [h, s, m] = n.childNodes, p = ([e, t, b]) => {
    let { value: u, activeLine: g } = o, d = b == "backward" ? e : t, a = x(u, d), i = /.*/.exec(u.slice(d))[0];
    !a && !i && (i = " "), c != a && (h.data = c = a), l != i && (m.data = l = i), n.parentNode != g && g.prepend(n), r != (r = !1) && f();
  }, f = () => y(o, s);
  return {
    update(e) {
      o || (e.addListener("selectionChange", p), o = e, e.extensions.cursor = this, e.textarea.addEventListener("beforeinput", (t) => {
        r = /history/.test(t.inputType);
      }), e.activeLine && p(e.getSelection()));
    },
    getPosition() {
      const e = s.getBoundingClientRect(), t = o.overlays.getBoundingClientRect();
      return {
        top: e.y - t.y,
        bottom: t.bottom - e.bottom,
        left: e.x - t.x,
        right: t.right - e.x,
        height: e.height
      };
    },
    scrollIntoView: f,
    element: s
  };
};
export {
  T as cursorPosition
};
//# sourceMappingURL=cursor.js.map
