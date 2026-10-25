import { a as languages } from "../../core-Dr0o9A-8.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/stan.js
var higherOrderFunctions = /\b(?:algebra_solver|algebra_solver_newton|integrate_1d|integrate_ode|integrate_ode_bdf|integrate_ode_rk45|map_rect|ode_(?:adams|bdf|ckrk|rk45)(?:_tol)?|ode_adjoint_tol_ctl|reduce_sum|reduce_sum_static)\b/;
var expression = {
	pattern: /(=\s*)\S(?:\S|\s+(?!\s))*?(?=\s*(?:>$|,\s*\w+\s*=))/,
	lookbehind: true
};
expression.inside = languages.stan = {
	"comment": /\/\/.*|\/\*[^]*?\*\/|#(?!include).*/,
	"string": { pattern: /"[ !#-[\]-~]*"/g },
	"directive": {
		pattern: /^([ 	]*)#include\b.*/m,
		lookbehind: true,
		alias: "property"
	},
	"function-arg": {
		pattern: RegExp(`(${higherOrderFunctions.source}\\s*\\(\\s*)[a-zA-Z]\\w*`),
		lookbehind: true,
		alias: "function"
	},
	"constraint": {
		pattern: /(\b(?:int|matrix|real|row_vector|vector)\s*)<[^<>]*>/,
		lookbehind: true,
		inside: {
			"expression": expression,
			"property": /\b[a-z]\w*(?=\s*=)/i,
			"operator": /=/,
			"punctuation": /^<|>$|,/
		}
	},
	"keyword": [
		{
			pattern: /\bdata(?=\s*\{)|\b(?:functions|generated|model|parameters|quantities|transformed)\b/,
			alias: "program-block"
		},
		/\b(?:array|break|cholesky_factor_corr|cholesky_factor_cov|complex|continue|corr_matrix|cov_matrix|data|else|for|if|increment_log_prob|int?|matrix|ordered|positive_ordered|print|real|reject|return|row_vector|simplex|target|unit_vector|vector|void|while)\b/,
		higherOrderFunctions
	],
	"function": /\b[a-z]\w*(?=\s*\()/i,
	"number": /(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?i?(?!\w)/i,
	"boolean": boolean,
	"operator": /<-|\.[*/]=?|\|\|?|&&|[!=<>/*+-]=?|['^%~?:]/,
	"punctuation": /[()[\]{},;]/
};
//#endregion

//# sourceMappingURL=stan.js.map