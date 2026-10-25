import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/apl.js
languages.apl = {
	"comment": /(?:⍝|#[! ]).*/,
	"string": /'(?:[^\n']|'')*'/g,
	"number": /¯?(?:\d*\.?\b\d+(?:e[+¯]?\d+)?|¯|∞)(?:j¯?(?:(?:\d+(?:\.\d+)?|\.\d+)(?:e[+¯]?\d+)?|¯|∞))?/i,
	"statement": /:[A-Z][a-z][a-zA-Z]*\b/,
	"system-function": {
		pattern: /⎕[a-z]+/i,
		alias: "function"
	},
	"constant": /[⍬⌾#⎕⍞]/,
	"function": /[×÷⌈⌊∣|⍳⍸?⍟○⌹≤≥≠≡≢∊⍷∪∩~∨∧⍱⍲⍴,⍪⌽⊖⍉↑↓⊂⊃⊆⊇⌷⍋⍒⊤⊥⍕⍎⊣⊢⍁⍂≈⍯↗¤→!=<>*+-]/,
	"monadic-operator": {
		pattern: /[\\/⌿⍀¨⍨⌶&∥]/,
		alias: "operator"
	},
	"dyadic-operator": {
		pattern: /[.⍣⍠⍤∘⌸@⌺⍥]/,
		alias: "operator"
	},
	"assignment": {
		pattern: /←/,
		alias: "keyword"
	},
	"punctuation": /[()[\];◇⋄]/,
	"dfn": {
		pattern: /[{}⍺⍵⍶⍹∇⍫:]/,
		alias: "builtin"
	}
};
//#endregion

//# sourceMappingURL=apl.js.map