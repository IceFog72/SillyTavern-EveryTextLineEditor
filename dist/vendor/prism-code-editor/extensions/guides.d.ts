import { Extension } from '../types.js';
/**
 * Extension adding indent guides to an editor. Does not work with word wrap.
 * Requires styles from `prism-code-editor/guides.css`
 */
declare const indentGuides: () => Extension;
/**
 * Calculates the position and height of indentation guides for a string of code.
 * @param code Code you want to calculate indentation lines for.
 * @param tabSize Number of spaces a tab is equal to.
 * @returns An array of indentation guides.
 * Each guide is a tuple containing 3 numbers with the following values:
 * - The starting line of the guide.
 * - How many tabs the guide is offset to the right.
 * - How many lines tall the guide is.
 */
declare const getIndentGuides: (code: string, tabSize: number) => [number, number, number][];
export { indentGuides, getIndentGuides };
