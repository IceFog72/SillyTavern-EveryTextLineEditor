/**
 * Runs the given test case file and asserts the result
 *
 * The passed language identifier can either be a language like "css" or a composed language
 * identifier like "css+markup". Composed identifiers can be used for testing language inclusion.
 *
 * When testing language inclusion, the first given language is the main language which will be passed
 * to Prism for highlighting ("css+markup" will result in a call to Prism to highlight with the "css" grammar).
 * But it will be ensured, that the additional passed languages will be loaded too.
 *
 * The languages will be loaded in the order they were provided.
 * @param {string} filePath
 * @param {string} languageIdentifier
 * @param {"none" | "insert" | "update"} updateMode
 * @param {() => void | undefined} beforeRun
 */
export function runTestCase(languageIdentifier: string, filePath: string, updateMode: "none" | "insert" | "update", beforeRun: () => void | undefined): Promise<void>;
/**
 * @param {string} languageIdentifier
 * @param {string} filePath
 * @param {"none" | "insert" | "update"} updateMode
 * @param {Runner<T>} runner
 * @param {() => void | undefined} beforeRun
 * @template T
 */
export function runTestCaseWithRunner<T>(languageIdentifier: string, filePath: string, updateMode: "none" | "insert" | "update", runner: Runner<T>, beforeRun: () => void | undefined): Promise<void>;
/**
 * Parses the language names and finds the main language.
 *
 * It is either the last language or the language followed by a exclamation mark “!”.
 * There should only be one language with an exclamation mark.
 *
 * @param {string} languageIdentifier
 * @returns {{languages: string[], mainLanguage: string}}
 */
export function parseLanguageNames(languageIdentifier: string): {
    languages: string[];
    mainLanguage: string;
};
/**
 * * @typedef {import("./token-stream-transformer").TokenStream} TokenStream
 */
/**
 * Handles parsing and printing of a test case file.
 *
 * A test case file consists of at most three parts, separated by a line of at least 10 dashes.
 * This separation line must start at the beginning of the line and consist of at least three dashes.
 *
 *     {code: the source code of the test case}
 *     ----------
 *     {expected: the expected value of the test case}
 *     ----------
 *     {description: explaining the test case}
 *
 * All parts are optional.
 *
 * If the file contains more than three parts, the remaining parts are part of the description.
 */
export class TestCaseFile {
    /**
     * Parses the given file contents into a test file.
     *
     * The line ends of the code, expected value, and description are all normalized to LF.
     * @param {string} content
     */
    static parse(content: string): TestCaseFile;
    /**
     * Reads the given test case file from disk.
     * @param {string} filePath
     */
    static readFromFile(filePath: string): TestCaseFile;
    /**
     * @param {string} code
     * @param {string} [expected = '']
     * @param {string} [description = '']
     */
    constructor(code: string, expected?: string | undefined, description?: string | undefined);
    code: string;
    expected: string;
    description: string;
    /**
     * The end of line sequence used when printed.
     *
     * @type {"\n" | "\r\n"}
     */
    eol: "\n" | "\r\n";
    /**
     * The number of the first line of `code`.
     *
     * @type {number}
     */
    codeLineStart: number;
    /**
     * The number of the first line of `expected`.
     *
     * @type {number}
     */
    expectedLineStart: number;
    /**
     * The number of the first line of `description`.
     *
     * @type {number}
     */
    descriptionLineStart: number;
    /**
     * Returns the file content of the given test file.
     */
    print(): string;
    /**
     * Writes the given test case file to disk.
     * @param {string} filePath
     */
    writeToFile(filePath: string): void;
}
/**
 * *
 */
export type TokenStream = import('./token-stream-transformer').TokenStream;
export type Runner<T> = {
    run: (code: string, language: string) => T;
    print: (actual: T) => string;
    isEqual: (actual: T, expected: string) => boolean;
    assertEqual: (actual: T, expected: string, message: (firstDifference: number) => string) => void;
};
