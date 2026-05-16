import { l as r, i } from "../prismCore-AxbjJFmh.js";
var a = (t) => RegExp("(^(?:" + t.source + "):[ 	]*(?![ 	]))[^]+", "i");
r.http = {
  "request-line": {
    pattern: /^(?:CONNECT|DELETE|GET|HEAD|OPTIONS|PATCH|POST|PRI|PUT|SEARCH|TRACE)\s(?:https?:\/\/|\/)\S*\sHTTP\/[\d.]+/m,
    inside: {
      // HTTP Method
      method: {
        pattern: /^[A-Z]+\b/,
        alias: "property"
      },
      // Request Target e.g. http://example.com, /path/to/file
      "request-target": {
        pattern: /^(\s)(?:https?:\/\/|\/)\S*(?=\s)/,
        lookbehind: !0,
        alias: "url",
        inside: "uri"
      },
      // HTTP Version
      "http-version": {
        pattern: /^(\s)HTTP\/[\d.]+/,
        lookbehind: !0,
        alias: "property"
      }
    }
  },
  "response-status": {
    pattern: /^HTTP\/[\d.]+ \d+ .+/m,
    inside: {
      // HTTP Version
      "http-version": {
        pattern: /^HTTP\/[\d.]+/,
        alias: "property"
      },
      // Status Code
      "status-code": {
        pattern: /^(\s)\d+(?=\s)/,
        lookbehind: !0,
        alias: "number"
      },
      // Reason Phrase
      "reason-phrase": {
        pattern: /^(\s).+/,
        lookbehind: !0,
        alias: "string"
      }
    }
  },
  header: {
    pattern: /^[\w-]+:.+(?:(?:\r\n?|\n)[ \t].+)*/m,
    inside: {
      "header-value": [
        {
          pattern: a(/Content-Security-Policy/),
          lookbehind: !0,
          alias: ["csp", "languages-csp"],
          inside: "csp"
        },
        {
          pattern: a(/Public-Key-Pins(?:-Report-Only)?/),
          lookbehind: !0,
          alias: ["hpkp", "languages-hpkp"],
          inside: "hpkp"
        },
        {
          pattern: a(/Strict-Transport-Security/),
          lookbehind: !0,
          alias: ["hsts", "languages-hsts"],
          inside: "hsts"
        },
        {
          pattern: a(/[^:]+/),
          lookbehind: !0
        }
      ],
      "header-name": {
        pattern: /^[^:]+/,
        alias: "keyword"
      },
      punctuation: /^:/
    }
  }
};
var p = [
  "application/javascript",
  "application/json",
  "application/xml",
  "text/xml",
  "text/html",
  "text/css",
  "text/plain"
], o = ["application/json", "application/xml"], l = (t, e) => "(?:" + t + "|\\w+/(?:[\\w.-]+\\+)+" + e + "(?![+\\w.-]))", s = {};
p.forEach((t) => {
  var e = t.replace(/^[a-z]+\//, ""), n = o.includes(t) ? l(t, e) : t;
  s[t.replace(/\//g, "-")] = {
    pattern: RegExp(
      "(content-type:\\s*" + n + "(?:(?:\\r\\n?|\\n)[\\w-].*)*(?:\\r(?:\\n|(?!\\n))|\\n))[^ \\t\\w-][\\s\\S]*",
      "i"
    ),
    lookbehind: !0,
    inside: e == "json" ? r.json || "js" : e
  };
});
i("http", "header", s);
//# sourceMappingURL=http.js.map
