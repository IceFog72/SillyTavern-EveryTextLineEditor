import { b as h } from "../../utils-qtFp4SO6.js";
import "../../index-svJglgH1.js";
import "../../prismCore-AxbjJFmh.js";
const m = () => ({
  update(s) {
    this.update = () => {
    };
    let i, c = -1, t = [], r = ([n, e] = s.getSelection()) => {
      let a = n == e && (i = s.extensions.matchBrackets) && s.focused && u(e) || -1;
      a != c && (l(), a + 1 ? (t = [i.pairs[a], a].map(
        (o) => h(s, ".punctuation", 0, -1, i.brackets[o][1])
      ), t[0].nextSibling == t[1] && (t[0].textContent += t[1].textContent, t[1].textContent = "", t[1] = t[0]), l(!0)) : t = [], c = a);
    }, u = (n) => {
      for (let e = 0, { brackets: a, pairs: o } = i, g; g = a[++e]; )
        if (!g[4] && g[1] > n - 2 && a[o[e]]?.[1] <= n)
          return e;
    }, l = (n) => t.forEach((e) => e.classList.toggle("active-bracket", !!n)), p = addEventListener.bind(s.textarea);
    p("blur", () => r()), p("focus", () => r()), s.addListener("selectionChange", r), s.addListener("update", () => {
      l(), c = -1;
    });
  }
});
export {
  m as highlightBracketPairs
};
//# sourceMappingURL=highlight.js.map
