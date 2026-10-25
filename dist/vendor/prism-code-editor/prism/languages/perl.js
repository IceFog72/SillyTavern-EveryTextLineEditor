import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/perl.js
var brackets = "(?:\\((?:\\\\[\\s\\S]|[^\\\\()])*\\)|\\{(?:\\\\[\\s\\S]|[^\\\\{}])*\\}|\\[(?:\\\\[\\s\\S]|[^\\\\[\\]])*\\]|<(?:\\\\[\\s\\S]|[^\\\\<>])*>)";
var a = `(?![a-zA-Z\\d])\\s*(?:([^\\sa-zA-Z\\d{([<])(?:\\\\[^]|(?!\\1)[^\\\\])*\\1|([a-zA-Z\\d])(?:\\\\[^]|(?!\\2)[^\\\\])*\\2|${brackets})`;
languages.perl = {
	"comment": [{
		pattern: /(^\s*)=\w[^]*?=cut.*/gm,
		lookbehind: true
	}, {
		pattern: /(^|[^\\$])#.*/g,
		lookbehind: true
	}],
	"string": RegExp(`\\bq[qwx]?${a}|("|\`)(?:\\\\[^]|(?!\\3)[^\\\\])*\\3|'(?:\\\\.|[^\\\\\n'])*'`, "g"),
	"regex": [RegExp(`\\b(?:m|qr)${a}[msixpodualngc]*`, "g"), {
		pattern: RegExp(`(^|[^-])\\b(?:s|tr|y)(?![a-zA-Z\\d])\\s*(?:([^\\sa-zA-Z\\d{([<])(?:\\\\[^]|(?!\\2)[^\\\\])*\\2(?:\\\\[^]|(?!\\2)[^\\\\])*\\2|([a-zA-Z\\d])(?:\\\\[^]|(?!\\3)[^\\\\])*\\3(?:\\\\[^]|(?!\\3)[^\\\\])*\\3|${brackets}\\s*${brackets})[msixpodualngcer]*|/(?:\\\\.|[^\\\\\n/])*/[msixpodualngc]*(?=\\s*(?:$|[\n,.;})&|*~<>!?^+-]|(?:and|cmp|eq|[gl][et]|ne|not|x|x?or)\\b))`, "g"),
		lookbehind: true
	}],
	"variable": /[&*$@%](?:\{\^[A-Z]+\}|\^[A-Z_]|#?(?=\{)|#?(?:(?:::)*'?(?!\d)[$\w]+(?![$\w]))+(?:::)*|\d+)|(?!%=)[$@%][!"#$%&'*,./:;<=>?@()[\]{}||^_`|~+-]/,
	"filehandle": {
		pattern: /<(?![<=])\S*?>|\b_\b/,
		alias: "symbol"
	},
	"v-string": {
		pattern: /v\d+(?:\.\d+)*|\d+(?:\.\d+){2,}/,
		alias: "string"
	},
	"function": {
		pattern: /(\bsub[ 	]+)\w+/,
		lookbehind: true
	},
	"keyword": /\b(?:any|break|continue|default|delete|die|do|else|elsif|eval|for|foreach|given|goto|if|last|local|my|next|our|package|print|redo|require|return|say|state|sub|switch|undef|unless|until|use|when|while)\b/,
	"number": /\b(?:0x[a-fA-F\d](?:_?[a-fA-F\d])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)\b/,
	"operator": /-[rwxoRWXOezsfdlpSbctugkTBMAC]\b|->|=>|=~|~~|<=>?|!~|--|\+\+|(?:\*\*|\/\/|&&|\|\||<<|>>|[~%&|^!=<>/*+-])=?|\.(?:=|\.\.?)?|[\\?]|\bx(?:=|\b)|\b(?:and|cmp|eq|[gl][et]|ne|not|x?or)\b/,
	"punctuation": /[()[\]{},:;]/
};
//#endregion

//# sourceMappingURL=perl.js.map