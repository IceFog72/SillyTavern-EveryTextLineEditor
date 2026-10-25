import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/mermaid.js
languages.mermaid = {
	"comment": /%%.*/g,
	"style": {
		pattern: /^([ 	]*(?:classDef|linkStyle|style)[ 	]+[$\w-]+[ 	]+)\w.*[^\s;]/m,
		lookbehind: true,
		inside: {
			"property": /\b\w[\w-]*(?=[ 	]*:)/,
			"operator": /:/,
			"punctuation": /,/
		}
	},
	"inter-arrow-label": {
		pattern: /([^<>ox.=-])(?:-[-.]|==)(?![<>ox.=-])[ 	]*(?:"[^\n"]*"|[^\s".=-](?:[^\n.=-]*[^\s.=-])?)[ 	]*(?:\.+->?|--+[->]|==+[=>])(?![<>ox.=-])/g,
		lookbehind: true,
		inside: {
			"arrow": {
				pattern: /(?:\.+->?|--+[->]|==+[=>])$/,
				alias: "operator"
			},
			"label": {
				pattern: /^([^]{2}[ 	]*)\S(?:[^]*\S)?/,
				lookbehind: true,
				alias: "property"
			},
			"arrow-head": {
				pattern: /^\S+/,
				alias: "arrow operator"
			}
		}
	},
	"arrow": [
		{
			pattern: /(^|[^{}|o.-])[|}][|o](?:--|\.\.)[|o][|{](?![{}|o.-])/,
			lookbehind: true,
			alias: "operator"
		},
		{
			pattern: /(^|[^<>ox.=-])(?:[<ox](?:==+|--+|-\.*-)[>ox]?|(?:==+|--+|-\.*-)[>ox]|===+|---+|-\.+-)(?![<>ox.=-])/,
			lookbehind: true,
			alias: "operator"
		},
		{
			pattern: /(^|[^<>()x-])(?:--?(?:>>|[x>)])(?![<>()x])|(?:<<|[x<(])--?(?!-))/,
			lookbehind: true,
			alias: "operator"
		},
		{
			pattern: /(^|[^<>|*o.-])(?:[*o]--|--[*o]|<\|?(?:--|\.\.)|(?:--|\.\.)\|?>|--|\.\.)(?![<>|*o.-])/,
			lookbehind: true,
			alias: "operator"
		}
	],
	"label": {
		pattern: /(^|[^|<])\|(?:[^\n"|]|"[^\n"]*")+\|/g,
		lookbehind: true,
		alias: "property"
	},
	"text": {
		pattern: /(?:[(\[{]+|\b>)(?:[^\n"()[\]{}]|"[^\n"]*")+(?:[)\]}]+|>)/,
		alias: "string"
	},
	"string": /"[^\n"]*"/g,
	"annotation": {
		pattern: /<<(?:abstract|choice|enumeration|fork|interface|join|service)>>|\[\[(?:choice|fork|join)\]\]/i,
		alias: "important"
	},
	"keyword": [{
		pattern: /(^[ 	]*)(?:action|callback|class|classDef|classDiagram|click|direction|erDiagram|flowchart|gantt|gitGraph|graph|journey|link|linkStyle|pie|requirementDiagram|sequenceDiagram|stateDiagram|stateDiagram-v2|style|subgraph)(?![$\w-])/gm,
		lookbehind: true
	}, {
		pattern: /(^[ 	]*)(?:activate|alt|and|as|autonumber|deactivate|else|end(?:[ 	]+note)?|loop|opt|par|participant|rect|state|note[ 	]+(?:over|(?:left|right)[ 	]+of))(?![$\w-])/gim,
		lookbehind: true
	}],
	"entity": /#[a-z\d]+;/,
	"operator": {
		pattern: /(\w[ 	]*)&(?=[ 	]*\w)|:::|:/,
		lookbehind: true
	},
	"punctuation": /[(){};]/
};
//#endregion

//# sourceMappingURL=mermaid.js.map