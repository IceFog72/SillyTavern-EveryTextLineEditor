import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation, n as clikeComment, o as dotPunctuation, r as clikeNumber, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/dart.js
var keywords = /\b(?:a?sync|yield)\b\*?|\b(?:abstract|assert|await|break|case|catch|class|const|continue|covariant|default|deferred|do|dynamic|else|enum|export|extends|extension|external|factory|final|finally|for|[gs]et|hide|if|implements|import|in|interface|library|mixin|new|null|on|operator|part|rethrow|return|show|static|super|switch|this|throw|try|typedef|var|void|while|with)\b/;
var packagePrefix = "(^|[^\\w.])(?:[a-z]\\w*\\s*\\.\\s*)*(?:[A-Z]\\w*\\s*\\.\\s*)*";
var className = {
	pattern: RegExp(packagePrefix + "[A-Z](?:[\\d_A-Z]*[a-z]\\w*)?\\b"),
	lookbehind: true,
	inside: { "namespace": {
		pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
		inside: dotPunctuation
	} }
};
languages.dart = {
	"comment": clikeComment,
	"string-literal": {
		pattern: /r?(?:("""|''')[^]*?\1|(["'])(?:\\.|(?!\2)[^\\\n])*\2(?!\2))/g,
		inside: {
			"interpolation": {
				pattern: /((?:^|[^\\])(?:\\\\)*)\$(?:\w+|\{(?:[^{}]|\{[^}]*\})*\})/,
				lookbehind: true,
				inside: {
					"punctuation": /^.\{?|\}$/g,
					"expression": {
						pattern: /[^]+/,
						inside: "dart"
					}
				}
			},
			"string": /[^]+/
		}
	},
	"metadata": {
		pattern: /@\w+/,
		alias: "function"
	},
	"generics": {
		pattern: /<(?:[\w\s.,&?]|<(?:[\w\s.,&?]|<(?:[\w\s.,&?]|<[\w\s.,&?]*>)*>)*>)*>/,
		inside: {
			"class-name": className,
			"keyword": keywords,
			"punctuation": /[().,:<>]/,
			"operator": /[?&|]/
		}
	},
	"class-name": [className, {
		pattern: RegExp(packagePrefix + "[A-Z]\\w*(?=\\s+\\w+\\s*[;,=()])"),
		lookbehind: true,
		inside: className.inside
	}],
	"keyword": keywords,
	"boolean": boolean,
	"function": /\b\w+(?=\()/,
	"number": clikeNumber,
	"operator": /\bis!|\b[ai]s\b|--|\+\+|&&|\|\||<<=?|>>=?|~\/=?|[*/%&^|!=<>+-]=?|[~?]/,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=dart.js.map