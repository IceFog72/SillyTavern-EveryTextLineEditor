import { l as e } from "../prismCore-AxbjJFmh.js";
var r = {
  pattern: /(\basm\b)[\s\S]+?(?=\bend\s*[;[])/i,
  lookbehind: !0,
  greedy: !0
};
e.objectpascal = r.inside = e.pascal = {
  directive: {
    pattern: /\{\$[\s\S]*?\}/,
    greedy: !0,
    alias: ["marco", "property"]
  },
  comment: {
    pattern: /\(\*[\s\S]*?\*\)|\{[\s\S]*?\}|\/\/.*/,
    greedy: !0
  },
  string: {
    pattern: /(?:'(?:''|[^'\r\n])*'(?!')|#[&$%]?[a-f\d]+)+|\^[a-z]/i,
    greedy: !0
  },
  asm: r,
  keyword: [
    {
      // Turbo Pascal
      pattern: /(^|[^&])\b(?:absolute|array|asm|begin|case|const|constructor|destructor|do|downto|else|end|file|for|function|goto|if|implementation|inherited|inline|interface|label|nil|object|of|operator|packed|procedure|program|record|reintroduce|repeat|self|set|string|then|to|type|unit|until|uses|var|while|with)\b/i,
      lookbehind: !0
    },
    {
      // Free Pascal
      pattern: /(^|[^&])\b(?:dispose|exit|false|new|true)\b/i,
      lookbehind: !0
    },
    {
      // Object Pascal
      pattern: /(^|[^&])\b(?:class|dispinterface|except|exports|finalization|finally|initialization|inline|library|on|out|packed|property|raise|resourcestring|threadvar|try)\b/i,
      lookbehind: !0
    },
    {
      // Modifiers
      pattern: /(^|[^&])\b(?:absolute|abstract|alias|assembler|bitpacked|break|cdecl|continue|cppdecl|cvar|default|deprecated|dynamic|enumerator|experimental|export|external|far|far16|forward|generic|helper|implements|index|interrupt|iochecks|local|message|name|near|nodefault|noreturn|nostackframe|oldfpccall|otherwise|overload|override|pascal|platform|private|protected|public|published|read|register|reintroduce|result|safecall|saveregisters|softfloat|specialize|static|stdcall|stored|strict|unaligned|unimplemented|varargs|virtual|write)\b/i,
      lookbehind: !0
    }
  ],
  number: [
    // Hexadecimal, octal and binary
    /(?:[&%]\d+|\$[a-f\d]+)/i,
    // Decimal
    /\b\d+(?:\.\d+)?(?:e[+-]?\d+)?/i
  ],
  operator: [
    /\.\.|\*\*|:=|<[<=>]?|>[>=]?|[+\-*\/]=?|[@^=]/,
    {
      pattern: /(^|[^&])\b(?:and|as|div|exclude|in|include|is|mod|not|or|shl|shr|xor)\b/,
      lookbehind: !0
    }
  ],
  punctuation: /\(\.|\.\)|[()\[\]:;,.]/
};
r.inside = e.extend("pascal", {
  asm: void 0,
  keyword: void 0,
  operator: void 0
});
//# sourceMappingURL=pascal.js.map
