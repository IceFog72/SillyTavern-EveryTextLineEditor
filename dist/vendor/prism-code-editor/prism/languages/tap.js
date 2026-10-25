import { a as languages } from "../../core-Dr0o9A-8.js";
import "./yaml.js";
//#region src/prism/languages/tap.js
languages.tap = {
	"fail": /not ok[^#{\n]*/,
	"pass": /ok[^#{\n]*/,
	"pragma": /pragma [+-][a-z]+/,
	"bailout": /bail out!.*/i,
	"version": /tap version \d+/i,
	"plan": /\b\d+\.\.\d+(?: +#.*)?/,
	"subtest": /# Subtest(?:: .*)?/g,
	"punctuation": /[{}]/,
	"directive": /#.*/,
	"yamlish": {
		pattern: /(^[ 	]*)---[^]*?\n[ 	]*\.{3}$/m,
		lookbehind: true,
		alias: "language-yaml",
		inside: languages.yaml
	}
};
//#endregion

//# sourceMappingURL=tap.js.map