import { i as doc, n as createEditor, o as getElement } from "../core-BIWFpCIO.js";
import { loadTheme } from "../themes/index.js";
//#region src/setups/index.ts
var addStyles = (shadow, styles, id) => {
	let style = shadow.getElementById(id);
	if (!style) {
		style = doc.createElement("style");
		style.id = id;
		shadow.append(style);
	}
	style.textContent = styles;
};
/**
* Adds an editor inside a shadow root to the given element and asynchronously loads the styles.
* @param container Must be an element you can attach a shadow root to.
* @param options Options to create the editor as well as the theme to use.
* @param onLoad Function called when the styles are loaded and the editor is
* appended to the DOM.
* @returns Object to interact with the editor.
*/
var minimalEditor = (container, options, onLoad) => {
	const el = getElement(container);
	const shadow = el.shadowRoot || el.attachShadow({ mode: "open" });
	const editor = createEditor(null, null, { update(_, options) {
		if (theme != (theme = options.theme)) loadTheme(theme).then((style) => {
			if (style && theme == options.theme) addStyles(shadow, style, "theme");
		});
	} });
	const remove = editor.remove;
	let removed;
	let theme = options.theme;
	editor.remove = () => {
		remove();
		removed = true;
	};
	Promise.all([import("../styles-BSFdG5zS.js"), loadTheme(options.theme)]).then(([style, theme]) => {
		if (!removed) {
			addStyles(shadow, style.default, "layout-style");
			addStyles(shadow, theme || "", "theme");
			shadow.append(editor.container);
			editor.setOptions(options);
			onLoad && onLoad();
		}
	});
	return editor;
};
/**
* Same as {@link minimalEditor}, but also adds the {@link indentGuides},
* {@link highlightSelectionMatches}, {@link matchBrackets}, {@link highlightBracketPairs},
* {@link defaultCommands}, {@link editHistory}, {@link searchWidget},
* {@link showInvisibles}, and {@link matchTags} extensions and language specific
* behavior.
*/
var basicEditor = (container, options, onLoad) => {
	import("../basic-BZIQXUoi.js").then((mod) => {
		addStyles(el.shadowRoot, mod.style, "search-style");
		editor.addExtensions(...mod.basic());
	});
	const el = getElement(container);
	const editor = minimalEditor(el, options, onLoad);
	return editor;
};
/**
* Same as {@link minimalEditor}, but also adds the {@link copyButton}, {@link matchBrackets},
* {@link highlightBracketPairs}, {@link matchTags}, {@link indentGuides}, {@link highlightSelectionMatches},
* and {@link readOnlyCodeFolding} extensions. No commands are added which makes this setup
* best used with the `readOnly` option set to true.
*/
var readonlyEditor = (container, options, onLoad) => {
	import("../readonly-BFgqGP8L.js").then((mod) => {
		mod.addExtensions(editor);
		addStyles(el.shadowRoot, mod.style, "readonly-style");
	});
	const el = getElement(container);
	const editor = minimalEditor(el, options, onLoad);
	return editor;
};
//#endregion
export { basicEditor, minimalEditor, readonlyEditor };

//# sourceMappingURL=index.js.map