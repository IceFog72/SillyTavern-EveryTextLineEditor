import { Extension, PrismEditor } from '../../index.js';
/**
 * Callback used to add extra foldable ranges to an editor.
 * @param editor Editor the folding ranges are added to.
 * @param currentFolds The ranges that are currently foldable.
 * @returns An array of extra foldable ranges.
 */
export type FoldingRangeProvider = (editor: PrismEditor, currentFolds: [number, number][]) => [number, number][] | undefined;
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
 * @param providers By default, this extension does not add any foldable ranges and you
 * must add folding range providers. This package defines multiple folding range providers
 * you can import like {@link bracketFolding}, {@link tagFolding},
 * {@link blockCommentFolding}, and {@link markdownFolding}. You can also define your own
 * providers.
 *
 * Very minimal downsides to adding this extension dynamically.
 *
 * Requires styles from `prism-code-editor/code-folding.css`
 */
declare const readOnlyCodeFolding: (...providers: FoldingRangeProvider[]) => ReadOnlyCodeFolding;
/**
 * Folding range provider that adds folding of square, round, and curly brackets.
 * Requires a {@link BracketMatcher} added to the editor to work.
 */
declare const bracketFolding: FoldingRangeProvider;
/**
 * Folding range provider that adds folding of HTML/XML elements.
 * Requires a {@link TagMatcher} added to the editor to work.
 */
declare const tagFolding: FoldingRangeProvider;
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
export { readOnlyCodeFolding, markdownFolding, blockCommentFolding, tagFolding, bracketFolding };
