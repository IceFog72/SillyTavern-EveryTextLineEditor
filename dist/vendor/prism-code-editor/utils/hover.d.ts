import { PrismEditor } from '..';
import { HoverOptions, PrismCodeBlock } from '../client/code-block.js';
declare const createHoverTooltip: <T extends PrismEditor | PrismCodeBlock>(editor: T, callback: (types: string[], language: string, text: string, element: HTMLSpanElement, editor: T) => (string | Node)[] | null | undefined, options: HoverOptions) => readonly [(target: HTMLElement) => void, () => void, HTMLDivElement];
export { createHoverTooltip };
