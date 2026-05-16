import { CompletionFilter } from './types';

/**
 * Fuzzy filter that only requires that the option includes all the characters in the
 * query string in order with any number of character between each.
 *
 * Occurrences that result in score penalties:
 * - Skipping characters in the option.
 * - The case of the characters doesn't match.
 * - The match doesn't start at the beginning.
 * - The option is longer than the query.
 */
declare const fuzzyFilter: CompletionFilter;
/**
 * Strict filter that requires the option to start with the query string.
 *
 * Occurrences that result in score penalties:
 * - The case of the query and the start of the option is different.
 * - The option is longer than the query.
 */
declare const strictFilter: CompletionFilter;
export { fuzzyFilter, strictFilter };
