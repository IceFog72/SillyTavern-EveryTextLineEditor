import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, r as extend } from "../../language-CXbc22uF.js";
import "./javascript.js";
//#region src/prism/languages/coffeescript.js
var comment = /#(?!\{).+/;
var interpolation = {
	pattern: /#\{[^}]+\}/,
	alias: "variable"
};
var coffee = languages.coffee = languages.coffeescript = extend("js", {
	"comment": comment,
	"string": [/'(?:\\[^]|[^\\'])*'/g, {
		pattern: /"(?:\\[^]|[^\\"])*"/g,
		inside: { "interpolation": interpolation }
	}],
	"keyword": /\b(?:and|break|by|catch|class|continue|debugger|delete|do|each|else|extends?|false|true|finally|f?or|i[fns]|instanceof|isnt|let|loop|namespace|new|not?|null|off?|ow?n|return|super|switch|[tw]hen|this|throw|try|typeof|undefined|unless|until|while|window|with|yes|yield)\b/,
	"class-member": {
		pattern: /@(?!\d)\w+/,
		alias: "variable"
	}
});
insertBefore(coffee, "comment", {
	"multiline-comment": {
		pattern: /###[^]+?###/,
		alias: "comment"
	},
	"block-regex": {
		pattern: /\/{3}[^]*?\/{3}/,
		alias: "regex",
		inside: {
			"comment": comment,
			"interpolation": interpolation
		}
	}
});
insertBefore(coffee, "string", {
	"inline-javascript": {
		pattern: /`(?:\\[^]|[^\\`])*`/,
		inside: {
			"delimiter": {
				pattern: /^`|`$/,
				alias: "punctuation"
			},
			"script": {
				pattern: /[^]+/,
				alias: "language-javascript",
				inside: "js"
			}
		}
	},
	"multiline-string": [{
		pattern: /'''[^]*?'''/g,
		alias: "string"
	}, {
		pattern: /"""[^]*?"""/g,
		alias: "string",
		inside: { "interpolation": interpolation }
	}]
});
insertBefore(coffee, "keyword", { "property": /(?!\d)\w+(?=\s*:(?!:))/ });
delete coffee["template-string"];
//#endregion

//# sourceMappingURL=coffeescript.js.map