import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/elm.js
languages.elm = {
	"comment": /--.*|\{-[^]*?-\}/,
	"char": /'(?:[^\\\n']|\\(?:[abfnrtv\\']|\d+|x[a-fA-F\d]+|u\{[a-fA-F\d]+\}))'/g,
	"string": /"""[^]*?"""|"(?:\\.|[^\\\n"])*"/g,
	"import-statement": {
		pattern: /(^[ 	]*)import\s+[A-Z]\w*(?:\.[A-Z]\w*)*(?:\s+as\s+(?:[A-Z]\w*)(?:\.[A-Z]\w*)*)?(?:\s+exposing\s+)?/m,
		lookbehind: true,
		inside: { "keyword": /\b(?:as|exposing|import)\b/ }
	},
	"keyword": /\b(?:alias|as|case|else|exposing|if|in|infix[lr]|let|module|of|then|type)\b/,
	"builtin": /\b(?:abs|a?cos|always|a?sin|atan2?|ceiling|clamp|compare|curry|degrees|e|flip|floor|fromPolar|identity|isInfinite|isNaN|logBase|max|min|negate|never|not|pi|radians|rem|round|sqrt|tan|toFloat|toPolar|toString|truncate|turns|uncurry|xor)\b/,
	"number": /\b(?:\d+(?:\.\d+)?(?:e[+-]?\d+)?|0x[a-f\d]+)\b/i,
	"operator": /\s\.\s|\.\.+|[:?$#@~%&|^!=<>/*+-]+/,
	"hvariable": /\b(?:[A-Z]\w*\.)*[a-z]\w*\b/,
	"constant": /\b(?:[A-Z]\w*\.)*[A-Z]\w*\b/,
	"punctuation": /[()[\]{}.,]/
};
//#endregion

//# sourceMappingURL=elm.js.map