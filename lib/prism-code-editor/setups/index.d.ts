import { EditorOptions, PrismEditor } from '../index.js';

export type SetupOptions = Partial<EditorOptions> & {
    theme: string;
};
/**
 * Updates the theme of an editor. The editor needs to be inside a shadow root with a style
 * element for the theme whoose `id` is `"theme"`. This is the case when using the setups.
 * @param editor Editor you want to change the theme of.
 * @param theme Name of the new theme.
 */
declare const updateTheme: (editor: PrismEditor, theme: string) => void;
/**
 * Adds an editor inside a shadow root to the given element and asynchronously loads the styles.
 * @param container Must be an element you can attach a shadow root to
 * @param options Options to create the editor as well as the theme to use.
 * @param readyCallback Function called when the styles are loaded.
 * @returns Object to interact with the editor.
 */
declare const minimalEditor: (container: HTMLElement | string, options: SetupOptions, readyCallback?: () => any) => PrismEditor;
/**
 * Same as {@link minimalEditor}, but also adds {@link indentGuides}, {@link highlightSelectionMatches},
 * {@link matchBrackets}, {@link highlightBracketPairs}, {@link defaultCommands} and {@link editHistory}
 * extensions and language specific behavior.
 *
 * There's also an extension added that clears the history stack every time the value is
 * changed programmatically.
 */
declare const basicEditor: (container: HTMLElement | string, options: SetupOptions, readyCallback?: () => any) => PrismEditor;
/**
 * Same as {@link basicEditor}, but also adds the {@link searchWidget} and {@link matchTags} extensions.
 * @deprecated Will get merged with {@link basicEditor} in the next major release.
 */
declare const fullEditor: (container: HTMLElement | string, options: SetupOptions, readyCallback?: () => any) => PrismEditor;
/**
 * Same as {@link minimalEditor}, but also adds the {@link copyButton}, {@link matchBrackets},
 * {@link highlightBracketPairs}, {@link matchTags}, {@link indentGuides}, {@link highlightSelectionMatches}
 * and {@link readOnlyCodeFolding} extensions. No commands are added which makes this setup
 * best used with the `readOnly` option set to true.
 */
declare const readonlyEditor: (container: HTMLElement | string, options: SetupOptions, readyCallback?: () => any) => PrismEditor;
export { basicEditor, fullEditor, minimalEditor, readonlyEditor, updateTheme };
