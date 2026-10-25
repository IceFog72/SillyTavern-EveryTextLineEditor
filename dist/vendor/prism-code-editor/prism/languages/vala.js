import { a as languages, s as rest } from "../../core-Dr0o9A-8.js";
import { a as clikeString, i as clikePunctuation, n as clikeComment, o as dotPunctuation, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/vala.js
languages.vala = {
	"comment": clikeComment,
	"raw-string": {
		pattern: /"""[^]*?"""/g,
		alias: "string"
	},
	"template-string": {
		pattern: /@"[^"]*"/g,
		inside: {
			"interpolation": {
				pattern: /\$(?:\([^)]*\)|[a-zA-Z]\w*)/,
				inside: {
					"delimiter": {
						pattern: /^.\(?|\)$/g,
						alias: "punctuation"
					},
					[rest]: "vala"
				}
			},
			"string": /[^]+/
		}
	},
	"string": clikeString,
	"class-name": [
		{
			pattern: /\b[A-Z]\w*(?:\.\w+)*\b(?=(?:\?\s+|\*?\s+\*?)\w)|(\[)[A-Z]\w*(?:\.\w+)*\b/,
			lookbehind: true,
			inside: dotPunctuation
		},
		{
			pattern: /(\b(?:class|interface)\s+[A-Z]\w*(?:\.\w+)*\s*:\s*)[A-Z]\w*(?:\.\w+)*\b/,
			lookbehind: true,
			inside: dotPunctuation
		},
		{
			pattern: /((?:\b(?:class|enum|interface|new|struct)\s+)|(?:catch\s+\())[A-Z]\w*(?:\.\w+)*\b/,
			lookbehind: true,
			inside: dotPunctuation
		}
	],
	"regex": {
		pattern: /\/(?:\[(?:\\.|[^\\\n\]])*\]|\\.|[^\\\n/[])+\/[imsx]{0,4}(?=\s*(?:$|[\n,.;})\]]))/g,
		inside: {
			"regex-flags": /\w+$/,
			"regex-delimiter": /^\/|\/$/,
			"regex-source": {
				pattern: /[^]+/,
				alias: "language-regex",
				inside: "regex"
			}
		}
	},
	"keyword": /\b(?:abstract|as|assert|async|[bc]ase|bool|break|catch|class|const|construct|continue|default|delegate|delete|do|double|dynamic|else|ensures|enum|errordomain|extern|finally|float|for|foreach|[gs]et|i[fns]|inline|interface|internal|lock|namespace|new|null|out|override|owned|params|private|protected|public|ref|requires|return|signal|sizeof|ss?ize_t|static|string|struct|switch|this|throws?|try|typeof|u?char|u?int(?:8|16|32|64)?|u?long|unichar|unowned|u?short|using|value|var|virtual|void|volatile|weak|while|yield)\b/i,
	"boolean": boolean,
	"function": /\b\w+(?=\s*\()/,
	"number": /(?:\b0x[a-f\d]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)(?:f|u?l?)?/i,
	"operator": /--|\+\+|&&|\|\||=>|->|~|>>=?|<<=?|[%&|^!=<>/*+-]=?|\?\??|\.{3}/,
	"punctuation": clikePunctuation,
	"constant": /\b[A-Z\d_]+\b/
};
//#endregion

//# sourceMappingURL=vala.js.map