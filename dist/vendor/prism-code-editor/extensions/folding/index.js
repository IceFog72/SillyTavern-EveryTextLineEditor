import { a as T, n as x, l as A } from "../../index-svJglgH1.js";
import { g as N } from "../../utils-qtFp4SO6.js";
import "../../prismCore-AxbjJFmh.js";
const S = T("<div> </div>", "", "pce-fold"), j = T(" <span title='Unfold'>   </span> ", "", "pce-unfold"), U = (...b) => {
  let u, c, g, h, k, o, m, y;
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set(), F = (e) => {
    let r = e;
    for (let [p, t] of a)
      if (e > p) {
        if (e < t)
          return -1;
        r -= t - p - 3;
      }
    return r;
  }, d = (e) => {
    const r = o[e][0], p = (t) => {
      let [l, n] = o[t], i;
      for (let f of a)
        l <= f[0] && n > f[0] && (i ? a.delete(f) : (f[0] = l, n > f[1] && (f[1] = n), i = !0));
      i || a.add([l, n]);
    };
    if (s.has(e)) {
      s.delete(e);
      for (let t of a)
        if (r == t[0]) {
          a.delete(t);
          for (let l of s)
            o[l][0] > r && p(l);
          break;
        }
    } else
      s.add(e), p(e);
  }, w = () => {
    c = "";
    let e = 0, r = [], p = [...a].sort((t, l) => t[0] - l[0]);
    for (let [t, l] of p)
      c += g.slice(e, t) + "   ", r[x(c)] = x(g, t, e = l);
    k.value = c += g.slice(e), k.dispatchEvent(new Event("input"));
    for (let t = 1, l = 0, n = h.length; t < n; t++)
      h[t].setAttribute("data-line", l += r[t - 1] || 1);
    u.scrollContainer.style.setProperty(
      "--number-width",
      Math.ceil(Math.log10(x(g))) + 1e-3 + "ch"
    ), v();
  }, v = () => {
    for (let e = 0, r = o.length; e < r; e++) {
      if (!o[e])
        continue;
      let p = F(o[e][0]);
      if (p + 1) {
        let t = h[x(c, 0, p)], l = m[e], n = s.has(e);
        if (l || (l = m[e] = S.cloneNode(!0), l.onclick = () => L(e)), t != l.parentNode && !t.querySelector(".pce-fold") && t.prepend(l), l.classList.toggle("closed-fold", n), l.title = `${n ? "Unf" : "F"}old line`, l = y[e], n) {
          l || (l = y[e] = j.cloneNode(!0));
          const i = F(o[e][1]), [f, E, P] = l.childNodes;
          f.data = N(c, p), P.data = /.*/.exec(c.slice(i))[0], E.onclick = () => L(e), t != l.parentNode && t.prepend(l);
        } else
          l?.remove();
      }
    }
  }, L = (e) => {
    d(e), w(), u.setSelection(F(o[e][0]));
  }, C = () => {
    m = [], y = [], o = [], a.clear(), s.clear(), c = g = u.value;
    const e = [], { matchTags: r, matchBrackets: p } = u.extensions;
    if (r) {
      let { tags: t, pairs: l } = r;
      for (let n = 0, i, f = l.length; n < f; n++)
        (i = l[n]) > n && x(c, t[n][3], t[i][1]) > 1 && e.push([t[n][3], t[i][1]]);
    }
    if (p) {
      let { brackets: t, pairs: l } = p;
      for (let n = 0, i, f = l.length; n < f; n++)
        (i = l[n]) > n && t[n][3] != "(" && x(c, t[n][1], t[i][1]) > 1 && e.push([t[n][1] + t[n][3].length, t[i][1]]);
    }
    b.forEach((t) => e.push(...t(u, e)));
    for (let t = 0, l = e.length; t < l; t++) {
      const [n, i] = e[t], f = x(c, 0, n);
      (!o[f] || i > o[f][1]) && (o[f] = [n, i]);
    }
    v();
  };
  return {
    update(e, r) {
      u || (u = e, k = e.textarea, e.extensions.codeFold = this, h = e.wrapper.children, e.tokens[0] && C()), e.scrollContainer.style.setProperty(
        "--padding-left",
        r.lineNumbers == !1 ? "calc(var(--_pse) + var(--_ns))" : ""
      ), e.addListener("update", C), setTimeout(e.removeListener, 0, "update", C);
    },
    get fullCode() {
      return g;
    },
    toggleFold: (e, r) => !!o[e] && s.has(e) != r && !d(e),
    updateFolds: w
  };
}, R = ({ tokens: b, value: u, options: { language: c } }) => {
  const g = [], h = (k, o, m) => {
    for (let y = 0, s = k.length; y < s; ) {
      const a = k[y++], F = a.content, d = a.length, w = a.type, v = a.alias || w;
      if (v === "comment" && x(u, o, o + d) > 1) {
        let L = A[m]?.comments?.block;
        L && u.indexOf(L[0], o) == o && g.push([o + L[0].length, o + d - L[1].length]);
      } else
        Array.isArray(F) && h(
          F,
          o,
          v.indexOf("language-") ? m : v.slice(9)
        );
      o += d;
    }
  };
  return h(b, 0, c), g;
}, _ = ({ tokens: b, value: u, options: { language: c } }) => {
  let g = [], h = 0, k = [], o = (m) => {
    let y = u.slice(0, h).trimEnd().length;
    for (let s = m - 1; s < k.length; s++)
      g.push([k[s], y]);
  };
  if (c == "markdown" || c == "md")
    for (let m = 0, y = b.length - 1; ; m++) {
      const s = b[m], a = s.length, F = s.type;
      if (F == "code" && !s.alias) {
        let d = s.content;
        g.push([
          h + d[0].length + (d[1].content || "").length,
          h + a - d[d.length - 1].length - 1
        ]);
      }
      if (F == "title") {
        let [d, w] = s.content, v = d.type ? d.length : w.content[0] == "=" ? 1 : 2;
        o(v), k.length = v, k[v - 1] = h + (d.type ? a : d.length - 1);
      }
      if (h += a, m == y) {
        o(1);
        break;
      }
    }
  return g;
};
export {
  R as blockCommentFolding,
  _ as markdownFolding,
  U as readOnlyCodeFolding
};
//# sourceMappingURL=index.js.map
