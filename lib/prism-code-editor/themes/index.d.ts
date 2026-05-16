/**
 * Function that allows overriding the default themes or registering new themes to be
 * used by the setups or web components.
 * @param name Name of the theme.
 * @param loader Function returning a promise that resolves with the CSS for the theme.
 */
declare const registerTheme: (name: string, loader: () => Promise<{
    default: string;
}>) => void;
/**
 * Asynchronously loads the theme with the specified name.
 * The promise returned resolves with the CSS string for the theme.
 */
declare const loadTheme: (name: string) => Promise<string | undefined>;
export { loadTheme, registerTheme };
