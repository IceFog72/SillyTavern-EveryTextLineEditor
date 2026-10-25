import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/http.js
/**
* @param {string} name
* @param {string} lang
*/
var headerValueOf = (name, lang) => ({
	pattern: RegExp("(^(?:" + name + "):[ 	]*)\\S[^]*", "i"),
	lookbehind: true,
	alias: lang && "language-" + lang,
	inside: lang
});
var http = languages.http = {
	"request-line": {
		pattern: /^(?:CONNECT|DELETE|GET|HEAD|OPTIONS|PATCH|POST|PRI|PUT|SEARCH|TRACE)\s(?:https?:\/)?\/\S*\sHTTP\/[\d.]+/m,
		inside: {
			"method": {
				pattern: /^\w+/,
				alias: "property"
			},
			"request-target": {
				pattern: /^(\s)[h/]\S*/,
				lookbehind: true,
				alias: "url",
				inside: "uri"
			},
			"http-version": {
				pattern: /(?!^)\S+/,
				alias: "property"
			}
		}
	},
	"response-status": {
		pattern: /^HTTP\/[\d.]+ \d+ .+/m,
		inside: {
			"http-version": {
				pattern: /^\S+/,
				alias: "property"
			},
			"status-code": {
				pattern: /^( )\d+(?= )/,
				lookbehind: true,
				alias: "number"
			},
			"reason-phrase": {
				pattern: /(?!^).+/,
				alias: "string"
			}
		}
	}
};
[
	"application/javascript",
	"application/json",
	"application/xml",
	"text/xml",
	"text/html",
	"text/css",
	"text/plain"
].forEach((contentType) => {
	var lang = contentType.split("/")[1];
	var pattern = contentType[10] && !lang[4] ? "(?:" + contentType + "|\\w+/(?:[\\w.-]+\\+)+" + lang + "(?![\\w.+-]))" : contentType;
	http[contentType.replace("/", "-")] = {
		pattern: RegExp("(content-type:\\s*" + pattern + "(?:;.*)?(?:\n[\\w-].*)*\n)[^\\w 	-][^]*", "i"),
		lookbehind: true,
		alias: "language-" + lang,
		inside: lang == "json" ? languages.json || "js" : lang
	};
});
http.header = {
	pattern: /^[\w-]+:.+(?:\n[ 	].+)*/m,
	inside: {
		"header-value": [
			headerValueOf("Content-Security-Policy", "csp"),
			headerValueOf("Public-Key-Pins(?:-Report-Only)?", "hpkp"),
			headerValueOf("Strict-Transport-Security", "hsts"),
			headerValueOf("[^:]+")
		],
		"header-name": {
			pattern: /^[^:]+/,
			alias: "keyword"
		},
		"punctuation": /^:/
	}
};
//#endregion

//# sourceMappingURL=http.js.map