import { EditorEventMap, PrismEditor } from '../index.js';

declare const scrollToEl: (editor: PrismEditor, el: HTMLElement, paddingTop?: number) => void;
declare const getLineStart: (text: string, position: number) => number;
declare const getLineEnd: (text: string, position: number) => number;
declare const addListener: <T extends keyof EditorEventMap>(editor: PrismEditor, type: T, listener: EditorEventMap[T]) => () => void;
declare const getStyleValue: (el: HTMLElement, prop: keyof CSSStyleDeclaration) => number;
export { scrollToEl, getLineStart, getLineEnd, addListener, getStyleValue };
