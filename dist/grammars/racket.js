import { l as e, i as a } from "../prismCore-AxbjJFmh.js";
import "./scheme.js";
e.racket = e.extend("scheme", {
  "lambda-parameter": {
    // the racket lambda syntax is a lot more complex, so we won't even attempt to capture it.
    // this will just prevent false positives of the `function` pattern
    pattern: /([(\[]lambda\s+[(\[])[^()\[\]'\s]+/,
    lookbehind: !0
  }
});
a("racket", "string", {
  lang: {
    pattern: /^#lang.+/m,
    greedy: !0,
    alias: "keyword"
  }
});
e.rkt = e.racket;
//# sourceMappingURL=racket.js.map
