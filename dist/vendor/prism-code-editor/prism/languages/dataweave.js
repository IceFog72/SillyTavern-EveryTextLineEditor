import { a as languages } from "../../core-Dr0o9A-8.js";
import { n as clikeComment, t as boolean } from "../../patterns-DSInPV_c.js";
//#region src/prism/languages/dataweave.js
languages.dataweave = {
	"url": /\b[a-zA-Z]+:\/\/[\w/:.?=&-]+|\burn:[\w:.?=&-]+/,
	"property": /(?:\b\w+#)?(?:"(?:\\.|[^\\\n"])*"|\b\w+)(?=\s*[:@])/g,
	"string": /(["'`])(?:\\[^]|(?!\1)[^\\])*\1/g,
	"mime-type": /\b(?:application|audio|image|multipart|text|video)\/[\w+-]+/,
	"date": /\|[\w:+-]+\|/g,
	"comment": clikeComment,
	"regex": /\/(?:[^\\\n/]|\\[^\n])+\//g,
	"keyword": /\b(?:and|as|at|case|do|else|fun|if|input|is|match|not|ns|null|or|output|type|unless|update|using|var)\b/,
	"function": /\b[a-z_]\w*(?=\s*\()/i,
	"number": /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
	"punctuation": /[()[\]{}.,:;@]/,
	"operator": /<<|>>|->|[~!=<>]=?|--?-?|\+\+?|\?/,
	"boolean": boolean
};
//#endregion

//# sourceMappingURL=dataweave.js.map