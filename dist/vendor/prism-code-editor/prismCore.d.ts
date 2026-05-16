import { PrismType } from ".";
/**
 * Patched version of Prism with the following methods removed:
 *
 * - `Prism.highlight`
 * - `Prism.highlightAll`
 * - `Prism.highlightAllUnder`
 * - `Prism.highlightElement`
 * - `Prism.Token.stringify`
 * - `Prism.util.objId`
 * - `Prism.util.encode`
 */
export declare const Prism: PrismType;
export declare const languages: import("prismjs").Languages;
export declare const insertBefore: (inside: string, before: string, insert: import("prismjs").Grammar, root?: import("prismjs").LanguageMap | undefined) => import("prismjs").Grammar;
