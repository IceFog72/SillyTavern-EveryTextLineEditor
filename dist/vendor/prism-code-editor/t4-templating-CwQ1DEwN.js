//#region src/prism/utils/t4-templating.js
var createBlock = (prefix, insideLang) => ({
	pattern: RegExp(`<#${prefix}[^]*?#>`),
	alias: "block",
	inside: {
		"delimiter": {
			pattern: RegExp(`^<#${prefix}|#>$`),
			alias: "important"
		},
		"content": {
			pattern: /[^]+/,
			alias: typeof insideLang == "string" ? "language-" + insideLang : void 0,
			inside: insideLang
		}
	}
});
var createT4 = (insideLang) => ({ "block": {
	pattern: /<#[^]+?#>/,
	inside: {
		"directive": createBlock("@", {
			"attr-value": {
				pattern: /=(?:(["'])(?:\\[^]|(?!\1)[^\\])*\1|[^\s"'=>]+)/,
				inside: { "punctuation": /^=["']?|["']$/g }
			},
			"keyword": /\b\w+(?=\s)/,
			"attr-name": /\w+/
		}),
		"expression": createBlock("=", insideLang),
		"class-feature": createBlock("\\+", insideLang),
		"standard": createBlock("", insideLang)
	}
} });
//#endregion
export { createT4 as t };

//# sourceMappingURL=t4-templating-CwQ1DEwN.js.map