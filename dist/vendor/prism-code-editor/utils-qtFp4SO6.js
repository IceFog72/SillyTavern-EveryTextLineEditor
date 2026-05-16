import { n as h, e as p, f as u, b as m } from "./index-svJglgH1.js";
const E = (e) => e.replace(/[$+?|.^*(){}[\]\\]/g, "\\$&"), $ = (e, n) => e.slice(e.lastIndexOf(`
`, n - 1) + 1, n), S = (e, n, l = n) => [
  e.slice(
    n = n ? e.lastIndexOf(`
`, n - 1) + 1 : 0,
    l = (l = e.indexOf(`
`, l)) + 1 ? l : e.length
  ).split(`
`),
  n,
  l
], y = (e, n, l = 0, c = l, t = e.getSelection()[0]) => {
  const r = e.value, s = r.slice(t).search(/\n|$/) + 1, f = e.wrapper.children[h(r, 0, t)], a = f.querySelectorAll(n), i = new Range();
  i.setEndAfter(f);
  for (let g = a.length, o, d; g; )
    if (i.setStartAfter(o = a[--g]), d = i.toString().length, d <= s + c && d + o.textContent.length >= s - l)
      return o;
  return null;
}, v = (e, n) => y(e, '[class*="language-"]', 0, 0, n)?.className.match(
  /language-(\w+)/
)[1] || e.options.language, B = (e, n, l, c, t, r) => {
  const { textarea: s, getSelection: f, value: a, focused: i } = e;
  if (e.options.readOnly)
    return;
  i || s.focus();
  const g = t != null ? p([t, r ?? t, f()[2]]) : 0;
  if (l != null && s.setSelectionRange(l, c ?? l), u || s.dispatchEvent(new InputEvent("beforeinput", { data: n })), m || u) {
    const o = m && !a[s.selectionEnd] && /^$|\n$/.test(a) && /\n$/.test(n);
    o && (s.selectionEnd--, n = n.slice(0, -1)), u && (n += `
`), document.execCommand(
      n ? "insertHTML" : "delete",
      !1,
      n.replace(/&/g, "&amp;").replace(/</g, "&lt;")
    ), o && s.selectionStart++;
  } else
    document.execCommand(n ? "insertText" : "delete", !1, n);
  g && (s.setSelectionRange(...g), p());
}, C = (e) => e.altKey + e.ctrlKey * 2 + e.metaKey * 4 + e.shiftKey * 8, b = (e, n, l = 0) => {
  const c = e.scrollContainer.style, t = document.documentElement.style;
  c.scrollPaddingBlock = t.scrollPaddingBlock = `${l}px ${m && !n.textContent ? n.offsetHeight : 0}px`, n.scrollIntoView({ block: "nearest" }), c.scrollPaddingBlock = t.scrollPaddingBlock = "";
};
export {
  S as a,
  y as b,
  v as c,
  C as d,
  $ as g,
  B as i,
  E as r,
  b as s
};
//# sourceMappingURL=utils-qtFp4SO6.js.map
