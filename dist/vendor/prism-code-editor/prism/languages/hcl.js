import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/hcl.js
languages.hcl = {
	"comment": /(?:\/\/|#).*|\/\*[^]*?(?:\*\/|$)/,
	"heredoc": {
		pattern: /<<-?(\w+\b)[^]*?^[ 	]*\1/gm,
		alias: "string"
	},
	"keyword": [
		{
			pattern: /(?:data|resource)\s+(?:"(?:\\[^]|[^\\"])*")(?=\s+"[\w-]+"\s+\{)/i,
			inside: { "type": {
				pattern: /(resource|data|\s)(?:"(?:\\[^]|[^\\"])*")/i,
				lookbehind: true,
				alias: "variable"
			} }
		},
		{
			pattern: /(?:backend|module|output|provider|provisioner|variable)\s+(?:[\w-]+|"(?:\\[^]|[^\\"])*")\s+(?=\{)/i,
			inside: { "type": {
				pattern: /(backend|module|output|provider|provisioner|variable)\s+(?:[\w-]+|"(?:\\[^]|[^\\"])*")\s+/i,
				lookbehind: true,
				alias: "variable"
			} }
		},
		/[\w-]+(?=\s+\{)/
	],
	"property": [/[-\w.]+(?=\s*=(?!=))/, /"(?:\\[^]|[^\\"])+"(?=\s*[:=])/],
	"string": {
		pattern: /"(?:\\[^]|[^\\"$]|\$(?:(?=")|\$+(?!\$)|[^"${])|\$\{(?:[^{}"]|"(?:\\[^]|[^\\"])*")*\})*"/g,
		inside: { "interpolation": {
			pattern: /(^|[^$])\$\{(?:[^{}"]|"(?:\\[^]|[^\\"])*")*\}/,
			lookbehind: true,
			inside: {
				"type": {
					pattern: /(\b(?:count|data|local|module|path|self|terraform|var)\b\.)[\w\*]+/i,
					lookbehind: true,
					alias: "variable"
				},
				"keyword": /\b(?:count|data|local|module|path|self|terraform|var)\b/i,
				"function": /\w+(?=\()/,
				"string": /"(?:\\[^]|[^\\"])*"/g,
				"number": /\b0x[a-f\d]+\b|\b\d+(?:\.\d*)?(?:e[+-]?\d+)?/i,
				"punctuation": /[?!=$#%&'()[\]{}.,:;*+/<>@\\^`|~]/
			}
		} }
	},
	"number": /\b0x[a-f\d]+\b|\b\d+(?:\.\d*)?(?:e[+-]?\d+)?/i,
	"boolean": /\b(?:false|true)\b/i,
	"punctuation": /[=[\]{}]/
};
//#endregion

//# sourceMappingURL=hcl.js.map