import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation, n as clikeComment, r as clikeNumber, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/haxe.js
languages.haxe = {
	"comment": clikeComment,
	"string-interpolation": {
		pattern: /'(?:\\[^]|[^\\'])*'/g,
		inside: {
			"interpolation": {
				pattern: /(^|[^\\])\$(?:\w+|\{[^{}]+\})/,
				lookbehind: true,
				inside: {
					"interpolation-punctuation": {
						pattern: /^.\{?|\}$/g,
						alias: "punctuation"
					},
					"expression": {
						pattern: /[^]+/,
						inside: "haxe"
					}
				}
			},
			"string": /[^]+/
		}
	},
	"string": { pattern: /"(?:\\[^]|[^\\"])*"/g },
	"regex": {
		pattern: /~\/(?:\\.|[^\\\n/])+\/[a-z]*/g,
		inside: {
			"regex-flags": /\w+$/,
			"regex-delimiter": /^~\/|\/$/,
			"regex-source": {
				pattern: /[^]+/,
				alias: "language-regex",
				inside: "regex"
			}
		}
	},
	"class-name": [{
		pattern: /(\b(?:abstract|class|enum|extends|implements|interface|new|typedef)\s+)[A-Z_]\w*/,
		lookbehind: true
	}, /\b[A-Z]\w*/],
	"preprocessor": {
		pattern: /#(?:else|elseif|end|if)\b.*/,
		alias: "property"
	},
	"metadata": {
		pattern: /@:?[\w.]+/,
		alias: "symbol"
	},
	"reification": {
		pattern: /\$(?:\w+|(?=\{))/,
		alias: "important"
	},
	"keyword": /\bthis\b|\b(?:abstract|as|break|cas[et]|catch|class|continue|default|do|dynamic|else|enum|extends|extern|final|for|from|function|if|implements|import|in|inline|interface|macro|new|null|operator|overload|override|package|private|public|return|static|super|switch|throw|to|try|typedef|untyped|using|var|while)(?!\.)\b/,
	"boolean": boolean,
	"function": /\b[a-z_]\w*(?=\s*(?:<[^<>]*>\s*)?\()/gi,
	"number": clikeNumber,
	"operator": /--|\+\+|&&|\|\||->|=>|(?:<<?|>{1,3}|[%&|^!=/*+-])=?|[?:~]|\.{3}/,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=haxe.js.map