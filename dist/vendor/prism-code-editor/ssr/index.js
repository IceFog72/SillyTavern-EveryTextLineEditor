import { a as languages, i as highlightTokens, l as tokenizeText, n as escapeHtml } from "../core-Dr0o9A-8.js";
import { getIndentGuides } from "../extensions/guides.js";
import { t as addAlias } from "../language-CXbc22uF.js";
import { t as testBracket } from "../bracket-CStGDfC7.js";
//#region src/ssr/brackets.ts
var stack = [];
var sp;
var matchRecursive = (tokens, pairs) => {
	let token;
	let i = 0;
	for (; token = tokens[i++];) {
		if (typeof token == "string") continue;
		let content = token.content;
		let alias = token.alias;
		if (Array.isArray(content)) matchRecursive(content, pairs);
		else if ((alias || token.type) == "punctuation") {
			let last = token.length - 1;
			let bracketType = testBracket(content, pairs, last);
			if (bracketType) {
				if (bracketType % 2) stack[sp++] = [token, bracketType + 1];
				else {
					let i = sp;
					let entry;
					while (entry = stack[--i]) if (bracketType == entry[1]) {
						let alias = "bracket-level-" + i % 12;
						let j = i;
						while (++j < sp) addAlias(stack[j][0], "bracket-error");
						addAlias(token, alias);
						addAlias(entry[0], alias);
						sp = i;
						break;
					}
					if (!entry) addAlias(token, "bracket-error");
				}
			}
		}
	}
};
/**
* Function that runs the same bracket matching algorithm as the {@link matchBrackets}
* extension. This is useful to add rainbow brackets outside an editor or with
* {@link renderEditor}.
*
* @param pairs Which characters to match together. The opening character must be followed
* by the corresponding closing character. Defaults to `"()[]{}"`.
* @returns A function that accepts a token stream and adds extra classes to the brackets.
*/
var rainbowBrackets = (pairs = "()[]{}") => {
	return (tokens) => {
		sp = 0;
		matchRecursive(tokens, pairs);
		stack = [];
	};
};
//#endregion
//#region src/ssr/utils.ts
var escapeQuotes = (html) => {
	return escapeHtml(html, /"/g, "&quot;");
};
//#endregion
//#region src/ssr/code-block.ts
/**
* Renders a static code block as HTML. Styles from `prism-code-editor/code-block.css`
* are required in addition to the normal layout.
* @param options Options controlling how to render the code block. Any extra properties
* not in {@link CodeBlockOptions} will be stringified as JSON and later parsed by
* {@link forEachCodeBlock}.
* @returns String of HTML for the static code block.
*/
var renderCodeBlock = (options) => {
	let { language, value, tabSize, lineNumbers, lineNumberStart = 1, wordWrap, preserveIndent = wordWrap, guideIndents, rtl, class: userClass, tokenizeCallback, addLineClass, ...rest } = options;
	tabSize = +tabSize || 2;
	let html = `<pre class="prism-code-editor language-${escapeQuotes(language)}${lineNumbers ? " show-line-numbers" : ""} pce-${wordWrap ? "" : "no"}wrap${rtl ? " pce-rtl" : ""}${preserveIndent ? " pce-preserve" : ""}${guideIndents && !rtl ? " pce-guides" : ""}${userClass ? " " + escapeQuotes(userClass) : ""}" data-props='${escapeHtml(JSON.stringify(rest), /'/g, "&#39;")}' `;
	let indents = preserveIndent || guideIndents && !rtl ? getIndents(value, tabSize) : null;
	if (preserveIndent) value = value.replace(/	/g, " ".repeat(tabSize));
	let tokens = tokenizeText(value.includes("\r") ? value.replace(/\r\n?/g, "\n") : value, languages[language] || {});
	tokenizeCallback?.(tokens, language);
	let lines = highlightTokens(tokens).split("\n");
	let l = lines.length;
	let i = 0;
	html += `style="--tab-size:${tabSize}${lineNumbers ? `;--number-width:${(0 | Math.log10(l + lineNumberStart - 1)) + 1}.001ch${lineNumberStart - 1 ? `;counter-reset:line ${lineNumberStart - 1}` : ""}` : ""}"><code class=pce-wrapper><div class=pce-overlays></div>`;
	while (i < l) {
		let lineClass = addLineClass?.(i + 1);
		html += `<div class="pce-line${lineClass ? " " + escapeQuotes(lineClass) : ""}"${indents?.[i] ? ` style=--indent:${indents[i]}ch` : ""}>${lines[i++]}\n</div>`;
	}
	return html + "</code></pre>";
};
var getIndents = (code, tabSize) => {
	const lines = code.split("\n");
	const l = lines.length;
	const result = Array(l).fill(0);
	for (let prevIndent = 0, emptyPos = -1, i = 0; i < l; i++) {
		let line = lines[i];
		let l = line.search(/\S/);
		let indent = 0;
		if (l < 0) {
			if (emptyPos < 0) emptyPos = i;
		} else {
			for (let i = 0; i < l;) indent += line[i++] == "	" ? tabSize - indent % tabSize : 1;
			if (emptyPos + 1) {
				if (indent != prevIndent) prevIndent = Math.min(indent, prevIndent) + 1;
				while (emptyPos < i) result[emptyPos++] = prevIndent;
			}
			result[i] = prevIndent = indent;
			emptyPos = -1;
		}
	}
	return result;
};
//#endregion
//#region src/ssr/guides.ts
/**
* Function that renders indentation guides for an editor as an HTML string. Intended to
* be used as an overlay with {@link renderEditor}.
* @param options Render options for the editor.
* @returns HTML string for the indentation guides.
*/
var indentGuides = (options) => {
	if (!options.wordWrap) {
		let html = "<div class=guide-indents>	";
		let indents = getIndentGuides(options.value, +options.tabSize || 2);
		let active;
		let i = 0;
		let top;
		let indent;
		for (; top = indents[i]?.[0], top < 2; i++) if (!top) active = i;
		else {
			if (indents[i + 1]?.[0] != 1) active = i;
			break;
		}
		for (i = 0; indent = indents[i]; i++) html += `<div style=top:${indent[0]}00%;left:${indent[1]}00%;height:${indent[2]}00%${i == active ? " class=active-indent" : ""}></div>`;
		return html + "</div>";
	}
};
//#endregion
//#region src/ssr/index.ts
/**
* This function renders an editor as an HTML string. This is intended to the used with
* server-side rendering (SSR) or static-site generation (SSG). The editor can the later
* be made interactive on the client with the {@link mountEditorsUnder} function.
*
* @param options Options used for the editor. Any properties you define are stringified
* to JSON, which will later be parsed by {@link mountEditorsUnder}. This is very useful
* if you want to add extra configuration options used to customize how the editor is
* mounted.
*/
var renderEditor = (options) => {
	let { language, value, lineNumbers, wordWrap, rtl, readOnly, tabSize, tokenizeCallback, overlays, class: userClass, ...rest } = options;
	let containerClass = `prism-code-editor language-${language}${lineNumbers == false ? "" : " show-line-numbers"} pce-${wordWrap ? "" : "no"}wrap${rtl ? " pce-rtl" : ""} pce-no-selection${readOnly ? " pce-readonly" : ""}`;
	let html = `<div class="${escapeQuotes(containerClass + (userClass ? " " + userClass : ""))}"${userClass ? ` data-start=${containerClass.length + 1}` : ""} data-options='${escapeHtml(JSON.stringify(rest), /'/g, "&#39;")}' `;
	let tokens = tokenizeText(value.includes("\r") ? value.replace(/\r\n?/g, "\n") : value, languages[language] || {});
	tokenizeCallback?.(tokens, language);
	let lines = highlightTokens(tokens).split("\n");
	let l = lines.length;
	let i = 0;
	html += `style=tab-size:${+tabSize || 2};--number-width:${(0 | Math.log10(l)) + 1}.001ch><div class=pce-wrapper><div class=pce-overlays><textarea class=pce-textarea spellcheck=false autocapitalize=off autocomplete=off></textarea>`;
	overlays?.forEach((overlay) => {
		html += overlay(options) || "";
	});
	html += "</div>";
	while (i < l) html += `<div class=${i ? "pce-line" : "\"pce-line active-line\""} aria-hidden=true>${lines[i++]}\n</div>`;
	return html + "</div></div>";
};
//#endregion
export { indentGuides, rainbowBrackets, renderCodeBlock, renderEditor };

//# sourceMappingURL=index.js.map