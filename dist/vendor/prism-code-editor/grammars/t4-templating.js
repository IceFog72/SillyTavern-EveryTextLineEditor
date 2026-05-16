import { l as r } from "../prismCore-AxbjJFmh.js";
var t = (e, a) => ({
  pattern: RegExp(`<#${e}[\\s\\S]*?#>`),
  alias: "block",
  inside: {
    delimiter: {
      pattern: RegExp(`^<#${e}|#>$`),
      alias: "important"
    },
    content: {
      pattern: /[\s\S]+/,
      alias: typeof a == "string" ? "language-" + a : void 0,
      inside: a
    }
  }
}), s = (e) => ({
  block: {
    pattern: /<#[\s\S]+?#>/,
    inside: {
      directive: t("@", {
        "attr-value": {
          pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/,
          inside: {
            punctuation: /^=|^["']|["']$/
          }
        },
        keyword: /\b\w+(?=\s)/,
        "attr-name": /\b\w+/
      }),
      expression: t("=", e),
      "class-feature": t("\\+", e),
      standard: t("", e)
    }
  }
});
r["t4-templating"] = Object.defineProperty({}, "createT4", { value: s });
//# sourceMappingURL=t4-templating.js.map
