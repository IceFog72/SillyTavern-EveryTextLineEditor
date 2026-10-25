import { n as getClosestToken } from "../../../utils--SPWoSa0.js";
import { c as renderSnippet } from "../../../tooltip-CuDNNcdN.js";
import { t as getTagMatch } from "../../../markup-DGNiYW1g.js";
import { extract, markup, resolveConfig } from "emmet";
//#region src/extensions/autocomplete/emmet/markup.ts
/** @module autocomplete/emmet */
var replaceStopsWithCursors = (expanded, tabStops) => {
	let result = "";
	let i = 0;
	let pos = 0;
	while (i < tabStops.length) {
		result += expanded.slice(pos, pos = tabStops[i + 1]);
		tabStops[i++] < tabStops[i++] || (result += "|");
	}
	return result + expanded.slice(pos);
};
var filterExpanded = (abbr, expaded, tags, hasComponents) => {
	const tag = /^(\w+)\.?$/.exec(abbr)?.[1];
	const last = abbr.slice(-1);
	if (tag && !tags?.every((names) => !hasOwn.call(names, tag))) return true;
	if (tag && last == ".") return false;
	if (/[:-]/.test(abbr) && last != ":") return true;
	if (hasComponents && /^[A-Z]\w*$/.test(abbr)) return true;
	return expaded != `<${abbr}></${abbr}>`;
};
var syntaxMap = {
	html: "markup",
	svg: "markup",
	mathml: "markup",
	astro: "markup",
	tsx: "jsx"
};
var componentLangs = /* @__PURE__ */ new Set([
	"astro",
	"vue",
	"svelte"
]);
var hasOwn = {}.hasOwnProperty;
/**
* Completion source that expands the emmet abbreviation at the cursor position as long
* as the cursor isn't inside an XML tag or comment.
*
* @param options Options for controlling the outputted suggestions.
* @returns A completion source.
*/
var markupEmmetCompletion = (options = {}) => {
	let { tags, tagPattern, boost, suggestBoost, config, extractOptions, suggestSnippets = true, suggestTags = true, icon = "property", detail = "Emmet", highlight = true } = options;
	let tabStops;
	let resolved;
	let tryExpand = (abbr) => {
		tabStops = [];
		try {
			return [markup(abbr, resolved), tabStops];
		} catch (e) {}
	};
	return (context, editor) => {
		const isJsx = "tagMatch" in context;
		const language = context.language;
		if (isJsx ? language.slice(1) != "sx" || context.tagMatch || context.disabled && !getClosestToken(editor, ".plain-text", 0, 0, context.pos) : getTagMatch(context, editor, tagPattern) != null) return;
		const { abbreviation, start, end } = extract(editor.value, context.pos, extractOptions) || {};
		if (!abbreviation || /^[\d$]|^\{[^}]*\}$|^\([^)]*\)$|^\.\.+$/.test(abbreviation) || isJsx && /^\w*\[[^\]]*\]$/.test(abbreviation)) return;
		resolved ||= resolveConfig({
			maxRepeat: 999,
			syntax: syntaxMap[language] || language,
			...config,
			options: {
				"output.compactBoolean": true,
				"output.selfClosingStyle": language == "xml" ? language : isJsx ? "xhtml" : "html",
				...config?.options,
				"output.field"(_index, placeholder, offset) {
					tabStops.push(offset, offset + placeholder.length);
					return placeholder;
				}
			}
		});
		const result = tryExpand(abbreviation);
		if (!result) return;
		const [expandedAbbr, stops] = result;
		const items = [];
		const addCompletion = (abbr, expanded, stops, boost, label, from) => items.push({
			label: label || abbr,
			detail,
			icon,
			boost: boost ? boost(abbr, expanded, language) : label ? 0 : 1,
			from,
			insert: expanded,
			tabStops: stops,
			renderDocs() {
				return [highlight ? renderSnippet(replaceStopsWithCursors(expanded, stops), "xml") : replaceStopsWithCursors(expanded, stops)];
			}
		});
		const match = /(^|[>+])([\w:-]+)$/.exec(abbreviation);
		if (filterExpanded(abbreviation, expandedAbbr, tags, isJsx || componentLangs.has(language))) addCompletion(abbreviation, expandedAbbr, stops, boost);
		if (match) {
			const lastTag = match[2];
			const from = start + match.index + match[1].length;
			const records = [];
			const found = /* @__PURE__ */ new Set();
			if (suggestSnippets) records.push(resolved.snippets);
			if (suggestTags && tags) records.push(...tags);
			for (const record of records) for (const snippet in record) if (lastTag != snippet && lastTag == snippet.slice(0, lastTag.length) && !found.has(snippet)) {
				found.add(snippet);
				const currentAbbr = abbreviation + snippet.slice(lastTag.length);
				const [expanded, stops] = tryExpand(currentAbbr) || [];
				if (expanded) addCompletion(currentAbbr, expanded, stops, suggestBoost, snippet, from);
			}
		}
		return {
			from: start,
			to: end,
			options: items
		};
	};
};
//#endregion
export { markupEmmetCompletion };

//# sourceMappingURL=markup.js.map