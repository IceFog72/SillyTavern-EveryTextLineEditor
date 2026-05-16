import { l as o } from "../prismCore-AxbjJFmh.js";
var r = /[*&][^\s[\]{},]+/, t = /!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/, a = `(?:${t.source}(?:[ 	]+${r.source})?|${r.source}(?:[ 	]+${t.source})?)`, s = /(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(/<PLAIN>/g, /[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/.source), n = /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source, e = (u, d = "m") => RegExp(
  /([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source.replace(/<<prop>>/g, () => a).replace(/<<value>>/g, u),
  d
);
o.yml = o.yaml = {
  scalar: {
    pattern: RegExp(/([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(/<<prop>>/g, () => a)),
    lookbehind: !0,
    alias: "string"
  },
  comment: /#.*/,
  key: {
    pattern: RegExp(/((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source.replace(/<<prop>>/g, () => a).replace(/<<key>>/g, "(?:" + s + "|" + n + ")")),
    lookbehind: !0,
    greedy: !0,
    alias: "atrule"
  },
  directive: {
    pattern: /(^[ \t]*)%.+/m,
    lookbehind: !0,
    alias: "important"
  },
  datetime: {
    pattern: e(/\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/.source),
    lookbehind: !0,
    alias: "number"
  },
  boolean: {
    pattern: e(/false|true/.source, "im"),
    lookbehind: !0,
    alias: "important"
  },
  null: {
    pattern: e(/null|~/.source, "im"),
    lookbehind: !0,
    alias: "important"
  },
  string: {
    pattern: e(n),
    lookbehind: !0,
    greedy: !0
  },
  number: {
    pattern: e(/[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source, "im"),
    lookbehind: !0
  },
  tag: t,
  important: r,
  punctuation: /---|[:[\]{}\-,|>?]|\.\.\./
};
//# sourceMappingURL=yaml.js.map
