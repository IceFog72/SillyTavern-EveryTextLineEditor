import { a as languages } from "../../core-Dr0o9A-8.js";
import { n as clikeComment, o as dotPunctuation, t as boolean } from "../../patterns-DSInPV_c.js";
import { n as re, r as replace, t as nested } from "../../shared-oTKIFAwH.js";
//#region src/prism/languages/csharp.js
var keywordsToPattern = (words) => `\\b(?:${words})\\b`;
var typeKeyword = "bool|char|decimal|double|dynamic|float|object|s?byte|string|u?int|u?long|u?short|var|void";
var typeDeclarationKeyword = "class|enum|interface|record|struct";
var contextualKeyword = "add|alias|and|ascending|async|await|by|descending|from(?!\\s*[^\\s\\w])|[gls]et|global|group|into|init(?=\\s*;)|join|nameof|not|notnull|on|or|orderby|partial|remove|select|unmanaged|value|when|where|with(?=\\s*{)";
var otherKeyword = "abstract|as|[bc]ase|break|catch|checked|const|continue|default|delegate|do|else|event|explicit|extern|finally|fixed|for|foreach|goto|i[fns]|implicit|internal|lock|namespace|new|null|operator|out|override|params|private|protected|public|readonly|ref|return|sealed|sizeof|stackalloc|static|switch|this|throw|try|typeof|unchecked|unsafe|using|virtual|volatile|while|yield";
var typeDeclarationKeywords = keywordsToPattern(typeDeclarationKeyword);
var keywords = RegExp(keywordsToPattern(typeKeyword + "|" + typeDeclarationKeyword + "|" + contextualKeyword + "|" + otherKeyword));
var nonTypeKeywords = keywordsToPattern(typeDeclarationKeyword + "|" + contextualKeyword + "|" + otherKeyword);
var nonContextualKeywords = keywordsToPattern(typeKeyword + "|" + typeDeclarationKeyword + "|" + otherKeyword);
var generic = nested("<(?:[^<>;=*/%&|^+-]|<self>)*>", 2);
var nestedRound = nested("\\((?:[^()]|<self>)*\\)", 2);
var name = "@?\\b(?!\\d)\\w+\\b";
var genericName = replace("<0>(?:\\s*<1>)?", [name, generic]);
var identifier = replace("(?!<0>)<1>(?:\\s*\\.\\s*<1>)*", [nonTypeKeywords, genericName]);
var array = "\\[\\s*(?:,\\s*)*\\]";
var typeExpressionWithoutTuple = replace("<0>(?:\\s*(?:\\?\\s*)?<1>)*(?:\\s*\\?)?", [identifier, array]);
var tupleElement = replace("[^()[\\],;%&|^=<>/*+-]|<0>|<1>|<2>", [
	generic,
	nestedRound,
	array
]);
var tuple = replace("\\(<0>+(?:,<0>+)+\\)", [tupleElement]);
var typeExpression = replace("(?:<0>|<1>)(?:\\s*(?:\\?\\s*)?<2>)*(?:\\s*\\?)?", [
	tuple,
	identifier,
	array
]);
var typeInside = {
	"keyword": keywords,
	"punctuation": /[()[\].,:<>?]/
};
var character = "'(?:\\\\.|[^\n'\\\\]|\\\\[Uux][a-fA-F\\d]{1,8})'";
var regularString = "\"(?:\\\\.|[^\\\\\n\"])*\"";
var verbatimString = "@\"(?:\"\"|\\\\[\\s\\S]|[^\\\\\"])*\"(?!\")";
var regularStringOrCharacter = regularString + "|" + character;
var regularStringCharacterOrComment = replace("/(?![*/])|//[^\n]*\n|/\\*(?:[^*]|\\*(?!/))*\\*/|<0>", [regularStringOrCharacter]);
var roundExpression = nested(replace("[^()\"'/]|<0>|\\(<self>*\\)", [regularStringCharacterOrComment]), 2);
var attrTarget = "\\b(?:assembly|event|field|method|module|param|property|return|type)\\b";
var attr = replace("<0>(?:\\s*\\(<1>*\\))?", [identifier, roundExpression]);
var formatString = ":[^\n}]+";
var mInterpolationRound = nested(replace("[^()\"'/]|<0>|\\(<self>*\\)", [regularStringCharacterOrComment]), 2);
var mInterpolation = replace("\\{(?!\\{)(?:(?![}:])<0>)*<1>?\\}", [mInterpolationRound, formatString]);
var sInterpolationRound = nested(replace("[^()\"'/]|/(?!\\*)|/\\*(?:[^*]|\\*(?!/))*\\*/|<0>|\\(<self>*\\)", [regularStringOrCharacter]), 2);
var sInterpolation = replace("\\{(?!\\{)(?:(?![}:])<0>)*<1>?\\}", [sInterpolationRound, formatString]);
var createInterpolationInside = (interpolation, interpolationRound) => ({
	"interpolation": {
		pattern: re("((?:^|[^{])(?:\\{\\{)*)<0>", [interpolation]),
		lookbehind: true,
		inside: {
			"format-string": {
				pattern: re("(^\\{(?:(?![}:])<0>)*)<1>(?=\\}$)", [interpolationRound, formatString]),
				lookbehind: true,
				inside: { "punctuation": /^:/ }
			},
			"punctuation": /^\{|\}$/,
			"expression": {
				pattern: /[^]+/,
				alias: "language-csharp",
				inside: "cs"
			}
		}
	},
	"string": /[^]+/
});
languages.dotnet = languages.cs = languages.csharp = {
	"comment": clikeComment,
	"interpolation-string": [{
		pattern: re("(^|[^\\\\])(?:\\$@|@\\$)\"(?:\"\"|\\\\[\\s\\S]|\\{\\{|<0>|[^\\\\{\"])*\"", [mInterpolation], "g"),
		lookbehind: true,
		inside: createInterpolationInside(mInterpolation, mInterpolationRound)
	}, {
		pattern: re("(^|[^\\\\@])\\$\"(?:\\\\.|\\{\\{|<0>|[^\\\\\"{])*\"", [sInterpolation], "g"),
		lookbehind: true,
		inside: createInterpolationInside(sInterpolation, sInterpolationRound)
	}],
	"char": RegExp(character, "g"),
	"string": [{
		pattern: re("(^|[^\\\\$])<0>", [verbatimString], "g"),
		lookbehind: true
	}, {
		pattern: re("(^|[^\\\\@$])<0>", [regularString], "g"),
		lookbehind: true
	}],
	"namespace": {
		pattern: re("(\\b(?:namespace|using)\\s+)<0>(?:\\s*\\.\\s*<0>)*(?=\\s*[;{])", [name]),
		lookbehind: true,
		inside: dotPunctuation
	},
	"type-expression": {
		pattern: re("(\\b(?:default|sizeof|typeof)\\s*\\(\\s*(?!\\s))(?:[^()\\s]|\\s(?!\\s)|<0>)+(?=\\s*\\))", [nestedRound]),
		lookbehind: true,
		alias: "class-name",
		inside: typeInside
	},
	"return-type": {
		pattern: re("<0>(?=\\s+(?:<1>\\s*(?:=>|[({]|\\.\\s*this\\s*\\[)|this\\s*\\[))", [typeExpression, identifier]),
		alias: "class-name",
		inside: typeInside
	},
	"constructor-invocation": {
		pattern: re("(\\bnew\\s+)<0>(?=\\s*[[({])", [typeExpression]),
		lookbehind: true,
		alias: "class-name",
		inside: typeInside
	},
	"generic-method": {
		pattern: re("<0>\\s*<1>(?=\\s*\\()", [name, generic]),
		inside: {
			"function": re("^<0>", [name]),
			"generic": {
				pattern: RegExp(generic),
				alias: "class-name",
				inside: typeInside
			}
		}
	},
	"type-list": {
		pattern: re("\\b((?:<0>\\s+<1>|record\\s+<1>\\s*<5>|where\\s+<2>)\\s*:\\s*)(?:<3>|<4>|<1>\\s*<5>|<6>)(?:\\s*,\\s*(?:<3>|<4>|<6>))*(?=\\s*(?:where|[{;]|=>|$))", [
			typeDeclarationKeywords,
			genericName,
			name,
			typeExpression,
			keywords.source,
			nestedRound,
			"\\bnew\\s*\\(\\s*\\)"
		]),
		lookbehind: true,
		inside: {
			"record-arguments": {
				pattern: re("(^(?!new\\s*\\()<0>\\s*)<1>", [genericName, nestedRound], "g"),
				lookbehind: true,
				inside: "cs"
			},
			"keyword": keywords,
			"class-name": {
				pattern: RegExp(typeExpression, "g"),
				inside: typeInside
			},
			"punctuation": /[(),]/
		}
	},
	"preprocessor": {
		pattern: /(^[ 	]*)#.*/m,
		lookbehind: true,
		alias: "property",
		inside: { "directive": {
			pattern: /(#)\b(?:define|elif|else|endif|endregion|error|if|line|nullable|pragma|region|undef|warning)\b/,
			lookbehind: true,
			alias: "keyword"
		} }
	},
	"attribute": {
		pattern: re("((?:^|[^\\s\\w>)?])\\s*\\[\\s*)(?:<0>\\s*:\\s*)?<1>(?:\\s*,\\s*<1>)*(?=\\s*\\])", [attrTarget, attr], "g"),
		lookbehind: true,
		inside: {
			"target": {
				pattern: re("^<0>(?=\\s*:)", [attrTarget]),
				alias: "keyword"
			},
			"attribute-arguments": {
				pattern: re("\\(<0>*\\)", [roundExpression]),
				inside: "cs"
			},
			"class-name": {
				pattern: RegExp(identifier),
				inside: dotPunctuation
			},
			"punctuation": /[,:]/
		}
	},
	"class-name": [
		{
			pattern: re("(\\busing\\s+static\\s+)<0>(?=\\s*;)", [identifier]),
			lookbehind: true,
			inside: typeInside
		},
		{
			pattern: re("(\\busing\\s+<0>\\s*=\\s*)<1>(?=\\s*;)", [name, typeExpression]),
			lookbehind: true,
			inside: typeInside
		},
		{
			pattern: re("(\\busing\\s+)<0>(?=\\s*=)", [name]),
			lookbehind: true
		},
		{
			pattern: re("(\\b<0>\\s+)<1>", [typeDeclarationKeywords, genericName]),
			lookbehind: true,
			inside: typeInside
		},
		{
			pattern: re("(\\bcatch\\s*\\(\\s*)<0>", [identifier]),
			lookbehind: true,
			inside: typeInside
		},
		{
			pattern: re("(\\bwhere\\s+)<0>", [name]),
			lookbehind: true
		},
		{
			pattern: re("(\\b(?:is(?:\\s+not)?|as)\\s+)<0>", [typeExpressionWithoutTuple]),
			lookbehind: true,
			inside: typeInside
		},
		{
			pattern: re("\\b<0>(?=\\s+(?!<1>|with\\s*\\{)<2>(?:\\s*[=,:;{)\\]]|\\s+(?:in|when)\\b))", [
				typeExpression,
				nonContextualKeywords,
				name
			]),
			inside: typeInside
		}
	],
	"keyword": keywords,
	"boolean": boolean,
	"function": /\b\w+(?=\()/,
	"range": {
		pattern: /\.\./,
		alias: "operator"
	},
	"number": /(?:\b0(?:x[a-f\d_]*[a-f\d]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[+-]?\d+(?:_+\d+)*)?)(?:[dflmu]|lu|ul)?\b/i,
	"operator": /[=-]>|([&|+-])\1|~|\?\?=?|>>=?|<<=?|[%&|^!=<>/*+-]=?/,
	"named-parameter": {
		pattern: re("([(,]\\s*)<0>(?=\\s*:)", [name]),
		lookbehind: true,
		alias: "punctuation"
	},
	"punctuation": /\?\.?|::|[()[\]{}.,:;]/
};
//#endregion

//# sourceMappingURL=csharp.js.map