const h = [], f = [], b = (u = !0) => {
  let c, a;
  const n = [], l = [], g = (t) => {
    if (c = [], l.length = n.length = a = 0, d(t.tokens, 0), u)
      for (let s = 0, r; r = n[s]; ) {
        let e = r[0].alias;
        r[0].alias = (e ? (e.join?.(" ") || e) + " " : "") + `bracket-${l[s++] == null ? "error" : "level-" + r[2] % 12}`;
      }
  }, d = (t, s) => {
    for (let r = 0, e; e = t[r++]; ) {
      if (typeof e != "string") {
        const C = e.type, i = e.content;
        if (C != "regex") {
          if (Array.isArray(i))
            d(i, s);
          else if ((e.alias || C) == "punctuation") {
            let o = i.charCodeAt(i.length - 1), k = !!h[o];
            if (k || f[o]) {
              if (n[a] = [e, s, 0, i, k], k)
                c.push([a, o]);
              else
                for (let p = c.length; p; ) {
                  let [x, y] = c[--p];
                  if (o - y < 3 && o - y > 0) {
                    l[l[a] = x] = a, n[a][2] = n[x][2] = c.length = p;
                    break;
                  }
                }
              a++;
            }
          }
        }
      }
      s += e.length;
    }
  };
  return {
    update(t) {
      this.update = () => {
      }, t.extensions.matchBrackets = this, t.addListener("tokenize", g), u && t.tokens[0] ? t.update() : g(t);
    },
    brackets: n,
    pairs: l
  };
};
h[40] = h[91] = h[123] = !0;
f[41] = f[93] = f[125] = !0;
export {
  b as matchBrackets
};
//# sourceMappingURL=index.js.map
