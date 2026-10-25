import { Completion, CompletionSource, TagConfig } from '../types.js';
/**
 * Pattern used to determine if a string ends inside a Svelte or Astro tag. The pattern
 * has two capturing groups: the tag's name and the last attribute's name.
 */
declare const svelteTag: RegExp;
declare const svelteTags: TagConfig;
/**
 * Completion source that adds completion for HTML and SVG tags to Svelte. When configured,
 * it can also provide completions for specific Svelte components.
 * @param blockSnippets Snippets used to complete Svelte blocks such as `{#each}`.
 * @param components Used to configure autocompletion for Svelte components. This is an
 * object mapping each component's name to the properties available for that component.
 * @param nestedSource Completion source that will be used whenever the completion isn't
 * happening inside a tag or Svelte block. Can be used to provide completions for snippets
 * for example.
 */
declare const svelteCompletion: (blockSnippets?: Completion[], components?: TagConfig, nestedSource?: CompletionSource) => CompletionSource;
export { svelteCompletion, svelteTag, svelteTags };
export * from './snippets.js';
