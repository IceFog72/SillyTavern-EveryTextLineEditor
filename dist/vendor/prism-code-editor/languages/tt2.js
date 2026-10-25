import { n as getClosestToken } from "../utils--SPWoSa0.js";
import { l as markupTemplateLang } from "../shared-DXMiLwjC.js";
//#region src/languages/tt2.ts
markupTemplateLang("tt2", { block: ["[%#", "%]"] }).getComments = (editor, position) => ({
	line: getClosestToken(editor, ".tt2", 0, 0, position) && "#",
	block: ["[%#", "%]"]
});
//#endregion

//# sourceMappingURL=tt2.js.map