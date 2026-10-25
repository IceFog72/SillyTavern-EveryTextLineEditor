import { a as languages, s as rest } from "../../core-Dr0o9A-8.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
import { t as nested } from "../../shared-oTKIFAwH.js";
//#region src/prism/languages/rust.js
var multilineComment = nested("/\\*(?:[^*/]|\\*(?!/)|/(?!\\*)|<self>)*\\*/", 2);
var string = /b?"(?:\\[^]|[^\\"])*"|b?r(#*)"(?:[^"]|"(?!\1))*"\1/g;
var paramsInside = { "closure-punctuation": {
	pattern: /^\||\|$/,
	alias: "punctuation"
} };
paramsInside[rest] = languages.rust = {
	"comment": RegExp("//.*|" + multilineComment, "g"),
	"string": string,
	"char": /b?'(?:\\(?:x[0-7][a-fA-F\d]|u\{(?:[a-fA-F\d]_*){1,6}\}|.)|[^\\\n	'])'/g,
	"attribute": {
		pattern: /#!?\[(?:[^[\]"]|"(?:\\[^]|[^\\"])*")*\]/g,
		alias: "attr-name",
		inside: { "string": string }
	},
	"closure-params": {
		pattern: /([=(,:]\s*|\bmove\s*)\|[^|]*\||\|[^|]*\|(?=\s*(?:\{|->))/g,
		lookbehind: true,
		inside: paramsInside
	},
	"lifetime-annotation": {
		pattern: /'\w+/,
		alias: "symbol"
	},
	"fragment-specifier": {
		pattern: /(\$\w+:)[a-z]+/,
		lookbehind: true,
		alias: "punctuation"
	},
	"variable": /\$\w+/,
	"function-definition": {
		pattern: /(\bfn\s+)\w+/,
		lookbehind: true,
		alias: "function"
	},
	"type-definition": {
		pattern: /(\b(?:enum|struct|trait|type|union)\s+)\w+/,
		lookbehind: true,
		alias: "class-name"
	},
	"module-declaration": [{
		pattern: /(\b(?:crate|mod)\s+)[a-z][a-z_\d]*/,
		lookbehind: true,
		alias: "namespace"
	}, {
		pattern: /(\b(?:crate|self|super)\s*)::\s*[a-z][a-z_\d]*\b(?:\s*::(?:\s*[a-z][a-z_\d]*\s*::)*)?/,
		lookbehind: true,
		alias: "namespace",
		inside: { "punctuation": /::/ }
	}],
	"keyword": /\b(?:Self|abstract|as|async|await|become|box|break|const|continue|crate|do|dyn|else|enum|extern|final|fn|for|if|impl|in|let|loop|macro|match|mod|move|mut|override|priv|pub|ref|return|self|static|struct|super|trait|try|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield|bool|char|f(?:32|64)|[ui](?:8|16|32|64|128|size)|str)\b/,
	"function": /\b[a-z_]\w*(?=\s*(?:::\s*<|\())/,
	"macro": {
		pattern: /\b\w+!/,
		alias: "property"
	},
	"constant": /\b[A-Z_][A-Z_\d]+\b/,
	"class-name": /\b[A-Z]\w*\b/,
	"namespace": {
		pattern: /(?:\b[a-z][a-z_\d]*\s*::\s*)*\b[a-z][a-z_\d]*\s*::(?!\s*<)/,
		inside: { "punctuation": /::/ }
	},
	"number": /\b(?:0x[a-fA-F\d](?:_?[a-fA-F\d])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:f32|f64|[iu](?:8|16|32|64|size)?))?\b/,
	"boolean": boolean,
	"punctuation": /->|\.\.=|\.{1,3}|::|[()[\]{},:;]/,
	"operator": /&&|\|\||=>|>>=?|<<=?|[%&|^!=<>/*+-]=?|[@?]/
};
//#endregion

//# sourceMappingURL=rust.js.map