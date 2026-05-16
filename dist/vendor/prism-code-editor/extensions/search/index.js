import { a as pe, i as f, b as de, p as W } from "../../index-svJglgH1.js";
import { d as Y, a as ue, r as fe } from "../../utils-qtFp4SO6.js";
import { createReplaceAPI as he } from "./api.js";
import { highlightCurrentWord as Le, highlightSelectionMatches as Me } from "../../selection-D4-XLNej.js";
import "../../prismCore-AxbjJFmh.js";
import "../../search-nZ8ypo4o.js";
const ve = pe(
  '<div dir="ltr" class="prism-search"><button aria-expanded="false" title="Toggle Replace" class="pce-expand"></button><div spellcheck="false"><div><div class="pce-input pce-find"><input autocorrect="off" autocapitalize="off" placeholder="Find" aria-label="Find"><button class="prev-match" title="Previous Match (Shift+Enter)"></button><button class="next-match" title="Next Match (Enter)"></button><div class="search-error"></div></div><button class="pce-close" title="Close (Esc)"></button></div><div class="pce-input pce-replace"><input autocorrect="off" autocapitalize="off" placeholder="Replace" aria-label="Replace"><button title="(Enter)">Replace</button><button>All</button></div><div class="pce-options"><div class="pce-match-count">0<span> of </span>0</div><button aria-pressed="false" class="pce-regex"><span aria-hidden="true"></span></button><button aria-pressed="false"><span aria-hidden="true">Aa</span></button><button aria-pressed="false" class="pce-whole"><span aria-hidden="true">ab</span></button><button aria-pressed="false" class="pce-in-selection"></button></div></div></div>',
  "display:none;align-items:flex-start;justify-content:flex-end;",
  "prism-search-container"
), Z = (r, l) => r.setAttribute(l, r.getAttribute(l) == "false"), $ = (r, l) => parseFloat(getComputedStyle(r)[l]), we = () => {
  let r, l, y, C, s, u, P, h, g = !1, L;
  const o = ve.cloneNode(!0), m = o.firstChild, [z, F] = m.children, M = F.children, [I, ee] = M[0].children, [p, te, se, ae] = I.children, [O, ne, _] = M[1].children, [le, S, A, R, T] = M[2].children, [j, , ie] = le.childNodes;
  return {
    update(d) {
      this.update = () => {
      }, d.extensions.searchWidget = this;
      const { textarea: b, wrapper: B, overlays: ce, scrollContainer: E, getSelection: k } = d, a = he(d), v = (e) => {
        const t = a.search(
          p.value,
          y,
          C,
          l,
          s
        ), n = t ? -1 : g ? a.next() : a.closest();
        j.data = n + 1, ie.data = a.matches.length, I.classList.toggle("pce-error", !!t), t ? ae.textContent = t : e && a.selectMatch(n, h);
      }, D = (e) => {
        if (e.keyCode >> 1 == 35 && Y(e) == (f ? 4 : 2)) {
          W(e), V();
          let [t, n] = k(), i = d.value, c = i.slice(t, n) || i.slice(0, t).match(/[_\p{N}\p{L}]*$/u)[0] + i.slice(t).match(/^[_\p{N}\p{L}]*/u)[0];
          /^$|\n/.test(c) ? v() : (l && (c = fe(c)), document.execCommand("insertText", !1, c) || (p.value = c), p.select());
        }
      }, H = () => {
        s && (P = k());
      }, U = () => {
        if (s) {
          const e = r - (r = d.value.length), [, t] = P, [n, i] = s;
          t <= i && (s[1] -= e, t <= n - +(e < 0) && (s[0] -= e));
        }
        v(g), g = !1;
      }, V = (e = !0) => {
        u || (u = !0, L == null && (h = L = $(B, "marginTop")), d.addListener("update", U), b.addEventListener("beforeinput", H), o.style.display = "flex", N(), G(), J?.observe(E)), e && (p.focus(), p.select());
      }, q = this.close = (e = !0) => {
        u && (u = !1, a.stopSearch(), d.removeListener("update", U), b.removeEventListener("beforeinput", H), o.style.display = "none", N(), J?.disconnect(), e && b.focus());
      }, x = (e) => {
        if (a.matches[0]) {
          const t = a[e ? "next" : "prev"]();
          a.selectMatch(t, h), j.data = t + 1;
        }
      }, N = () => {
        const e = u ? $(m, "top") + $(m, "height") : L, t = E.scrollTop + e - h;
        B.style.marginTop = e + "px", E.scrollTop = t, h = e;
      }, G = () => F.style.setProperty(
        "--search-width",
        `min(${E.clientWidth - 2}px - 2.4em - var(--padding-left),20em)`
      ), J = window.ResizeObserver && new ResizeObserver(G), K = () => {
        g = !0, a.replace(O.value);
      }, Q = () => {
        a.replaceAll(O.value);
      }, re = {
        p: A,
        w: R,
        r: S,
        l: T
      }, oe = /* @__PURE__ */ new Map([
        [se, () => x(!0)],
        [te, x],
        [ee, q],
        [ne, K],
        [_, Q],
        [
          z,
          () => {
            Z(z, "aria-expanded"), N();
          }
        ],
        [A, () => y = !y],
        [S, () => l = !l],
        [R, () => C = !C],
        [
          T,
          () => {
            const e = d.value;
            s ? s = void 0 : (s = k().slice(0, 2), /\n/.test(e.slice(...s)) && (s = ue(e, ...s).slice(1))), r = e.length;
          }
        ]
      ]), w = ` (Alt+${f ? "Cmd+" : ""}`;
      A.title = `Preserve Case${w}P)`, R.title = `Match Whole Word${w}W)`, S.title = `RegExp Search${w}R)`, T.title = `Find in Selection${w}L)`, _.title = `(${f ? "Cmd" : "Ctrl+Alt"}+Enter)`, b.addEventListener("keydown", D), de && o.addEventListener("focusin", (e) => {
        o.contains(e.relatedTarget) || (p.focus(), e.target.focus());
      }), o.addEventListener("click", (e) => {
        const t = e.target;
        oe.get(t)?.(), t.matches("input~*") && t.focus(), t.matches(".pce-options>button") && (Z(t, "aria-pressed"), v(!0), e.isTrusted && t.focus());
      }), p.oninput = () => u && v(!0), o.addEventListener("keydown", (e) => {
        const t = Y(e), n = e.target, i = e.key, c = n == p;
        if (t == (f ? 5 : 1)) {
          let X = re[f ? e.code[3].toLowerCase() : i];
          X && (W(e), X.click(), n.focus());
        } else
          i == "Enter" && n.tagName == "INPUT" ? (W(e), t ? t == 8 && c ? x() : t == (f ? 4 : 3) && !c && Q() : c ? x(!0) : K(), n.focus()) : !t && i == "Escape" ? q() : D(e);
      }), this.open = (e) => {
        V(e), v();
      }, ce.append(o), a.container.className = "pce-matches";
    },
    widgetEl: m,
    close() {
    },
    open() {
    }
  };
};
export {
  Le as highlightCurrentWord,
  Me as highlightSelectionMatches,
  we as searchWidget
};
//# sourceMappingURL=index.js.map
