import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/batch.js
var variable = /%%?[~:\w]+%?|!\S+!/;
var parameter = {
	pattern: /\/[a-z?]+(?![^ :]):?|-[a-z]\b|--[a-z-]+\b/im,
	alias: "attr-name",
	inside: { "punctuation": /:/ }
};
var string = /"(?:[\\"]"|[^"])*"(?!")/;
var number = /(?:\b|-)\d+\b/;
languages.batch = {
	"comment": {
		pattern: /^::.*|((?:^|[&(])[ 	]*)rem\b(?:[^^&)\n]|\^[^])*/im,
		lookbehind: true
	},
	"label": {
		pattern: /^:.*/m,
		alias: "property"
	},
	"command": [
		{
			pattern: /((?:^|[&(])[ 	]*)for(?: \/[a-z?](?:[ :](?:"[^"]*"|[^\s"/]\S*))?)* \S+ in \([^)]+\) do/im,
			lookbehind: true,
			inside: {
				"keyword": /\b(?:do|in)\b|^for\b/i,
				"string": string,
				"parameter": parameter,
				"variable": variable,
				"number": number,
				"punctuation": /[()',]/
			}
		},
		{
			pattern: /((?:^|[&(])[ 	]*)if(?: \/[a-z?](?:[ :](?:"[^"]*"|[^\s"/]\S*))?)* (?:not )?(?:cmdextversion \d+|defined \w+|errorlevel \d+|exist \S+|(?:"[^"]*"|(?!")(?:(?!==)\S)+)?(?:==| (?:equ|[gln]eq|gtr|lss) )(?:"[^"]*"|[^\s"]\S*))/im,
			lookbehind: true,
			inside: {
				"keyword": /\b(?:cmdextversion|defined|errorlevel|exist|not)\b|^if\b/i,
				"string": string,
				"parameter": parameter,
				"variable": variable,
				"number": number,
				"operator": /\^|==|\b(?:equ|[gln]eq|gtr|lss)\b/i
			}
		},
		{
			pattern: /((?:^|[&()])[ 	]*)else\b/im,
			lookbehind: true,
			inside: { "keyword": /.+/ }
		},
		{
			pattern: /((?:^|[&(])[ 	]*)set(?: \/[a-z](?:[ :](?:"[^"]*"|[^\s"/]\S*))?)* (?:[^^&)\n]|\^[^])*/im,
			lookbehind: true,
			inside: {
				"keyword": /^set\b/i,
				"string": string,
				"parameter": parameter,
				"variable": [variable, /\w+(?=(?:[*/%&^|+-]|<<|>>)?=)/],
				"number": number,
				"operator": /[%&|^/*+-]=?|<<=?|>>=?|[!~_=]/,
				"punctuation": /[()',]/
			}
		},
		{
			pattern: /((?:^|[&(])[ 	]*@?)\w+\b(?:"(?:[\\"]"|[^"])*"(?!")|[^"^&)\n]|\^[^])*/m,
			lookbehind: true,
			inside: {
				"keyword": /^\w+/,
				"string": string,
				"parameter": parameter,
				"label": {
					pattern: /(^\s*):\S+/m,
					lookbehind: true,
					alias: "property"
				},
				"variable": variable,
				"number": number,
				"operator": /\^/
			}
		}
	],
	"operator": /[&@]/,
	"punctuation": /[()']/
};
//#endregion

//# sourceMappingURL=batch.js.map