import { a as languages } from "../../core-Dr0o9A-8.js";
import { a as clikeString } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/makefile.js
languages.makefile = {
	"comment": /#(?:\\[^]|[^\\\n])*/,
	"string": clikeString,
	"builtin-target": {
		pattern: /\.[A-Z][^:#=\s]+(?=\s*:(?!=))/,
		alias: "builtin"
	},
	"target": {
		pattern: /^(?:[^:=\s]|[ 	]+(?![\s:]))+(?=\s*:(?!=))/m,
		alias: "symbol",
		inside: { "variable": /\$+(?:(?!\$)[^(){}:#=\s]+|(?=[({]))/ }
	},
	"variable": /\$+(?:(?!\$)[^(){}:#=\s]+|\([@*%<^+?][DF]\)|(?=[({]))/,
	"keyword": /-include\b|\b(?:define|else|endef|endif|export|ifn?def|ifn?eq|override|private|s?include|undefine|unexport|vpath)\b/,
	"function": {
		pattern: /(\()(?:abspath|addsuffix|and|basename|call|dir|error|eval|file|filter(?:-out)?|findstring|firstword|flavor|foreach|guile|if|info|join|lastword|load|notdir|or|origin|patsubst|realpath|shell|sort|strip|subst|suffix|value|warning|wildcard|word(?:list|s)?)(?=[ 	])/,
		lookbehind: true
	},
	"operator": /(?:::|[?:+!])?=|[|@]/,
	"punctuation": /[:;(){}]/
};
//#endregion

//# sourceMappingURL=makefile.js.map