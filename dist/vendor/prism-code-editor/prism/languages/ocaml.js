import { a as languages } from "../../core-Dr0o9A-8.js";
import { t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/ocaml.js
languages.ocaml = {
	"comment": /\(\*[^]*?\*\)/,
	"char": /'(?:[^\\\n']|\\(?:.|[ox]?[a-f\d]{1,3}))'/gi,
	"string": /"(?:\\[^]|[^\\\n"])*"|\{([a-z_]*)\|[^]*?\|\1\}/g,
	"number": /\b(?:0b[01][01_]*|0o[0-7][0-7_]*|0x[a-f\d][a-f\d_]*(?:\.[a-f\d_]*)?(?:p[+-]?\d[\d_]*)?|\d[\d_]*(?:\.[\d_]*)?(?:e[+-]?\d[\d_]*)?)(?!\w)/i,
	"directive": {
		pattern: /\B#\w+/,
		alias: "property"
	},
	"label": {
		pattern: /\B~\w+/,
		alias: "property"
	},
	"type-variable": {
		pattern: /\B'\w+/,
		alias: "function"
	},
	"variant": {
		pattern: /`\w+/,
		alias: "symbol"
	},
	"keyword": /\b(?:as|assert|begin|class|constraint|do|done|downto|else|end|exception|external|for|fun|function|functor|if|in|include|inherit|initializer|lazy|let|match|method|module|mutable|new|nonrec|object|of|open|private|rec|sig|struct|[tw]hen|to|try|type|val|value|virtual|where|while|with)\b/,
	"boolean": boolean,
	"operator-like-punctuation": {
		pattern: /\[[<>|]|[>|]\]|\{<|>\}/,
		alias: "punctuation"
	},
	"operator": /\.[.~]|:[=>]|[@$?~%&|^!=<>/*+-][.:/@$?~%&|^!=<>/*+-]*|\b(?:and|asr|land|ls[lr]|lx?or|mod|or)\b/,
	"punctuation": /;;|::|[()[\]{}.,:;#]|\b_\b/
};
//#endregion

//# sourceMappingURL=ocaml.js.map