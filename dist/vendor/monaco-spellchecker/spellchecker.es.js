const C = "spellchecker.ignore", M = "spellchecker.addWord", I = "spellchecker.correct";
function v(r) {
  return `vs.editor.ICodeEditor:1:${r}`;
}
const N = (r, s) => {
  switch (r) {
    case "hover-message":
      return `"${s}" is misspelled.`;
    case "ignore":
      return `Ignore "${s}"`;
    case "add-word":
      return `Add "${s}" to Dictionary`;
    case "apply-suggestion":
      return `Replace with "${s}"`;
    default:
      return "";
  }
};
function* R(r) {
  const s = /\b[a-zA-Z']+\b/g;
  let c;
  for (; (c = s.exec(r)) !== null; ) {
    const { 0: g, index: b } = c;
    g.length < 2 || (yield { word: g, pos: b });
  }
}
function z(r, s, c) {
  const {
    check: g,
    suggest: b,
    ignore: y,
    addWord: A,
    messageBuilder: f = N,
    tokenize: S = R,
    languageSelector: E = "*"
  } = c, p = "spellchecker";
  let h = !1;
  const x = async () => {
    if (h) return;
    const n = s.getModel();
    if (!n) return;
    const e = [], a = n.getValue().split(`
`);
    for (let i = 0; i < a.length && !(e.length > 500); i++) {
      const o = S(a[i]);
      for (const { word: l, pos: d } of o) {
        const u = d + 1, k = u + l.length, t = g(l), q = typeof t == "boolean" ? t : await t;
        if (h) return;
        if (!q) {
          const L = {
            startLineNumber: i + 1,
            startColumn: u,
            endLineNumber: i + 1,
            endColumn: k
          };
          e.push({
            code: l,
            startLineNumber: i + 1,
            startColumn: u,
            endLineNumber: i + 1,
            endColumn: k,
            message: f("hover-message", l, L, c),
            severity: c.severity || r.MarkerSeverity.Warning
          });
        }
      }
    }
    r.editor.setModelMarkers(n, p, e);
  }, $ = {
    provideCodeActions: async function(n, e, w, a) {
      if (h) return null;
      const o = r.editor.getModelMarkers({ owner: p, resource: n.uri }).find((t) => e.containsRange.call(t, e));
      if (!o) return null;
      const l = [], d = o.code, u = b(d), k = await Promise.resolve(u);
      if (a.isCancellationRequested) return null;
      if (k.forEach((t) => {
        l.push({
          title: t,
          command: {
            id: v(I),
            title: f("apply-suggestion", t, o, c),
            arguments: [{
              range: o,
              suggestion: t
            }]
          },
          ranges: [o],
          kind: "quickfix"
        });
      }), y) {
        const t = f("ignore", d, o, c);
        l.push({
          title: t,
          command: {
            id: v(C),
            title: t,
            arguments: [d]
          },
          ranges: [o],
          kind: "quickfix"
        });
      }
      if (A) {
        const t = f("add-word", d, o, c);
        l.push({
          title: t,
          command: {
            id: v(M),
            title: t,
            arguments: [d]
          },
          ranges: [o],
          kind: "quickfix"
        });
      }
      return { actions: l, dispose: () => {
      } };
    }
  }, m = [
    s.addAction({
      id: I,
      label: "Spellchecker: Correct",
      run: (n, e) => {
        if (!e || !e.range || !e.suggestion || !n.getModel()) return;
        const { range: a, suggestion: i } = e;
        n.pushUndoStop(), n.executeEdits(p, [{
          range: a,
          text: i
        }]);
      }
    }),
    r.languages.registerCodeActionProvider(E, $)
  ];
  return y && m.push(
    s.addAction({
      id: C,
      label: "Spellchecker: Ignore",
      run: async (n, e) => {
        e && (await y(e), x());
      }
    })
  ), A && m.push(
    s.addAction({
      id: M,
      label: "Spellchecker: Add to Dictionary",
      run: async (n, e) => {
        e && (await A(e), x());
      }
    })
  ), { process: x, dispose: () => {
    r.editor.removeAllMarkers(p), m.forEach((n) => n.dispose()), m.length = 0, h = !0;
  } };
}
export {
  M as addWordActionId,
  I as correctActionId,
  N as defaultMessageBuilder,
  R as defaultTokenize,
  z as getSpellchecker,
  C as ignoreActionId
};
