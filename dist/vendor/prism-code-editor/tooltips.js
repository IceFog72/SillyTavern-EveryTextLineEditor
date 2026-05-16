import { a as u } from "./index-svJglgH1.js";
import "./prismCore-AxbjJFmh.js";
const h = /* @__PURE__ */ u(
  "<div></div>",
  "z-index:5;top:auto;display:flex;",
  "tooltip-wrapper"
), x = (t, o, s = !0) => {
  const e = h.cloneNode(!0), r = e.style, a = e.firstChild;
  return e.append(o), (s ? o : a).style.flexShrink = 0, [
    (l) => {
      let d = t.extensions.cursor;
      if (d) {
        let { left: m, right: y, top: n, bottom: i, height: g } = d.getPosition();
        e.parentNode || t.overlays.append(e), a.style.width = (t.options.rtl ? y : m) + "px";
        let c = !l == n > i && (l ? n : i) < e.clientHeight ? !l : l;
        r[c ? "bottom" : "top"] = g + (c ? i : n) + "px", r[c ? "top" : "bottom"] = "auto";
      }
    },
    () => e.remove()
  ];
}, p = window.ResizeObserver && /* @__PURE__ */ new ResizeObserver(
  (t) => t.forEach((o) => {
    const s = o.target, e = s.querySelector(".pce-wrapper"), r = getComputedStyle(e);
    e.style.paddingBottom = `${s.clientHeight - parseFloat(r.marginBottom) - parseFloat(r.lineHeight)}px`;
  })
), f = (t) => {
  p && p.observe(t.scrollContainer);
}, b = (t) => {
  const o = t.scrollContainer;
  p && p.unobserve(o), o.querySelector(".pce-wrapper").style.paddingBottom = "";
};
export {
  f as addOverscroll,
  x as addTooltip,
  b as removeOverscroll
};
//# sourceMappingURL=tooltips.js.map
