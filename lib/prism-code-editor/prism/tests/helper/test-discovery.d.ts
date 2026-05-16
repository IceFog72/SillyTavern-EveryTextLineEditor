/**
 * Loads the list of all available tests
 * @returns {Map<string, string[]>}
 */
export function loadAllTests(rootDir?: any): Map<string, string[]>;
/**
 * Loads the list of available tests that match the given languages
 * @param {string | string[]} languages
 * @param {string} [rootDir=LANGUAGES_DIR]
 * @returns {Map<string, string[]>}
 */
export function loadSomeTests(languages: string | string[], rootDir?: string | undefined): Map<string, string[]>;
/**
 * Returns a list of all (sub)directories (just the directory names, not full paths)
 * in the given src directory
 * @param {string} src
 * @returns {string[]}
 */
export function getAllDirectories(src: string): string[];
/**
 * Returns a list of all (sub)directories (just the directory names, not full paths)
 * in the given src directory, matching the given languages
 * @param {string | string[]} languages
 * @param {string} src
 */
export function getSomeDirectories(src: string, languages: string | string[]): any;
/**
 * Returns whether a directory matches one of the given languages.
 * @param {string} directory
 * @param {string | string[]} language
 */
export function directoryMatches(directory: string, languages: any): boolean;
