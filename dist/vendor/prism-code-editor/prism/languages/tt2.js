import { a as languages, c as tokenize } from "../../core-Dr0o9A-8.js";
import { r as clikeNumber, t as boolean } from "../../patterns-DSInPV_c.js";
import { t as embeddedIn } from "../../templating-BdhIX5ID.js";
import { t as clikeClass } from "../../clike-class-CXD3NFPG.js";
import "./markup.js";
//#region src/prism/languages/tt2.js
languages.tt2 = {
	"tt2": {
		pattern: /\[%[^]*?%\]/,
		alias: "language-tt2",
		inside: {
			"comment": /#.*|^..#[^]+/g,
			"string": [/'[^\\']*(?:\\[^][^\\']*)*'/g, {
				pattern: /"[^\\"]*(?:\\[^][^\\"]*)*"/g,
				inside: { "variable": /\$(?:[a-z]\w*(?:\.(?:\d+|\$?[a-z]\w*))*)/i }
			}],
			"class-name": clikeClass(),
			"delimiter": {
				pattern: /^..-?|-?%\]$/g,
				alias: "punctuation"
			},
			"keyword": /\b(?:BLOCK|CALL|CASE|CATCH|CLEAR|DEBUG|DEFAULT|ELSE|ELSIF|END|FILTER|FINAL|FOREACH|[GS]ET|IF|IN|INCLUDE|INSERT|LAST|MACRO|META|NEXT|PERL|PROCESS|RAWPERL|RETURN|STOP|SWITCH|TAGS|THROW|TRY|UNLESS|USE|WHILE|WRAPPER)\b/,
			"boolean": boolean,
			"function": /\b\w+(?=\()/,
			"operator": /=>|[!=<>]=?|&&|\|\|?|\b(?:and|not|or)\b/,
			"variable": /\b[a-z]\w*(?:\s*\.\s*(?:\d+|\$?[a-z]\w*))*\b/i,
			"number": clikeNumber,
			"punctuation": /[()[\]{},]/
		}
	},
	[tokenize]: embeddedIn("html")
};
//#endregion

//# sourceMappingURL=tt2.js.map