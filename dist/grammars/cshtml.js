import { l as i, i as c } from "../prismCore-AxbjJFmh.js";
import "./markup.js";
import "./csharp.js";
import "./clike.js";
var $ = /\/(?![/*])|\/\/.*[\r\n]|\/\*[^*]*(?:\*(?!\/)[^*]*)*\*\//.source, v = `@(?!")|"(?:[^\\r\\n\\\\"]|\\\\.)*"|@"(?:[^\\\\"]|""|\\\\[\\s\\S])*"(?!")|'(?:(?:[^\\r\\n'\\\\]|\\\\.|\\\\[Uux][\\da-fA-F]{1,8})'|(?=[^\\\\](?!')))`, a = (t, d) => {
  for (var p = 0; p < d; p++)
    t = t.replace(/<self>/g, () => "(?:" + t + ")");
  return t.replace(/<self>/g, "[^\\s\\S]").replace(/<str>/g, `(?:${v})`).replace(/<comment>/g, `(?:${$})`);
}, r = a(/\((?:[^()'"@/]|<str>|<comment>|<self>)*\)/.source, 2), h = a(/\[(?:[^\[\]'"@/]|<str>|<comment>|<self>)*\]/.source, 1), e = a(/\{(?:[^{}'"@/]|<str>|<comment>|<self>)*\}/.source, 2), k = a(/<(?:[^<>'"@/]|<comment>|<self>)*>/.source, 1), u = `@(?:await\\b\\s*)?(?:(?!await\\b)\\w+\\b|${r})(?:[?!]?\\.\\w+\\b|(?:${k})?${r}|${h})*(?![?!\\.(\\[]|<(?!\\/))`, f = "@(?![\\w()])|" + u, g = `(?:"[^"@]*"|'[^'@]*'|[^\\s'"@>=]+(?=[\\s>])|["'][^"'@]*(?:(?:${f})[^"'@]*)+["'])`, o = `(?:\\s(?:\\s*[^\\s>\\/=]+(?:\\s*=\\s*${g}|(?=[\\s/>])))+)?`, n = `(?!\\d)[^\\s>\\/=$<%]+${o}\\s*\\/?>`, b = `\\B@?(?:<([a-zA-Z][\\w:]*)${o}\\s*>(?:[^<]|<\\/?(?!\\1\\b)${n}|${a(
  `<\\1${o}\\s*>(?:[^<]|<\\/?(?!\\1\\b)${n}|<self>)*<\\/\\1\\s*>`,
  2
)})*<\\/\\1\\s*>|<${n})`, s = i.razor = i.cshtml = i.extend("markup", {}), w = c("csharp", "string", {
  html: {
    pattern: RegExp(b),
    greedy: !0,
    inside: s
  }
}, { csharp: i.extend("csharp", {}) }), l = {
  pattern: /\S[\s\S]*/,
  alias: "language-csharp",
  inside: w
}, m = {
  pattern: RegExp(/(^|[^@])/.source + u),
  lookbehind: !0,
  greedy: !0,
  alias: "variable",
  inside: {
    keyword: /^@/,
    csharp: l
  }
}, y = s["markup-bracket"];
delete s["markup-bracket"];
s["markup-bracket"] = y;
s.tag.pattern = RegExp(/<\/?/.source + n);
s.tag.inside["attr-value"].pattern = RegExp(/=\s*/.source + g);
c("inside", "punctuation", { value: m }, s.tag.inside["attr-value"]);
c("cshtml", "prolog", {
  "razor-comment": {
    pattern: /@\*[\s\S]*?\*@/,
    greedy: !0,
    alias: "comment"
  },
  block: {
    pattern: RegExp(
      `(^|[^@])@(?:${e}|(?:code|functions)\\s*${e}|(?:for|foreach|lock|switch|using|while)\\s*${r}\\s*${e}|do\\s*${e}\\s*while\\s*${r}(?:\\s*;)?|try\\s*${e}\\s*catch\\s*${r}\\s*${e}\\s*finally\\s*${e}|if\\s*${r}\\s*${e}(?:\\s*else(?:\\s+if\\s*${r})?\\s*${e})*|helper\\s+\\w+\\s*${r}\\s*${e})`
    ),
    lookbehind: !0,
    greedy: !0,
    inside: {
      keyword: /^@\w*/,
      csharp: l
    }
  },
  directive: {
    pattern: /^([ \t]*)@(?:addTagHelper|attribute|implements|inherits|inject|layout|model|namespace|page|preservewhitespace|removeTagHelper|section|tagHelperPrefix|using)(?=\s).*/m,
    lookbehind: !0,
    greedy: !0,
    inside: {
      keyword: /^@\w+/,
      csharp: l
    }
  },
  value: m,
  "delegate-operator": {
    pattern: /(^|[^@])@(?=<)/,
    lookbehind: !0,
    alias: "operator"
  }
});
//# sourceMappingURL=cshtml.js.map
