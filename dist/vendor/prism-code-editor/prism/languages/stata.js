import { a as languages } from "../../core-Dr0o9A-8.js";
import "./java.js";
import "./mata.js";
import "./python.js";
//#region src/prism/languages/stata.js
var expression = { pattern: /[^]+/ };
expression.inside = languages.stata = {
	"comment": [{
		pattern: /(^[ 	]*)\*.*/gm,
		lookbehind: true
	}, {
		pattern: /(^|\s)\/\/.*|\/\*[^]*?\*\//g,
		lookbehind: true
	}],
	"string-literal": {
		pattern: /"[^\n"]*"|[‘`']".*?"[’`']/g,
		inside: {
			"interpolation": {
				pattern: /\$\{[^{}]*\}|[‘`']\w[^’`'\n]*[’`']/,
				inside: {
					"punctuation": /^\$\{|\}$/,
					"expression": expression
				}
			},
			"string": /[^]+/
		}
	},
	"mata": {
		pattern: /(^[ 	]*mata[ 	]*:)[^]+?(?=^end\b)/gm,
		lookbehind: true,
		alias: "language-mata",
		inside: languages.mata
	},
	"java": {
		pattern: /(^[ 	]*java[ 	]*:)[^]+?(?=^end\b)/gm,
		lookbehind: true,
		alias: "language-java",
		inside: languages.java
	},
	"python": {
		pattern: /(^[ 	]*python[ 	]*:)[^]+?(?=^end\b)/gm,
		lookbehind: true,
		alias: "language-python",
		inside: languages.py
	},
	"command": {
		pattern: /(^[ 	]*(?:\.[ 	]+)?(?:(?:bayes|bootstrap|by|bysort|capture|collect|fmm|frame|jackknife|m?fp|mi|nestreg|noisily|permute|quietly|rolling|simulate|statsby|stepwise|svy|version|xi)\b[^\n:]*:[ 	]*|(?:capture|noisily|quietly|version)[ 	]+)?)[a-zA-Z]\w*/gm,
		lookbehind: true,
		alias: "keyword"
	},
	"variable": /\$\w+|[‘`']\w[^’`'\n]*[’`']/,
	"keyword": /\b(?:bayes|bootstrap|by|bysort|capture|clear|collect|fmm|frame|if|in|jackknife|mi[ 	]+estimate|m?fp|nestreg|noisily|of|permute|quietly|rolling|simulate|sort|statsby|stepwise|svy|varlist|version|xi)\b/,
	"boolean": /\b(?:off|on)\b/,
	"number": /\b\d+(?:\.\d+)?\b|\B\.\d+/,
	"function": /\b[a-z_]\w*(?=\()/i,
	"operator": /--|\+\+|##?|[~!=<>]=?|[&|^/*+-]/,
	"punctuation": /[()[\]{},:]/
};
//#endregion

//# sourceMappingURL=stata.js.map