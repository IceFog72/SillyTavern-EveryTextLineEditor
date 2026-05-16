import { BasicExtension } from '../../index.js';

/**
 * Extension that shows tabs and spaces.
 * @param alwaysShow By default, spaces and tabs are only shown when they're selected.
 * By passing `true`, they're always shown, which negatively impacts performance when
 * typing, and increases the amount of elements in the DOM.
 *
 * Requires styling from `prism-code-editor/invisibles.css`.
 */
declare const showInvisibles: (alwaysShow?: boolean) => BasicExtension;
export { showInvisibles };
