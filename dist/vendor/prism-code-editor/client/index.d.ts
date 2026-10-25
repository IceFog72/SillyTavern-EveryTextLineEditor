import { EditorExtension, EditorOptions, PrismEditor } from '../index.js';
/**
 * Mounts all editors rendered by {@link renderEditor} under the specified root. Editors
 * are mounted in document order, and editors that have already been mounted are skipped.
 *
 * @param root Root element to search for editors under.
 * @param getExtensions Function used to get the extensions that should be added to each
 * editor. If the editors were created with extra options, these will be parsed from
 * JSON and passed to this function together with all other editor options. This is very
 * useful if you want to configure different extensions for different editors.
 * @returns Array of the mounted editors. These editors are in document order.
 */
declare const mountEditorsUnder: <T extends {} = {}>(root: Document | Element, getExtensions?: (options: EditorOptions & T) => EditorExtension<T>[] | undefined | null) => PrismEditor<T>[];
export { mountEditorsUnder };
