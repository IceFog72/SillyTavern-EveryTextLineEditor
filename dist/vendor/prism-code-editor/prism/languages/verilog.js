import { a as languages } from "../../core-Dr0o9A-8.js";
import { n as clikeComment } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/verilog.js
languages.verilog = {
	"comment": clikeComment,
	"string": /"(?:\\[^]|[^\\\n"])*"/g,
	"kernel-function": {
		pattern: /\B\$\w+/,
		alias: "property"
	},
	"constant": /\B`\w+/,
	"function": /\b\w+(?=\()/,
	"keyword": /\b(?:alias|assert|assign|assume|automatic|before|begin|bin[ds]|binsof|bit|break|buf|bufif[01]|byte|case[xz]?|cell|chandle|class|clocking|config|const|constraint|context|continue|cover|covergroup|coverpoint|cross|deassign|default|defparam|design|disable|dist|do|edge|else|end(?:case|class|clocking|config|function|generate|group|interface|module|package|primitive|program|property|sequence|specify|table|task)?|enum|event|expect|export|extends|extern|final|first_match|[fnw]or|force|foreach|forever|fork|forkjoin|function|generate|genvar|highz[01]|iff?|ifnone|ignore_bins|illegal_bins|import|incdir|include|initial|in[op]ut|inside|instance|int|integer|interface|intersect|join|join_any|join_none|large|liblist|library|local|localparam|logic|longint|macromodule|matches|medium|modport|module|[nrw]?and|negedge|new|noshowcancelled|not|notif[01]|null|output|package|packed|parameter|posedge|primitive|priority|program|property|protected|pull[01]|pulldown|pullup|pulsestyle_ondetect|pulsestyle_onevent|pure|randc|randcase|randsequence|r?[cnp]mos|real|realtime|re[fg]|release|repeat|return|r?tran|r?tranif[01]|scalared|sequence|shortint|shortreal|showcancelled|signed|small|solve|specify|specparam|static|string|strong[01]|struct|super|supply[01]|table|tagged|task|this|throughout|time|timeprecision|timeunit|tri[01]?|triand|trior|trireg|type|typedef|union|unique|unsigned|use|u?wire|var|vectored|virtual|void|wait|wait_order|weak[01]|while|wildcard|with|within|x?n?or)\b/,
	"important": /\b(?:always|always_comb|always_ff|always_latch)\b(?: *@)?/,
	"number": /\B##?\d+|(?:\b\d+)?'[odbh] ?[a-f\dzx_?]+|\b(?:\d*[._])?\d+(?:e[+-]?\d+)?/i,
	"operator": /[{}~?%&|^!=<>/*+-]+/,
	"punctuation": /[()[\].,:;]/
};
//#endregion

//# sourceMappingURL=verilog.js.map