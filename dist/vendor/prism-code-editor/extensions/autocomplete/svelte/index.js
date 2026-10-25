import { a as completionsFromRecords, c as renderSnippet, r as attrSnippet, s as optionsFromKeys } from "../../../tooltip-CuDNNcdN.js";
import { A as htmlEventHandlers, j as htmlTags, k as globalHtmlAttributes } from "../../../data-Be9fjVqf.js";
import { a as globalSvgAttributes, o as svgTags, t as getTagMatch } from "../../../markup-DGNiYW1g.js";
import { n as re } from "../../../shared-oTKIFAwH.js";
import { n as braces } from "../../../jsx-shared-BgBgis07.js";
//#region src/extensions/autocomplete/svelte/snippets.ts
var renderDocs = (item) => [renderSnippet(`{${item.insert}}`, "svelte")];
var svelteBlockSnippets = [
	{
		label: "#await",
		icon: "keyword",
		insert: "#await promise then value}\n	\n{/await",
		tabStops: [
			7,
			14,
			20,
			25,
			28
		],
		renderDocs
	},
	{
		label: "#await then",
		icon: "keyword",
		insert: "#await promise}\n	\n{:then value}\n	\n{/await",
		tabStops: [
			7,
			14,
			17,
			17,
			25,
			30,
			33
		],
		renderDocs
	},
	{
		label: "#await catch",
		icon: "keyword",
		insert: "#await promise}\n	\n{:then value}\n	\n{:catch error}\n	\n{/await",
		tabStops: [
			7,
			14,
			17,
			17,
			25,
			30,
			33,
			33,
			42,
			47,
			50
		],
		renderDocs
	},
	{
		label: "#each",
		icon: "keyword",
		insert: "#each items as item}\n	\n{/each",
		tabStops: [
			6,
			11,
			15,
			19,
			22
		],
		renderDocs
	},
	{
		label: "#if",
		icon: "keyword",
		insert: "#if condition}\n	\n{/if",
		tabStops: [
			4,
			13,
			16
		],
		renderDocs
	},
	{
		label: "#key",
		icon: "keyword",
		insert: "#key value}\n	\n{/key",
		tabStops: [
			5,
			10,
			13
		],
		renderDocs
	},
	{
		label: "#snippet",
		icon: "keyword",
		insert: "#snippet name(params)}\n	\n{/snippet",
		tabStops: [
			9,
			13,
			14,
			20,
			24
		],
		renderDocs
	},
	{
		label: "@const",
		icon: "keyword",
		insert: "@const name = value",
		tabStops: [
			7,
			11,
			14,
			19
		],
		renderDocs
	},
	{
		label: "@debug",
		icon: "keyword"
	},
	{
		label: "@html",
		icon: "keyword"
	},
	{
		label: "@render",
		icon: "keyword",
		insert: "@render snippet(params)",
		tabStops: [
			8,
			15,
			16,
			22
		],
		renderDocs
	},
	{
		label: ":catch",
		icon: "keyword"
	},
	{
		label: ":else",
		icon: "keyword"
	},
	{
		label: ":else if",
		icon: "keyword"
	},
	{
		label: ":then",
		icon: "keyword"
	}
];
//#endregion
//#region src/extensions/autocomplete/svelte/index.ts
/** @module autocomplete/svelte */
/**
* Pattern used to determine if a string ends inside a Svelte or Astro tag. The pattern
* has two capturing groups: the tag's name and the last attribute's name.
*/
var svelteTag = /* @__PURE__ */ re("<$|<(?![\\d!])([^\\s%=<>/]+)(?:\\s(?:\\s*([^\\s{=<>/]+)(?:\\s*=\\s*(?!\\s)(?:\"[^\"]*(?:\"|$)|'[^']*(?:'|$)|[^\\s{=<>/\"']+(?!\\S])|<0>)?|(?![^\\s=]))|\\s*<0>)*)?\\s*$", [braces]);
var globalBinds = [
	"innerHTML",
	"textContent",
	"innerText",
	"contentRect",
	"contentBoxSize",
	"borderBoxSize",
	"devicePixelContentBoxSize",
	"focused",
	"this"
];
var mediaBinds = [
	"readyState",
	"duration",
	"buffered",
	"played",
	"seekable",
	"seeking",
	"ended",
	"muted",
	"volume",
	"currentTime",
	"playbackRate",
	"paused"
];
var bindAttrs = {
	audio: mediaBinds,
	input: [
		"checked",
		"files",
		"group",
		"indeterminate",
		"value"
	],
	select: ["value"],
	textarea: ["value"],
	video: mediaBinds.concat("videoHeight", "videoWidth"),
	"svelte:document": [
		"activeElement",
		"fullscreenElement",
		"pointerLockElement",
		"visibilityState"
	],
	"svelte:window": [
		"innerWidth",
		"innerHeight",
		"outerWidth",
		"outerHeight",
		"devicePixelRatio",
		"scrollX",
		"scrollY",
		"online"
	]
};
var svelteTags = {
	"svelte:boundary": { onerror: null },
	"svelte:window": htmlEventHandlers,
	"svelte:document": htmlEventHandlers,
	"svelte:body": htmlEventHandlers,
	"svelte:head": htmlEventHandlers,
	"svelte:element": {
		...globalHtmlAttributes,
		this: null
	},
	"svelte:options": {
		customElement: null,
		namespace: [
			"html",
			"svg",
			"mathml"
		],
		css: ["injected"],
		runes: null
	}
};
var createCompletion = (label, icon) => ({
	label,
	icon
});
var tagNames = completionsFromRecords([
	htmlTags,
	svgTags,
	svelteTags
], "property");
var enumerateAttrs = (attrs, result = []) => {
	for (let attr in attrs) if (attr.slice(0, 2) == "on") result.push(attrSnippet("on:" + attr.slice(2), "{}", "event"), attrSnippet(attr, "{}", "event"), attrSnippet(attr + "capture", "{}", "event"));
	else result.push(createCompletion(attr, "enum"));
	return result;
};
var addBinds = (binds, options) => {
	for (let i = 0; i < binds.length;) options.push(attrSnippet("bind:" + binds[i++], "{}", "enum"));
};
/**
* Completion source that adds completion for HTML and SVG tags to Svelte. When configured,
* it can also provide completions for specific Svelte components.
* @param blockSnippets Snippets used to complete Svelte blocks such as `{#each}`.
* @param components Used to configure autocompletion for Svelte components. This is an
* object mapping each component's name to the properties available for that component.
* @param nestedSource Completion source that will be used whenever the completion isn't
* happening inside a tag or Svelte block. Can be used to provide completions for snippets
* for example.
*/
var svelteCompletion = (blockSnippets, components, nestedSource) => (context, editor) => {
	const tagMatch = getTagMatch(context, editor, svelteTag);
	if (tagMatch) {
		let [tag, tagName, lastAttr] = tagMatch;
		let start = tagMatch.index;
		let from = start + 1;
		let options;
		if (/\s/.test(tag)) {
			let tags = [
				htmlTags,
				svgTags,
				svelteTags,
				components
			];
			let globalAtts = [globalHtmlAttributes, globalSvgAttributes];
			let inAttrValue = /=\s*(?:"[^"]*|'[^']*|[^\s"'=]*)$/.test(tag);
			let i = 0;
			let currentTags;
			from = start + tag.search(/[^\s"'=]*$/);
			for (; currentTags = tags[i]; i++) {
				let globals = globalAtts[i];
				let tagAttrs = currentTags[tagName];
				if (tagAttrs) {
					if (inAttrValue) options = (globals?.[lastAttr] || tagAttrs[lastAttr])?.map((val) => createCompletion(val, "unit"));
					else {
						options = enumerateAttrs(tagAttrs);
						if (globals) enumerateAttrs(globals, options);
						if (bindAttrs[tagName]) addBinds(bindAttrs[tagName], options);
						if (globals || i == 2 && "onclick" in tagAttrs) addBinds(globalBinds, options);
					}
					break;
				}
			}
		} else options = components ? tagNames.concat(optionsFromKeys(components, "property")) : tagNames;
		if (options) return {
			from,
			options
		};
	}
	if (tagMatch != false) {
		const blockMatch = blockSnippets && /\{[#@:]\w*$/.exec(context.lineBefore);
		if (blockMatch) return {
			from: context.pos + 1 - blockMatch[0].length,
			options: blockSnippets
		};
		return nestedSource?.(context, editor);
	}
};
//#endregion
export { svelteBlockSnippets, svelteCompletion, svelteTag, svelteTags };

//# sourceMappingURL=index.js.map