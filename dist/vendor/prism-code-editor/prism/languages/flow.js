import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, n as clone } from "../../language-CXbc22uF.js";
import "./javascript.js";
//#region src/prism/languages/flow.js
var flow = languages.flow = clone(languages.js);
insertBefore(flow, "keyword", { "type": [{
	pattern: /\b(?:[Bb]oolean|Function|[Nn]umber|[Ss]tring|[Ss]ymbol|any|mixed|null|void)\b/,
	alias: "class-name"
}] });
flow["function-variable"].pattern = /(?!\d)(?:(?!\s)[$\w\xa0-\uffff])+(?=\s*=\s*(?:function\b|(?:\([^()]*\)(?:\s*:\s*\w+)?|(?!\d)(?:(?!\s)[$\w\xa0-\uffff])+)\s*=>))/i;
delete flow["parameter"];
insertBefore(flow, "operator", { "flow-punctuation": {
	pattern: /\{\||\|\}/,
	alias: "punctuation"
} });
flow.keyword.unshift({
	pattern: /(^|[^$]\b)(?:Class|declare|opaque|type)\b(?!\$)/,
	lookbehind: true
}, {
	pattern: /(^|[^$]\B)\$(?:Diff|Enum|Exact|Keys|ObjMap|PropertyType|Record|Shape|Subtype|Supertype|await)\b(?!\$)/,
	lookbehind: true
});
//#endregion

//# sourceMappingURL=flow.js.map