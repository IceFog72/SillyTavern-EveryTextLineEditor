import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/gap.js
var gap = {
	pattern: /^(gap>).+(?:\n>.*)*/,
	lookbehind: true
};
gap.inside = languages.gap = {
	"shell": {
		pattern: /^gap>[^]*?(?=^gap>|$(?![^]))/gm,
		inside: {
			"gap": gap,
			"punctuation": /^gap>/
		}
	},
	"comment": /#.*/g,
	"string": {
		pattern: /(^|[^\\"'])(?:'(?:\\.|[^\\\n']|){1,10}'|"(?:\\.|[^\\\n"])*"(?!")|"""[^]*?""")/g,
		lookbehind: true,
		inside: { "continuation": {
			pattern: /^>/m,
			alias: "punctuation"
		} }
	},
	"keyword": /\b(?:Assert|Info|IsBound|QUIT|TryNextMethod|Unbind|[ae]nd|atomic|break|continue|do|elif|else|fi|f?or|function|if|in|local|m?od|not|quit|readonly|readwrite|rec|repeat|return|then|until|while)\b/,
	"boolean": boolean,
	"function": /\b[a-z_]\w*(?=\s*\()/i,
	"number": {
		pattern: /(^|[^\w.]|\.\.)(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?(?:_[a-z]?)?(?=$|[^\w.]|\.\.)/,
		lookbehind: true
	},
	"continuation": {
		pattern: /^>/m,
		alias: "punctuation"
	},
	"operator": /->|[~^!=/*+-]|<>|[<>]=?|:=|\.\./,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=gap.js.map