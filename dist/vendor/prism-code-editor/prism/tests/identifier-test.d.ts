export type Token = {
    type: string;
    content: string | Token | (string | Token)[];
};
export type IdentifierTestOptions = {
    word?: boolean | undefined;
    number?: boolean | undefined;
    template?: boolean | undefined;
};
