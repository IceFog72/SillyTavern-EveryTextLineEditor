import { l as A, p as B, d as F, i as J, s as Y } from "../index-svJglgH1.js";
import { c as W, i as p, d as O, a as S, g as G, r as k } from "../utils-qtFp4SO6.js";
import "../prismCore-AxbjJFmh.js";
const H = navigator.clipboard, _ = J ? 4 : 2, tn = (K = ['""', "''", "``", "()", "[]", "{}"], N = /([^\w$'"`]["'`]|.[[({])[;:,.\])}>\s]|.[[({]`/s) => ({
  update(o, I) {
    this.update = () => {
    };
    let y;
    const { textarea: q, keyCommandMap: T, inputCommandMap: b, getSelection: D } = o, j = ({ insertSpaces: e = !0, tabSize: n }) => [e ? " " : "	", e ? n || 2 : 1], x = () => !o.extensions.cursor?.scrollIntoView(), v = ([e, n], [t, s], l, a) => (e < n || !a && N.test((l[n - 1] || " ") + t + (l[n] || " "))) && !p(o, t + l.slice(e, n) + s, null, null, e + 1, n + 1), P = ([e, n], t, s) => e == n && s[n] == t && !o.setSelection(e + 1), Q = (e, n, t, s, l, a) => {
      let c = n.join(`
`);
      if (c != e.join(`
`)) {
        const f = e.length - 1, i = n[f], h = e[f], g = h.length - i.length, r = n[0].length - e[0].length, u = t + (r < 0 ? n : e)[0].search(/\S|$/), M = s - h.length + (g > 0 ? i : h).search(/\S|$/), d = t - s + c.length + g, m = u > l ? l : Math.max(u, l + r), $ = a + t - s + c.length;
        p(
          o,
          c,
          t,
          s,
          m,
          a < M ? $ + g : Math.max(M + d, $)
        );
      }
    }, U = (e, n, t, s, l, a, c, f) => {
      Q(
        n,
        n.map(
          e ? (i) => i.slice(i.search(/\S|$/) ? f - i.search(/\S|$/) % f : 0) : (i) => i && c.repeat(f - i.search(/\S|$/) % f) + i
        ),
        t,
        s,
        l,
        a
      );
    };
    b["<"] = (e, n, t) => v(n, "<>", t, !0), K.forEach(([e, n]) => {
      const t = e == n;
      b[e] = (s, l, a) => (t && P(l, n, a) || v(l, e + n, a)) && x(), t || (b[n] = (s, l, a) => P(l, n, a) && x());
    }), b[">"] = (e, n, t) => {
      const s = A[W(o)]?.autoCloseTags?.call(
        o,
        n,
        t
      );
      s && (p(o, ">" + s, null, null, n[0] + 1), B(e));
    }, T.Tab = (e, [n, t], s) => {
      if (F || I.readOnly || O(e) & 6)
        return;
      const [l, a] = j(I), c = e.shiftKey, [f, i, h] = S(s, n, t);
      return n < t || c ? U(c, f, i, h, n, t, l, a) : p(o, l.repeat(a - (n - i) % a)), x();
    }, T.Enter = (e, n, t) => {
      const s = O(e) & 7;
      if (!s || s == _) {
        s && (n = Array(2).fill(S(t, n[1], n[1])[2]));
        const [l, a] = j(I), c = A[W(o)]?.autoIndent, f = Math.floor(G(t, n[0]).search(/\S|$/) / a) * a, i = c?.[0]?.call(o, n, t) ? a : 0, h = c?.[1]?.call(o, n, t), g = `
` + l.repeat(f + i) + (h ? `
` + l.repeat(f) : "");
        if (g[1] || n[1] < t.length)
          return p(
            o,
            g,
            n[0],
            n[1],
            n[0] + f + i + 1
          ), x();
      }
    }, T.Backspace = (e, [n, t], s) => {
      if (n == t) {
        const l = G(s, n), [, a] = j(I), c = K.includes(s.slice(n - 1, n + 1)), f = l.length % a || a;
        if (c || f != 1 && !/\S|^$/.test(l))
          return p(o, "", n - (c ? 1 : f), n + +c), x();
      }
    };
    for (let e = 0; e < 2; e++)
      T[e ? "ArrowDown" : "ArrowUp"] = (n, [t, s], l) => {
        const a = O(n);
        if ((a & 7) == 1) {
          if (a == 1) {
            const c = e ? t : t ? l.lastIndexOf(`
`, t - 1) : -1, f = e ? l.indexOf(`
`, s) + 1 : s;
            if (c > -1 && f > 0) {
              const [i, h, g] = S(l, c, f), r = i[e ? "pop" : "shift"](), u = r.length + 1;
              i[e ? "unshift" : "push"](r), p(
                o,
                i.join(`
`),
                h,
                g,
                t + (e ? u : -u),
                s + (e ? u : -u)
              );
            }
          } else {
            const [c, f, i] = S(l, t, s), h = c.join(`
`), g = e ? h.length + 1 : 0;
            p(o, h + `
` + h, f, i, t + g, s + g);
          }
          return x();
        }
      };
    q.addEventListener("keydown", (e) => {
      const n = O(e), t = e.keyCode;
      if (n == _ && (t == 221 || t == 219)) {
        const [s, l] = D();
        U(
          t == 219,
          ...S(o.value, s, l),
          s,
          l,
          ...j(I)
        );
      } else if (n == (J ? 10 : 2) && t == 77)
        Y(!F), B(e);
      else if (e.code == "Backslash" && n == _ || t == 65 && n == 9) {
        const s = o.value, l = n == 9, [a, c] = D(), f = l ? a : s.lastIndexOf(`
`, a - 1) + 1, i = A[W(o, f)] || {}, { line: h, block: g } = i.getComments?.(o, f, s) || i.comments || {}, [r, u, M] = S(s, a, c), d = r.length - 1;
        if (l) {
          if (g) {
            const [m, $] = g, L = s.slice(a, c), w = s.slice(0, a).search(k(m) + " ?$"), C = RegExp("^ ?" + k($)).test(s.slice(c));
            w + 1 && C ? p(
              o,
              L,
              w,
              c + +(s[c] == " ") + $.length,
              w,
              w + c - a
            ) : p(
              o,
              `${m} ${L} ${$}`,
              a,
              c,
              a + m.length + 1,
              c + m.length + 1
            ), x();
          }
        } else if (h) {
          const m = k(h), $ = RegExp(`^\\s*(${m} ?|$)`), L = RegExp(m + " ?"), w = !/\S/.test(s.slice(u, M)), C = r.map(
            r.every((E) => $.test(E)) && !w ? (E) => E.replace(L, "") : (E) => w || /\S/.test(E) ? E.replace(/^\s*/, `$&${h} `) : E
          );
          Q(r, C, u, M, a, c), x();
        } else if (g) {
          const [m, $] = g, L = r[0].search(/\S|$/), w = r[0].startsWith(m, L) && r[d].endsWith($), C = r.slice();
          C[0] = r[0].replace(
            w ? RegExp(k(m) + " ?") : /(?=\S)|$/,
            w ? "" : m + " "
          );
          let E = C[0].length - r[0].length;
          C[d] = w ? C[d].replace(RegExp(`( ?${k($)})?$`), "") : C[d] + " " + $;
          let V = C.join(`
`), R = L + u, z = R > a ? a : Math.max(a + E, R), X = R > c - (a != c) ? c : Math.min(Math.max(R, c + E), u + V.length);
          p(o, V, u, M, z, Math.max(z, X)), x();
        }
      } else if (n == 8 + _ && t == 75) {
        const s = o.value, [l, a, c] = D(), [f, i, h] = S(s, l, a), g = c == "forward" ? a - h + f.pop().length : l - i, r = S(s, h + 1)[0][0].length;
        p(
          o,
          "",
          i - !!i,
          h + !i,
          i + Math.min(g, r)
        ), x();
      }
    }), ["copy", "cut", "paste"].forEach(
      (e) => q.addEventListener(e, (n) => {
        const [t, s] = D();
        if (t == s && H) {
          const [[l], a, c] = S(o.value, t, s);
          e == "paste" ? n.clipboardData.getData("text/plain") == y && (p(o, y + `
`, a, a, t + y.length + 1), x(), B(n)) : (H.writeText(y = l), e == "cut" && (p(o, "", a, c + 1), x()), B(n));
        }
      })
    );
  }
});
export {
  tn as defaultCommands
};
//# sourceMappingURL=commands.js.map
