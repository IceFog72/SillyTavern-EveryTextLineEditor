import { JSContext } from './index.js';
import { CompletionSource } from '../types.js';

/**
 * Completion source that adds autocompletion for JS/TS keywords.
 */
declare const completeKeywords: CompletionSource<JSContext>;
export { completeKeywords };
