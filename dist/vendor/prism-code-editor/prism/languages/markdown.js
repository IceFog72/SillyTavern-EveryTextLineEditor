import { a as languages, c as tokenize, l as tokenizeText, u as withoutTokenizer } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, n as clone } from "../../language-CXbc22uF.js";
import { n as re, r as replace } from "../../shared-oTKIFAwH.js";
import "./markup.js";
//#region src/prism/languages/markdown.js
var inner = ["(?:\\\\.|[^\\\\\n]|\n(?!\n))"];
/**
* This function is intended for the creation of the bold or italic pattern.
*
* This also adds a lookbehind group to the given pattern to ensure that the pattern is not backslash-escaped.
*
* _Note:_ Keep in mind that this adds a capturing group.
*
* @param {string} pattern
* @returns {RegExp}
*/
var createInline = (pattern) => re(`((?:^|[^\\\\])(?:\\\\\\\\)*)(?:${pattern})`, inner, "g");
var tableCell = /(?:\\.|``(?:[^\n`]|`(?!`))+``|`[^\n`]+`|[^\\\n|`])+/;
var tableRow = replace("\\|?<0>(?:\\|<0>)+\\|?(?:\n|(?![\\s\\S]))", [tableCell.source]);
var tableLine = "\\|?[ 	]*:?-{3,}:?[ 	]*(?:\\|[ 	]*:?-{3,}:?[ 	]*)+\\|?\n";
var markdown = languages.md = languages.markdown = clone(languages.html);
insertBefore(markdown, "prolog", {
	"front-matter-block": {
		pattern: /(^(?:\s*\n)?)---(?!.)[^]*?\n---(?!.)/g,
		lookbehind: true,
		inside: {
			"punctuation": /^---|---$/,
			"front-matter": {
				pattern: /\S(?:[^]*\S)?/,
				alias: "language-yaml",
				inside: "yaml"
			}
		}
	},
	"blockquote": {
		pattern: /^>(?:[ 	]*>)*/m,
		alias: "punctuation"
	},
	"table": {
		pattern: RegExp("^" + tableRow + tableLine + "(?:" + tableRow + ")*", "m"),
		inside: {
			"table-header-row": {
				pattern: /^.+/,
				inside: {
					"table-header": {
						pattern: tableCell,
						alias: "important",
						inside: markdown
					},
					"punctuation": /\|/
				}
			},
			"table-data-rows": {
				pattern: /(.+\n)[^]+/,
				lookbehind: true,
				inside: {
					"table-data": {
						pattern: tableCell,
						inside: markdown
					},
					"punctuation": /\|/
				}
			},
			"table-line": {
				pattern: /.+/,
				inside: { "punctuation": /\S+/ }
			}
		}
	},
	"code-snippet": {
		pattern: /(^|[^\\`])(`+)[^\n`](?:|.*?[^\n`])\2(?!`)/g,
		lookbehind: true,
		alias: "code keyword"
	},
	"code": [{
		pattern: /(^[ 	]*\n)(?:    |	).+(?:\n(?:    |	).+)*/gm,
		lookbehind: true,
		alias: "keyword"
	}, {
		pattern: /^(```+)[^`][^]*?^\1`*$/gm,
		inside: {
			"punctuation": /^`+|`+$/,
			"code-language": /^.+/,
			"code-block": /(?!^)[^]+(?=\n)/,
			[tokenize](code, grammar) {
				var tokens = withoutTokenizer(code, grammar);
				var language;
				if (tokens[5]) {
					language = (/[a-z][\w-]*/i.exec(tokens[1].content.replace(/\b#/g, "sharp").replace(/\b\+\+/g, "pp")) || [""])[0].toLowerCase();
					tokens[3].alias = "language-" + language;
					if (grammar = languages[language]) tokens[3].content = tokenizeText(tokens[3].content, grammar);
				}
				return tokens;
			}
		}
	}],
	"title": [{
		pattern: /\S.*\n(?:==+|--+)(?=[ 	]*$)/gm,
		alias: "important",
		inside: { punctuation: /=+$|-+$/ }
	}, {
		pattern: /(^\s*)#.+/gm,
		lookbehind: true,
		alias: "important",
		inside: { punctuation: /^#+|#+$/ }
	}],
	"hr": {
		pattern: /(^\s*)([*-])(?:[ 	]*\2){2,}(?=\s*$)/m,
		lookbehind: true,
		alias: "punctuation"
	},
	"list": {
		pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[ 	].)/gm,
		lookbehind: true,
		alias: "punctuation"
	},
	"url-reference": {
		pattern: /!?\[[^\]]+\]:[ 	]+(?:\S+|<(?:\\.|[^\\>])+>)(?:[ 	]+(?:"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'|\((?:\\.|[^\\)])*\)))?/g,
		inside: {
			"variable": {
				pattern: /^(!?\[)[^\]]+/,
				lookbehind: true
			},
			"string": /(?:"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'|\((?:\\.|[^\\)])*\))$/,
			"punctuation": /^[[\]!:]|<|>/
		},
		alias: "url"
	},
	"bold": {
		pattern: createInline("\\b__(?:(?!_)<0>|_(?:(?!_)<0>)+_)+__\\b|\\*\\*(?:(?!\\*)<0>|\\*(?:(?!\\*)<0>)+\\*)+\\*\\*"),
		lookbehind: true,
		inside: {
			"content": {
				pattern: /(^..)[^]+(?=..)/,
				lookbehind: true,
				inside: {}
			},
			"punctuation": /../
		}
	},
	"italic": {
		pattern: createInline("\\b_(?:(?!_)<0>|__(?:(?!_)<0>)+__)+_\\b|\\*(?:(?!\\*)<0>|\\*\\*(?:(?!\\*)<0>)+\\*\\*)+\\*"),
		lookbehind: true,
		inside: {
			"content": {
				pattern: /(?!^)[^]+(?=.)/,
				inside: {}
			},
			"punctuation": /./
		}
	},
	"strike": {
		pattern: createInline("(~~?)(?:(?!~)<0>)+\\2"),
		lookbehind: true,
		inside: {
			"punctuation": /^~~?|~~?$/,
			"content": {
				pattern: /[^]+/,
				inside: {}
			}
		}
	},
	"url": {
		pattern: createInline("!?\\[(?:(?!\\])<0>)+\\](?:\\([^\\s)]+(?:[ 	]+\"(?:\\\\.|[^\\\\\"])*\")?\\)|[ 	]?\\[(?:(?!\\])<0>)+\\])"),
		lookbehind: true,
		inside: {
			"operator": /^!/,
			"content": {
				pattern: /(^\[)[^\]]+(?=\])/,
				lookbehind: true,
				inside: {}
			},
			"variable": {
				pattern: /(^\][ 	]?\[)[^\]]+(?=\]$)/,
				lookbehind: true
			},
			"url": {
				pattern: /(^\]\()[^\s)]+/,
				lookbehind: true
			},
			"string": {
				pattern: /(^[ 	]+)"(?:\\.|[^\\"])*"(?=\)$)/,
				lookbehind: true
			},
			"markup-bracket": markdown["markup-bracket"]
		}
	}
});
[
	"url",
	"bold",
	"italic",
	"strike"
].forEach((token) => {
	[
		"url",
		"bold",
		"italic",
		"strike",
		"code-snippet",
		"markup-bracket"
	].forEach((inside) => {
		if (token != inside) markdown[token].inside.content.inside[inside] = markdown[inside];
	});
});
//#endregion

//# sourceMappingURL=markdown.js.map