import { a as languages, c as tokenize } from "../../core-Dr0o9A-8.js";
import { t as embeddedIn } from "../../templating-BdhIX5ID.js";
import "./markup.js";
//#region src/prism/languages/liquid.js
languages.liquid = {
	"ignore-raw": {
		pattern: /(\{%-?\s*raw\b[^}]*\})(?!\{%-?\s*endraw\b[^}]*\})[^]+?(?=\{%-?\s*endraw\b[^}]*\})/g,
		lookbehind: true
	},
	"liquid": {
		pattern: /\{%\s*comment\s*%\}[^]*?\{%\s*endcomment\s*%\}|\{(?:%[^]*?%|\{\{[^]*?\}\}|\{[^]*?\})\}/g,
		alias: "language-liquid",
		inside: {
			"comment": {
				pattern: /(^\{%\s*comment\s*%\})[^]+(?=\{%\s*endcomment\s*%\}$)/,
				lookbehind: true
			},
			"delimiter": {
				pattern: /^\{(?:\{\{|[%{])-?|-?(?:\}\}|[%}])\}$/,
				alias: "punctuation"
			},
			"string": /"[^"]*"|'[^']*'/g,
			"keyword": /\b(?:as|assign|break|(?:end)?(?:capture|case|comment|form?|if|paginate|raw|style|tablerow|unless)|continue|cycle|decrement|echo|else|elsif|in|include|increment|limit|liquid|offset|range|render|reversed|section|when|with)\b/,
			"object": /\b(?:address|all_country_option_tags|article|block|blog|[cp]art|checkout|collection|color|country|country_option_tags|currency|current_page|current_tags|customer|customer_address|date|discount_allocation|discount_application|external_video|filter|filter_value|font|forloop|fulfillment|generic_file|gift_card|group|handle|image|line_item|link|linklist|localization|location|measurement|media|metafield|model|model_source|order|page|page_description|page_image|page_title|policy|product|product_option|recommendations|request|robots|routes|rule|script|search|selling_plan|selling_plan_allocation|selling_plan_group|shipping_method|shop|shop_locale|sitemap|store_availability|tax_line|template|theme|transaction|unit_price_measurement|user_agent|variant|video|video_source)\b/,
			"function": [{
				pattern: /(\|\s*)\w+/,
				lookbehind: true,
				alias: "filter"
			}, {
				pattern: /(\.\s*)(?:first|last|size)/,
				lookbehind: true
			}],
			"boolean": /\b(?:false|true|nil)\b/,
			"range": {
				pattern: /\.\./,
				alias: "operator"
			},
			"number": /\b\d+(?:\.\d+)?\b/,
			"operator": /[!=]=|<>|[<>]=?|[|?:=-]|\b(?:and|contains(?!\S)|or)\b/,
			"punctuation": /[()[\].,]/,
			"empty": {
				pattern: /\bempty\b/,
				alias: "keyword"
			}
		}
	},
	[tokenize]: embeddedIn("html")
};
//#endregion

//# sourceMappingURL=liquid.js.map