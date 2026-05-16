const themes = /* @__PURE__ */ Object.assign({ "./atom-one-dark.css": () => import("../atom-one-dark.js"), "./dracula.css": () => import("../dracula.js"), "./github-dark-dimmed.css": () => import("../github-dark-dimmed.js"), "./github-dark.css": () => import("../github-dark.js"), "./github-light.css": () => import("../github-light.js"), "./night-owl.css": () => import("../night-owl.js"), "./prism-okaidia.css": () => import("../prism-okaidia-B3-OPcI3.js"), "./prism-solarized-light.css": () => import("../prism-solarized-light.js"), "./prism-tomorrow.css": () => import("../prism-tomorrow.js"), "./prism-twilight.css": () => import("../prism-twilight.js"), "./prism.css": () => import("../prism-v-0tLOI_.js"), "./vs-code-dark.css": () => import("../vs-code-dark.js"), "./vs-code-light.css": () => import("../vs-code-light.js") });
const registerTheme = (name, loader) => {
  themes[`./${name}.css`] = loader;
};
const loadTheme = async (name) => (await themes[`./${name}.css`]?.())?.default;
export {
  loadTheme,
  registerTheme
};
//# sourceMappingURL=index.js.map
