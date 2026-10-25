import { indentGuides } from "./extensions/guides.js";
import { matchBrackets } from "./extensions/matchBrackets/index.js";
import { highlightBracketPairs } from "./extensions/matchBrackets/highlight.js";
import { matchTags } from "./extensions/matchTags.js";
import { n as highlightSelectionMatches } from "./selection-CyY_l5FT.js";
import { copyButton } from "./extensions/copyButton/index.js";
import { blockCommentFolding, bracketFolding, markdownFolding, readOnlyCodeFolding, tagFolding } from "./extensions/folding/index.js";
import "./languages/index.js";
//#region src/extensions/copyButton/copy.css?inline
var copy_default = ".pce-copy{all:unset;cursor:pointer;position:sticky;right:.5em;top:.5em;left:.5em;box-shadow:inset 0 0 0 1px var(--pce-widget-border);margin:-9in 0 0;padding:.5em;background:var(--pce-widget-bg);z-index:3;color:var(--pce-widget-color-options);pointer-events:auto;display:grid!important;align-items:center;font:400 1em/1.5 Arial,Helvetica,sans-serif}.pce-copy,.pce-copy:after,.pce-copy:before{opacity:0;border-radius:.3em;transition:opacity .1s ease-out}.pce-copy:after{content:attr(aria-label);position:absolute;right:calc(100% + .5em);background:#000000b3;color:#fff;text-align:center;width:8ch;font-size:80%;padding:.2em 0;pointer-events:none}.pce-copy:before{content:\"\";position:absolute;top:0;bottom:0;left:0;right:0;background:#9992;box-shadow:inset 0 0 0 1px #999}.prism-code-editor:hover .pce-copy,.pce-copy:hover:before,.pce-copy:hover:after{opacity:1}.pce-copy:focus-visible:before,.pce-copy:focus-visible,.pce-copy:focus-visible:after{opacity:1}";
//#endregion
//#region src/extensions/folding/folding.css?inline
var folding_default = ".pce-fold{position:sticky;display:inline-grid;margin:0 0 0 calc(2px - var(--_ns));width:calc(var(--_ns) - 2px);place-items:center;z-index:2;left:calc(2px + var(--padding-left) - var(--_ns))}.pce-fold,.pce-unfold span{pointer-events:auto;cursor:pointer}.pce-fold>*{width:.7em}.pce-fold>:after{content:\"\";display:block;position:absolute;top:50%;transform:translateY(-50%);height:.7em;width:.7em;background:var(--pce-bg-fold, #777);clip-path:polygon(6.36% 21.82%,0% 28.18%,50% 78.18%,100% 28.18%,93.64% 21.82%,50% 65.45%)}.closed-fold>:after{transform:translateY(-50%) rotate(-90deg)}.pce-unfold{position:absolute;padding-right:inherit;top:0;color:#0000;z-index:1}.pce-unfold span{box-shadow:inset 0 0 0 1px var(--pce-widget-border);border-radius:.3em;background:repeat-x var(--pce-widget-bg) calc(1.5ch - 1.3px) .5em/.85ch url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\"><circle fill=\"%23999\" r=\"1.3\" cx=\"1.3\" cy=\"1.3\"/></svg>')}";
//#endregion
//#region src/setups/readonly.ts
var addExtensions = (editor) => {
	editor.addExtensions(matchBrackets(), highlightBracketPairs(), highlightSelectionMatches(), matchTags(), indentGuides(), copyButton(), readOnlyCodeFolding(tagFolding, bracketFolding, markdownFolding, blockCommentFolding));
};
var style = copy_default + folding_default;
//#endregion
export { addExtensions, style };

//# sourceMappingURL=readonly-BFgqGP8L.js.map