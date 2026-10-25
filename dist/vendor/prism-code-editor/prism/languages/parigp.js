import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/parigp.js
languages.parigp = {
	"comment": /\/\*[^]*?\*\/|\\\\.*/,
	"string": /"(?:\\.|[^\\\n"])*"/g,
	"keyword": RegExp("\\b(?:" + "breakpoint|break|dbg_down|dbg_err|dbg_up|dbg_x|forcomposite|fordiv|forell|forpart|forprime|forstep|forsubgroup|forvec|for|iferr|if|local|my|next|return|until|while".replace(/\w/g, "$& *") + ")\\b"),
	"function": /\b\w(?:[\w ]*\w)?(?= *\()/,
	"number": {
		pattern: /(\. *\. *)?(?:\b\d(?: *\d)*(?: *(?!\. *\.)\.(?: *\d)*)?|\. *\d(?: *\d)*)(?: *e *(?:[+-] *)?\d(?: *\d)*)?/i,
		lookbehind: true
	},
	"operator": /\. *\.|[*/!](?: *=)?|%(?: *=|(?: *#)?(?: *')*)?|\+(?: *[+=])?|-(?: *[-=>])?|<(?: *>|(?: *<)?(?: *=)?)?|>(?: *>)?(?: *=)?|=(?: *=){0,2}|\\(?: *\/)?(?: *=)?|&(?: *&)?|\| *\||['#~^]/,
	"punctuation": /[()[\]{}.,:;|]/
};
//#endregion

//# sourceMappingURL=parigp.js.map