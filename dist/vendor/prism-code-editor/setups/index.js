import { g as d, c as m } from "../index-svJglgH1.js";
import { loadTheme as c } from "../themes/index.js";
import "../prismCore-AxbjJFmh.js";
const r = (i, s, n) => {
  const e = document.createElement("style");
  e.textContent = s, n && (e.id = n), i.append(e);
}, g = (i, s) => {
  const n = i.scrollContainer.parentNode;
  if (n instanceof ShadowRoot) {
    const e = n.getElementById("theme");
    e && c(s).then((t) => {
      t && (e.textContent = t);
    });
  }
}, a = (i, s, n) => {
  const e = d(i), t = e.shadowRoot || e.attachShadow({ mode: "open" }), o = m();
  return Promise.all([import("../styles-GYla42XD.js"), c(s.theme)]).then(([h, l]) => {
    o.removed || (r(t, h.default), r(t, l || "", "theme"), t.append(o.scrollContainer), o.setOptions(s), n && n());
  }), o;
}, u = (i, s, n) => {
  import("../common-SKRLiXwL.js").then((t) => {
    t.addExtensions(e);
  });
  const e = a(i, s, n);
  return import("../selection-D4-XLNej.js").then((t) => {
    e.addExtensions(t.highlightSelectionMatches());
  }), e;
}, x = (i, s, n) => {
  import("../common-SKRLiXwL.js").then((o) => {
    o.addExtensions(t);
  });
  const e = d(i), t = a(e, s, n);
  return import("../search-AcdErlHO.js").then((o) => {
    t.removed || r(e.shadowRoot, o.default);
  }), import("../extensions/search/index.js").then((o) => {
    t.addExtensions(o.highlightSelectionMatches(), o.searchWidget());
  }), import("../extensions/matchTags.js").then((o) => {
    t.addExtensions(o.matchTags());
  }), t;
}, w = (i, s, n) => {
  import("../readonly-zT5TACqM.js").then((o) => {
    o.addExtensions(t), t.removed || r(e.shadowRoot, o.style);
  });
  const e = d(i), t = a(e, s, n);
  return t;
};
export {
  u as basicEditor,
  x as fullEditor,
  a as minimalEditor,
  w as readonlyEditor,
  g as updateTheme
};
//# sourceMappingURL=index.js.map
