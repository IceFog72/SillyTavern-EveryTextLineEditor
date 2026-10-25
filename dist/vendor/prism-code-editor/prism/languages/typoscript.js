import { a as languages } from "../../core-Dr0o9A-8.js";
import { o as dotPunctuation } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/typoscript.js
var keywords = /\b(?:ACT|ACTIFSUB|CARRAY|CASE|CLEARGIF|COA|COA_INT|CONSTANTS|CONTENT|CUR|EDITPANEL|EFFECT|EXT|FILE|FLUIDTEMPLATE|FORM|FRAME|FRAMESET|GIFBUILDER|[GHT]MENU|GMENU_FOLDOUT|[GT]MENU_LAYERS|GP|HRULER|HTML|IENV|IFSUB|IMAGE|IMGMENU|IMGMENUITEM|IMGTEXT|IMG_RESOURCE|INCLUDE_TYPOSCRIPT|JSMENU|JSMENUITEM|LLL|LOAD_REGISTER|NO|PAGE|RECORDS|RESTORE_REGISTER|TEMPLATE|TEXT|TMENUITEM|USER|USER_INT|_GIFBUILDER|global|globalString|globalVar)\b/;
languages.tsconfig = languages.typoscript = {
	"comment": [
		/\/\*[^]*?(?:\*\/|$)/,
		{
			pattern: /(^|[^\\:= 	]|(?:^|[^= 	])[ 	]+)\/\/.*/g,
			lookbehind: true
		},
		{
			pattern: /(^|[^"'])#.*/g,
			lookbehind: true
		}
	],
	"function": [{
		pattern: /<INCLUDE_TYPOSCRIPT:\s*source\s*=\s*(?:"[^\n"]*"|'[^\n']*')\s*>/,
		inside: {
			"string": {
				pattern: /"[^\n"]*"|'[^\n']*'/,
				inside: { "keyword": keywords }
			},
			"keyword": /INCLUDE_TYPOSCRIPT/
		}
	}, {
		pattern: /@import\s*(?:"[^\n"]*"|'[^\n']*')/,
		inside: { "string": /"[^\n"]*"|'[^\n']*'/ }
	}],
	"string": {
		pattern: /^((?:[^=]|=\n)*=[< ]?).*[^\n\]]/,
		lookbehind: true,
		inside: {
			"function": /\{\$.*\}/,
			"keyword": keywords,
			"number": /^\d+$/,
			"punctuation": /[,:|]/
		}
	},
	"keyword": keywords,
	"number": {
		pattern: /\b\d+\s*[.{=]/,
		inside: { "operator": /[.{=]/ }
	},
	"tag": {
		pattern: /\.?[-\w\\]+\.?/,
		inside: dotPunctuation
	},
	"punctuation": /[()[\]{}.,:;|]/,
	"operator": /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/
};
//#endregion

//# sourceMappingURL=typoscript.js.map