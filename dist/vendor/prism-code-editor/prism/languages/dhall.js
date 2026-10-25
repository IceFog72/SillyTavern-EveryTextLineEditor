import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/dhall.js
var expression = {
	pattern: /(^..)[^]+(?=.)/,
	lookbehind: true,
	alias: "language-dhall"
};
expression.inside = languages.dhall = {
	"comment": /--.*|\{-(?:[^-{]|-(?!\})|\{(?!-)|\{-(?:[^-{]|-(?!\})|\{(?!-))*-\})*-\}/,
	"string": {
		pattern: /"(?:\\.|[^\\"])*"|''(?:[^']|'(?!')|'''|''\$\{)*''(?!'|\$)/g,
		inside: { "interpolation": {
			pattern: /\$\{[^{}]*\}/,
			inside: {
				"expression": expression,
				"punctuation": /.+/
			}
		} }
	},
	"label": /`[^`]*`/g,
	"url": /\bhttps?:\/\/[\w.:%!$&'*+;=@~-]+(?:\/[\w.:%!$&'*+;=@~-]*)*(?:\?[/?\w.:%!$&'*+;=@~-]*)?/g,
	"env": {
		pattern: /\benv:(?:(?!\d)\w+|"(?:\\.|[^\\"=])*")/g,
		inside: {
			"function": /^env/,
			"operator": /^:/,
			"variable": /[^]+/
		}
	},
	"hash": {
		pattern: /\bsha256:[a-fA-F\d]{64}\b/,
		inside: {
			"function": /sha256/,
			"operator": /:/,
			"number": /[a-fA-F\d]{64}/
		}
	},
	"keyword": /\b(?:as|assert|else|forall|if|in|let|merge|missing|then|toMap|using|with)\b|∀/,
	"builtin": /\b(?:None|Some)\b/,
	"boolean": /\b(?:False|True)\b/,
	"number": /\bNaN\b|-?\bInfinity\b|[+-]?\b(?:0x[a-fA-F\d]+|\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b/,
	"operator": /\/\\|\/\/\\\\|===|[!=]=|\/\/|->|\+\+|&&|\|\||::|[+*#@:?=<>|\\∧⩓≡⫽λ→]/,
	"punctuation": /\.\.|[()[\]{}.,/]/,
	"class-name": /\b[A-Z]\w*\b/
};
//#endregion

//# sourceMappingURL=dhall.js.map