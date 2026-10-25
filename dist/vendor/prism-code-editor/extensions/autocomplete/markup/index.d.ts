import { PrismEditor } from '../../../index.js';
import { AttributeConfig, CompletionContext, CompletionSource, TagConfig } from '../types.js';
/**
 * `false` is returned if completion shouldn't happen at the current position.
 * `null` is returned if the cursor isn't in a tag.
 *
 * If completion should happen and the cursor is in a tag, a match array is
 * returned. The match has two capturing groups; the tag's name and the last attribute's
 * name.
 *
 * @param pattern Regular expression used to check if there's a partial tag before the
 * cursor.
 */
declare const getTagMatch: ({ explicit, before, pos }: CompletionContext, editor: PrismEditor, pattern?: RegExp) => false | RegExpExecArray | null;
/**
 * Completion source that adds auto completion for specified tags.
 * @param namespaces Array of different namespaces of tags you want to provide
 * completions for. The `tags` property maps tag names in that namespace to completable
 * attributes for that tag. The optional `globals` property allows you to override the
 * global attributes shared by all tags in the namespace. If omitted, the
 * `globalAttributes` parameter is used.
 * @param globalAttributes Default global attributes. Used by unrecognized tags or when
 * the `globals` property is omitted.
 *  @param nestedSource Completion source that will be used whenever the completion isn't
 * happening inside a tag. Can be used to provide completions for snippets for example.
 * @returns A Completion source.
 */
declare const markupCompletion: (namespaces: {
    tags: TagConfig;
    globals?: AttributeConfig;
}[], globalAttributes?: AttributeConfig, nestedSource?: CompletionSource) => CompletionSource;
export { htmlTags, globalHtmlAttributes } from './data.js';
export { svgTags, globalSvgAttributes } from './svgData.js';
export { mathMLTags, globalMathMLAttributes } from './mathData.js';
export { markupCompletion, getTagMatch };
