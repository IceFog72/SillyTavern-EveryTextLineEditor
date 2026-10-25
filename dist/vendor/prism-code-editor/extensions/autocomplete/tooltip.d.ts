import { AutoComplete, AutoCompleteConfig, CompletionDefinition } from './types.js';
declare const map: Record<string, CompletionDefinition<any>>;
/**
 * Registers completion sources for a set of languages.
 * If any of the languages already have completion sources, they're overridden.
 * @param langs Array of languages you want the completions to apply for.
 * @param definition Defines the completion sources for the languages along with additional
 * properties on the context passed to the completion sources.
 */
declare const registerCompletions: <T extends object>(langs: string[], definition: CompletionDefinition<T>) => void;
/**
 * Extension adding basic autocomplete to an editor. For autocompletion to work, you need to
 * {@link registerCompletions} for specific languages.
 *
 * @param config Object used to configure the extension. The `filter` property is required.
 *
 * Requires the {@link cursorPosition} extension to work.
 *
 * Requires styling from `prism-code-editor/autocomplete.css` in addition to a stylesheet
 * for icons. `prism-code-editor/autocomplete-icons.css` adds some icons from VSCode, but
 * you can use your own icons instead.
 *
 * @see {@link Completion.icon} for how to style your own icons.
 *
 * ## Keyboard shortcuts
 *
 * Here, `Mod` refers to `Cmd` on Mac and `Ctrl` otherwise.
 *
 * - `Ctrl` + `Space`: Trigger suggestion
 * - `Mod` + `I`: Trigger suggestion
 * - `Alt` + `Escape`: Trigger suggestion (Mac only)
 * - `Ctrl` + `Space`: Toggle suggestion documentation
 * - `Mod` + `I`: Toggle suggestion documentation
 * - `Tab`: Insert completion
 * - `Enter`: Insert completion
 * - `Escape`: Close completion widget
 * - `Escape`: Clear tab stops
 * - `Tab`: Select next tab stop
 * - `Shift` + `Tab`: Select previous tab stop
 * - `ArrowUp`: Select previous suggestion
 * - `ArrowDown`: Select next suggestion
 * - `PageUp`: Select first visible suggestion
 * - `PageDown`: Select last visible suggestion
 */
declare const autoComplete: (config: AutoCompleteConfig) => AutoComplete;
export { autoComplete, registerCompletions, map };
