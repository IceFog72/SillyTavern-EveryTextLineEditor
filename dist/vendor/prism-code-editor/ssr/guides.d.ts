import { RenderOptions } from './index.js';
/**
 * Function that renders indentation guides for an editor as an HTML string. Intended to
 * be used as an overlay with {@link renderEditor}.
 * @param options Render options for the editor.
 * @returns HTML string for the indentation guides.
 */
declare const indentGuides: (options: RenderOptions) => string | undefined;
export { indentGuides };
