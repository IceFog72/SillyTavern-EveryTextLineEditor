//#region src/themes/index.ts
var themes = /* #__PURE__ */ Object.assign({
	"./atom-one-dark.css": () => import("../atom-one-dark.js"),
	"./dracula.css": () => import("../dracula.js"),
	"./github-dark-dimmed.css": () => import("../github-dark-dimmed.js"),
	"./github-dark.css": () => import("../github-dark.js"),
	"./github-light.css": () => import("../github-light.js"),
	"./night-owl-light.css": () => import("../night-owl-light.js"),
	"./night-owl.css": () => import("../night-owl.js"),
	"./prism-okaidia.css": () => import("../prism-okaidia.js"),
	"./prism-solarized-light.css": () => import("../prism-solarized-light.js"),
	"./prism-tomorrow.css": () => import("../prism-tomorrow.js"),
	"./prism-twilight.css": () => import("../prism-twilight.js"),
	"./prism.css": () => import("../prism.js"),
	"./vs-code-dark.css": () => import("../vs-code-dark.js"),
	"./vs-code-light.css": () => import("../vs-code-light.js")
});
/**
* Function that allows overriding the default themes or registering new themes to be
* used by the setups or web components.
* @param name Name of the theme.
* @param loader Function returning a promise that resolves with the CSS for the theme.
*/
var registerTheme = (name, loader) => {
	themes[`./${name}.css`] = loader;
};
/**
* Asynchronously loads the theme with the specified name.
* The promise returned resolves with the CSS string for the theme.
* This CSS can then be added to a `<style>` element on the page.
* @param name Name of the theme.
*/
var loadTheme = async (name) => (await themes[`./${name}.css`]?.())?.default;
//#endregion
export { loadTheme, registerTheme };

//# sourceMappingURL=index.js.map