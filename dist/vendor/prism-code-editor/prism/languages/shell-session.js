import { a as languages } from "../../core-Dr0o9A-8.js";
import "./bash.js";
//#region src/prism/languages/shell-session.js
languages["sh-session"] = languages.shellsession = languages["shell-session"] = {
	"command": {
		pattern: /^(?:[^\s@:$#%*!/\\]+@[^\n@:$#%*!/\\]+(?::[^\0-\x1f$#%*?"<>:;|]+)?|[/~.][^\0-\x1f$#%*?"<>@:;|]*)?[$#%](?=\s)(?:[^\\\n 	"'<$]|[ 	](?:(?!#)|#.*$)|\\[^]|\$(?!')|<(?!<)|"(?:\\[^]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^\\"`$])*"|'[^']*'|\$'(?:\\[^]|[^\\'])*'|<<-?\s*(["']?)(\w+)\1\s[^]*?\n\2)+/gm,
		inside: {
			"info": {
				pattern: /^[^#$%]+/,
				alias: "punctuation",
				inside: {
					"user": /^[^\s@:$#%*!/\\]+@[^\n@:$#%*!/\\]+/,
					"punctuation": /:/,
					"path": /[^]+/
				}
			},
			"bash": {
				pattern: /(^[$#%]\s*)\S[^]*/,
				lookbehind: true,
				alias: "language-bash",
				inside: languages.bash
			},
			"shell-symbol": {
				pattern: /^[$#%]/,
				alias: "important"
			}
		}
	},
	"output": /.(?:.*(?:\n|.$))*/
};
//#endregion

//# sourceMappingURL=shell-session.js.map