import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, n as clone } from "../../language-CXbc22uF.js";
import { n as re } from "../../shared-oTKIFAwH.js";
import "./markup.js";
//#region src/prism/languages/textile.js
var replacements = ["(?:\\([^|()\n]+\\)|\\[[^\\]\n]+\\]|\\{[^\n}]+\\})", "(?:\\)|\\((?![^|()\n]+\\)))"];
var modifierTokens = {
	"css": {
		pattern: /\{[^{}]+\}/,
		inside: "css"
	},
	"class-id": {
		pattern: /(\()[^()]+(?=\))/,
		lookbehind: true,
		alias: "attr-value"
	},
	"lang": {
		pattern: /(\[)[^[\]]+(?=\])/,
		lookbehind: true,
		alias: "attr-value"
	},
	"punctuation": /[\\/]\d+|\S/
};
var phraseInlineInside = {
	"bold": {
		pattern: re("(^(\\*\\*?)<0>*).+?(?=\\2)", replacements),
		lookbehind: true
	},
	"italic": {
		pattern: re("(^(__?)<0>*).+?(?=\\2)", replacements),
		lookbehind: true
	},
	"cite": {
		pattern: re("(^\\?\\?<0>*).+?(?=\\?\\?)", replacements),
		lookbehind: true,
		alias: "string"
	},
	"code": {
		pattern: re("(^@<0>*).+?(?=@)", replacements),
		lookbehind: true,
		alias: "keyword"
	},
	"inserted": {
		pattern: re("(^\\+<0>*).+?(?=\\+)", replacements),
		lookbehind: true
	},
	"deleted": {
		pattern: re("(^-<0>*).+?(?=-)", replacements),
		lookbehind: true
	},
	"span": {
		pattern: re("(^%<0>*).+?(?=%)", replacements),
		lookbehind: true
	},
	"modifier": {
		pattern: re("(^\\*\\*|__|\\?\\?|[*_%@^~+-])<0>+", replacements),
		lookbehind: true,
		inside: modifierTokens
	},
	"punctuation": /[*_%?@^~+-]+/
};
var phraseTableInside = {
	"modifier": {
		pattern: re("(^|\\|\n?)(?:<0>|<1>|[<>=^~_]|[\\\\/]\\d+)+(?=\\.)", replacements),
		lookbehind: true,
		inside: modifierTokens
	},
	"punctuation": /\||^\./
};
var phraseInside = {
	"block-tag": {
		pattern: re("^[a-z]\\w*(?:<0>|<1>|[<>=])*\\.", replacements),
		inside: {
			"modifier": {
				pattern: re("(^[a-z]\\w*)(?:<0>|<1>|[<>=])+(?=\\.)", replacements),
				lookbehind: true,
				inside: modifierTokens
			},
			"tag": /^[a-z]\w*/,
			"punctuation": /\.$/
		}
	},
	"list": {
		pattern: re("^[*#]+<0>*\\s+\\S.*", replacements, "m"),
		inside: {
			"modifier": {
				pattern: re("(^[*#]+)<0>+", replacements),
				lookbehind: true,
				inside: modifierTokens
			},
			"punctuation": /^[*#]+/
		}
	},
	"table": {
		pattern: re("^(?:(?:<0>|<1>|[<>=^~])+\\.\\s*)?(?:\\|(?:(?:<0>|<1>|[<>=^~_]|[\\\\/]\\d+)+\\.|(?!(?:<0>|<1>|[<>=^~_]|[\\\\/]\\d+)+\\.))[^|]*)+\\|", replacements, "m"),
		inside: phraseTableInside
	},
	"inline": {
		pattern: re("(^|[^a-zA-Z\\d])(\\*\\*|__|\\?\\?|[*_%@^~+-])<0>*.+?\\2(?![a-zA-Z\\d])", replacements),
		lookbehind: true,
		inside: phraseInlineInside
	},
	"link-ref": {
		pattern: /^\[[^\]]+\]\S+$/m,
		inside: {
			"string": {
				pattern: /(^\[)[^\]]+(?=\])/,
				lookbehind: true
			},
			"url": {
				pattern: /(^\])\S+$/,
				lookbehind: true
			},
			"punctuation": /[[\]]/
		}
	},
	"link": {
		pattern: re("\"<0>*[^\"]+\":\\S+(?=\\S)[\\w/]?", replacements),
		inside: {
			"text": {
				pattern: re("(^\"<0>*)[^\"]+(?=\")", replacements),
				lookbehind: true
			},
			"modifier": {
				pattern: re("(^\")<0>+", replacements),
				lookbehind: true,
				inside: modifierTokens
			},
			"url": {
				pattern: /(:).+/,
				lookbehind: true
			},
			"punctuation": /[":]/
		}
	},
	"image": {
		pattern: re("!(?:<0>|<1>|[<>=])*(?![<>=])[^!\\s()]+(?:\\([^)]+\\))?!(?::\\S+(?=\\S)[\\w/]?)?", replacements),
		inside: {
			"source": {
				pattern: re("(^!(?:<0>|<1>|[<>=])*)(?![<>=])[^!\\s()]+(?:\\([^)]+\\))?(?=!)", replacements),
				lookbehind: true,
				alias: "url"
			},
			"modifier": {
				pattern: re("(^!)(?:<0>|<1>|[<>=])+", replacements),
				lookbehind: true,
				inside: modifierTokens
			},
			"url": {
				pattern: /(:).+/,
				lookbehind: true
			},
			"punctuation": /[!:]/
		}
	},
	"footnote": {
		pattern: /\b\[\d+\]/,
		alias: "comment",
		inside: { "punctuation": /[[\]]/ }
	},
	"acronym": {
		pattern: /\b[A-Z\d]+\([^)]+\)/,
		inside: {
			"comment": {
				pattern: /(\()[^()]+(?=\))/,
				lookbehind: true
			},
			"punctuation": /[()]/
		}
	},
	"mark": {
		pattern: /\b\((?:C|R|TM)\)/,
		alias: "comment",
		inside: { "punctuation": /[()]/ }
	}
};
var textile = languages.textile = clone(languages.html);
var nestedPatterns = {};
insertBefore(textile, "markup-bracket", { "phrase": {
	pattern: /(^|\n)\S[^]*?(?=$|\n\n)/,
	lookbehind: true,
	inside: phraseInside
} });
[
	"bold",
	"italic",
	"inserted",
	"deleted",
	"span"
].forEach((p) => phraseInlineInside[p].inside = nestedPatterns);
[
	"inline",
	"link",
	"image",
	"footnote",
	"acronym",
	"mark"
].forEach((p) => nestedPatterns[p] = phraseTableInside[p] = phraseInside[p]);
textile.tag.pattern = /<\/?(?!\d)[a-z\d]+(?:\s+[^\s/=>]+(?:=(?:"[^"]*"|'[^']'|[^\s"'>=]+))?)*\s*\/?>/gi;
//#endregion

//# sourceMappingURL=textile.js.map