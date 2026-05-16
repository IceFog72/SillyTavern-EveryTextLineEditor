import { l as t } from "../prismCore-AxbjJFmh.js";
t.mermaid = {
  comment: {
    pattern: /%%.*/,
    greedy: !0
  },
  style: {
    pattern: /^([ \t]*(?:classDef|linkStyle|style)[ \t]+[\w$-]+[ \t]+)\w.*[^\s;]/m,
    lookbehind: !0,
    inside: {
      property: /\b\w[\w-]*(?=[ \t]*:)/,
      operator: /:/,
      punctuation: /,/
    }
  },
  "inter-arrow-label": {
    pattern: /([^<>ox.=-])(?:-[-.]|==)(?![<>ox.=-])[ \t]*(?:"[^"\r\n]*"|[^\s".=-](?:[^\r\n.=-]*[^\s.=-])?)[ \t]*(?:\.+->?|--+[->]|==+[=>])(?![<>ox.=-])/,
    lookbehind: !0,
    greedy: !0,
    inside: {
      arrow: {
        pattern: /(?:\.+->?|--+[->]|==+[=>])$/,
        alias: "operator"
      },
      label: {
        pattern: /^([\s\S]{2}[ \t]*)\S(?:[\s\S]*\S)?/,
        lookbehind: !0,
        alias: "property"
      },
      "arrow-head": {
        pattern: /^\S+/,
        alias: ["arrow", "operator"]
      }
    }
  },
  arrow: [
    // This might look complex but it really isn't.
    // There are many possible arrows (see tests) and it's impossible to fit all of them into one pattern. The
    // problem is that we only have one lookbehind per pattern. However, we cannot disallow too many arrow
    // characters in the one lookbehind because that would create too many false negatives. So we have to split the
    // arrows into different patterns.
    {
      // ER diagram
      pattern: /(^|[^{}|o.-])[|}][|o](?:--|\.\.)[|o][|{](?![{}|o.-])/,
      lookbehind: !0,
      alias: "operator"
    },
    {
      // flow chart
      // (?:==+|--+|-\.*-)
      pattern: /(^|[^<>ox.=-])(?:[<ox](?:==+|--+|-\.*-)[>ox]?|(?:==+|--+|-\.*-)[>ox]|===+|---+|-\.+-)(?![<>ox.=-])/,
      lookbehind: !0,
      alias: "operator"
    },
    {
      // sequence diagram
      pattern: /(^|[^<>()x-])(?:--?(?:>>|[x>)])(?![<>()x])|(?:<<|[x<(])--?(?!-))/,
      lookbehind: !0,
      alias: "operator"
    },
    {
      // class diagram
      pattern: /(^|[^<>|*o.-])(?:[*o]--|--[*o]|<\|?(?:--|\.\.)|(?:--|\.\.)\|?>|--|\.\.)(?![<>|*o.-])/,
      lookbehind: !0,
      alias: "operator"
    }
  ],
  label: {
    pattern: /(^|[^|<])\|(?:[^\r\n"|]|"[^"\r\n]*")+\|/,
    lookbehind: !0,
    greedy: !0,
    alias: "property"
  },
  text: {
    pattern: /(?:[(\[{]+|\b>)(?:[^\r\n"()\[\]{}]|"[^"\r\n]*")+(?:[)\]}]+|>)/,
    alias: "string"
  },
  string: {
    pattern: /"[^"\r\n]*"/,
    greedy: !0
  },
  annotation: {
    pattern: /<<(?:abstract|choice|enumeration|fork|interface|join|service)>>|\[\[(?:choice|fork|join)\]\]/i,
    alias: "important"
  },
  keyword: [
    // This language has both case-sensitive and case-insensitive keywords
    {
      pattern: /(^[ \t]*)(?:action|callback|class|classDef|classDiagram|click|direction|erDiagram|flowchart|gantt|gitGraph|graph|journey|link|linkStyle|pie|requirementDiagram|sequenceDiagram|stateDiagram|stateDiagram-v2|style|subgraph)(?![\w$-])/m,
      lookbehind: !0,
      greedy: !0
    },
    {
      pattern: /(^[ \t]*)(?:activate|alt|and|as|autonumber|deactivate|else|end(?:[ \t]+note)?|loop|opt|par|participant|rect|state|note[ \t]+(?:over|(?:left|right)[ \t]+of))(?![\w$-])/im,
      lookbehind: !0,
      greedy: !0
    }
  ],
  entity: /#[a-z0-9]+;/,
  operator: {
    pattern: /(\w[ \t]*)&(?=[ \t]*\w)|:::|:/,
    lookbehind: !0
  },
  punctuation: /[(){};]/
};
//# sourceMappingURL=mermaid.js.map
