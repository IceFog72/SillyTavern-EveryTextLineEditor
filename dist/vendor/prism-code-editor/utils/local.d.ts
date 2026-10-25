import { PrismEditor } from '../index.js';
import { PrismCodeBlock } from '../client/code-block.js';
declare const scrollToEl: (editor: PrismEditor, el: HTMLElement, paddingTop?: number) => void;
declare const getLineStart: (text: string, position: number) => number;
declare const getLineEnd: (text: string, position: number) => number;
declare const addListener2: <T extends keyof HTMLElementEventMap>(element: HTMLElement, type: T, listener: (this: HTMLElement, ev: HTMLElementEventMap[T]) => any, options?: boolean | AddEventListenerOptions) => () => void;
declare const addTextareaListener: <T extends keyof HTMLElementEventMap>(editor: PrismEditor, type: T, listener: (this: HTMLElement, ev: HTMLElementEventMap[T]) => any, options?: boolean | AddEventListenerOptions) => () => void;
declare const getStyleValue: (el: HTMLElement, prop: keyof CSSStyleDeclaration) => number;
declare const getPosition: (editor: PrismEditor | PrismCodeBlock, el: HTMLElement) => {
    top: number;
    bottom: number;
    left: number;
    right: number;
    height: number;
};
declare const updateNode: (node: Text, text: string) => void;
declare const voidlessLangs: Set<string>;
declare const voidTags: RegExp;
export { scrollToEl, getLineStart, getLineEnd, getStyleValue, addListener2, addTextareaListener, getPosition, updateNode, voidTags, voidlessLangs, };
