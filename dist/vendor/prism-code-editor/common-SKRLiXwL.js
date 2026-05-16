import "./languages/clike.js";
import "./languages/css.js";
import "./languages/html.js";
import "./languages/jsx.js";
import "./languages/python.js";
import "./languages/xml.js";
import { matchBrackets as r } from "./extensions/matchBrackets/index.js";
import { highlightBracketPairs as t } from "./extensions/matchBrackets/highlight.js";
import { indentGuides as i } from "./extensions/guides.js";
import { cursorPosition as m } from "./extensions/cursor.js";
import { defaultCommands as p } from "./extensions/commands.js";
import "./index-svJglgH1.js";
import "./prismCore-AxbjJFmh.js";
import "./patterns-JQzfU8Ac.js";
import "./utils-qtFp4SO6.js";
const P = (o) => {
  o.addExtensions(
    p(),
    i(),
    r(),
    t(),
    m()
  );
};
export {
  P as addExtensions
};
//# sourceMappingURL=common-SKRLiXwL.js.map
