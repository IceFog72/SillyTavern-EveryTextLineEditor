import { l as c, P as j } from "../prismCore-AxbjJFmh.js";
import "./markup.js";
var w = (r, a) => "___" + r.toUpperCase() + a + "___";
Object.defineProperties(c["markup-templating"] = {}, {
  buildPlaceholders: {
    /**
     * Tokenize all inline templating expressions matching `placeholderPattern`.
     *
     * If `replaceFilter` is provided, only matches of `placeholderPattern` for which `replaceFilter` returns
     * `true` will be replaced.
     *
     * @param {object} env The environment of the `before-tokenize` hook.
     * @param {string} language The language id.
     * @param {RegExp} placeholderPattern The matches of this pattern will be replaced by placeholders.
     * @param {(match: string) => boolean} [replaceFilter]
     */
    value(r, a, f, o) {
      if (r.language == a) {
        var t = r.tokenStack = [], l = r.code;
        r.code = l.replace(f, (s) => {
          if (o && !o(s))
            return s;
          for (var i = t.length, e; l.indexOf(e = w(a, i)) + 1; )
            ++i;
          return t[i] = s, e;
        }), r.grammar = c.markup;
      }
    }
  },
  tokenizePlaceholders: {
    /**
     * Replace placeholders with proper tokens after tokenizing.
     *
     * @param {object} env The environment of the `after-tokenize` hook.
     * @param {string} language The language id.
     */
    value(r, a) {
      if (!(r.language != a || !r.tokenStack)) {
        r.grammar = c[a];
        var f = 0, o = Object.keys(r.tokenStack), t = o.length, l = 0, s = [], i = (e) => {
          for (var u = 0; u < e.length && f < t; u++) {
            var h = e[u], v = h.content;
            if (v && (s[l++] = h), Array.isArray(v))
              i(v);
            else {
              var m = o[f], p = r.tokenStack[m], d = v || h, P = w(a, m), g = d.indexOf(P);
              if (g + 1) {
                ++f;
                var _ = d.slice(0, g), S = P.length, b = new j.Token(a, j.tokenize(p, r.grammar), "language-" + a, p), y = d.slice(g + S), k = [], O = 0;
                for (_ && k.push(...i([_])), k.push(b), y && k.push(...i([y])); O < l; )
                  s[O++].length += p.length - S;
                v ? h.content = k : e.splice(u, 1, ...k);
              }
            }
            v && l--;
          }
          return e;
        };
        i(r.tokens);
      }
    }
  }
});
//# sourceMappingURL=markup-templating.js.map
