import { a as languages, s as rest } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, n as clone } from "../../language-CXbc22uF.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
import "./markup.js";
//#region src/prism/languages/velocity.js
var vel = languages.velocity = clone(languages.html);
var string = /"[^"]*"|'[^']*'/g;
var punctuation = /[()[\]{}.,:]/;
var number = /\b\d+\b/;
var variable = {
	pattern: /(^|[^\\](?:\\\\)*)\$!?(?:[a-z][\w-]*(?:\([^)]*\))?(?:\.[a-z][\w-]*(?:\([^)]*\))?|\[[^\]]+\])*|\{[^}]+\})/i,
	lookbehind: true,
	inside: {
		"string": string,
		"function": {
			pattern: /([^\w-])[a-z][\w-]*(?=\()/,
			lookbehind: true
		},
		"number": number,
		"boolean": boolean,
		"punctuation": punctuation
	}
};
insertBefore(vel, "comment", {
	"unparsed": {
		pattern: /(^|[^\\])#\[\[[^]*?\]\]#/g,
		lookbehind: true,
		inside: { "punctuation": /^...|\]\]#$/g }
	},
	"velocity-comment": [{
		pattern: /(^|[^\\])#\*[^]*?\*#/g,
		lookbehind: true,
		alias: "comment"
	}, {
		pattern: /(^|[^\\])##.*/g,
		lookbehind: true,
		alias: "comment"
	}],
	"directive": {
		pattern: /(^|[^\\](?:\\\\)*)#@?(?:[a-z][\w-]*|\{[a-z][\w-]*\})(?:\s*\((?:[^()]|\([^)]*\))*\))?/i,
		lookbehind: true,
		inside: {
			"keyword": {
				pattern: /^#@?(?:[a-z][\w-]*|\{[a-z][\w-]*\})|\bin\b/,
				inside: { "punctuation": /[{}]/ }
			},
			"variable": variable,
			"string": string,
			"number": number,
			"boolean": boolean,
			"operator": /[!=<>]=?|[%/*+-]|&&|\|\||\.\.|\b(?:eq|[gl][et]|ne|not)\b/,
			"punctuation": punctuation
		}
	},
	"variable": variable
});
vel["tag"].inside["attr-value"][2].inside[rest] = vel;
//#endregion

//# sourceMappingURL=velocity.js.map