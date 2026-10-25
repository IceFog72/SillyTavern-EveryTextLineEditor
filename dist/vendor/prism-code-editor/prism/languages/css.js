import { a as languages, s as rest } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/css.js
var string = /"(?:\\[^]|[^\\\n"])*"|'(?:\\[^]|[^\\\n'])*'/g;
var stringSrc = string.source;
var atruleInside = {
	"rule": /^@[\w-]+/,
	"selector-function-argument": {
		pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^)]*\))*\))+(?=\s*\))/,
		lookbehind: true,
		alias: "selector"
	},
	"keyword": {
		pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
		lookbehind: true
	}
};
atruleInside[rest] = languages.css = {
	"comment": /\/\*[^]*?\*\//,
	"atrule": {
		pattern: RegExp(`@[\\w-](?:[^\\s;{"']|\\s+(?!\\s)|${stringSrc})*?(?:;|(?=\\s*\\{))`),
		inside: atruleInside
	},
	"url": {
		pattern: RegExp(`\\burl\\((?:${stringSrc}|(?:[^\\\\\n"')=]|\\\\[^])*)\\)`, "gi"),
		inside: {
			"function": /^url/i,
			"punctuation": /^\(|\)$/,
			"string": {
				pattern: /^["'][^]+/,
				alias: "url"
			}
		}
	},
	"selector": {
		pattern: RegExp(`(^|[{}\\s])[^\\s{}](?:[^\\s{};"']|\\s+(?![\\s{])|${stringSrc})*(?=\\s*\\{)`),
		lookbehind: true
	},
	"string": string,
	"variable": {
		pattern: /(^|[^-\w\xa0-\uffff])--(?:(?!\s)[-\w\xa0-\uffff])*/,
		lookbehind: true
	},
	"property": {
		pattern: /(^|[^-\w\xa0-\uffff])(?!\d)(?:(?!\s)[-\w\xa0-\uffff])+(?=\s*:)/,
		lookbehind: true
	},
	"important": /!important\b/i,
	"function": {
		pattern: /(^|[^-a-z\d])[-a-z\d]+(?=\()/i,
		lookbehind: true
	},
	"punctuation": /[(){},:;]/
};
//#endregion

//# sourceMappingURL=css.js.map