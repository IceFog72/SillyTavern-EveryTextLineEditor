import { TokenStream } from '../prism/index.js';
export type CodeBlockOptions = {
    /**
     * Language used for syntax highlighting. If the language doesn't have a registered
     * Prism grammar, syntax highlighting will be disabled.
     */
    language: string;
    /** Code in the code block. */
    value: string;
    /** Number of spaces a tab is equal to. @default 2 */
    tabSize?: number;
    /** Whether or not to display line numbers. @default false */
    lineNumbers?: boolean;
    /** Line number of the first line. @default 1 */
    lineNumberStart?: number;
    /** Whether or not lines can wrap. @default false */
    wordWrap?: boolean;
    /**
     * Whether or not indentation is preserved on wrapped lines. When `true`, tabs are
     * replaced with spaces since Chrome doesn't render tabs properly with this enabled.
     * Defaults to `true` when `wordWrap` is enabled.
     */
    preserveIndent?: boolean;
    /**
     * Whether or not to display indentation guides. Does support `wordWrap` unlike the
     * `indentGuides()` editor extension. Does not work with `rtl`. @default false
     */
    guideIndents?: boolean;
    /**
     * Whether the code block uses right to left directionality. Requires styles from
     * `prism-code-editor/rtl-layout.css` to work. @default false
     */
    rtl?: boolean;
    /**
     * Additional classes for the root element of the code block. Useful when styling
     * individual code blocks. The `pre.prism-code-editor` selector can be used to style
     * all code blocks.
     */
    class?: string;
    /**
     * Callback that can be used to modify the tokens before they're stringified to HTML.
     * Can be used to add rainbow brackets for example.
     */
    tokenizeCallback?(tokens: TokenStream, language: string): void;
    /**
     * Callback function that can be used to add extra classes to lines. Multiple classes
     * can be separated by spaces. Note that the `lineNumberStart` option does not affect
     * the line number passed to the callback.
     * @param lineNumber The line number of the line.
     */
    addLineClass?(lineNumber: number): string | undefined | null;
};
/**
 * Renders a static code block as HTML. Styles from `prism-code-editor/code-block.css`
 * are required in addition to the normal layout.
 * @param options Options controlling how to render the code block. Any extra properties
 * not in {@link CodeBlockOptions} will be stringified as JSON and later parsed by
 * {@link forEachCodeBlock}.
 * @returns String of HTML for the static code block.
 */
declare const renderCodeBlock: <T extends {}>(options: CodeBlockOptions & Omit<T, keyof CodeBlockOptions>) => string;
export { renderCodeBlock };
