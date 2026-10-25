import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/cooklang.js
var single_token_suffix = "(?:(?!\\s)[\\d$+<=a-zA-Z\\x80-\\uffff])+";
var multi_token_infix = "[^{}@#]+";
var multi_token = multi_token_infix + "\\{[^}#@]*\\}";
languages.cooklang = {
	"comment": /\[-[^]*?-\]|--.*/,
	"meta": {
		pattern: />>.*:.*/,
		inside: { "property": {
			pattern: /(>>\s*)[^\s:](?:[^:]*[^\s:])?/,
			lookbehind: true
		} }
	},
	"cookware-group": {
		pattern: RegExp(`#(?:${multi_token}|${single_token_suffix})`),
		inside: {
			"cookware": {
				pattern: RegExp(`(^#)(?:${multi_token_infix})`),
				lookbehind: true,
				alias: "variable"
			},
			"cookware-keyword": {
				pattern: /^#/,
				alias: "keyword"
			},
			"quantity-group": {
				pattern: /\{[^{}@#]*\}/,
				inside: {
					"punctuation": /[{}]/,
					"quantity": {
						pattern: /[^]+/,
						alias: "number"
					}
				}
			}
		}
	},
	"ingredient-group": {
		pattern: RegExp(`@(?:${multi_token}|${single_token_suffix})`),
		inside: {
			"ingredient": {
				pattern: RegExp(`(^@)(?:${multi_token_infix})`),
				lookbehind: true,
				alias: "variable"
			},
			"ingredient-keyword": {
				pattern: /^@/,
				alias: "keyword"
			},
			"amount-group": {
				pattern: /\{[^{}]*\}/,
				inside: {
					"amount": {
						pattern: /([\{|])[^{}|*%]+/,
						lookbehind: true,
						alias: "number"
					},
					"unit": {
						pattern: /(%)[^}]+/,
						lookbehind: true,
						alias: "symbol"
					},
					"servings-scaler": {
						pattern: /\*/,
						alias: "operator"
					},
					"servings-alternative-separator": {
						pattern: /\|/,
						alias: "operator"
					},
					"unit-separator": {
						pattern: /(?:%|(\*)%)/,
						lookbehind: true,
						alias: "operator"
					},
					"punctuation": /[{}]/
				}
			}
		}
	},
	"timer-group": {
		pattern: /~(?!\s)[^@#~{}]*\{[^{}]*\}/,
		inside: {
			"timer": {
				pattern: /(^~)[^{]+/,
				lookbehind: true,
				alias: "variable"
			},
			"duration-group": {
				pattern: /\{[^{}]*\}/,
				inside: {
					"punctuation": /[{}]/,
					"unit": {
						pattern: /(%\s*)(?:h|hours|hrs|m|min|minutes)\b/,
						lookbehind: true,
						alias: "symbol"
					},
					"operator": /%/,
					"duration": {
						pattern: /\d+/,
						alias: "number"
					}
				}
			},
			"timer-keyword": {
				pattern: /^~/,
				alias: "keyword"
			}
		}
	}
};
//#endregion

//# sourceMappingURL=cooklang.js.map