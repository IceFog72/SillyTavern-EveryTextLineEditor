import { a as languages } from "../../core-Dr0o9A-8.js";
import { i as insertBefore, r as extend } from "../../language-CXbc22uF.js";
import { i as clikePunctuation } from "../../patterns-DSInPV_c.js";
import "./json.js";
//#region src/prism/languages/jsonp.js
insertBefore(languages.jsonp = extend("json", { "punctuation": clikePunctuation }), "punctuation", { "function": /(?!\d)(?:(?!\s)[$\w\xa0-\uffff])+(?=\s*\()/ });
//#endregion

//# sourceMappingURL=jsonp.js.map