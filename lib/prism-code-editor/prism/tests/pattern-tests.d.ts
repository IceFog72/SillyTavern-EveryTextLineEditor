export type LiteralAST = import('./helper/util').LiteralAST;
export type CapturingGroup = import('regexpp/ast').CapturingGroup;
export type Element = import('regexpp/ast').Element;
export type Group = import('regexpp/ast').Group;
export type LookaroundAssertion = import('regexpp/ast').LookaroundAssertion;
export type Pattern = import('regexpp/ast').Pattern;
export type Highlight = {
    start: number;
    end: number;
    label?: string | undefined;
};
