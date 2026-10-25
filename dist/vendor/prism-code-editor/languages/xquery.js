import { s as languageMap } from "../core-BIWFpCIO.js";
import { n as getClosestToken } from "../utils--SPWoSa0.js";
import { c as markupLanguage } from "../shared-DXMiLwjC.js";
//#region src/languages/xquery.ts
var comment = ["(:", ":)"];
var xquery = languageMap.xquery = markupLanguage({ block: comment }, /<(?!!|\d)([^\s/=>$<%]+)(?:\s+[^\s/=>]+(?:\s*=\s*(["'])(?:\{\{|\{(?!\{)(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})*\}|(?!\2)[^{])*\2)?)*\s*>[ 	]*$/);
xquery.getComments = (editor, position) => ({ block: getClosestToken(editor, ".plain-text", 0, 0, position) ? ["{(:", ":)}"] : comment });
//#endregion

//# sourceMappingURL=xquery.js.map