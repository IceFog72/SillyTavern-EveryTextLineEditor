import { l, i as c } from "../prismCore-AxbjJFmh.js";
import "./clike.js";
var r = (s, n) => s.replace(/<<(\d+)>>/g, (u, D) => `(?:${n[+D]})`), e = (s, n, u) => RegExp(r(s, n), u || ""), d = (s, n) => {
  for (var u = 0; u < n; u++)
    s = s.replace(/<<self>>/g, `(?:${s})`);
  return s.replace(/<<self>>/g, "[^\\s\\S]");
}, v = (s) => `\\b(?:${s})\\b`, R = "bool|byte|char|decimal|double|dynamic|float|int|long|object|sbyte|short|string|uint|ulong|ushort|var|void", m = "class|enum|interface|record|struct", I = "add|alias|and|ascending|async|await|by|descending|from(?=\\s*(?:\\w|$))|get|global|group|into|init(?=\\s*;)|join|let|nameof|not|notnull|on|or|orderby|partial|remove|select|set|unmanaged|value|when|where|with(?=\\s*{)", y = "abstract|as|base|break|case|catch|checked|const|continue|default|delegate|do|else|event|explicit|extern|finally|fixed|for|foreach|goto|if|implicit|in|internal|is|lock|namespace|new|null|operator|out|override|params|private|protected|public|readonly|ref|return|sealed|sizeof|stackalloc|static|switch|this|throw|try|typeof|unchecked|unsafe|using|virtual|volatile|while|yield", K = v(m), b = RegExp(v(R + "|" + m + "|" + I + "|" + y)), O = v(m + "|" + I + "|" + y), F = v(R + "|" + m + "|" + y), g = d(/<(?:[^<>;=+\-*/%&|^]|<<self>>)*>/.source, 2), p = d(/\((?:[^()]|<<self>>)*\)/.source, 2), a = /@?\b[A-Za-z_]\w*\b/.source, h = r(/<<0>>(?:\s*<<1>>)?/.source, [a, g]), o = r(/(?!<<0>>)<<1>>(?:\s*\.\s*<<1>>)*/.source, [O, h]), f = /\[\s*(?:,\s*)*\]/.source, N = r(/<<0>>(?:\s*(?:\?\s*)?<<1>>)*(?:\s*\?)?/.source, [o, f]), P = r(/[^,()<>[\];=+\-*/%&|^]|<<0>>|<<1>>|<<2>>/.source, [g, p, f]), U = r(/\(<<0>>+(?:,<<0>>+)+\)/.source, [P]), i = r(/(?:<<0>>|<<1>>)(?:\s*(?:\?\s*)?<<2>>)*(?:\s*\?)?/.source, [U, o, f]), t = {
  keyword: b,
  punctuation: /[<>()?,.:[\]]/
}, _ = /'(?:[^\r\n'\\]|\\.|\\[Uux][\da-fA-F]{1,8})'/.source, C = /"(?:\\.|[^\\"\r\n])*"/.source, W = /@"(?:""|\\[\s\S]|[^\\"])*"(?!")/.source, k = l.dotnet = l.cs = l.csharp = l.extend("clike", {
  string: [
    {
      pattern: e(/(^|[^$\\])<<0>>/.source, [W]),
      lookbehind: !0,
      greedy: !0
    },
    {
      pattern: e(/(^|[^@$\\])<<0>>/.source, [C]),
      lookbehind: !0,
      greedy: !0
    }
  ],
  "class-name": [
    {
      // Using static
      // using static System.Math;
      pattern: e(/(\busing\s+static\s+)<<0>>(?=\s*;)/.source, [o]),
      lookbehind: !0,
      inside: t
    },
    {
      // Using alias (type)
      // using Project = PC.MyCompany.Project;
      pattern: e(/(\busing\s+<<0>>\s*=\s*)<<1>>(?=\s*;)/.source, [a, i]),
      lookbehind: !0,
      inside: t
    },
    {
      // Using alias (alias)
      // using Project = PC.MyCompany.Project;
      pattern: e(/(\busing\s+)<<0>>(?=\s*=)/.source, [a]),
      lookbehind: !0
    },
    {
      // Type declarations
      // class Foo<A, B>
      // interface Foo<out A, B>
      pattern: e(/(\b<<0>>\s+)<<1>>/.source, [K, h]),
      lookbehind: !0,
      inside: t
    },
    {
      // Single catch exception declaration
      // catch(Foo)
      // (things like catch(Foo e) is covered by variable declaration)
      pattern: e(/(\bcatch\s*\(\s*)<<0>>/.source, [o]),
      lookbehind: !0,
      inside: t
    },
    {
      // Name of the type parameter of generic constraints
      // where Foo : class
      pattern: e(/(\bwhere\s+)<<0>>/.source, [a]),
      lookbehind: !0
    },
    {
      // Casts and checks via as and is.
      // as Foo<A>, is Bar<B>
      // (things like if(a is Foo b) is covered by variable declaration)
      pattern: e(/(\b(?:is(?:\s+not)?|as)\s+)<<0>>/.source, [N]),
      lookbehind: !0,
      inside: t
    },
    {
      // Variable, field and parameter declaration
      // (Foo bar, Bar baz, Foo[,,] bay, Foo<Bar, FooBar<Bar>> bax)
      pattern: e(/\b<<0>>(?=\s+(?!<<1>>|with\s*\{)<<2>>(?:\s*[=,;:{)\]]|\s+(?:in|when)\b))/.source, [i, F, a]),
      inside: t
    }
  ],
  keyword: b,
  // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#literals
  number: /(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:[dflmu]|lu|ul)?\b/i,
  operator: />>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,
  punctuation: /\?\.?|::|[{}[\];(),.:]/
});
c("csharp", "number", {
  range: {
    pattern: /\.\./,
    alias: "operator"
  }
});
c("csharp", "punctuation", {
  "named-parameter": {
    pattern: e(/([(,]\s*)<<0>>(?=\s*:)/.source, [a]),
    lookbehind: !0,
    alias: "punctuation"
  }
});
c("csharp", "class-name", {
  namespace: {
    // namespace Foo.Bar {}
    // using Foo.Bar;
    pattern: e(/(\b(?:namespace|using)\s+)<<0>>(?:\s*\.\s*<<0>>)*(?=\s*[;{])/.source, [a]),
    lookbehind: !0,
    inside: {
      punctuation: /\./
    }
  },
  "type-expression": {
    // default(Foo), typeof(Foo<Bar>), sizeof(int)
    pattern: e(/(\b(?:default|sizeof|typeof)\s*\(\s*(?!\s))(?:[^()\s]|\s(?!\s)|<<0>>)*(?=\s*\))/.source, [p]),
    lookbehind: !0,
    alias: "class-name",
    inside: t
  },
  "return-type": {
    // Foo<Bar> ForBar(); Foo IFoo.Bar() => 0
    // int this[int index] => 0; T IReadOnlyList<T>.this[int index] => this[index];
    // int Foo => 0; int Foo { get; set } = 0;
    pattern: e(/<<0>>(?=\s+(?:<<1>>\s*(?:=>|[({]|\.\s*this\s*\[)|this\s*\[))/.source, [i, o]),
    inside: t,
    alias: "class-name"
  },
  "constructor-invocation": {
    // new List<Foo<Bar[]>> { }
    pattern: e(/(\bnew\s+)<<0>>(?=\s*[[({])/.source, [i]),
    lookbehind: !0,
    inside: t,
    alias: "class-name"
  },
  /*'explicit-implementation': {
  	// int IFoo<Foo>.Bar => 0; void IFoo<Foo<Foo>>.Foo<T>();
  	pattern: replace(/\b<<0>>(?=\.<<1>>)/, className, methodOrPropertyDeclaration),
  	inside: classNameInside,
  	alias: 'class-name'
  },*/
  "generic-method": {
    // foo<Bar>()
    pattern: e(/<<0>>\s*<<1>>(?=\s*\()/.source, [a, g]),
    inside: {
      function: e(/^<<0>>/.source, [a]),
      generic: {
        pattern: RegExp(g),
        alias: "class-name",
        inside: t
      }
    }
  },
  "type-list": {
    // The list of types inherited or of generic constraints
    // class Foo<F> : Bar, IList<FooBar>
    // where F : Bar, IList<int>
    pattern: e(
      /\b((?:<<0>>\s+<<1>>|record\s+<<1>>\s*<<5>>|where\s+<<2>>)\s*:\s*)(?:<<3>>|<<4>>|<<1>>\s*<<5>>|<<6>>)(?:\s*,\s*(?:<<3>>|<<4>>|<<6>>))*(?=\s*(?:where|[{;]|=>|$))/.source,
      [K, h, a, i, b.source, p, /\bnew\s*\(\s*\)/.source]
    ),
    lookbehind: !0,
    inside: {
      "record-arguments": {
        pattern: e(/(^(?!new\s*\()<<0>>\s*)<<1>>/.source, [h, p]),
        lookbehind: !0,
        greedy: !0,
        inside: k
      },
      keyword: b,
      "class-name": {
        pattern: RegExp(i),
        greedy: !0,
        inside: t
      },
      punctuation: /[,()]/
    }
  },
  preprocessor: {
    pattern: /(^[\t ]*)#.*/m,
    lookbehind: !0,
    alias: "property",
    inside: {
      // highlight preprocessor directives as keywords
      directive: {
        pattern: /(#)\b(?:define|elif|else|endif|endregion|error|if|line|nullable|pragma|region|undef|warning)\b/,
        lookbehind: !0,
        alias: "keyword"
      }
    }
  }
});
var T = C + "|" + _, z = r(/\/(?![*/])|\/\/[^\r\n]*[\r\n]|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>/.source, [T]), j = d(r(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [z]), 2), x = /\b(?:assembly|event|field|method|module|param|property|return|type)\b/.source, Z = r(/<<0>>(?:\s*\(<<1>>*\))?/.source, [o, j]), w = /:[^}\r\n]+/.source, A = d(r(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [z]), 2), $ = r(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [A, w]), B = d(r(/[^"'/()]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>|\(<<self>>*\)/.source, [T]), 2), E = r(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [B, w]), S = (s, n) => ({
  interpolation: {
    pattern: e(/((?:^|[^{])(?:\{\{)*)<<0>>/.source, [s]),
    lookbehind: !0,
    inside: {
      "format-string": {
        pattern: e(/(^\{(?:(?![}:])<<0>>)*)<<1>>(?=\}$)/.source, [n, w]),
        lookbehind: !0,
        inside: {
          punctuation: /^:/
        }
      },
      punctuation: /^\{|\}$/,
      expression: {
        pattern: /[\s\S]+/,
        alias: "language-csharp",
        inside: k
      }
    }
  },
  string: /[\s\S]+/
});
c("csharp", "class-name", {
  attribute: {
    // Attributes
    // [Foo], [Foo(1), Bar(2, Prop = "foo")], [return: Foo(1), Bar(2)], [assembly: Foo(Bar)]
    pattern: e(/((?:^|[^\s\w>)?])\s*\[\s*)(?:<<0>>\s*:\s*)?<<1>>(?:\s*,\s*<<1>>)*(?=\s*\])/.source, [x, Z]),
    lookbehind: !0,
    greedy: !0,
    inside: {
      target: {
        pattern: e(/^<<0>>(?=\s*:)/.source, [x]),
        alias: "keyword"
      },
      "attribute-arguments": {
        pattern: e(/\(<<0>>*\)/.source, [j]),
        inside: k
      },
      "class-name": {
        pattern: RegExp(o),
        inside: {
          punctuation: /\./
        }
      },
      punctuation: /[:,]/
    }
  }
});
c("csharp", "string", {
  "interpolation-string": [
    {
      pattern: e(/(^|[^\\])(?:\$@|@\$)"(?:""|\\[\s\S]|\{\{|<<0>>|[^\\{"])*"/.source, [$]),
      lookbehind: !0,
      greedy: !0,
      inside: S($, A)
    },
    {
      pattern: e(/(^|[^@\\])\$"(?:\\.|\{\{|<<0>>|[^\\"{])*"/.source, [E]),
      lookbehind: !0,
      greedy: !0,
      inside: S(E, B)
    }
  ],
  char: {
    pattern: RegExp(_),
    greedy: !0
  }
});
//# sourceMappingURL=csharp.js.map
