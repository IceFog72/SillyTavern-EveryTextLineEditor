import { r as B } from "./utils-qtFp4SO6.js";
import { a as F } from "./index-svJglgH1.js";
const N = F(
  "",
  "color:#0000;display:none;contain:strict;padding:0 var(--_pse) 0 var(--padding-left);"
), E = (o, c, r = /[_\p{N}\p{L}]{2}/u) => c ? r.test(
  o.slice(
    c - (o.codePointAt(c - 2) > 65535 ? 2 : 1),
    c + (o.codePointAt(c) > 65535 ? 2 : 1)
  )
) : !1, R = (o) => {
  const c = document.createElement("span"), r = [new Text()], s = [], d = N.cloneNode(), l = [], m = () => {
    l[0] && (l.length = 0, d.style.display = "none");
  };
  let f;
  return c.append(""), o.overlays.append(d), {
    search(p, b, w, S, h, u, g) {
      if (!p)
        return m();
      S || (p = B(p));
      const i = o.value, T = h ? i.slice(...h) : i, C = h ? h[0] : 0, I = `gum${b ? "" : "i"}`, x = typeof u == "number" ? (e, n) => e > u || n <= u : u;
      try {
        let e, n, a, t = 0;
        for (l.length = 0, f = RegExp(p, I); e = f.exec(T); )
          n = e[0].length, a = e.index + C, n || (f.lastIndex += i.codePointAt(a) > 65535 ? 2 : 1), !(w && (E(i, a, g) || E(i, a + n, g))) && (!x || x(a, a + n)) && (l[t++] = [a, a + n]);
      } catch (e) {
        return e.message;
      } finally {
        const e = Math.min(l.length * 2, 2e4), n = d.childNodes.length, a = i.slice(e ? l[e / 2 - 1][1] : 0);
        for (let t = r.length; t <= e; )
          r[t++] = c.cloneNode(!0), r[t++] = new Text();
        for (let t = n - 1; t > e; )
          r[t--].remove();
        n <= e && d.append(...r.slice(n, e + 1));
        for (let t = 0, y = 0; t < e; ++t) {
          const [v, _] = l[t / 2], A = i.slice(y, v), P = i.slice(v, y = _);
          A != s[t] && (r[t].data = s[t] = A), P != s[++t] && (r[t].firstChild.data = s[t] = P);
        }
        a != s[e] && (r[e].data = s[e] = a), d.style.display = "";
      }
    },
    container: d,
    get regex() {
      return f;
    },
    matches: l,
    stopSearch: m
  };
};
N.setAttribute("aria-hidden", !0);
export {
  R as c
};
//# sourceMappingURL=search-nZ8ypo4o.js.map
