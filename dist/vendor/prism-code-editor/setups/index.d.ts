import { EditorOptions } from '../index.js';
import { EditorTheme } from '../themes/index.js';
export type SetupOptions = Partial<EditorOptions> & {
    theme: EditorTheme;
};
/**
 * Adds an editor inside a shadow root to the given element and asynchronously loads the styles.
 * @param container Must be an element you can attach a shadow root to.
 * @param options Options to create the editor as well as the theme to use.
 * @param onLoad Function called when the styles are loaded and the editor is
 * appended to the DOM.
 * @returns Object to interact with the editor.
 */
declare const minimalEditor: (container: HTMLElement | string, options: SetupOptions, onLoad?: () => any) => import('../types.js').PrismEditor<{
    theme: EditorTheme;
}>;
/**
 * Same as {@link minimalEditor}, but also adds the {@link indentGuides},
 * {@link highlightSelectionMatches}, {@link matchBrackets}, {@link highlightBracketPairs},
 * {@link defaultCommands}, {@link editHistory}, {@link searchWidget},
 * {@link showInvisibles}, and {@link matchTags} extensions and language specific
 * behavior.
 */
declare const basicEditor: (container: HTMLElement | string, options: SetupOptions, onLoad?: () => any) => import('../types.js').PrismEditor<{
    theme: EditorTheme;
}>;
/**
 * Same as {@link minimalEditor}, but also adds the {@link copyButton}, {@link matchBrackets},
 * {@link highlightBracketPairs}, {@link matchTags}, {@link indentGuides}, {@link highlightSelectionMatches},
 * and {@link readOnlyCodeFolding} extensions. No commands are added which makes this setup
 * best used with the `readOnly` option set to true.
 */
declare const readonlyEditor: (container: HTMLElement | string, options: SetupOptions, onLoad?: () => any) => import('../types.js').PrismEditor<{
    theme: EditorTheme;
}>;
export { basicEditor, minimalEditor, readonlyEditor };
