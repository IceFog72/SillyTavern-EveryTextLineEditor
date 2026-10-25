import { a as languages } from "../../core-Dr0o9A-8.js";
import { r as clikeNumber, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/ruby.js
var interpolationContent = { pattern: /[^]+/ };
var percentExpression = "(?:([^a-zA-Z\\d\\s{([<=])(?:\\\\[\\s\\S]|(?!\\1)[^\\\\])*\\1|\\((?:\\\\[\\s\\S]|[^\\\\()]|\\((?:\\\\[\\s\\S]|[^\\\\()])*\\))*\\)|\\{(?:\\\\[\\s\\S]|[^\\\\{}]|\\{(?:\\\\[\\s\\S]|[^\\\\{}])*\\})*\\}|\\[(?:\\\\[\\s\\S]|[^\\\\[\\]]|\\[(?:\\\\[\\s\\S]|[^\\\\[\\]])*\\])*\\]|<(?:\\\\[\\s\\S]|[^\\\\<>]|<(?:\\\\[\\s\\S]|[^\\\\<>])*>)*>)";
var symbolName = "(?:\"(?:\\\\.|[^\\\\\n\"])*\"|(?:\\b(?!\\d)\\w+|[^\\s\0-\\x7f]+)[?!]?|\\$.)";
var interpolation = {
	pattern: /((?:^|[^\\])(?:\\\\)*)#\{(?:[^{}]|\{[^}]*\})*\}/,
	lookbehind: true,
	inside: {
		"delimiter": {
			pattern: /^..|\}$/g,
			alias: "punctuation"
		},
		"content": interpolationContent
	}
};
interpolationContent.inside = languages.rb = languages.ruby = {
	"comment": /#.*|^=begin\s[^]*?^=end/gm,
	"string-literal": [
		{
			pattern: RegExp("%[qQiIwWs]?" + percentExpression + "|([\"'])(?:#\\{[^}]+\\}|#(?!\\{)|\\\\[\\s\\S]|(?!\\2)[^\\\\#\n])*\\2", "g"),
			inside: {
				"interpolation": interpolation,
				"string": /[^]+/
			}
		},
		{
			pattern: /<<[-~]?([a-z_]\w*)\n(?:.*\n)*?[ 	]*\1/gi,
			alias: "heredoc-string",
			inside: {
				"delimiter": {
					pattern: /^<<[-~]?[a-z_]\w*|\b[a-z_]\w*$/i,
					inside: {
						"symbol": /\w+/,
						"punctuation": /^<<[-~]?/
					}
				},
				"interpolation": interpolation,
				"string": /[^]+/
			}
		},
		{
			pattern: /<<[-~]?'([a-z_]\w*)'\n(?:.*\n)*?[ 	]*\1/gi,
			alias: "heredoc-string",
			inside: {
				"delimiter": {
					pattern: /^<<[-~]?'[a-z_]\w*'|\b[a-z_]\w*$/i,
					inside: {
						"symbol": /\w+/,
						"punctuation": /^<<[-~]?'|'$/
					}
				},
				"string": /[^]+/
			}
		}
	],
	"command-literal": {
		pattern: RegExp("%x" + percentExpression + "|`(?:#\\{[^}]+\\}|#(?!\\{)|\\\\[\\s\\S]|[^\\\\`#\n])*`", "g"),
		inside: {
			"interpolation": interpolation,
			"command": {
				pattern: /[^]+/,
				alias: "string"
			}
		}
	},
	"class-name": {
		pattern: /(\b(?:class|module)\s+|\bcatch\s+\()[\w.\\]+|\b[A-Z_]\w*(?=\s*\.\s*new\b)/,
		lookbehind: true,
		inside: { "punctuation": /[\\.]/ }
	},
	"regex-literal": {
		pattern: RegExp(`(^|[^/])/(?!/)(?:\\[[^
\\]]+\\]|\\\\.|[^\\\\
/[])+/[egimnosux]{0,6}(?=\\s*(?:\$|[
,.;})#]))|%r${percentExpression.replace(/\\1/g, "\\2")}[egimnosux]{0,6}`, "g"),
		lookbehind: true,
		inside: {
			"interpolation": interpolation,
			"regex": /[^]+/
		}
	},
	"variable": /[@$]+(?!\d)\w+(?:[?!]|\b)/,
	"symbol": [{
		pattern: RegExp("(^|[^:]):" + symbolName, "g"),
		lookbehind: true
	}, {
		pattern: RegExp("([\n{(,][ 	]*)" + symbolName + "(?=:(?!:))", "g"),
		lookbehind: true
	}],
	"method-definition": {
		pattern: /(\bdef\s+)\w+(?:\s*\.\s*\w+)?/,
		lookbehind: true,
		inside: {
			"function": /\b\w+$/,
			"keyword": /^self\b/,
			"class-name": /^\w+/,
			"punctuation": /\./
		}
	},
	"keyword": /\b(?:BEGIN|END|alias|and|begin|break|case|class|def|define_method|defined|do|each|else|elsif|end|ensure|extend|f?or|if|in|include|module|new|next|nil|not|prepend|private|protected|public|raise|redo|require|rescue|retry|return|self|super|[tw]hen|throw|undef|unless|until|while|yield)\b/,
	"boolean": boolean,
	"builtin": /\b(?:Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Fixnum|Float|Hash|IO|Integer|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|Stat|String|Struct|Symbol|TMS|Thread|ThreadGroup|Time|TrueClass)\b/,
	"constant": /\b[A-Z][A-Z\d_]*(?:[?!]|\b)/,
	"number": clikeNumber,
	"double-colon": {
		pattern: /::/,
		alias: "punctuation"
	},
	"operator": /\.{2,3}|&\.|===|<?=>|[!=]?~|(?:&&|\|\||<<|>>|\*\*|[%&|^!=<>/*+-])=?|[?:]/,
	"punctuation": /[()[\]{}.,;]/
};
//#endregion

//# sourceMappingURL=ruby.js.map