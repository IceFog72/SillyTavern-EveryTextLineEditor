import { CompletionSource, TagConfig } from '../types.js';
/**
 * Completion source that adds completion for HTML and SVG tags to Vue. When configured,
 * it can also provide completions for specific Vue components.
 * @param components Used to configure autocompletion for Vue components. This is an
 * object mapping each component's name to the properties available for that component.
 * To provide completions for events, prefix them with `on`. E.g. `onevent` will result
 * in completions for `@event` and `v-on:event`. Camel cased props are not converted to
 * kebab case.
 * @param nestedSource Completion source that will be used whenever the completion isn't
 * happening inside a tag. Can be used to provide completions for snippets for example.
 */
declare const vueCompletion: (components?: TagConfig, nestedSource?: CompletionSource) => CompletionSource;
export { vueCompletion };
