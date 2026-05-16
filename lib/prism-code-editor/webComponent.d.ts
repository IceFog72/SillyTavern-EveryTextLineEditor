import { PrismEditor } from './types.js';

export interface PrismEditorElement extends HTMLElement {
    readonly editor: PrismEditor;
    value: string;
    theme: string;
    language: string;
    tabSize: number;
    insertSpaces: boolean;
    lineNumbers: boolean;
    readOnly: boolean;
    wordWrap: boolean;
    rtl: boolean;
    addEventListener(type: "ready", listener: (this: PrismEditorElement, ev: CustomEvent) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: PrismEditorElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: "ready", listener: (this: PrismEditorElement, ev: CustomEvent) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: PrismEditorElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
/**
 * Adds a custom element wrapping the {@link minimalEditor} setup.
 * @param name Name of the custom element. Must be a valid custom element name.
 */
export declare const addMinimalEditor: (name: string) => void;
/**
 * Adds a custom element wrapping the {@link basicEditor} setup.
 * @param name Name of the custom element. Must be a valid custom element name.
 */
export declare const addBasicEditor: (name: string) => void;
/**
 * Adds a custom element wrapping the {@link fullEditor} setup.
 * @param name Name of the custom element. Must be a valid custom element name.
 * @deprecated Will get merged with {@link addBasicEditor} in the next major release.
 */
export declare const addFullEditor: (name: string) => void;
/**
 * Adds a custom element wrapping the {@link readonlyEditor} setup.
 * @param name Name of the custom element. Must be a valid custom element name.
 */
export declare const addReadonlyEditor: (name: string) => void;
