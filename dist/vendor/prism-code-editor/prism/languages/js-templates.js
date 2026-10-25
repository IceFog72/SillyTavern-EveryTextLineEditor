import { a as languages, c as tokenize, s as rest } from "../../core-Dr0o9A-8.js";
import { t as embeddedIn } from "../../templating-BdhIX5ID.js";
import "./javascript.js";
//#region src/prism/languages/js-templates.js
var js = languages.js;
var templateString = js["template-string"];
var templateLiteralPattern = templateString.pattern.source;
var interpolationPattern = templateString.inside.interpolation.pattern;
/**
* Creates a new pattern to match a template string with a special tag.
*
* This will return `undefined` if there is no grammar with the given language id.
*
* @param {string} language The language id of the embedded language. E.g. `markdown`.
* @param {string} tag The regex pattern to match the tag.
* @returns {object | undefined}
* @example
* createTemplate('css', '\\bcss');
*/
var createTemplate = (language, tag) => ({
	pattern: RegExp("(\\b(?:" + tag + ")\\s*)" + templateLiteralPattern, "g"),
	lookbehind: true,
	inside: {
		"template-punctuation": {
			pattern: /^`|`$/,
			alias: "string"
		},
		["language-" + language]: {
			pattern: /[^]+/,
			inside: {
				"interpolation": {
					pattern: interpolationPattern,
					lookbehind: true,
					alias: "language-javascript",
					inside: {
						"interpolation-punctuation": {
							pattern: /^..|\}$/g,
							alias: "punctuation"
						},
						[rest]: "js"
					}
				},
				[tokenize]: embeddedIn(language)
			}
		}
	}
});
js["template-string"] = [
	createTemplate("css", "styled(?:\\([^)]*\\))?(?:\\s*\\.\\s*\\w+(?:\\([^)]*\\))*)*|css(?:\\s*\\.\\s*(?:global|resolve))?|createGlobalStyle|keyframes"),
	createTemplate("html", "html|\\.\\s*(?:inner|outer)HTML\\s*\\+?="),
	createTemplate("svg", "svg"),
	createTemplate("markdown", "markdown|md"),
	createTemplate("graphql", "gql|graphql(?:\\s*\\.\\s*experimental)?"),
	createTemplate("sql", "sql"),
	templateString
];
//#endregion

//# sourceMappingURL=js-templates.js.map