import { PrismCodeBlock } from './code-block.js';
export type HoverOptions = {
    /** Whether the prefered position of the tooltip is above the token. @default false */
    above?: boolean;
    /** A CSS length value for the tooltip's max width. */
    maxWidth?: string;
    /** A CSS length value for the tooltip's max height. */
    maxHeight?: string;
    /**
     * Whether the callback will be called for tokens that have elements as children.
     * @default false
     */
    allowChildren?: boolean;
    /**
     * Delay before the tooltip is opened in milliseconds. If omitted, the tooltip opens
     * immediately.
     */
    delay?: number;
    /**
     * The opening delay can be temporarily removed after closing a tooltip, and this option
     * controls for how many milliseconds it is removed. If omitted, the delay is always
     * applied. When a tooltip gets opened with no delay, it gets the `pce-instant` class
     * added. The `.pce-instant` selector can therefore be used to remove CSS transitions
     * when opened with no delay for example.
     */
    warmDuration?: number;
};
export type HoverCallback = (types: string[], language: string, text: string, element: HTMLSpanElement, codeBlock: PrismCodeBlock) => (string | Node)[] | null | undefined;
/**
 * Utility that makes it easier to add hover descriptions to tokens.
 * @param codeBlock Code block to add the functionality to.
 * @param callback Function called when a token with only textual children is hovered.
 *
 * The function gets called with the following arguments:
 * - `types`: Array with the token's type as the first element, followed by any alises.
 * - `language`: The language at the token's position.
 * - `text`: The `textContent` of the token.
 * - `element`: The `<span>` element of the hovered token.
 *
 * Lastly, the function should return an array of children that get added to the tooltip.
 * If `null` or `undefined` is returned, no tooltip is shown for the token.
 * @param options Options for configuring the size and position of the tooltip.
 */
declare const addHoverDescriptions: (codeBlock: PrismCodeBlock, callback: HoverCallback, options?: HoverOptions) => void;
/**
 * Highlights bracket pairs when hovered. Clicking on a pair keeps it highlighted.
 * Clicking anywhere inside the container removes the highlight.
 *
 * This will match all brackets under the container together. If there are multiple code
 * blocks underneath, then brackets from different code blocks might get matched together.
 *
 * Note that there should not be any editors inside your container as this can cause
 * issues.
 *
 * @param container Container to add bracket pair highlighting to.
 * @param pairs Which characters to match together. The opening character must be followed
 * by the corresponding closing character. Defaults to "()[]{}".
 */
declare const highlightBracketPairsOnHover: (container: PrismCodeBlock | HTMLElement, pairs?: string) => void;
/**
 * Highlights tag pairs when a tag name is hovered. Clicking on a pair keeps it
 * highlighted. Clicking anywhere inside the container removes the highlight.
 *
 * This will match all tags under the container together. If there are multiple code
 * blocks underneath, then tags from different code blocks might get matched together.
 *
 * Note that there should not be any editors inside your container as this can cause
 * issues.
 *
 * @param container Container to add tag pair highlighting to.
 */
declare const highlightTagPairsOnHover: (container: PrismCodeBlock | HTMLElement) => void;
export { addHoverDescriptions, highlightBracketPairsOnHover, highlightTagPairsOnHover };
