import { a as languages, s as rest } from "../../core-Dr0o9A-8.js";
import { n as clone } from "../../language-CXbc22uF.js";
//#region src/prism/languages/lisp.js
/**
* Functions to construct regular expressions
* e.g. (interactive ... or (interactive)
*
* @param {string} name
* @returns {RegExp}
*/
var simple_form = (name) => RegExp(`(\\()(?:${name})(?=[\\s\\)])`);
/**
* booleans and numbers
*
* @param {string} pattern
* @returns {RegExp}
*/
var primitive = (pattern) => RegExp(`([\\s([])(?:${pattern})(?=[\\s)])`);
var symbol = "(?!\\d)[~@$%{}\\w^!=<>/*+-]+";
var marker = "&" + symbol;
var par = "(\\()";
var endpar = "(?=\\))";
var space = "(?=\\s)";
var nestedPar = "(?:[^()]|\\((?:[^()]|\\((?:[^()]|\\((?:[^()]|\\((?:[^()]|\\([^)]*\\))*\\))*\\))*\\))*\\))";
var language = {
	"heading": {
		pattern: /;;;.*/,
		alias: "comment title"
	},
	"comment": /;.*/,
	"string": {
		pattern: /"(?:\\.|[^\\"])*"/g,
		inside: {
			argument: /[-A-Z]+(?=[.,\s])/,
			symbol: RegExp("`" + symbol + "'")
		}
	},
	"quoted-symbol": {
		pattern: RegExp("#?'" + symbol),
		alias: "variable symbol"
	},
	"lisp-property": {
		pattern: RegExp(":" + symbol),
		alias: "property"
	},
	"splice": {
		pattern: RegExp(",@?" + symbol),
		alias: "symbol variable"
	},
	"keyword": [{
		pattern: RegExp(par + "(?:and|(?:cl-)?letf|cl-loop|con[ds]|error|if|(?:lexical-)?let\\*?|message|not|null|or|provide|require|setq|unless|use-package|when|while)" + space),
		lookbehind: true
	}, {
		pattern: RegExp(par + "(?:append|by|collect|concat|do|finally|for|in|return)" + space),
		lookbehind: true
	}],
	"declare": {
		pattern: simple_form("declare"),
		lookbehind: true,
		alias: "keyword"
	},
	"interactive": {
		pattern: simple_form("interactive"),
		lookbehind: true,
		alias: "keyword"
	},
	"boolean": {
		pattern: primitive("nil|t"),
		lookbehind: true
	},
	"number": {
		pattern: primitive("[+-]?\\d+(?:\\.\\d*)?"),
		lookbehind: true
	},
	"defvar": {
		pattern: RegExp(par + "def(?:const|custom|group|var)\\s+" + symbol),
		lookbehind: true,
		inside: {
			"keyword": /^def[a-z]+/,
			"variable": RegExp(symbol)
		}
	},
	"defun": {
		pattern: RegExp(`${par}(?:cl-)?(?:defmacro|defun\\*?)\\s+${symbol}\\s+\\(${nestedPar}*\\)`, "g"),
		lookbehind: true,
		inside: {
			"keyword": /^(?:cl-)?def\S+/,
			"arguments": null,
			"function": {
				pattern: RegExp("(^\\s)" + symbol),
				lookbehind: true
			},
			"punctuation": /[()]/
		}
	},
	"lambda": {
		pattern: RegExp(par + "lambda\\s+\\(\\s*(?:&?" + symbol + "(?:\\s+&?" + symbol + ")*\\s*)?\\)", "g"),
		lookbehind: true,
		inside: {
			"keyword": /^lambda/,
			"arguments": null,
			"punctuation": /[()]/
		}
	},
	"car": {
		pattern: RegExp(par + symbol),
		lookbehind: true
	},
	"punctuation": [/['`,]\(|[()[\]]/, {
		pattern: /(\s)\.(?!\S)/,
		lookbehind: true
	}]
};
var arg = {
	"lisp-marker": RegExp(marker),
	"varform": {
		pattern: RegExp(`\\(${symbol}\\s+(?=\\S)${nestedPar}*\\)`),
		inside: language
	},
	"argument": {
		pattern: RegExp("(^|[\\s(])" + symbol),
		lookbehind: true,
		alias: "variable"
	},
	[rest]: language
};
var forms = "\\S+(?:\\s+\\S+)*";
var arglist = {
	pattern: RegExp(par + nestedPar + "+" + endpar),
	lookbehind: true,
	inside: {
		"rest-vars": {
			pattern: RegExp("&(?:body|rest)\\s+" + forms),
			inside: arg
		},
		"other-marker-vars": {
			pattern: RegExp("&(?:aux|optional)\\s+" + forms),
			inside: arg
		},
		"keys": {
			pattern: RegExp("&key\\s+" + forms + "(?:\\s+&allow-other-keys)?"),
			inside: arg
		},
		"argument": {
			pattern: RegExp(symbol),
			alias: "variable"
		},
		"punctuation": /[()]/
	}
};
language["lambda"].inside.arguments = arglist;
(language["defun"].inside.arguments = clone(arglist)).inside.sublist = arglist;
languages["emacs-lisp"] = languages.emacs = languages.elisp = languages.lisp = language;
//#endregion

//# sourceMappingURL=lisp.js.map