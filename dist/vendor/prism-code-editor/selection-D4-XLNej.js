import { c as p } from "./search-nZ8ypo4o.js";
import "./utils-qtFp4SO6.js";
import "./index-svJglgH1.js";
import "./prismCore-AxbjJFmh.js";
const g = (s, n) => ({
  update(e) {
    this.update = () => {
    };
    const i = this.api = p(e), c = i.container;
    c.style.zIndex = -1, c.className = s, e.addListener("selectionChange", n(e, i));
  }
}), $ = (s, n = 1, e = 200) => g("selection-matches", (i, c) => ([o, r], t) => {
  t = i.focused ? t.slice(o, r) : "";
  let h = t.search(/\S/), a = (t = t.trim()).length;
  c.search(
    n > a || a > e ? "" : t,
    s,
    !1,
    !1,
    void 0,
    o + h
  );
}), E = (s, n) => Object.assign(
  g("word-matches", (e, i) => {
    let c = !1;
    return e.addListener("update", () => c = !0), ([o, r], t) => {
      if (o < r || !e.focused || c)
        i.search("");
      else {
        let h = `[_$\\p{L}\\d${n && n(o) ? "-" : ""}]`, a = t.slice(0, o).match(RegExp(h + "*$", "u")), d = a.index, l = a[0] + t.slice(o).match(RegExp("^" + h + "*", "u"))[0];
        i.search(
          /^-*(\d|$)/.test(l) || s && !s(d, d + l.length) ? "" : l,
          !0,
          !0,
          !1,
          void 0,
          s,
          RegExp(h + "{2}", "u")
        );
      }
      c = !1;
    };
  }),
  {
    setFilter(e) {
      s = e;
    }
  }
);
export {
  E as highlightCurrentWord,
  $ as highlightSelectionMatches
};
//# sourceMappingURL=selection-D4-XLNej.js.map
