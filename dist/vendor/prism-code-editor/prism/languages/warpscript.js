import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/warpscript.js
languages.warpscript = {
	"comment": /#.*|\/\/.*|\/\*[^]*?\*\//,
	"string": /"(?:\\.|[^\\\n"])*"|'(?:\\.|[^\\\n'])*'|<'(?:[^\\']|'(?!>)|\\.)*'>/g,
	"variable": /\$\S+/,
	"macro": {
		pattern: /@\S+/,
		alias: "property"
	},
	"keyword": /\b(?:BREAK|CHECKMACRO|CONTINUE|C?UDF|DEFINED|DEFINEDMACRO|EVAL|FAIL|FOR|FOREACH|FORSTEP|IFTE?|MSGFAIL|N?RETURN|RETHROW|SWITCH|TRY|UNTIL|WHILE)\b/,
	"number": /[+-]?\b(?:NaN|Infinity|\d+(?:\.\d*)?(?:[Ee][+-]?\d+)?|0x[a-fA-F\d]+|0b[01]+)\b/,
	"boolean": /\b(?:F|T|false|true)\b/,
	"punctuation": /<%|%>|[()[\]{}]/,
	"operator": /==|&&?|\|\|?|\*\*?|>>>?|<<|[<>!~]=?|[%^/-]|\+!?|\b(?:AND|NOT|OR)\b/
};
//#endregion

//# sourceMappingURL=warpscript.js.map