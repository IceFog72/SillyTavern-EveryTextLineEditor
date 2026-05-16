/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */
const C = (() => {
  var O = {}, A = {}, Q = (a) => typeof a == "string" ? B.languages[a] : a, T = (a, l = /* @__PURE__ */ new Map()) => {
    if (l.has(a))
      return l.get(a);
    var i = a, v = U(a);
    if (v == "Object") {
      l.set(a, i = {});
      for (var g in a)
        a.hasOwnProperty(g) && (i[g] = T(a[g], l));
    } else if (v == "Array") {
      l.set(a, i = []);
      for (var n = 0, f = a.length; n < f; n++)
        i[n] = T(a[n], l);
    }
    return i;
  }, R = {}.toString, U = (a) => R.call(a).slice(8, -1), B = {
    /**
     * A namespace for utility methods.
     *
     * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
     * change or disappear at any time.
     *
     * @namespace
     * @memberof Prism
     */
    util: {
      /**
       * Returns the name of the type of the given value.
       *
       * @param {any} o
       * @returns {string}
       * @example
       * type(null)      === 'Null'
       * type(undefined) === 'Undefined'
       * type(123)       === 'Number'
       * type('foo')     === 'String'
       * type(true)      === 'Boolean'
       * type([1, 2])    === 'Array'
       * type({})        === 'Object'
       * type(String)    === 'Function'
       * type(/abc+/)    === 'RegExp'
       */
      type: U,
      /**
       * Creates a deep clone of the given object.
       *
       * The main intended use of this function is to clone language definitions.
       *
       * @param {T} o
       * @param {Map<any, any>} [visited]
       * @returns {T}
       * @template T
       */
      clone: T
    },
    /**
     * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
     *
     * @namespace
     * @memberof Prism
     * @public
     */
    languages: {
      /**
       * The grammar for plain, unformatted text.
       */
      plain: O,
      plaintext: O,
      text: O,
      txt: O,
      /**
       * Creates a deep copy of the language with the given id and appends the given tokens.
       *
       * If a token in `redef` also appears in the copied language, then the existing token in the copied language
       * will be overwritten at its original position.
       *
       * ## Best practices
       *
       * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
       * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
       * understand the language definition because, normally, the order of tokens matters in Prism grammars.
       *
       * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
       * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
       *
       * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
       * @param {Grammar} redef The new tokens to append.
       * @returns {Grammar} The new language created.
       * @public
       * @example
       * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
       *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
       *     // at its original position
       *     'comment': { ... },
       *     // CSS doesn't have a 'color' token, so this token will be appended
       *     'color': /\b(?:red|green|blue)\b/
       * });
       */
      extend: (a, l) => Object.assign(T(B.languages[a]), l),
      /**
       * Inserts tokens _before_ another token in a language definition or any other grammar.
       *
       * ## Usage
       *
       * This helper method makes it easy to modify existing languages. For example, the CSS language definition
       * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
       * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
       * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
       * this:
       *
       * ```js
       * Prism.languages.markup.style = {
       *     // token
       * };
       * ```
       *
       * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
       * before existing tokens. For the CSS example above, you would use it like this:
       *
       * ```js
       * Prism.languages.insertBefore('markup', 'cdata', {
       *     'style': {
       *         // token
       *     }
       * });
       * ```
       *
       * ## Special cases
       *
       * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
       * will be ignored.
       *
       * This behavior can be used to insert tokens after `before`:
       *
       * ```js
       * Prism.languages.insertBefore('markup', 'comment', {
       *     'comment': Prism.languages.markup.comment,
       *     // tokens after 'comment'
       * });
       * ```
       *
       * ## Limitations
       *
       * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
       * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
       * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
       * deleting properties which is necessary to insert at arbitrary positions.
       *
       * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
       * Instead, it will create a new object and replace all references to the target object with the new one. This
       * can be done without temporarily deleting properties, so the iteration order is well-defined.
       *
       * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
       * you hold the target object in a variable, then the value of the variable will not change.
       *
       * ```js
       * var oldMarkup = Prism.languages.markup;
       * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
       *
       * assert(oldMarkup !== Prism.languages.markup);
       * assert(newMarkup === Prism.languages.markup);
       * ```
       *
       * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
       * object to be modified.
       * @param {string} before The key to insert before.
       * @param {Grammar} insert An object containing the key-value pairs to be inserted.
       * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
       * object to be modified.
       *
       * Defaults to `Prism.languages`.
       * @returns {Grammar} The new grammar object.
       * @public
       */
      insertBefore(a, l, i, v = B.languages) {
        var g = v[a], n = {};
        for (var f in g)
          g.hasOwnProperty(f) && (n[f] = g[f], delete g[f]);
        for (var f in n)
          f == l && Object.assign(g, i), i.hasOwnProperty(f) || (g[f] = n[f]);
        return g;
      }
    },
    plugins: {},
    /**
     * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
     * and the language definitions to use, and returns an array with the tokenized code.
     *
     * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
     *
     * This method could be useful in other contexts as well, as a very crude parser.
     *
     * @param {string} text A string with the code to be highlighted.
     * @param {Grammar} grammar An object containing the tokens to use.
     *
     * Usually a language definition like `Prism.languages.markup`.
     * @returns {TokenStream} An array of strings and tokens, a token stream.
     * @memberof Prism
     * @public
     * @example
     * let code = `var foo = 0;`;
     * let tokens = Prism.tokenize(code, Prism.languages.javascript);
     * tokens.forEach(token => {
     *     if (token instanceof Prism.Token && token.type === 'number') {
     *         console.log(`Found numeric literal: ${token.content}`);
     *     }
     * });
     */
    tokenize(a, l) {
      var i = {}, v = { prev: i }, g = {
        head: i,
        tail: v,
        length: 0
      }, n = Q(l.rest), f = [], x = 0;
      for (i.next = v, n && (Object.assign(l, n), delete l.rest), _(g, i, a), W(a, g, l, i, 0); (i = i.next) != v; )
        f[x++] = i.value;
      return f;
    },
    /**
     * @namespace
     * @memberof Prism
     * @public
     */
    hooks: {
      all: A,
      /**
       * Adds the given callback to the list of callbacks for the given hook.
       *
       * The callback will be invoked when the hook it is registered for is run.
       * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
       *
       * One callback function can be registered to multiple hooks and the same hook multiple times.
       *
       * @param {string} name The name of the hook.
       * @param {HookCallback} callback The callback function which is given environment variables.
       * @public
       */
      add(a, l) {
        (A[a] || (A[a] = [])).push(l);
      },
      /**
       * Runs a hook invoking all registered callbacks with the given environment variables.
       *
       * Callbacks will be invoked synchronously and in the order in which they were registered.
       *
       * @param {string} name The name of the hook.
       * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
       * @public
       */
      run(a, l) {
        A[a]?.forEach((i) => i(l));
      }
    },
    Token: I
  }, V = (a, l, i) => {
    var v = a.exec(l);
    if (v && i && v[1]) {
      var g = v[1].length;
      v.index += g, v[0] = v[0].slice(g);
    }
    return v;
  }, W = (a, l, i, v, g, n) => {
    for (var f in i)
      if (i.hasOwnProperty(f) && f != "rest" && i[f])
        for (var x = 0, u = i[f], X = Array.isArray(u) ? u : [u]; x < X.length; ++x) {
          if (n && n.b == x && n.a == f)
            return;
          var y = X[x], Y = Q(y.inside), Z = y.lookbehind, $ = y.greedy, S = y.alias, h = y.pattern || y;
          $ && !h.global && (h = y.pattern = RegExp(h.source, "g" + h.flags));
          for (var r = v.next, s = g; r != l.tail && (!n || s < n.c); s += r.value.length, r = r.next) {
            var w = r.value;
            if (l.length > a.length)
              return;
            if (!(w instanceof I)) {
              var M = 1, e;
              if ($) {
                if (h.lastIndex = s, e = V(h, a, Z), !e || e.index >= a.length)
                  break;
                for (var E = e.index, c = E + e[0].length; E >= (s += r.value.length); )
                  r = r.next;
                if (s -= r.value.length, r.value instanceof I)
                  continue;
                for (var z = r, u = s; z != l.tail && (u < c || typeof z.value == "string"); z = z.next)
                  M++, u += z.value.length;
                M--, w = a.slice(s, u), e.index -= s;
              } else if (e = V(h, w, Z), !e)
                continue;
              var E = e.index, q = e[0], D = w.slice(0, E), b = w.slice(E + q.length), H = s + w.length, P = r.prev;
              n && H > n.c && (n.c = H), D && (P = _(l, P, D), s += D.length);
              for (var G = P.next, J = 0; J < M && G != l.tail; J++)
                G = G.next;
              P.next = G, G.prev = P, l.length -= J;
              var p = new I(f, Y ? B.tokenize(q, Y) : q, S, q);
              if (r = _(l, P, p), b && _(l, r, b), M > 1) {
                var K = { a: f, b: x, c: H };
                W(a, l, i, r.prev, s, K), n && K.c > n.c && (n.c = K.c);
              }
            }
          }
        }
  }, _ = (a, l, i) => {
    var v = l.next;
    return a.length++, l.next = v.prev = { value: i, prev: l, next: v };
  };
  function I(a, l, i, v = "") {
    this.type = a, this.content = l, this.alias = i, this.length = v.length;
  }
  return B;
})(), F = C, j = F.languages, t = j.insertBefore;
export {
  F as P,
  t as i,
  j as l
};
//# sourceMappingURL=prismCore-AxbjJFmh.js.map
