import { a as k } from "../index-svJglgH1.js";
import "../prismCore-AxbjJFmh.js";
const A = k(
  '<div style="position:relative;display:inline-block"> </div>',
  "left:var(--padding-left)",
  "guide-indents"
), G = k(
  "",
  "width:1px;position:absolute;background:var(--bg-guide-indent)"
), E = () => {
  let u, g = 0, v, f = -1, h;
  const p = [], I = [], m = A.cloneNode(!0), L = m.lastChild, b = [], N = (e) => {
    v = [];
    const l = w(e.split(`
`)), a = l.length;
    for (let t = 0, o = [], n = l[0]; n; t++) {
      const { style: s } = p[t] || (p[t] = G.cloneNode()), [d, r, c] = n, i = I[t];
      n = l[t + 1], d != i?.[0] && (s.top = d + "00%"), r != i?.[1] && (s.height = r + "00%"), c != i?.[2] && (s.left = c + "00%");
      const x = o[0] != d && n?.[0] != d, C = o[0] + o[1] != d + r && n?.[0] + n?.[1] != d + r;
      for (let y = -x, z = r + C; y < z; y++)
        v[y + d] = t;
      o = I[t] = l[t];
    }
    for (let t = g; t > a; )
      p[--t].remove();
    L.append(...p.slice(g, g = a));
  }, S = () => {
    const e = v[h.activeLineNumber - 1] ?? -1;
    e != f && (f > -1 && (p[f].className = ""), e > -1 && (p[e].className = "active")), f = e;
  }, w = (e) => {
    const l = e.length, a = [], t = [];
    for (let o = 0, n = -1, s = 0, d = 0; ; s++) {
      const r = s == l, c = r ? 0 : b[s] = j(e[s]);
      if (c == -1)
        n == -1 && (n = s);
      else {
        for (let i = c; i < o; i++)
          a[i][1] = (n > -1 && (i > c || r) ? n : s) - a[i][0];
        for (let i = o; i < c; )
          t[d++] = a[i] = [
            n == -1 || i > o ? s : n,
            0,
            i++ * u
          ];
        n = -1, o = c;
      }
      if (r)
        break;
    }
    return b.length = l, t;
  }, j = (e) => {
    let l = e.search(/\S/), a = 0;
    if (l == -1)
      return -1;
    for (let t = 0; t < l; )
      a += e[t++] == "	" ? u - a % u : 1;
    return Math.ceil(a / u);
  };
  return {
    lines: L.children,
    indentLevels: b,
    update(e, l) {
      h || (h = e, e.extensions.indentGuides = this, e.overlays.append(m), e.addListener("update", N), e.addListener("selectionChange", S)), m.style.display = l.wordWrap ? "none" : "", u != (u = l.tabSize || 2) && (N(e.value), S());
    }
  };
};
export {
  E as indentGuides
};
//# sourceMappingURL=guides.js.map
