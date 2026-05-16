import { EditorOptions, PrismEditor, Language, EditorExtension } from './types.js';

/**
 * Creates a code editor using the specified container and options.
 * @param container Element to append the editor to or a selector.
 * This can also be a `ShadowRoot` or `DocumentFragment` for example.
 * If omitted, you must manually append the `scrollContainer` to the DOM.
 * @param options Options the editor is initialized with.
 * If omitted, the editor won't function until you call `setOptions`.
 * @param extensions Extensions added before the first render. You can still add extensions later.
 * @returns Object to interact with the created editor.
 */
declare const createEditor: (container?: ParentNode | string | null, options?: Partial<EditorOptions>, ...extensions: EditorExtension[]) => PrismEditor;
/**
 * Almost identical to {@link createEditor}, but instead of appending the editor to your
 * element, the editor replaces it.
 *
 * The `textContent` of the placeholder will be the code in the editor unless `options.value` is defined.
 * @param placeholder Node or selector which will be replaced by the editor.
 * @param options Options the editor is initialized with.
 * @param extensions Extensions added before the first render. You can still add extensions later.
 * @returns Object to interact with the created editor.
 */
declare const editorFromPlaceholder: (placeholder: string | ChildNode, options: Partial<EditorOptions>, ...extensions: EditorExtension[]) => PrismEditor;
declare const createTemplate: <T extends Element = HTMLDivElement>(html: string) => () => T;
declare const addTextareaListener: <T extends keyof HTMLElementEventMap>(editor: PrismEditor, type: T, listener: (this: HTMLTextAreaElement, ev: HTMLElementEventMap[T]) => any, options?: boolean | AddEventListenerOptions) => void;
declare const getElement: <T extends Node>(el?: string | T | null | undefined) => HTMLElement | T | null | undefined;
declare const isMac: boolean;
declare const isChrome: boolean;
declare const isWebKit: boolean;
/**
 * Counts number of lines in the string between `start` and `end`.
 * If start and end are excluded, the whole string is searched.
 */
declare const numLines: (str: string, start?: number, end?: number) => number;
/** Object storing all language specific behavior. */
declare const languageMap: Record<string, Language>;
declare const preventDefault: (e: Event) => void;
export { createEditor, languageMap, numLines, createTemplate, isMac, isChrome, isWebKit, getElement, preventDefault, editorFromPlaceholder, addTextareaListener, };
