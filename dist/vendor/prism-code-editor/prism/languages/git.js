import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/git.js
languages.git = {
	"comment": /^#.*/m,
	"deleted": /^[-–].*/m,
	"inserted": /^\+.*/m,
	"string": /(["'])(?:\\.|(?!\1)[^\\\n])*\1/,
	"command": {
		pattern: /^.*\$ git .*/m,
		inside: { "parameter": /\s--?\w+/ }
	},
	"coord": /^@@.*@@$/m,
	"commit-sha1": /^commit \w{40}$/m
};
//#endregion

//# sourceMappingURL=git.js.map