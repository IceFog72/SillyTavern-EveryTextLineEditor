import { EditorOptions, PrismEditor, Language, EditorExtension } from './types.js';
/**
 * Creates a code editor using the specified container and options.
 * @param container Element to append the editor to or a selector.
 * This can also be a `ShadowRoot` or `DocumentFragment` for example.
 * If omitted, you must manually append `editor.container` to the DOM.
 * @param options Options the editor is initialized with.
 * If omitted, the editor won't function until you call `editor.setOptions`.
 * @param extensions Extensions added before the first render. You can still add extensions later.
 * @returns Object to interact with the created editor.
 */
declare const createEditor: <T extends {} = {}>(container?: ParentNode | string | null, options?: (Partial<EditorOptions<T>> & Omit<T, keyof EditorOptions>) | null, ...extensions: EditorExtension<T>[]) => PrismEditor<T>;
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
declare const editorFromPlaceholder: <T extends {} = {}>(placeholder: string | ChildNode, options: Partial<EditorOptions<T>> & Omit<T, keyof EditorOptions>, ...extensions: EditorExtension<T>[]) => PrismEditor<T>;
/** Equivalent to `document` in a browser setting, `null` otherwise. */
declare const doc: Document | null;
declare const createTemplate: <T extends Element = HTMLDivElement>(html: string, node?: Node) => () => T;
declare const addListener: <T extends keyof HTMLElementEventMap>(target: HTMLElement, type: T, listener: (this: HTMLElement, ev: HTMLElementEventMap[T]) => any, options?: boolean | AddEventListenerOptions) => void;
declare const getElement: <T extends Node>(el?: T | string | null) => HTMLElement | T | null | undefined;
/**
 * Counts number of lines in the string between `start` and `end`.
 * If start and end are omitted, the whole string is searched.
 */
declare const numLines: (str: string, start?: number, end?: number) => number;
/** Object storing all language specific behavior. */
declare const languageMap: Record<string, Language>;
declare const preventDefault: (e: Event) => void;
declare const setSelectionChange: (f?: (force?: boolean) => void) => ((force?: boolean) => void) | undefined;
export { createEditor, languageMap, numLines, createTemplate, getElement, preventDefault, editorFromPlaceholder, addListener, setSelectionChange, doc, };
