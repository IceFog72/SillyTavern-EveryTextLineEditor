import { ExtractOptions, UserConfig } from 'emmet';
import { Completion, CompletionSource, TagConfig } from '../types.js';
import { JSContext } from '../javascript/index.js';
export type MarkupEmmetOptions = {
    /**
     * List of objects whose keys will be allowed as single word completions even
     * if they aren't Emmet snippets. This ensures random words aren't given as suggestions.
     * Pass `null` or `undefined` to enable suggestions for all words.
     */
    tags?: TagConfig[] | null;
    /** Configuration options passed when resolving the Emmet config. */
    config?: UserConfig;
    /**
     * Pattern used for determining whether completion is happening inside a
     * tag. Pass {@link svelteTag} for 'astro' or 'svelte'.  This is not needed for JSX
     * since `tagMatch` from the completion context will be used instead. Defaults to a tag
     * pattern for markup.
     */
    tagPattern?: RegExp;
    /** Options passed when extracting the abbreviation at the cursor's position */
    extractOptions?: Partial<ExtractOptions>;
    /**
     * Boost given to the score of the main abbreviation's completion option.
     * A positive number moves it up the list, while a negative one moves it down.
     * Defaults to 1.
     */
    boost?(abbreviation: string, expanded: string, lang: string): number;
    /**
     * Boost given to the score of the suggestion completion options.
     * A positive number moves them up the list, while a negative one moves them down.
     */
    suggestBoost?(abbreviation: string, expanded: string, lang: string): number;
    /**
     * Whether extra suggestions should be shown that extend the last tag in the main
     * abbreviation with Emmet snippets.
     * @default true
     */
    suggestSnippets?: boolean;
    /**
     * Whether extra suggestions should be shown that extend the last tag in the main
     * abbreviation with available tags.
     * @default true
     */
    suggestTags?: boolean;
    /**
     * Icon displayed in the completion options.
     * @default "property"
     */
    icon?: Completion["icon"];
    /**
     * Detail displayed in the completion options.
     * @default "Emmet"
     */
    detail?: string;
    /**
     * Whether the expanded abbreviation should be have syntax highlighting in the tooltip
     * documentation. @default true
     */
    highlight?: boolean;
};
/**
 * Completion source that expands the emmet abbreviation at the cursor position as long
 * as the cursor isn't inside an XML tag or comment.
 *
 * @param options Options for controlling the outputted suggestions.
 * @returns A completion source.
 */
export declare const markupEmmetCompletion: (options?: MarkupEmmetOptions) => CompletionSource<JSContext | {}>;
