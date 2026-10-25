import { s as languageMap } from "../core-BIWFpCIO.js";
import { a as getLineBefore } from "../utils--SPWoSa0.js";
//#region src/languages/apacheconf.ts
languageMap.apacheconf = {
	comments: { line: "#" },
	autoIndent: [([start], value) => /<\w+\b.*>[ 	]*$/.test(getLineBefore(value, start)), ([start, end], value) => /<\w+\b.*>$/.test(getLineBefore(value, start)) && /^<\/\w+\b.*>/.test(value.slice(end))],
	autoCloseTags([start], value) {
		let match = /<(\w+)\b.*>/.exec(getLineBefore(value, start) + ">");
		return match && `</${match[1]}>`;
	}
};
//#endregion

//# sourceMappingURL=apacheconf.js.map