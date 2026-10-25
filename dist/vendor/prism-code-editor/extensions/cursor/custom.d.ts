import { BasicExtension } from '../../types.js';
/**
 * Extension that overrides the browser's default cursor.
 *
 * Due to a known issue, it's **not recommended** to use this extension with `wordWrap`
 * enabled.
 *
 * Use the `--pce-cursor` CSS variable to change the cursor's color and the `.pce-cursor`
 * selector for other styling.
 *
 * Requires the {@link cursorPosition} extension and styling from
 * `prism-code-editor/cursor.css` to work.
 */
declare const customCursor: () => BasicExtension;
export { customCursor };
