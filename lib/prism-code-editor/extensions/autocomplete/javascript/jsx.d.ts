import { JSContext } from './index.js';
import { AttributeConfig, CompletionSource, TagConfig } from '../types.js';

/**
 * Completion source that adds autocompletion for JSX tags.
 * @param tags Object mapping tag-names to completable attributes for that tag.
 * @param globalAttributes Completable attributes shared by all tags.
 * @returns A Completion source. Requires a JavaScript context to work.
 */
declare const jsxTagCompletion: (tags: TagConfig, globalAttributes: AttributeConfig) => CompletionSource<JSContext>;
export { jsxTagCompletion };
