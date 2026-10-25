export type IncludedTheme = "atom-one-dark" | "dracula" | "github-dark" | "github-dark-dimmed" | "github-light" | "night-owl" | "night-owl-light" | "prism" | "prism-okaidia" | "prism-solarized-light" | "prism-tomorrow" | "prism-twilight" | "vs-code-dark" | "vs-code-light";
export type EditorTheme = IncludedTheme | (string & {});
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
 * This CSS can then be added to a `<style>` element on the page.
 * @param name Name of the theme.
 */
declare const loadTheme: (name: EditorTheme) => Promise<string | undefined>;
export { loadTheme, registerTheme };
