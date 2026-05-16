import { l as s, i as t } from "../prismCore-AxbjJFmh.js";
import "./markup.js";
import "./csharp.js";
import "./clike.js";
var r = {
  "page-directive": {
    pattern: /<%\s*@\s*(?:Assembly|Control|Implements|Import|Master(?:Type)?|OutputCache|Page|PreviousPageType|Reference|Register)?|%>/i,
    alias: "tag"
  }
}, e = s.aspnet = s.extend("markup", {
  "page-directive": {
    pattern: /<%\s*@.*%>/,
    alias: "tag",
    inside: r
  },
  directive: {
    pattern: /<%.*%>/,
    alias: "tag",
    inside: {
      directive: {
        pattern: /<%\s*?[$=%#:]{0,2}|%>/,
        alias: "tag"
      },
      rest: "csharp"
    }
  }
}), i = e["markup-bracket"], a = e.tag;
delete e["markup-bracket"];
e["markup-bracket"] = i;
r.rest = a.inside;
a.pattern = /<(?!%)\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/;
t("inside", "punctuation", {
  directive: e.directive
}, a.inside["attr-value"]);
t("aspnet", "comment", {
  "asp-comment": {
    pattern: /<%--[\s\S]*?--%>/,
    alias: ["asp", "comment"]
  }
});
t("aspnet", e.script ? "script" : "tag", {
  "asp-script": {
    pattern: /(<script(?=.*runat=['"]?server\b)[^>]*>)[\s\S]*?(?=<\/script>)/i,
    lookbehind: !0,
    alias: ["asp", "script"],
    inside: "csharp"
  }
});
//# sourceMappingURL=aspnet.js.map
