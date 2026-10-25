import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/vhdl.js
languages.vhdl = {
	"comment": /--.+/,
	"vhdl-vectors": {
		"pattern": /\b[oxb]"[a-f\d_]+"|"[01uxzwlh-]+"/i,
		"alias": "number"
	},
	"quoted-function": {
		pattern: /"\S+?"(?=\()/,
		alias: "function"
	},
	"string": /"(?:\\[^]|[^\\\n"])*"/,
	"attribute": {
		pattern: /\b'\w+/,
		alias: "attr-name"
	},
	"keyword": /\b(?:access|after|alias|all|architecture|array|assert|attribute|begin|block|body|buffer|bus|case|component|configuration|constant|disconnect|downto|else|elsif|end|entity|exit|file|for|function|generate|generic|group|guarded|impure|inertial|inout|i[fns]|label|library|linkage|literal|loop|map|new|next|null|of|on|open|others|out|package|port|postponed|private|procedure|process|pure|range|record|register|reject|report|return|select|severity|shared|signal|subtype|[tw]hen|to|transport|type|unaffected|units|until|use|variable|view|wait|while|with)\b/i,
	"boolean": /\b(?:false|true)\b/i,
	"function": /\w+(?=\()/,
	"number": /'[01uxzwlh-]'|\b(?:\d+#[a-f\d_.]+#|\d[\d_.]*)(?:e[-+]?\d+)?/i,
	"operator": /[<>]=?|:=|[&=/*+-]|\b(?:abs|n?and|mod|x?n?or|not|rem|ro[lr]|s[lr][al])\b/i,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=vhdl.js.map