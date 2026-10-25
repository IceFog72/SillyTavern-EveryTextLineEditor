import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as clikePunctuation, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/gdscript.js
languages.gdscript = {
	"comment": /#.*/,
	"string": /@?(?:(["'])(?:\\[^]|(?!\1)[^\\\n])*\1(?!"|')|"""(?:\\[^]|[^\\])*?""")/g,
	"class-name": {
		pattern: /(^(?:class|class_name|extends)[ 	]+|^export\([ 	]*|\bas[ 	]+|(?:\b(?:const|var)[ 	]|[,(])[ 	]*\w+[ 	]*:[ 	]*|->[ 	]*)(?!\d)\w+/m,
		lookbehind: true
	},
	"keyword": /\b(?:and|as|assert|break|breakpoint|class|class_name|const|continue|elif|else|enum|export|extends|f?or|func|if|in|is|master|mastersync|match|not|null|onready|pass|preload|puppet|puppetsync|remote|remotesync|return|self|setget|signal|static|tool|var|while|yield)\b/,
	"function": /\b[a-z_]\w*(?=[ 	]*\()/i,
	"variable": /\$\w+/,
	"number": [/\b0b[01_]+\b|\b0x[a-fA-F\d_]+\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.[\d_]+)(?:e[+-]?[\d_]+)?\b/, /\b(?:INF|NAN|PI|TAU)\b/],
	"constant": /\b[A-Z][A-Z_\d]*\b/,
	"boolean": boolean,
	"operator": /->|:=|&&|\|\||<<|>>|[%&|!=<>/*+-]=?|[~^]/,
	"punctuation": clikePunctuation
};
//#endregion

//# sourceMappingURL=gdscript.js.map