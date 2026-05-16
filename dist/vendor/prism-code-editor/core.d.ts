import type { EditorOptions, PrismEditor, Language, Extension, InputSelection } from "./types";
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
declare const createEditor: (container?: ParentNode | string, options?: Partial<EditorOptions>, ...extensions: Extension[]) => PrismEditor;
/**
 * Almost identical to {@link createEditor}, but instead of appending the editor to your
 * element, the editor replaces it.
 *
 * The `textContent` of the placeholder will be the code in the editor unless `options.value` is defined.
 * @param placeholder Element or selector which will be replaced by the editor.
 * @param options Options the editor is initialized with.
 * @param extensions Extensions added before the first render. You can still add extensions later.
 * @returns Object to interact with the created editor.
 */
declare const editorFromPlaceholder: (placeholder: string | HTMLElement, options: Partial<EditorOptions>, ...extensions: Extension[]) => PrismEditor;
/** Returns a div with the specified HTML, class and inline style */
declare const createTemplate: (innerHTML?: string, style?: string, className?: string) => HTMLDivElement;
declare const getElement: <T extends ParentNode>(el?: string | T | null | undefined) => HTMLElement | T | null | undefined;
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
/**
 * Sets whether editors should ignore tab or use it for indentation.
 * Users can always toggle this using Ctrl+M / Ctrl+Shift+M (Mac).
 */
declare const setIgnoreTab: (newState: boolean) => boolean;
declare const preventDefault: (e: Event) => void;
declare const setSelection: (s?: InputSelection) => InputSelection | undefined;
declare let ignoreTab: boolean;
export { createEditor, languageMap, setIgnoreTab, ignoreTab, numLines, createTemplate, isMac, isChrome, isWebKit, getElement, preventDefault, setSelection, editorFromPlaceholder, };
