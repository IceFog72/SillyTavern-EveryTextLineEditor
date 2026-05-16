export var entity: (RegExp | {
    pattern: RegExp;
    alias: string;
})[];
export namespace tag {
    let pattern: RegExp;
    let greedy: boolean;
    let inside: {
        punctuation: RegExp;
        tag: {
            pattern: RegExp;
            inside: {
                namespace: RegExp;
            };
        };
        'attr-value': {
            pattern: RegExp;
            lookbehind: boolean;
            greedy: boolean;
            inside: {
                punctuation: RegExp;
                entity: (RegExp | {
                    pattern: RegExp;
                    alias: string;
                })[];
            };
        }[];
        'attr-equals': RegExp;
        'attr-name': {
            pattern: RegExp;
            inside: {
                namespace: RegExp;
            };
        };
    };
}
