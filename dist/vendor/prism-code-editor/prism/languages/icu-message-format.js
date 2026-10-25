import { a as languages, s as rest } from "../../core-Dr0o9A-8.js";
import { r as replace, t as nested } from "../../shared-oTKIFAwH.js";
//#region src/prism/languages/icu-message-format.js
var stringPattern = /'[{}:=,](?:[^']|'')*'(?!')/g;
var escape = {
	pattern: /''/g,
	alias: "operator"
};
var string = {
	pattern: stringPattern,
	inside: { "escape": escape }
};
var message = { pattern: /(?!^)[^]+(?=.)/ };
var choiceStyleInside = {
	"punctuation": /\|/,
	"range": {
		pattern: /^(\s*)[+-]?(?:\d+(?:\.\d*)?|∞)\s*[<#≤]/,
		lookbehind: true,
		inside: {
			"operator": /[<#≤]/,
			"number": /\S+/
		}
	}
};
var argumentSource = nested(replace("\\{(?:[^{}']|'(?![{},'])|''|<0>|<self>)*\\}", [stringPattern.source]), 3);
var nestedMessage = {
	pattern: RegExp(argumentSource),
	inside: {
		"message": message,
		"message-delimiter": {
			pattern: /./,
			alias: "punctuation"
		}
	}
};
choiceStyleInside[rest] = message.inside = languages["icu-message-format"] = {
	"argument": {
		pattern: RegExp(argumentSource, "g"),
		inside: {
			"content": {
				pattern: /(?!^)[^]+(?=.)/,
				inside: {
					"argument-name": {
						pattern: /^(\s*)[^{}:=,\s]+/,
						lookbehind: true
					},
					"choice-style": {
						pattern: /^(\s*,\s*choice\s*,\s*)\S(?:[^]*\S)?/,
						lookbehind: true,
						inside: choiceStyleInside
					},
					"plural-style": {
						pattern: /^(\s*,\s*(?:plural|selectordinal)\s*,\s*)\S(?:[^]*\S)?/,
						lookbehind: true,
						inside: {
							"offset": /^offset:\s*\d+/,
							"nested-message": nestedMessage,
							"selector": {
								pattern: /=\d+|[^{}:=,\s]+/,
								inside: { "keyword": /^(?:few|many|one|other|two|zero)$/ }
							}
						}
					},
					"select-style": {
						pattern: /^(\s*,\s*select\s*,\s*)\S(?:[^]*\S)?/,
						lookbehind: true,
						inside: {
							"nested-message": nestedMessage,
							"selector": {
								pattern: /[^{}:=,\s]+/,
								inside: { "keyword": /^other$/ }
							}
						}
					},
					"keyword": /\b(?:choice|plural|select|selectordinal)\b/,
					"arg-type": {
						pattern: /\b(?:date|duration|number|ordinal|spellout|time)\b/,
						alias: "keyword"
					},
					"arg-skeleton": {
						pattern: /(,\s*)::[^{}:=,\s]+/,
						lookbehind: true
					},
					"arg-style": {
						pattern: /(,\s*)(?:currency|full|integer|long|medium|percent|short)(?=\s*$)/,
						lookbehind: true
					},
					"arg-style-text": {
						pattern: RegExp("(^\\s*,\\s*(?!\\s))" + nested("(?:[^{}']|'[^']*'|\\{(?:<self>)?\\})+", 3) + "$"),
						lookbehind: true,
						alias: "string"
					},
					"punctuation": /,/
				}
			},
			"argument-delimiter": {
				pattern: /./,
				alias: "operator"
			}
		}
	},
	"escape": escape,
	"string": string
};
//#endregion

//# sourceMappingURL=icu-message-format.js.map