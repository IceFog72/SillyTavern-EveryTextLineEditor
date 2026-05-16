import { Completion, CompletionSource } from '../types.js';
import { atRules, cssValues, pseudoClasses, pseudoElements } from './data.js';

declare const getCSSProperties: () => Completion[];
/**
 * Completion source for CSS that adds completion for HTML tags, pseudo-elements,
 * pseudo-classes, classes, CSS variables, at-rules, CSS properties and property values.
 * Requires the `css-extras` grammar and bracket matching extension to work correctly.
 * @param classes List of class names that should be completed even if they're not found
 * in the editor. Each string must be prefixed with `.`.
 * @param variables List of CSS variables that should be completed even if they're not
 * found in the editor. Each string must be prefixed with `--`.
 * @returns A completion source.
 */
declare const cssCompletion: (classes?: Iterable<string>, variables?: Iterable<string>) => CompletionSource;
export { cssCompletion, cssValues, pseudoClasses, pseudoElements, atRules, getCSSProperties };
