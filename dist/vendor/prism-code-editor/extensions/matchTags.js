import { b as k } from "../utils-qtFp4SO6.js";
import "../index-svJglgH1.js";
import "../prismCore-AxbjJFmh.js";
const y = "xml,rss,atom,jsx,tsx".split(","), I = "area,base,br,col,embed,hr,img,input,link,meta,source,track,wbr".split(","), b = (n) => {
  let c = [], t = [], s, h, d = (l, g) => {
    s = [], t.length = c.length = h = 0, r(l, g, 0);
  }, r = (l, g, e) => {
    for (let i = 0, f = y.includes(g), u = l.length; i < u; ) {
      const a = l[i++], m = a.content, C = a.type, x = a.length;
      if (Array.isArray(m))
        if (C == "tag") {
          if (m[0].content) {
            const o = n.value, p = m[0].length, L = o[e + 1] == "/", E = o.slice(e + 1 + L, e + p), v = !E || o[e + x - 2] != "/" && (f || !I.includes(E));
            if (m[2] && f && r(m.slice(1, -1), g, e + p), v)
              if (L)
                for (let T = s.length; T; )
                  E == s[--T][1] && (c[c[h] = s[T][0]] = h, s.length = T, T = 0);
              else
                s.push([h, E]);
            t[h++] = [
              a,
              e,
              1 + L,
              e + x,
              E,
              !v
            ];
          }
        } else {
          let o = a.alias || C;
          r(
            m,
            o.indexOf("language-") ? g : o.slice(9),
            e
          );
        }
      e += x;
    }
  };
  return n.addListener("tokenize", (l) => {
    d(l.tokens, l.language);
  }), d(n.tokens, n.options.language), n.extensions.matchTags = {
    tags: t,
    pairs: c
  };
}, w = (n, c) => {
  for (let t = 0, s = c.length; t < s; t++)
    if (c[t][1] <= n && c[t][3] >= n)
      return t;
}, N = () => ({
  update(n) {
    this.update = () => {
    };
    let c, t;
    const { tags: s, pairs: h } = this.matcher = n.extensions.matchTags || b(n), d = (l) => [c, t].forEach((g) => {
      g && g.classList.toggle("active-tagname", !l);
    }), r = () => {
      let [l, g] = n.getSelection(), e, i;
      if (l == g && n.focused) {
        let f = w(l, s), u = s[f];
        if (u && u[4]) {
          const a = k(n, ".tag>.tag", -u[2], 0), m = h[f];
          if (a && m + 1) {
            const C = k(n, ".tag>.tag", 0, 0, s[m][1]);
            [e, i] = [a, C].map((x) => {
              let o = x.childNodes, p = o[1];
              return (o[2] || p.data) && (p = document.createElement("span"), p.append(...[].slice.call(o, 1)), x.append(p)), p;
            });
          }
        }
      }
      c != e && (d(!0), c = e, t = i, d());
    };
    n.addListener("selectionChange", r);
  }
}), P = (n, c) => ({
  update(t) {
    this.update = () => {
    };
    let s, h;
    const { tags: d } = this.matcher = t.extensions.matchTags || b(t), r = (e) => k(t, ".tag>.punctuation", 0, 0, e), l = (e) => [s, h].forEach((i) => {
      i && i.classList.toggle(n, !e);
    }), g = () => {
      let [e, i] = t.getSelection(), f, u;
      if (e == i && t.focused) {
        let a = d[w(e, d)];
        a && (c || (i < a[1] + a[2] || i > a[1] + a[2] + a[4].length) && r()) && (f = r(a[1]), u = r(a[3] - 1));
      }
      (s != f || h != u) && (l(!0), s = f, h = u, l());
    };
    t.addListener("selectionChange", g), t.textarea.addEventListener("focus", g), t.textarea.addEventListener("blur", g);
  }
});
export {
  b as createTagMatcher,
  P as highlightTagPunctuation,
  N as matchTags
};
//# sourceMappingURL=matchTags.js.map
