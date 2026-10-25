import { a as languages, c as tokenize, t as Token, u as withoutTokenizer } from "../../core-Dr0o9A-8.js";
import { r as extend } from "../../language-CXbc22uF.js";
import { n as re } from "../../shared-oTKIFAwH.js";
import "./markup.js";
//#region src/prism/languages/xquery.js
var xquery = languages.xquery = extend("xml", {
	"xquery-comment": {
		pattern: /\(:[^]*?:\)/g,
		alias: "comment"
	},
	"string": /"(?:""|[^"])*"|'(?:''|[^'])*'/g,
	"extension": {
		pattern: /\(#.+?#\)/,
		alias: "symbol"
	},
	"variable": /\$[-\w:]+/,
	"axis": {
		pattern: /(^|[^-])(?:ancestor(?:-or-self)?|attribute|child|descendant(?:-or-self)?|following(?:-sibling)?|parent|preceding(?:-sibling)?|self)(?=::)/,
		lookbehind: true,
		alias: "operator"
	},
	"keyword-operator": {
		pattern: /(^|[^:-])\b(?:and|castable as|eq|except|[gl][et]|i?div|instance of|intersect|is|mod|ne|or|union)\b(?=$|[^:-])/,
		lookbehind: true,
		alias: "operator"
	},
	"keyword": {
		pattern: /(^|[^:-])\b(?:as|ascending|at|base-uri|boundary-space|case|cast as|collation|construction|copy-namespaces|declare|default|descending|else|empty (?:greatest|least)|encoding|every|external|for|function|if|import|in|inherit|lax|let|map|module|namespace|no-inherit|no-preserve|option|order(?: by|ed|ing)?|preserve|return|satisfies|schema|some|stable|strict|strip|then|to|treat as|typeswitch|unordered|validate|variable|version|where|xquery)\b(?=$|[^:-])/,
		lookbehind: true
	},
	"function": /[\w-]+(?::[\w-]+)*(?=\s*\()/,
	"xquery-element": {
		pattern: /(element\s+)[\w-]+(?::[\w-]+)*/,
		lookbehind: true,
		alias: "tag"
	},
	"xquery-attribute": {
		pattern: /(attribute\s+)[\w-]+(?::[\w-]+)*/,
		lookbehind: true,
		alias: "attr-name"
	},
	"builtin": {
		pattern: /(^|[^:-])\b(?:attribute|comment|document|element|processing-instruction|text|xs:(?:ENTITIES|ENTITY|ID|IDREFS?|NCName|NMTOKENS?|NOTATION|Q?Name|anyAtomicType|anyType|anyURI|base64Binary|boolean|byte|date|dateTime|dayTimeDuration|decimal|double|duration|float|gDay|gMonth|gMonthDay|gYear|gYearMonth|hexBinary|int|integer|language|long|negativeInteger|nonNegativeInteger|nonPositiveInteger|normalizedString|positiveInteger|short|string|time|token|unsigned(?:Byte|Int|Long|Short)|untyped(?:Atomic)?|yearMonthDuration))\b(?=$|[^:-])/,
		lookbehind: true
	},
	"number": /\b\d+(?:\.\d+)?(?:E[+-]?\d+)?/,
	"operator": {
		pattern: /[=?|@*+]|\.\.?|:=|!=|<[=<]?|>[=>]?|(\s)-(?!\S)/,
		lookbehind: true
	},
	"punctuation": /[()[\]{},:;/]/,
	[tokenize](code, grammar) {
		var position = 0, tokens = withoutTokenizer(code, grammar);
		var i = 0, openedTags = [], l = 0;
		var token;
		var j = 0;
		var textStartPos;
		var content;
		var last;
		var addStoredText = () => {
			if (textStartPos) {
				content = code.slice(textStartPos, position);
				tokens[j++] = new Token("plain-text", content, content);
				textStartPos = 0;
			}
		};
		for (; token = tokens[i]; i++) {
			var length = token.length;
			var isNeverText = token.type;
			var tag, start;
			if (isNeverText && isNeverText != "comment") {
				content = token.content;
				if (isNeverText == "tag") {
					start = content[0].length;
					tag = code.substr(position + start, content[1].length);
					if (start > 1) {
						if (l && last[0] == tag) last = openedTags[--l - 1];
					} else if (content[content.length - 1].length < 2) openedTags[l++] = last = [tag, 0];
				} else if (l && isNeverText == "punctuation") {
					if (content == "{") {
						if (code[position + 1] == content && !last[1]) {
							i++;
							length++;
							isNeverText = false;
						} else last[1]++;
					} else if (last[1] && content == "}") last[1]--;
					else isNeverText = false;
				} else isNeverText = false;
			}
			if (!isNeverText && l && !last[1]) {
				if (!textStartPos) textStartPos = position;
			} else {
				addStoredText();
				tokens[j++] = token;
			}
			position += length;
		}
		addStoredText();
		tokens.length = j;
		return tokens;
	}
});
var tag = xquery.tag;
var attrValue = tag.inside["attr-value"][0];
var expression = ["\\{(?!\\{)(?:[^{}]|\\{(?:[^{}]|\\{[^}]*\\})*\\})*\\}"];
tag.pattern = re("</?(?!\\d)[^\\s/=>$<%]+(?:\\s+[^\\s/=>]+(?:\\s*=\\s*([\"'])(?:\\{\\{|<0>|(?!\\1)[^{])*\\1)?)*\\s*/?>", expression, "g");
attrValue.pattern = re("(=\\s*)([\"'])(?:\\{\\{|<0>|(?!\\2)[^{])*\\2", expression, "g");
attrValue.inside["expression"] = {
	pattern: re("((?:^|[^{])(?:\\{\\{)*)<0>", expression),
	lookbehind: true,
	alias: "language-xquery",
	inside: xquery
};
delete xquery["markup-bracket"];
//#endregion

//# sourceMappingURL=xquery.js.map