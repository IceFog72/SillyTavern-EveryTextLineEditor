import { PrismEditor } from '../../index.js';
import { Completion, CompletionContext, CompletionSource } from './types.js';

declare const optionsFromKeys: (obj: object, icon?: string) => Completion[];
declare const updateNode: (node: Text, text: string) => void;
declare const updateMatched: (container: HTMLElement, matched: number[], text: string) => void;
/**
 * Completion source that returns a list of snippets if `path` property of the context
 * is present and only contains a single string.
 * @param snippets Snippets to complete.
 */
declare const completeSnippets: (snippets: Completion[]) => CompletionSource<{
    path: string[] | null;
}>;
/**
 * Utility that searches the editor's {@link TokenStream} for strings.
 * @param context Current completion context.
 * @param editor Editor to search in.
 * @param filter Function used to filter tokens you want to search in. Is called with the
 * type of the token and its starting position. If the filter returns true, the token
 * will be searched.
 * @param pattern Pattern used to search for words.
 * @param init Words to initialize the result with.
 * @param tokensOnly If `true` only the text of tokens whoose `content` is a string will
 * be searched. If not any string inside the {@link TokenStream} can be searched.
 * @returns An array with found identifers/words.
 */
declare const findWords: (context: CompletionContext, editor: PrismEditor, filter: (type: string, start: number) => boolean, pattern: RegExp, init?: Iterable<string>, tokensOnly?: boolean) => string[];
export { optionsFromKeys, updateMatched, updateNode, findWords, completeSnippets };
