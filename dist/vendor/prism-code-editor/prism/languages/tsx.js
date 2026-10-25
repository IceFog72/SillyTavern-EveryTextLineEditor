import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore } from "../../language-CXbc22uF.js";
import { n as re } from "../../shared-oTKIFAwH.js";
import { r as space, t as addJsxTag } from "../../jsx-shared-BgBgis07.js";
import "./typescript.js";
import "./jsx.js";
//#region src/prism/languages/tsx.js
var tsx = addJsxTag(languages.ts, "tsx");
var tag = tsx["tag"];
var bracket = "(?:^|(";
try {
	RegExp("(?<=)");
	bracket += "?<=";
} catch {
	tag.lookbehind = true;
}
tag.pattern = RegExp(bracket + `[^\\w$])|(?=</))${tag.pattern.source.replace(space, space + `|(?:${space})*<(?:[^<>=]|=[^<]|=?<(?:[^<>]|<[^<>]*>)*>)*>`)}`, "g");
insertBefore(tag.inside, "attr-value", { "generic": {
	pattern: re("(^<0>*)<(?:[^<>=]|=[^<]|=?<(?:[^<>]|<[^<>]*>)*>)*>", [space]),
	lookbehind: true,
	alias: "class-name",
	inside: tsx["class-name"].inside
} });
//#endregion

//# sourceMappingURL=tsx.js.map