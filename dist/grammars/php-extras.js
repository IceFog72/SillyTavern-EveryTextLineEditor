import { i as r } from "../prismCore-AxbjJFmh.js";
import "./php.js";
import "./markup-templating.js";
import "./markup.js";
r("php", "variable", {
  this: {
    pattern: /\$this\b/,
    alias: "keyword"
  },
  global: /\$(?:GLOBALS|HTTP_RAW_POST_DATA|_(?:COOKIE|ENV|FILES|GET|POST|REQUEST|SERVER|SESSION)|argc|argv|http_response_header|php_errormsg)\b/,
  scope: {
    pattern: /\b[\w\\]+::/,
    inside: {
      keyword: /\b(?:parent|self|static)\b/,
      punctuation: /::|\\/
    }
  }
});
//# sourceMappingURL=php-extras.js.map
