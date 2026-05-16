import { c as P } from "../../search-nZ8ypo4o.js";
import { s as I, i as M } from "../../utils-qtFp4SO6.js";
import "../../index-svJglgH1.js";
import "../../prismCore-AxbjJFmh.js";
const D = (s) => {
  const { getSelection: h, textarea: v } = s, n = P(s), L = () => {
    const r = h()[0], e = n.matches, c = e.length;
    for (let t = c; t; )
      if (r > e[--t][1])
        return t == c - 1 ? 0 : t + 1;
    return c ? 0 : -1;
  };
  let g, i, l;
  return Object.assign(n, {
    next() {
      const r = h()[1], e = n.matches, c = e.length;
      for (let t = 0, a; t < c; t++)
        if (a = e[t], a[0] - (a[0] == a[1]) >= r)
          return t;
      return c ? 0 : -1;
    },
    prev() {
      const r = h()[0], e = n.matches, c = e.length;
      for (let t = c, a; t; )
        if (a = e[--t], a[1] + (a[0] == a[1]) <= r)
          return t;
      return c - 1;
    },
    closest: L,
    selectMatch(r, e) {
      l?.();
      const c = n.matches[r];
      c && (l = () => {
        g?.classList.remove("match-highlight"), i?.classList.remove("match"), v.removeEventListener("focus", l), l = null;
      }, s.setSelection(...c), v.addEventListener("focus", l), g = s.activeLine, g.classList.add("match-highlight"), i = n.container.children[r], i && (i.classList.add("match"), I(s, i, e)));
    },
    replace(r) {
      if (!n.matches[0])
        return;
      const e = L(), [c, t] = n.matches[e], [a, m] = h();
      if (c != a || t != m)
        return this.selectMatch(e), e;
      M(s, r);
    },
    replaceAll(r) {
      const { matches: e } = n;
      if (!e[0])
        return;
      let c = s.value, [t, a] = h(), m = r.length, d = t, p = a, E = "", S = e.length;
      for (let o = 0; o < S; o++) {
        const [u, w] = e[o], x = m - w + u, A = (f) => u > f ? 0 : f >= w ? x : x < 0 && f > u + m ? m + u - f : 0;
        p += A(a), d += A(t), E += o ? c.slice(e[o - 1][1], u) + r : r;
      }
      M(
        s,
        E,
        e[0][0],
        e[S - 1][1],
        d,
        p
      );
    },
    destroy() {
      l?.(), n.container.remove();
    }
  });
};
export {
  D as createReplaceAPI,
  P as createSearchAPI
};
//# sourceMappingURL=api.js.map
