import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/scheme.js
/**
* Given a topologically sorted BNF grammar, this will return the RegExp source of last rule of the grammar.
*
* @param {Record<string, string>} grammar
*/
var SortedBNF = (grammar) => {
	for (var key in grammar) grammar[key] = grammar[key].replace(/<[\w ]+>/g, (key) => `(?:${grammar[key]})`);
	return RegExp(grammar[key], "i");
};
languages.scheme = {
	"comment": /;.*|#;\s*(?:\((?:[^()]|\([^)]*\))*\)|\[(?:[^[\]]|\[[^\]]*\])*\])|#\|(?:[^#|]|#(?!\|)|\|(?!#)|#\|(?:[^#|]|#(?!\|)|\|(?!#))*\|#)*\|#/,
	"string": /"(?:\\.|[^\\"])*"/g,
	"symbol": /'[^()[\]#'\s]+/g,
	"char": /#\\(?:[ux][a-fA-F\d]+\b|[-a-zA-Z]+\b|[\ud800-\udbff][\udc00-\udfff]|\S)/g,
	"lambda-parameter": [{
		pattern: /((?:^|[^'`#])[([]lambda\s+)(?:[^\s()[\]'|]+|\|(?:\\.|[^\\|])*\|)/,
		lookbehind: true
	}, {
		pattern: /((?:^|[^'`#])[([]lambda\s+[([])[^()[\]']+/,
		lookbehind: true
	}],
	"keyword": {
		pattern: /((?:^|[^'`#])[([])(?:begin|case(?:-lambda)?|cond(?:-expand)?|define(?:-library|-macro|-record-type|-syntax|-values)?|defmacro|delay(?:-force)?|do|else|except|export|guard|if|import|include(?:-ci|-library-declarations)?|lambda|let(?:rec)?(?:-syntax|-values|\*)?|let\*-values|only|parameterize|prefix|(?:quasi-?)?quote|rename|set!|syntax-(?:case|rules)|unless|unquote(?:-splicing)?|when)(?![^()[\]\s])/,
		lookbehind: true
	},
	"builtin": {
		pattern: /((?:^|[^'`#])[([])(?:abs|and|append|apply|assoc|ass[qv]|binary-port\?|boolean=?\?|bytevector(?:-append|-copy!?|-length|-u8-ref|-u8-set!|\?)?|caar|cadr|call-with-(?:current-continuation|port|values)|call\/cc|car|cdar|cddr|cdr|ceiling|char(?:->integer|-ready\?|\?|<\?|<=\?|=\?|>\?|>=\?)|close-(?:input-port|output-port|port)|complex\?|cons|current-(?:error|input|output)-port|denominator|dynamic-wind|eof-object\??|eq\?|equal\?|eqv\?|error|error-object(?:-irritants|-message|\?)|eval|even\?|exact(?:-integer-sqrt|-integer\?|\?)?|expt|features|file-error\?|floor(?:-quotient|-remainder|\/)?|flush-output-port|for-each|gcd|get-output-(?:bytevector|string)|inexact\??|input-port(?:-open\?|\?)|integer(?:->char|\?)|lcm|length|list(?:->string|->vector|-copy|-ref|-set!|-tail|\?)?|make-(?:bytevector|list|parameter|string|vector)|map|max|member|mem[qv]|min|modulo|negative\?|newline|not|null\?|number(?:->string|\?)|numerator|odd\?|open-(?:input|output)-(?:bytevector|string)|or|output-port(?:-open\?|\?)|pair\?|peek-char|peek-u8|port\?|positive\?|procedure\?|quotient|raise|raise-continuable|rational\?|rationalize|read-(?:bytevector|bytevector!|char|error\?|line|string|u8)|real\?|remainder|reverse|round|set-c[ad]r!|square|string(?:->list|->number|->symbol|->utf8|->vector|-append|-copy!?|-fill!|-for-each|-length|-map|-ref|-set!|\?|<\?|<=\?|=\?|>\?|>=\?)?|substring|symbol(?:->string|\?|=\?)|syntax-error|textual-port\?|truncate(?:-quotient|-remainder|\/)?|u8-ready\?|utf8->string|values|vector(?:->list|->string|-append|-copy!?|-fill!|-for-each|-length|-map|-ref|-set!|\?)?|with-exception-handler|write-(?:bytevector|char|string|u8)|zero\?)(?![^()[\]\s])/,
		lookbehind: true
	},
	"operator": {
		pattern: /((?:^|[^'`#])[([])(?:[%/*+-]|[<>]=?|=>?)(?![^()[\]\s])/,
		lookbehind: true
	},
	"number": {
		pattern: SortedBNF({
			"<ureal dec>": "\\d+(?:/\\d+)|(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:[esfdl][+-]?\\d+)?",
			"<real dec>": "[+-]?<ureal dec>|[+-](?:inf|nan)\\.0",
			"<imaginary dec>": "[+-](?:<ureal dec>|(?:inf|nan)\\.0)?i",
			"<complex dec>": "<real dec>(?:@<real dec>|<imaginary dec>)?|<imaginary dec>",
			"<num dec>": "(?:#d(?:#[ei])?|#[ei](?:#d)?)?<complex dec>",
			"<ureal box>": "[a-f\\d]+(?:/[a-f\\d]+)?",
			"<real box>": "[+-]?<ureal box>|[+-](?:inf|nan)\\.0",
			"<imaginary box>": "[+-](?:<ureal box>|(?:inf|nan)\\.0)?i",
			"<complex box>": "<real box>(?:@<real box>|<imaginary box>)?|<imaginary box>",
			"<num box>": "#[box](?:#[ei])?|(?:#[ei])?#[box]<complex box>",
			"<number>": "(^|[()[\\]\\s])(?:<num dec>|<num box>)(?![^()[\\]\\s])"
		}),
		lookbehind: true
	},
	"boolean": {
		pattern: /(^|[()[\]\s])#(?:[ft]|false|true)(?![^()[\]\s])/,
		lookbehind: true
	},
	"function": {
		pattern: /((?:^|[^'`#])[([])(?:[^|()[\]'\s]+|\|(?:\\.|[^\\|])*\|)(?![^()[\]\s])/,
		lookbehind: true
	},
	"identifier": {
		pattern: /(^|[()[\]\s])\|(?:\\.|[^\\|])*\|(?![^()[\]\s])/g,
		lookbehind: true
	},
	"punctuation": /[()[\]']/
};
//#endregion

//# sourceMappingURL=scheme.js.map