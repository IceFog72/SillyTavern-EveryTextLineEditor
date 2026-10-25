import { a as languages } from "../../core-Dr0o9A-8.js";
import { o as dotPunctuation } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/javastacktrace.js
languages.javastacktrace = {
	"summary": {
		pattern: /^([ 	]*)(?:(?:Caused by:|Suppressed:|Exception in thread "[^"]*")[ 	]+)?[$\w.]+(?::.*)?$/m,
		lookbehind: true,
		inside: {
			"keyword": {
				pattern: /^([ 	]*)(?:(?:Caused by|Suppressed)(?=:)|Exception in thread)/m,
				lookbehind: true
			},
			"string": {
				pattern: /^(\s*)"[^"]*"/,
				lookbehind: true
			},
			"exceptions": {
				pattern: /^(:?\s*)[$\w.]+(?=:|$)/,
				lookbehind: true,
				inside: {
					"class-name": /[$\w]+$/,
					"namespace": /\b[a-z]\w*\b/,
					"punctuation": /\./
				}
			},
			"message": {
				pattern: /(:\s*)\S.*/,
				lookbehind: true,
				alias: "string"
			},
			"punctuation": /:/
		}
	},
	"stack-frame": {
		pattern: /^([ 	]*)at (?:[$\w./]|@[$\w.+-]*\/)+(?:<init>)?\([^()]*\)/m,
		lookbehind: true,
		inside: {
			"keyword": {
				pattern: /^(\s*)at(?= )/,
				lookbehind: true
			},
			"source": [{
				pattern: /(\()\w+\.\w+:\d+(?=\))/,
				lookbehind: true,
				inside: {
					"file": /^\w+\.\w+/,
					"punctuation": /:/,
					"line-number": {
						pattern: /\b\d+\b/,
						alias: "number"
					}
				}
			}, {
				pattern: /(\()[^()]+(?=\))/,
				lookbehind: true,
				inside: { "keyword": /^(?:Native Method|Unknown Source)$/ }
			}],
			"class-name": /[$\w]+(?=\.(?:<init>|[$\w]+)\()/,
			"function": /(?:<init>|[$\w]+)(?=\()/,
			"class-loader": {
				pattern: /(\s)[a-z]\w*(?:\.[a-z]\w*)*(?=\/[\w@$.]*\/)/,
				lookbehind: true,
				alias: "namespace",
				inside: dotPunctuation
			},
			"module": {
				pattern: /([\s/])[a-z]\w*(?:\.[a-z]\w*)*(?:@[$\w.+-]*)?(?=\/)/,
				lookbehind: true,
				inside: {
					"version": {
						pattern: /(@)[^]+/,
						lookbehind: true,
						alias: "number"
					},
					"punctuation": /[@.]/
				}
			},
			"namespace": {
				pattern: /(?:\b[a-z]\w*\.)+/,
				inside: dotPunctuation
			},
			"punctuation": /[()/.]/
		}
	},
	"more": {
		pattern: /^([ 	]*)\.{3} \d+ [a-z]+(?: [a-z]+)*/m,
		lookbehind: true,
		inside: {
			"punctuation": /\.{3}/,
			"number": /\d+/,
			"keyword": /\b[a-z]+(?: [a-z]+)*\b/
		}
	}
};
//#endregion

//# sourceMappingURL=javastacktrace.js.map