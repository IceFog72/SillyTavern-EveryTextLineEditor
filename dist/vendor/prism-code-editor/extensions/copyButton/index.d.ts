import { BasicExtension } from '../../types.js';
/**
 * Creates a static copy button that can be added to the overlays of an editor or code
 * block. The `firstChild` of the element returned is the button itself.
 */
declare const createCopyButton: () => HTMLDivElement;
/**
 * Extension that adds a copy button to the editor.
 * Probably best used with a read-only editor.
 * You must also import styles from `prism-code-editor/copy-button.css`.
 *
 * By default, the copy button is only shown when the editor is hovered. To always show
 * it, change the default opacity with the following CSS:
 *
 * ```less
 * button.pce-copy {
 *   opacity: 1; // or a lower value for a semi-transparent button
 * }
 * ```
 *
 * @param label `aria-label` for the button. Defaults to `"Copy"`.
 * @param copiedLabel Temporary `aria-label` for the button after it has been clicked.
 * Defaults to `"Copied!"`.
 */
declare const copyButton: (label?: string, copiedLabel?: string) => BasicExtension;
export { copyButton, createCopyButton };
