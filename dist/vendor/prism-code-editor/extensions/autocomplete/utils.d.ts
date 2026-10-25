import { PrismEditor } from '../../index.js';
import { TokenName } from '../../prism/types.js';
import { Completion, CompletionContext, CompletionSource } from './types.js';
declare const optionsFromKeys: (obj: object, icon?: string) => Completion[];
declare const updateMatched: (container: HTMLElement, matched: number[], text: string) => void;
/**
 * Completion source that returns a list of options if `path` property of the context
 * is present and only contains a single string.
 * @param options Options to complete.
 */
declare const completeFromList: (options: Completion[]) => CompletionSource<{
    path: string[] | null;
}>;
/**
 * Utility that searches the editor's {@link TokenStream} for strings. This utility will
 * only search parts of the document whose language has the same completion definition
 * registered.
 * @param context Current completion context.
 * @param editor Editor to search in.
 * @param filter Function used to filter tokens you want to search in. It's called with
 * the type of the token and its starting position. If the filter returns true, the token
 * will be searched.
 * @param pattern Pattern used to search for words. Must have the `g` flag.
 * @param init Words that should be completed even if they're not found in the document.
 * @param tokensOnly If `true` only the text of tokens whose `content` is a string will
 * be searched. If `false`, any string inside the {@link TokenStream} can be searched.
 * @returns A set with found identifers/words.
 */
declare const findWords: (context: CompletionContext, editor: PrismEditor, filter: (type: TokenName, start: number) => boolean, pattern: RegExp, init?: Iterable<string>, tokensOnly?: boolean) => Set<string>;
declare const attrSnippet: (name: string, quotes: string, icon?: Completion["icon"], boost?: number) => Completion;
declare const completionsFromRecords: (records: (Record<string, unknown> | undefined)[], icon?: Completion["icon"]) => Completion[];
/**
 * @param snippet String of code to highlight.
 * @param language Language to highlight the snippet with.
 * @param className Additional classes to add to the `<pre>` element.
 * @returns `<pre><code>` element with the snippet highlighted using the specified
 * language.
 */
declare const renderSnippet: (snippet: string, language: string, className?: string) => HTMLPreElement;
export { optionsFromKeys, updateMatched, findWords, completeFromList, attrSnippet, completionsFromRecords, renderSnippet, };
