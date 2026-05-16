import { l as o } from "../prismCore-AxbjJFmh.js";
var t = /\s\x00-\x1f\x22-\x2f\x3a-\x3f\x5b-\x5e\x60\x7b-\x7e/.source, n = (e, r) => RegExp(e.source.replace(/<nonId>/g, t), r);
o.kum = o.kumir = {
  comment: /\|.*/,
  prolog: {
    pattern: /#.*/,
    greedy: !0
  },
  string: {
    pattern: /"[^\n\r"]*"|'[^\n\r']*'/,
    greedy: !0
  },
  boolean: {
    pattern: n(/(^|[<nonId>])(?:да|нет)(?=[<nonId>]|$)/),
    lookbehind: !0
  },
  "operator-word": {
    pattern: n(/(^|[<nonId>])(?:и|или|не)(?=[<nonId>]|$)/),
    lookbehind: !0,
    alias: "keyword"
  },
  "system-variable": {
    pattern: n(/(^|[<nonId>])знач(?=[<nonId>]|$)/),
    lookbehind: !0,
    alias: "keyword"
  },
  type: [
    {
      pattern: n(/(^|[<nonId>])(?:вещ|лит|лог|сим|цел)(?:\x20*таб)?(?=[<nonId>]|$)/),
      lookbehind: !0,
      alias: "builtin"
    },
    {
      pattern: n(/(^|[<nonId>])(?:компл|сканкод|файл|цвет)(?=[<nonId>]|$)/),
      lookbehind: !0,
      alias: "important"
    }
  ],
  /**
   * Should be performed after searching for type names because of "таб".
   * "таб" is a reserved word, but never used without a preceding type name.
   * "НАЗНАЧИТЬ", "Фввод", and "Фвывод" are not reserved words.
   */
  keyword: {
    pattern: n(/(^|[<nonId>])(?:алг|арг(?:\x20*рез)?|ввод|ВКЛЮЧИТЬ|вс[её]|выбор|вывод|выход|дано|для|до|дс|если|иначе|исп|использовать|кон(?:(?:\x20+|_)исп)?|кц(?:(?:\x20+|_)при)?|надо|нач|нс|нц|от|пауза|пока|при|раза?|рез|стоп|таб|то|утв|шаг)(?=[<nonId>]|$)/),
    lookbehind: !0
  },
  /** Should be performed after searching for reserved words. */
  name: {
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    pattern: n(/(^|[<nonId>])[^\d<nonId>][^<nonId>]*(?:\x20+[^<nonId>]+)*(?=[<nonId>]|$)/),
    lookbehind: !0
  },
  /** Should be performed after searching for names. */
  number: {
    pattern: n(/(^|[<nonId>])(?:\B\$[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)(?=[<nonId>]|$)/, "i"),
    lookbehind: !0
  },
  /** Should be performed after searching for words. */
  punctuation: /:=|[(),:;\[\]]/,
  /**
   * Should be performed after searching for
   * - numeric constants (because of "+" and "-");
   * - punctuation marks (because of ":=" and "=").
   */
  "operator-char": {
    pattern: /\*\*?|<[=>]?|>=?|[-+/=]/,
    alias: "operator"
  }
};
//# sourceMappingURL=kumir.js.map
