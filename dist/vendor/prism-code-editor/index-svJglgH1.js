import { l as te, P as O } from "./prismCore-AxbjJFmh.js";
const ne = (a, d, ...g) => {
  let c, f, V = B(a), C = [], E, l = "", W, D = !1, S = !0, P = [], M;
  const h = ie.cloneNode(!0), z = h.firstChild, k = z.firstChild, s = k.firstChild, y = z.children, u = { language: "text" }, A = new Set(g), m = addEventListener.bind(s), H = "</span>", b = {
    selectionChange: /* @__PURE__ */ new Set([
      ([e, n, t]) => {
        const r = y[W = oe(l, 0, t == "backward" ? e : n)];
        r != E && (E?.classList.remove("active-line"), r.classList.add("active-line"), E = r), k.classList.toggle("pce-no-selection", e == n);
      }
    ])
  }, K = (e) => {
    ({ language: c, value: l = "" } = Object.assign(u, { value: l }, e));
    const n = f != (f = te[c]);
    if (!f)
      throw Error(`Language "${c}" has no grammar.`);
    A.forEach((t) => t.update(w, u)), h.className = `prism-code-editor language-${c}${u.lineNumbers == !1 ? "" : " show-line-numbers"} pce-${u.wordWrap ? "" : "no"}wrap${u.rtl ? " pce-rtl" : ""}`, h.style.tabSize = u.tabSize || 2, (n || l != s.value) && (G(), s.value = l, l = s.value, s.selectionEnd = 0, N()), k.classList.toggle("pce-readonly", M = !!u.readOnly), s.inputMode = M ? "none" : "", s.setAttribute("aria-readonly", M);
  }, X = () => {
    let e = "", n = "", t = { language: c, code: l, grammar: f };
    O.hooks.run("before-tokenize", t), P = t.tokens = O.tokenize(t.code, t.grammar), O.hooks.run("after-tokenize", t), j("tokenize", t);
    const r = (o) => {
      let i = "", v = o.length;
      for (let T = 0; T < v; )
        i += p(o[T++]);
      return i;
    }, p = (o) => {
      if (o instanceof O.Token) {
        let { type: i, alias: v, content: T } = o, Y = v ? " " + (typeof v == "string" ? v : v.join(" ")) : "", Z = e, _ = n, U = `<span class="token ${i + Y + (i == "keyword" ? " keyword-" + T : "")}">`;
        n += H, e += U;
        let ee = p(T);
        return e = Z, n = _, U + ee + H;
      }
      return typeof o != "string" ? r(o) : (o = o.replace(/&/g, "&amp;").replace(/</g, "&lt;")).includes(`
`) && n ? o.replace(/\n/g, n + `
` + e) : o;
    };
    return r(P);
  }, N = () => {
    const e = X().split(`
`), n = e.length;
    let t = 0, r = e.length, p = C.length, o = "";
    for (; e[t] == C[t] && t < r; )
      ++t;
    for (; r && e[--r] == C[--p]; )
      ;
    t == r && t == p && (y[++t].innerHTML = e[t - 1] + `
`);
    for (let i = p < t ? p : t - 1; i < r; )
      o += `<div class="pce-line" aria-hidden="true">${e[++i]}
</div>`;
    for (let i = r < t ? r : t - 1; i < p; i++)
      y[t + 1].remove();
    o && y[t].insertAdjacentHTML("afterend", o);
    for (let i = r < t ? r + 1 : t; i < n; )
      y[++i].setAttribute("data-line", i);
    h.style.setProperty("--number-width", Math.ceil(Math.log10(n + 1)) + 1e-3 + "ch"), S = !0, j("update", l), L(), setTimeout(setTimeout, 0, () => S = !0), C = e, S = !1;
  }, x = () => Q || [s.selectionStart, s.selectionEnd, s.selectionDirection], R = () => $ == L, q = {
    Escape() {
      s.blur();
    }
  }, F = {}, G = () => re && !R() && m(
    "focus",
    (e) => e.relatedTarget ? e.relatedTarget.focus() : s.blur(),
    { once: !0 }
  ), j = (e, ...n) => {
    for (const t of b[e] || [])
      t.apply(w, n);
    u[`on${e[0].toUpperCase()}${e.slice(1)}`]?.apply(w, n);
  }, L = (e) => (e || S) && j("selectionChange", x(), l), w = {
    scrollContainer: h,
    wrapper: z,
    overlays: k,
    textarea: s,
    get activeLine() {
      return E;
    },
    get activeLineNumber() {
      return W;
    },
    get value() {
      return l;
    },
    options: u,
    get focused() {
      return R();
    },
    get removed() {
      return D;
    },
    get tokens() {
      return P;
    },
    inputCommandMap: F,
    keyCommandMap: q,
    extensions: {},
    setOptions: K,
    update: N,
    getSelection: x,
    setSelection(e, n, t) {
      G(), s.setSelectionRange(e, n ?? e, t), L(!0);
    },
    addExtensions(...e) {
      e.forEach((n) => {
        A.has(n) || (A.add(n), n.update(w, u));
      });
    },
    addListener(e, n) {
      (b[e] || (b[e] = /* @__PURE__ */ new Set())).add(n);
    },
    removeListener(e, n) {
      b[e]?.delete(n);
    },
    remove() {
      h.remove(), D = !0;
    }
  };
  return m("keydown", (e) => {
    q[e.key]?.(e, x(), l) && I(e);
  }), m("beforeinput", (e) => {
    (M || e.inputType == "insertText" && F[e.data]?.(e, x(), l)) && I(e);
  }), m("input", () => {
    l != s.value && (l = s.value, N());
  }), m("blur", () => {
    $ = null;
  }), m("focus", () => {
    $ = L;
  }), m("selectionchange", (e) => {
    L(), I(e);
  }), V?.append(h), d && K(d), w;
}, de = (a, d, ...g) => {
  const c = B(a), f = ne(
    void 0,
    Object.assign({ value: c.textContent }, d),
    ...g
  );
  return c.replaceWith(f.scrollContainer), f;
}, ae = (a = "", d = "", g = "") => Object.assign(document.createElement("div"), { innerHTML: a, style: d, className: g }), B = (a) => typeof a == "string" ? document.querySelector(a) : a, J = navigator.userAgent, ue = /Mac|iPhone|iPod|iPad/i.test(navigator.platform), se = /Chrome\//.test(J), re = !se && /AppleWebKit\//.test(J), oe = (a, d = 0, g = 1 / 0) => {
  let c = 1;
  for (; (d = a.indexOf(`
`, d) + 1) && d <= g; c++)
    ;
  return c;
}, pe = {}, ie = ae(
  '<div class="pce-wrapper"><div class="pce-overlays"><textarea spellcheck="false" autocapitalize="off" autocomplete="off"></textarea></div></div>'
), ge = (a) => le = a, I = (a) => {
  a.preventDefault(), a.stopImmediatePropagation();
}, fe = (a) => Q = a;
let le, $, Q;
document.addEventListener("selectionchange", () => $?.());
export {
  ae as a,
  se as b,
  ne as c,
  le as d,
  fe as e,
  re as f,
  B as g,
  de as h,
  ue as i,
  pe as l,
  oe as n,
  I as p,
  ge as s
};
//# sourceMappingURL=index-svJglgH1.js.map
