export interface Change {
    value: string;
    added: boolean;
    removed: boolean;
    count: number;
}

export function diffLines(
    oldStr: string,
    newStr: string,
    options?: {
        ignoreNewlineAtEof?: boolean;
    }
): Change[];
