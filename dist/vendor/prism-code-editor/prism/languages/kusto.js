import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/kusto.js
languages.kusto = {
	"comment": /\/\/.*/,
	"string": /```[^]*?```|[hH]?(?:"(?:\\.|[^\\\n"])*"|'(?:\\.|[^\\\n'])*'|@(?:"[^\n"]*"|'[^\n']*'))/g,
	"verb": {
		pattern: /(\|\s*)[a-z][\w-]*/i,
		lookbehind: true,
		alias: "keyword"
	},
	"command": {
		pattern: /\.[a-z][a-z\d-]*\b/,
		alias: "keyword"
	},
	"class-name": /\b(?:bool|datetime|decimal|dynamic|guid|int|long|real|string|timespan)\b/,
	"keyword": /\b(?:access|alias|and|anti|asc?|auto|between|by|(?:contains|(?:ends|starts)with|has(?:perfix|suffix)?)(?:_cs)?|database|declare|desc|external|from|fullouter|has_all|in|ingestion|inline|inner|innerunique|into|(?:left|right)(?:anti(?:semi)?|inner|outer|semi)?|[ls]et|like|local|not|o[fnr]|pattern|print|query_parameters|range|restrict|schema|step|tables?|to|view|where|with|matches\s+regex|nulls\s+(?:first|last))(?![\w-])/,
	"boolean": /\b(?:false|true|null)\b/,
	"function": /\b[a-z_]\w*(?=\s*\()/,
	"datetime": [{
		pattern: /\b(?:(?:Fri|Friday|Mon|Monday|Sat|Saturday|Sun|Sunday|Thu|Thursday|Tue|Tuesday|Wed|Wednesday)\s*,\s*)?\d\d?(?:\s+|-)(?:Apr|Aug|Dec|Feb|Jan|Ju[ln]|Ma[ry]|Nov|Oct|Sep)(?:\s+|-)\d\d\s+\d\d:\d\d(?::\d\d)?(?:\s*(?:\b(?:[A-Z]|(?:[ECMT][DS]|GM|U)T)|[+-]\d{4}))?\b/,
		alias: "number"
	}, {
		pattern: /[+-]?\b(?:\d{4}-\d\d-\d\d(?:[ T]\d\d:\d\d(?::\d\d(?:\.\d+)?)?)?|\d\d:\d\d(?::\d\d(?:\.\d+)?)?)Z?/,
		alias: "number"
	}],
	"number": /\b(?:0x[a-fA-F\d]+|\d+(?:\.\d+)?(?:[Ee][+-]?\d+)?)(?:(?:min|sec|[mnµ]s|[dhms]|microsecond|tick)\b)?|[+-]?\binf\b/,
	"operator": /=>|[!=]~|[!=<>]=?|[%|/*+-]|\.\./,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=kusto.js.map