import { s as languageMap } from "../core-BIWFpCIO.js";
import { i as clikeComment, r as bracketIndenting } from "../shared-DXMiLwjC.js";
//#region src/languages/css.ts
languageMap.css = bracketIndenting({ block: ["/*", "*/"] });
languageMap.less = languageMap.scss = bracketIndenting();
languageMap.sass = { comments: clikeComment };
//#endregion

//# sourceMappingURL=css.js.map