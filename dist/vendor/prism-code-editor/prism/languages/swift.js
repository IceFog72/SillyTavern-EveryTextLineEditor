import { a as languages } from "../../core-Dr0o9A-8.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/swift.js
var swift = languages.swift = {
	"comment": /\/\/.*|\/\*(?:[^/*]|\/(?!\*)|\*(?!\/)|\/\*(?:[^*]|\*(?!\/))*\*\/)*\*\//g,
	"string-literal": [{
		pattern: /(^|[^"#])(?:"(?:\\(?:\((?:[^()]|\([^)]*\))*\)|[^(])|[^\\\n"])*"|"""(?:\\(?:\((?:[^()]|\([^)]*\))*\)|[^(])|[^\\"]|"(?!""))*""")(?!["#])/g,
		lookbehind: true,
		inside: {
			"interpolation": {
				pattern: /(\\\()(?:[^()]|\([^()]*\))+(?=\))/,
				lookbehind: true
			},
			"interpolation-punctuation": {
				pattern: /^\)|\\\($/,
				alias: "punctuation"
			},
			"punctuation": /\\(?=\n)/,
			"string": /[^]+/
		}
	}, {
		pattern: /(^|[^"#])(#+)(?:"(?:\\(?:#+\((?:[^()]|\([^)]*\))*\)|[^#])|[^\\\n])*?"|"""(?:\\(?:#+\((?:[^()]|\([^)]*\))*\)|[^#])|[^\\])*?""")\2/g,
		lookbehind: true,
		inside: {
			"interpolation": {
				pattern: /(\\#+\()(?:[^()]|\([^()]*\))+(?=\))/,
				lookbehind: true
			},
			"interpolation-punctuation": {
				pattern: /^\)|\\#+\($/,
				alias: "punctuation"
			},
			"string": /[^]+/
		}
	}],
	"directive": {
		pattern: /#(?:(?:elseif|if)\b(?:[ 	]*(?:![ 	]*)?(?:\b\w+\b(?:[ 	]*\((?:[^()]|\([^)]*\))*\))?|\((?:[^()]|\([^)]*\))*\))(?:[ 	]*(?:&&|\|\|))?)+|(?:else|endif)\b)/,
		alias: "property",
		inside: {
			"directive-name": /^#\w+/,
			"boolean": boolean,
			"number": /\b\d+(?:\.\d+)*\b/,
			"operator": /!|&&|\|\||[<>]=?/,
			"punctuation": /[(),]/
		}
	},
	"literal": {
		pattern: /#(?:colorLiteral|column|dsohandle|file(?:ID|Literal|Path)?|function|imageLiteral|line)\b/,
		alias: "constant"
	},
	"other-directive": {
		pattern: /#\w+/,
		alias: "property"
	},
	"attribute": {
		pattern: /@\w+/,
		alias: "atrule"
	},
	"function-definition": {
		pattern: /(\bfunc\s+)\w+/,
		lookbehind: true,
		alias: "function"
	},
	"label": {
		pattern: /\b(break|continue)\s+\w+|\b(?!\d)\w+(?=\s*:\s*(?:for|repeat|while)\b)/,
		lookbehind: true,
		alias: "important"
	},
	"keyword": /\b(?:Any|[Pp]rotocol|[Ss]elf|Type|actor|as|assignment|associatedtype|associativity|async|await|break|case|catch|class|continue|convenience|default|defer|deinit|didSet|do|dynamic|else|enum|extension|fallthrough|fileprivate|final|for|func|[gs]et|guard|higherThan|i[fns]|import|indirect|infix|init|inout|internal|isolated|lazy|lef?t|lowerThan|mutating|none|nonisolated|nonmutating|open|operator|optional|override|postfix|precedencegroup|prefix|private|public|repeat|required|rethrows|return|right|safe|some|static|struct|subscript|super|switch|throws?|try|typealias|unowned|unsafe|var|weak|where|while|willSet)\b/,
	"boolean": boolean,
	"nil": {
		pattern: /\bnil\b/,
		alias: "constant"
	},
	"short-argument": /\$\d+\b/,
	"omit": {
		pattern: /\b_\b/,
		alias: "keyword"
	},
	"number": /\b(?:[\d_]+(?:\.[\de_]+)?|0x[a-f\d_]+(?:\.[a-f\dp_]+)?|0b[01_]+|0o[0-7_]+)\b/i,
	"class-name": /\b[A-Z](?:[A-Z_\d]*[a-z]\w*)?\b/,
	"function": /\b[a-z_]\w*(?=\s*\()/i,
	"constant": /\b(?:[A-Z_]{2,}|k[A-Z][A-Za-z_]+)\b/,
	"operator": /[~?%&|^!=<>/*+-]+|\.[.~?%&|^!=<>/*+-]+/,
	"punctuation": /[()[\]{}.,:;\\]/
};
swift["string-literal"].forEach((rule) => {
	rule.inside["interpolation"].inside = swift;
});
//#endregion

//# sourceMappingURL=swift.js.map