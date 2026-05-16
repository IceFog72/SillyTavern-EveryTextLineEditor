import { Extension, PrismEditor } from '../../index.js';

/**
 * Callback used to add extra foldable ranges to an editor.
 * @param editor Editor the folding ranges are added to.
 * @param currentFolds The ranges that are currently foldable.
 * @returns An array of extra foldable ranges.
 */
export type FoldingRangeProvider = (editor: PrismEditor, currentFolds: [number, number][]) => [number, number][];
export interface ReadOnlyCodeFolding extends Extension {
    /** The code in the editor with no ranges collapsed. */
    readonly fullCode: string;
    /**
     * Toggles whether a range is folded. Does not cause a rerender so it's possible to
     * toggle multiple folds simultaneously.
     * @param lineNumber The line number of the fold.
     * @param force If set to `true`, the range will only be folded.
     * If `false`, the range will only be unfolded.
     * If `undefined`, it will be toggled.
     * @returns A boolean indicating whether or not a fold was toggled which means
     * calling {@link updateFolds} in the near future is necessary.
     */
    toggleFold(lineNumber: number, force?: boolean): boolean;
    /** Call this after the {@link toggleFold} method to rerender the editor. */
    updateFolds(): void;
}
/**
 * Extension only supporting read-only editors which adds code folding to the editor.
 *
 * To fold XML elements, a {@link TagMatcher} needs to be added before.
 *
 * To fold bracket pairs, a {@link BracketMatcher} needs to be added before.
 *
 * @param providers Callbacks that can add extra foldable ranges.
 *
 * Very minimal downsides to adding this extension dynamically.
 *
 * Requires styles from `prism-code-editor/code-folding.css`
 */
declare const readOnlyCodeFolding: (...providers: FoldingRangeProvider[]) => ReadOnlyCodeFolding;
/**
 * Folding range provider that allows folding of block comments. For this to work,
 * you need to befine block comments in the {@link languageMap} for the language.
 *
 * Simply pass this function as one of the arguments when calling {@link readOnlyCodeFolding}.
 */
declare const blockCommentFolding: FoldingRangeProvider;
/**
 * Folding range provider that allows folding of titles and code blocks in markdown.
 *
 * Simply pass this function as one of the arguments when calling {@link readOnlyCodeFolding}.
 */
declare const markdownFolding: FoldingRangeProvider;
export { readOnlyCodeFolding, markdownFolding, blockCommentFolding };
