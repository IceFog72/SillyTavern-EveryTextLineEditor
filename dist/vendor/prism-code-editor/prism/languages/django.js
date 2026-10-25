import { a as languages, c as tokenize } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation } from "../../patterns-DSInPV_c.js";
import { t as embeddedIn } from "../../templating-BdhIX5ID.js";
import "./markup.js";
//#region src/prism/languages/django.js
languages.jinja2 = languages.django = {
	"django": {
		pattern: /\{(?:\{[^]*?\}|%[^]*?%|#[^]*?#)\}/,
		alias: "language-django",
		inside: {
			"comment": /^\{#[^]+/,
			"tag": {
				pattern: /(^\{%[+-]?\s*)\w+/,
				lookbehind: true,
				alias: "keyword"
			},
			"delimiter": {
				pattern: /^..[+-]?|[+-]?[}%]\}$/g,
				alias: "punctuation"
			},
			"string": /(["'])(?:\\.|(?!\1)[^\\\n])*\1/g,
			"filter": {
				pattern: /(\|)\w+/,
				lookbehind: true,
				alias: "function"
			},
			"test": {
				pattern: /(\bis\s+(?:not\s+)?)(?!not\b)\w+/,
				lookbehind: true,
				alias: "function"
			},
			"function": /\b(?!\d)\w+(?=\s*\()/,
			"keyword": /\b(?:and|as|by|else|f?or|i[fns]|import|loop|not|recursive|with|without)\b/,
			"operator": /!=|\*\*=?|\/\/=?|<>|>>|<<|[%=<>/*+-]=?|[&|^~]/,
			"number": /\b\d+(?:\.\d+)?\b/,
			"boolean": /[Ff]alse|[Nn]one|[Tt]rue/,
			"variable": /\w+/,
			"punctuation": clikePunctuation
		}
	},
	[tokenize]: embeddedIn("html")
};
//#endregion

//# sourceMappingURL=django.js.map