import { PrismEditor } from ".";
/**
 * Moves to tooltip to align with the cursor and shows it.
 * @param preferPlacingAboveCursor Whether the preferred position is above the cursor or not.
 */
export type ShowTooltip = (preferPlacingAboveCursor?: boolean) => void;
/** Function removing the tooltip from the DOM. */
export type HideTooltip = () => void;
/**
 * Utility making it easy to add tooltips to an editor. Before you can show the tooltip,
 * a {@link cursorPosition} extension must be added to the editor.
 * @param editor Editor you want to add the tooltip to.
 * @param element Element for the tooltip.
 * @param fixedWidth If false, the tooltip will shrink instead of getting offset to
 * the left if there's not enough space to the right of the cursor. Defaults to `true`.
 * @returns Show and hide functions.
 *
 * @example
 * const [show, hide] = addTooltip(editor, element)
 */
export declare const addTooltip: (editor: PrismEditor, element: HTMLElement, fixedWidth?: boolean) => [ShowTooltip, HideTooltip];
/** Allows users to scroll past the last line in the editor by adding padding to the wrapper. */
export declare const addOverscroll: (editor: PrismEditor) => void;
/** Removes the ability to scroll past the last line in the editor. */
export declare const removeOverscroll: (editor: PrismEditor) => void;
