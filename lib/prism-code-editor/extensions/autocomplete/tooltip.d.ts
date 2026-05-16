import { BasicExtension } from '../../index.js';
import { AutoCompleteConfig, CompletionDefinition } from './types.js';

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
 * Requires styling from `prism-code-editor/autocomplete.css`. Also requires a stylesheet
 * for icons. `prism-code-editor/autocomplete-icons.css` adds some icons from VSCode, but
 * you can define your own icons instead.
 *
 * @see {@link Completion.icon} for how to style your own icons.
 */
declare const autoComplete: (config: AutoCompleteConfig) => BasicExtension;
export { autoComplete, registerCompletions };
