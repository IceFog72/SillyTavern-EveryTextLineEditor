import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, r as extend } from "../../language-CXbc22uF.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
import { n as re } from "../../shared-oTKIFAwH.js";
import "./c.js";
//#region src/prism/languages/cpp.js
var keyword = /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/;
var cpp = languages.cpp = extend("c", {
	"class-name": [
		{
			pattern: RegExp(`(\\b(?:class|concept|enum|struct|typename)\\s+)(?!${keyword.source})\\w+`),
			lookbehind: true
		},
		/\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/,
		/\b[a-z_]\w*(?=\s*::\s*~\w+\s*\()/i,
		/\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/
	],
	"keyword": keyword,
	"number": /(?:\b0b[01']+|\b0x(?:[a-f\d']+(?:\.[a-f\d']*)?|\.[a-f\d']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/gi,
	"operator": /->|--|\+\+|&&|\|\||[?:~]|<=>|>>=?|<<=?|[%&|^!=<>/*+-]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|x?or|x?or_eq)\b/,
	"boolean": boolean
});
insertBefore(cpp, "string", {
	"module": {
		pattern: re("(\\b(?:import|module)\\s+)(?:\"(?:\\\\[\\s\\S]|[^\\\\\n\"])*\"|<[^<>\n]*>|<0>(?:\\s*:\\s*<0>)?|:\\s*<0>)", [`\\b(?!${keyword.source})\\w+(?:\\s*\\.\\s*\\w+)*\\b`], "g"),
		lookbehind: true,
		inside: {
			"string": /^[<"][^]+/,
			"operator": /:/,
			"punctuation": /\./
		}
	},
	"raw-string": {
		pattern: /R"([^\\() ]{0,16})\([^]*?\)\1"/g,
		alias: "string"
	}
});
insertBefore(cpp, "keyword", { "generic-function": {
	pattern: /\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,
	inside: {
		"function": /^\w+/,
		"generic": {
			pattern: /<[^]+/,
			alias: "class-name",
			inside: cpp
		}
	}
} });
insertBefore(cpp, "operator", { "double-colon": {
	pattern: /::/,
	alias: "punctuation"
} });
var baseClauseInside = Object.assign({}, cpp);
insertBefore(cpp, "class-name", { "base-clause": {
	pattern: /(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/g,
	lookbehind: true,
	inside: baseClauseInside
} });
insertBefore(baseClauseInside, "double-colon", { "class-name": /\b[a-z_]\w*\b(?!\s*::)/i });
//#endregion

//# sourceMappingURL=cpp.js.map