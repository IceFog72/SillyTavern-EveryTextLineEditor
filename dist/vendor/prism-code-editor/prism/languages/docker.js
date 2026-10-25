import { a as languages } from "../../core-Dr0o9A-8.js";
import { n as re, r as replace } from "../../shared-oTKIFAwH.js";
var space = replace("(?:[ 	]+(?![ 	])<0>?|<0>)", ["\\\\\n(?:\\s|\\\\\n|#.*(?!.))*(?![\\s#]|\\\\\n)"]);
var string = /"(?:\\[^]|[^\\\n"])*"|'(?:\\[^]|[^\\\n'])*'/g;
var stringSrc = string.source;
var option = replace("--[\\w-]+=(?:<0>|(?![\"'])(?:\\\\.|[^\\\\\\s])+)", [stringSrc]);
var stringRule = string;
var commentRule = {
	pattern: /(^[ 	]*)#.*/gm,
	lookbehind: true
};
languages.dockerfile = languages.docker = {
	"instruction": {
		pattern: /(^[ 	]*)(?:add|arg|cmd|copy|entrypoint|env|expose|from|healthcheck|label|maintainer|onbuild|run|shell|stopsignal|user|volume|workdir)(?=\s)(?:\\.|[^\\\n])*(?:\\$(?:\s|#.*$)*(?![\s#])(?:\\.|[^\\\n])*)*/gim,
		lookbehind: true,
		inside: {
			"options": {
				pattern: re("(^(?:onbuild<0>)?\\w+<0>)<1>(?:<0><1>)*", [space, option], "gi"),
				lookbehind: true,
				inside: {
					"property": {
						pattern: /(^|\s)--[\w-]+/,
						lookbehind: true
					},
					"string": [stringRule, {
						pattern: /(=)(?!["'])(?:\\.|[^\\\s])+/,
						lookbehind: true
					}],
					"operator": /\\$/m,
					"punctuation": /=/
				}
			},
			"keyword": [
				{
					pattern: re("(^(?:onbuild<0>)?healthcheck<0>(?:<1><0>)*)(?:cmd|none)\\b", [space, option], "gi"),
					lookbehind: true
				},
				{
					pattern: re("(^(?:onbuild<0>)?from<0>(?:<1><0>)*(?!--)[^\\\\ 	]+<0>)as", [space, option], "gi"),
					lookbehind: true
				},
				{
					pattern: re("(^onbuild<0>)\\w+", [space], "gi"),
					lookbehind: true
				},
				/^\w+/g
			],
			"comment": commentRule,
			"string": stringRule,
			"variable": /\$(?:\w+|\{[^\\{}"']*\})/,
			"operator": /\\$/m
		}
	},
	"comment": commentRule
};
//#endregion

//# sourceMappingURL=docker.js.map