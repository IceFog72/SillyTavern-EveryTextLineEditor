import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation, n as clikeComment, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/kotlin.js
var interpolationInside = {
	"interpolation-punctuation": {
		pattern: /^.\{?|\}$/g,
		alias: "punctuation"
	},
	"expression": { pattern: /[^]+/ }
};
interpolationInside.expression.inside = languages.kts = languages.kt = languages.kotlin = {
	"string-literal": [{
		pattern: /"""(?:[^$]|\$(?:(?!\{)|\{[^{}]*\}))*?"""/,
		alias: "multiline",
		inside: {
			"interpolation": {
				pattern: /\$(?:[a-z_]\w*|\{[^{}]*\})/i,
				inside: interpolationInside
			},
			"string": /[^]+/
		}
	}, {
		pattern: /"(?:\\.|[^\\\n"$]|\$(?:(?!\{)|\{[^{}]*\}))*"/,
		alias: "singleline",
		inside: {
			"interpolation": {
				pattern: /((?:^|[^\\])(?:\\\\)*)\$(?:[a-z_]\w*|\{[^{}]*\})/i,
				lookbehind: true,
				inside: interpolationInside
			},
			"string": /[^]+/
		}
	}],
	"char": /'(?:[^\\\n']|\\(?:.|u[a-fA-F\d]{0,4}))'/g,
	"comment": clikeComment,
	"annotation": {
		pattern: /\B@(?:\w+:)?(?:[A-Z]\w*|\[[^\]]+\])/,
		alias: "builtin"
	},
	"keyword": {
		pattern: /(^|[^.])\b(?:abstract|actual|annotation|as|break|by|catch|class|companion|const|constructor|continue|crossinline|data|do|dynamic|else|enum|expect|external|final|finally|for|fun|get|if|import|in|infix|init|inline|inner|interface|internal|is|lateinit|noinline|null|object|open|operator|out|override|package|private|protected|public|reified|return|sealed|set|super|suspend|tailrec|this|throw|to|try|typealias|val|var|vararg|when|where|while)\b/,
		lookbehind: true
	},
	"boolean": boolean,
	"label": {
		pattern: /\b\w+@|@\w+/,
		alias: "symbol"
	},
	"function": {
		pattern: /(?:`[^\n`]+`|\b\w+)(?=\s*\()|(\.)(?:`[^\n`]+`|\w+)(?=\s*\{)/g,
		lookbehind: true
	},
	"number": /\b(?:0[xX][a-fA-F\d]+(?:_[a-fA-F\d]+)*|0[bB][01]+(?:_[01]+)*|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?[fFL]?)\b/,
	"operator": /--|\+\+|&&|\|\||->|[!=]==|!!|[%!=<>/*+-]=?|[?:]:?|\.\.|\b(?:and|inv|shl|u?shr|x?or)\b/,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=kotlin.js.map