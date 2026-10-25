import { BasicExtension } from '../../index.js';
/**
 * Extension that highlights selected tabs and spaces as an overlay. To instead highlight
 * all spaces and tabs, use {@link tokenizeInvisibles}.
 *
 * Requires styling from `prism-code-editor/invisibles.css`.
 */
declare const showInvisibles: () => BasicExtension;
export { showInvisibles };
