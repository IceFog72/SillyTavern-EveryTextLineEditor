import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/plant-uml.js
var variable = /\$\w+|%[a-z]+%/;
var expression = {
	pattern: /(\[)[^[\]]+(?=\])/,
	lookbehind: true
};
var arrowAttr = "\\[[^[\\]]*\\]";
var arrowDirection = "(?:[drlu]|do|down|le|left|ri|right|up)";
var arrowBody = "(?:-+" + arrowDirection + "-+|\\.+" + arrowDirection + "\\.+|-+(?:" + arrowAttr + "-*)?|" + arrowAttr + "-+|\\.+(?:" + arrowAttr + "\\.*)?|" + arrowAttr + "\\.+)";
var arrowLeft = "(?:<<?|//?|\\\\\\\\?|<\\||[#*^+}xo])";
var arrowRight = "(?:>>?|//?|\\\\\\\\?|\\|>|[#*^+{xo])";
var arrow = "[[?]?[ox]?(?:" + arrowBody + arrowRight + "|" + arrowLeft + arrowBody + "(?:" + arrowRight + ")?)[ox]?[\\]?]?";
expression.inside = languages.plantuml = languages["plant-uml"] = {
	"comment": {
		pattern: /(^[ 	]*)(?:'.*|\/'[^]*?'\/)/gm,
		lookbehind: true
	},
	"preprocessor": {
		pattern: /(^[ 	]*)!.*/gm,
		lookbehind: true,
		alias: "property",
		inside: { "variable": variable }
	},
	"delimiter": {
		pattern: /(^[ 	]*)@(?:end|start)uml\b/gm,
		lookbehind: true,
		alias: "punctuation"
	},
	"arrow": {
		pattern: RegExp("(^|[^\\\\[\\].?|ox<>-])" + arrow + "(?![\\\\\\].?|ox<>-])", "g"),
		lookbehind: true,
		alias: "operator",
		inside: {
			"expression": expression,
			"punctuation": /\[(?=$|\])|^\]/
		}
	},
	"string": /"[^"]*"/g,
	"text": {
		pattern: /(\[[ 	]*\n+(?!\n))[^\]]+(?=\])/g,
		lookbehind: true,
		alias: "string"
	},
	"keyword": [{
		pattern: /^([ 	]*)(?:abstract\s+class|end\s+(?:box|fork|group|merge|note|ref|split|title)|(?:fork|split)(?:\s+again)?|activate|actor|agent|alt|annotation|artifact|autoactivate|autonumber|backward|binary|boundary|box|break|caption|card|case|circle|class|clock|cloud|collections|component|concise|control|create|critical|database|deactivate|destroy|detach|diamond|else|elseif|end|end[hr]note|endif|endswitch|endwhile|entity|enum|file|folder|footer|frame|group|[hr]?note|header|hexagon|hide|if|interface|label|legend|loop|map|namespace|network|newpage|node|nwdiag|object|opt|package|page|par|participant|person|queue|rectangle|ref|remove|repeat|restore|return|robust|scale|set|show|skinparam|stack|start|state|stop|storage|switch|title|together|usecase\/?|while)(?!\S)/gm,
		lookbehind: true
	}, /\b(?:elseif|equals|not|while)(?=\s*\()|\b(?:as|is|then)\b/],
	"divider": {
		pattern: /^==.+==$/gm,
		alias: "important"
	},
	"time": {
		pattern: /@(?:\d+(?:[:/]\d+){2}|[+-]?\d+|:[a-z]\w*(?:[+-]\d+)?)\b/gi,
		alias: "number"
	},
	"color": {
		pattern: /#(?:[a-z_]+|[a-fA-F\d]+)\b/,
		alias: "symbol"
	},
	"variable": variable,
	"punctuation": /[()[\]{},:;]|\.{3}/
};
//#endregion

//# sourceMappingURL=plant-uml.js.map