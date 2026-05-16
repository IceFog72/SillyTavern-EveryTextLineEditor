import { PrismEditor } from '../../../index.js';
import { AttributeConfig, CompletionContext, CompletionSource, TagConfig } from '../types.js';

/**
 * `false` is returned if completion shouldn't happen at the current position.
 * `null` is returned if the cursor isn't in a tag.
 *
 * If completion should happen and the cursor is in a tag, a match array is
 * returned. The match has two capturing groups; the tag's name and the last attribute's
 * name.
 */
declare const getTagMatch: ({ explicit, before, pos }: CompletionContext, editor: PrismEditor) => false | RegExpExecArray | null;
/**
 * Completion source that adds auto completion for HTML tags.
 * @param tags Object mapping tag-names to completable attributes for that tag.
 * @param globalAttributes Completable attributes shared by all tags.
 * @returns A Completion source.
 */
declare const markupCompletion: (tags: TagConfig, globalAttributes: AttributeConfig) => CompletionSource;
export { htmlTags, globalHtmlAttributes } from './data.js';
export { svgTags, globalSvgAttributes } from './svgData.js';
export { markupCompletion, getTagMatch };
