/** @module code-blocks */
export type PrismCodeBlock = {
    /** Outermost element of the code block. */
    readonly container: HTMLPreElement;
    /** `<code>` element wrapping the lines and overlays. */
    readonly wrapper: HTMLElement;
    /**
     * Collection containing the overlays as the first element. The rest of the elements
     * are the code lines. This means the first line starts at index 1.
     */
    readonly lines: HTMLCollectionOf<HTMLDivElement>;
    /** The code of the code block. */
    readonly code: string;
    /** The language of the code block. */
    readonly language: string;
};
/**
 * Runs a callback function for each code block under the root in document order. If a
 * callback has previously been run for a code block, it's skipped.
 *
 * The callback function takes the code block as the first argument. The second parameter
 * is any additional properties passed when the code block was created. These options
 * were stringified to JSON and parsed.
 * @param root Root to search for code blocks under.
 * @param callback Function to run for each code block.
 * @returns An array with all visited code blocks in document order.
 */
declare const forEachCodeBlock: <T extends {}>(root: Document | Element, callback: (codeBlock: PrismCodeBlock, options: T) => void) => PrismCodeBlock[];
/**
 * @param selector Selector used to specify which lines to omit from the resulting code.
 * @returns A function that returns the code inside a code block without any lines that
 * match the specified selector.
 */
declare const omitLines: (selector: string) => (codeBlock: PrismCodeBlock) => string;
/**
 * Adds a copy button to a code block. Requires styles from
 * `prism-code-editor/copy-button.css`.
 *
 * By default, the copy button is only shown when the code block is hovered. To always
 * show it, change the default opacity with the following CSS:
 *
 * ```less
 * button.pce-copy {
 *   opacity: 1; // or a lower value for a semi-transparent button
 * }
 * ```
 * @param codeBlock Code block to add the copy button to.
 * @param getCode Function used to get the copied code. Can be used to e.g. omit deleted
 * lines.
 * @param label `aria-label` for the button. Defaults to `"Copy"`.
 * @param copiedLabel Temporary `aria-label` for the button after it has been clicked.
 * Defaults to `"Copied!"`.
 */
declare const addCopyButton: (codeBlock: PrismCodeBlock, getCode?: (codeBlock: PrismCodeBlock) => string, label?: string, copiedLabel?: string) => void;
export { forEachCodeBlock, addCopyButton, omitLines };
export * from './hover.js';
