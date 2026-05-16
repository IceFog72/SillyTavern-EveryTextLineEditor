import { l as t } from "../prismCore-AxbjJFmh.js";
var i = t.diff = {
  // Match all kinds of coord lines (prefixed by "+++", "---" or "***").
  // Match "@@ ... @@" coord lines in unified diff.
  // Match coord lines in normal diff (starts with a number).
  coord: /^(?:\*{3}|-{3}|\+{3}|\d).*$|^@@.*@@$/m
  // deleted, inserted, unchanged, diff
}, r = {
  "deleted-sign": "-",
  "deleted-arrow": "<",
  "inserted-sign": "+",
  "inserted-arrow": ">",
  unchanged: " ",
  diff: "!"
};
for (var e in r) {
  var d = e.split("-")[0];
  i[e] = {
    pattern: RegExp("^(?:[" + r[e] + `].*$(?:\r
?|
)?)+`, "m"),
    alias: d != e ? d : e == "diff" ? "bold" : void 0,
    inside: {
      prefix: {
        pattern: RegExp("^[" + r[e] + "]", "m"),
        greedy: !0,
        alias: d
      }
    }
  };
}
Object.defineProperty(i, "PREFIXES", {
  value: r
});
//# sourceMappingURL=diff.js.map
