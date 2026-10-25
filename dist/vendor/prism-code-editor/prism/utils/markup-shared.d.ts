import { tokenize } from '../core.js';
/**
 * @param {string} tagName
 * @param {*} tagInside
 * @param {(code: string) => string} getLang
 */
export function addInlined(tagName: string, tagInside: any, getLang: (code: string) => string): {
    pattern: RegExp;
    inside: {
        'code-block': {
            pattern: RegExp;
            lookbehind: boolean;
        };
        tag: {
            pattern: RegExp;
            inside: any;
        };
        [tokenize]: (code: any, grammar: any) => import('../types.js').TokenStream;
    };
};
/**
 * @param {*} expression
 */
export function astroTag(expression: any): {
    pattern: RegExp;
    inside: {
        punctuation: RegExp;
        tag: {
            pattern: RegExp;
            inside: {
                namespace: RegExp;
                'class-name': RegExp;
            };
        };
        'attr-value': {
            pattern: RegExp;
            lookbehind: boolean;
            inside: {
                punctuation: RegExp;
            };
        };
        expression: any;
        'attr-equals': RegExp;
        'attr-name': {
            pattern: RegExp;
            inside: {
                namespace: RegExp;
            };
        };
    };
};
