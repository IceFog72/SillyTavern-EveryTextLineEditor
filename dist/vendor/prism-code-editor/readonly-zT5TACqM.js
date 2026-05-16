import "./languages/clike.js";
import "./languages/css.js";
import "./languages/html.js";
import "./languages/jsx.js";
import "./languages/python.js";
import "./languages/xml.js";
import { indentGuides as e } from "./extensions/guides.js";
import { matchBrackets as t } from "./extensions/matchBrackets/index.js";
import { copyButton as i } from "./extensions/copyButton/index.js";
import { matchTags as r } from "./extensions/matchTags.js";
import { readOnlyCodeFolding as p, blockCommentFolding as c, markdownFolding as a } from "./extensions/folding/index.js";
import { highlightBracketPairs as n } from "./extensions/matchBrackets/highlight.js";
import { highlightSelectionMatches as s } from "./selection-D4-XLNej.js";
import "./index-svJglgH1.js";
import "./prismCore-AxbjJFmh.js";
import "./patterns-JQzfU8Ac.js";
import "./utils-qtFp4SO6.js";
import "./search-nZ8ypo4o.js";
const d = '.pce-copy{all:unset;cursor:pointer;position:sticky;right:.5em;top:.5em;left:.5em;box-shadow:inset 0 0 0 1px var(--widget__border);margin:-9in 0 0;padding:.6em;background:var(--widget__bg);z-index:3;color:var(--widget__color-options);pointer-events:auto;display:grid!important;align-items:center;font:400 1em/1.5 Arial,Helvetica,sans-serif}.pce-copy,.pce-copy:after,.pce-copy:before{opacity:0;border-radius:.4em;transition:opacity .1s ease-out}.pce-copy:after{content:attr(aria-label);position:absolute;right:calc(100% + .5em);background:#000000b3;color:#fff;text-align:center;width:8ch;font-size:80%;padding:.3em 0;pointer-events:none}.pce-copy:before{content:"";position:absolute;top:0;bottom:0;left:0;right:0;background:#9992;box-shadow:inset 0 0 0 1px #999}.prism-code-editor:hover .pce-copy,.pce-copy:hover:before,.pce-copy:hover:after{opacity:1}.pce-copy:focus-visible:before,.pce-copy:focus-visible,.pce-copy:focus-visible:after{opacity:1}', l = `.pce-fold{position:absolute;display:inline-grid;margin:0 0 0 calc(2px - var(--_ns));width:calc(var(--_ns) - 2px);place-items:center;z-index:2}.pce-fold,.pce-unfold span{pointer-events:auto;cursor:pointer}.pce-fold>*{width:.7em}.pce-fold>:after{content:"";display:block;position:absolute;top:50%;transform:translateY(-50%);height:.7em;width:.7em;background:var(--editor__bg-fold, #777);clip-path:polygon(6.36% 21.82%,0% 28.18%,50% 78.18%,100% 28.18%,93.64% 21.82%,50% 65.45%)}.closed-fold>:after{transform:translateY(-50%) rotate(-90deg)}.pce-nowrap .pce-fold{position:sticky;left:calc(2px + var(--padding-left) - var(--_ns))}.pce-unfold{position:absolute;padding:inherit;top:0;color:#0000;z-index:1}.pce-unfold span{box-shadow:inset 0 0 0 1px var(--widget__border);border-radius:.3em;background:repeat-x var(--widget__bg) calc(1.5ch - 1.3px) .5em/.85ch url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"><circle fill="%23999" r="1.3" cx="1.3" cy="1.3"/></svg>')}`, A = (o) => {
  o.addExtensions(
    t(),
    n(),
    s(),
    r(),
    e(),
    i(),
    p(a, c)
  );
}, G = d + l;
export {
  A as addExtensions,
  G as style
};
//# sourceMappingURL=readonly-zT5TACqM.js.map
