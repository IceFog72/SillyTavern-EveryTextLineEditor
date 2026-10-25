import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/hoon.js
languages.hoon = {
	"comment": /::.*/,
	"string": /"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'/g,
	"constant": /%(?:\.[ny]|[\w-]+)/,
	"class-name": /@(?:[a-z\d-]*[a-z\d])?|\*/i,
	"function": /(?:\+[+-]  )?(?:[a-z](?:[a-z\d-]*[a-z\d])?)/,
	"keyword": /\.[+*=?^]|![.:?!=<>]|=[.,:;~?|^<>/*+-]|\?[|.:^<>&~=@!+-]|\|[$_%.:^~*=@?-]|\+[|$+*]|:[_^~*+-]|%[_.:^~*=+]|\^[|.:&~*=?+-]|\$[|_%:<>^&~@=?-]|;[<:;/~*=+]|~[%&|$_?!=<>/+]|--|==/
};
//#endregion

//# sourceMappingURL=hoon.js.map