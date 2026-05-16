import { l as S } from "../prismCore-AxbjJFmh.js";
var r = /(?:"(?:""|[^"])*"(?!")|'(?:''|[^'])*'(?!'))/.source, e = /\b(?:\d[\da-f]*x|\d+(?:\.\d+)?(?:e[+-]?\d+)?)\b/i, t = {
  pattern: RegExp(r + "[bx]"),
  alias: "number"
}, u = {
  pattern: /&[a-z_]\w*/i
}, d = {
  pattern: /((?:^|\s|=|\())%(?:ABORT|BY|CMS|COPY|DISPLAY|DO|ELSE|END|EVAL|GLOBAL|GO|GOTO|IF|INC|INCLUDE|INDEX|INPUT|KTRIM|LENGTH|LET|LIST|LOCAL|PUT|QKTRIM|QSCAN|QSUBSTR|QSYSFUNC|QUPCASE|RETURN|RUN|SCAN|SUBSTR|SUPERQ|SYMDEL|SYMEXIST|SYMGLOBL|SYMLOCAL|SYSCALL|SYSEVALF|SYSEXEC|SYSFUNC|SYSGET|SYSRPUT|THEN|TO|TSO|UNQUOTE|UNTIL|UPCASE|WHILE|WINDOW)\b/i,
  lookbehind: !0,
  alias: "keyword"
}, p = {
  pattern: /(^|\s)(?:proc\s+\w+|data(?!=)|quit|run)\b/i,
  alias: "keyword",
  lookbehind: !0
}, s = {
  pattern: /\/\*[\s\S]*?\*\/|(^[ \t]*|;\s*)\*[^;]*;/m,
  lookbehind: !0
}, n = {
  pattern: RegExp(r),
  greedy: !0
}, a = /[$%@.(){}\[\];,\\]/, c = {
  pattern: /%?\b\w+(?=\()/,
  alias: "keyword"
}, i = {
  function: c,
  "arg-value": {
    pattern: /(=\s*)[A-Z\.]+/i,
    lookbehind: !0
  },
  operator: /=/,
  "macro-variable": u,
  arg: {
    pattern: /[A-Z]+/i,
    alias: "keyword"
  },
  number: e,
  "numeric-constant": t,
  punctuation: a,
  string: n
}, m = {
  pattern: /\b(?:format|put)\b=?[\w'$.]+/i,
  inside: {
    keyword: /^(?:format|put)(?==)/i,
    equals: /=/,
    format: {
      pattern: /(?:\w|\$\d)+\.\d?/,
      alias: "number"
    }
  }
}, b = {
  pattern: /\b(?:format|put)\s+[\w']+(?:\s+[$.\w]+)+(?=;)/i,
  inside: {
    keyword: /^(?:format|put)/i,
    format: {
      pattern: /[\w$]+\.\d?/,
      alias: "number"
    }
  }
}, o = {
  pattern: /((?:^|\s)=?)(?:catname|checkpoint execute_always|dm|endsas|filename|footnote|%include|libname|%list|lock|missing|options|page|resetline|%run|sasfile|skip|sysecho|title\d?)\b/i,
  lookbehind: !0,
  alias: "keyword"
}, g = {
  pattern: /(^|\s)(?:submit(?:\s+(?:load|norun|parseonly))?|endsubmit)\b/i,
  lookbehind: !0,
  alias: "keyword"
}, k = /aStore|accessControl|aggregation|audio|autotune|bayesianNetClassifier|bioMedImage|boolRule|builtins|cardinality|cdm|clustering|conditionalRandomFields|configuration|copula|countreg|dataDiscovery|dataPreprocess|dataSciencePilot|dataStep|decisionTree|deduplication|deepLearn|deepNeural|deepRnn|ds2|ecm|entityRes|espCluster|explainModel|factmac|fastKnn|fcmpact|fedSql|freqTab|gVarCluster|gam|gleam|graphSemiSupLearn|hiddenMarkovModel|hyperGroup|ica|image|iml|kernalPca|langModel|ldaTopic|loadStreams|mbc|mixed|mlTools|modelPublishing|network|neuralNet|nmf|nonParametricBayes|nonlinear|optNetwork|optimization|panel|pca|percentile|phreg|pls|qkb|qlim|quantreg|recommend|regression|reinforcementLearn|robustPca|ruleMining|sampling|sandwich|sccasl|search(?:Analytics)?|sentimentAnalysis|sequence|session(?:Prop)?|severity|simSystem|simple|smartData|sparkEmbeddedProcess|sparseML|spatialreg|spc|stabilityMonitoring|svDataDescription|svm|table|text(?:Filters|Frequency|Mining|Parse|Rule(?:Develop|Score)|Topic|Util)|timeData|transpose|tsInfo|tsReconcile|uniTimeSeries|varReduce/.source, y = {
  pattern: RegExp(/(^|\s)(?:action\s+)?(?:<act>)\.[a-z]+\b[^;]+/.source.replace(/<act>/g, k), "i"),
  lookbehind: !0,
  inside: {
    keyword: RegExp(/(?:<act>)\.[a-z]+\b/.source.replace(/<act>/g, k), "i"),
    action: {
      pattern: /(?:action)/i,
      alias: "keyword"
    },
    comment: s,
    function: c,
    "arg-value": i["arg-value"],
    operator: i.operator,
    argument: i.arg,
    number: e,
    "numeric-constant": t,
    punctuation: a,
    string: n
  }
}, l = {
  pattern: /((?:^|\s)=?)(?:after|analysis|and|array|barchart|barwidth|begingraph|by|call|cas|cbarline|cfill|class(?:lev)?|close|column|computed?|contains|continue|data(?==)|define|delete|describe|document|do\s+over|do|dol|drop|dul|else|end(?:comp|source)?|entryTitle|eval(?:uate)?|exec(?:ute)?|exit|file(?:name)?|fill(?:attrs)?|flist|fnc|function(?:list)?|global|goto|group(?:by)?|headline|headskip|histogram|if|infile|keep|keylabel|keyword|label|layout|leave|legendlabel|length|libname|loadactionset|merge|midpoints|_?null_|name|noobs|nowd|ods|options|or|otherwise|out(?:put)?|over(?:lay)?|plot|print|put|raise|ranexp|rannor|rbreak|retain|return|select|session|sessref|set|source|statgraph|sum|summarize|table|temp|terminate|then\s+do|then|title\d?|to|var|when|where|xaxisopts|y2axisopts|yaxisopts)\b/i,
  lookbehind: !0
};
S.sas = {
  datalines: {
    pattern: /^([ \t]*)(?:cards|(?:data)?lines);[\s\S]+?^[ \t]*;/im,
    lookbehind: !0,
    alias: "string",
    inside: {
      keyword: /^(?:cards|(?:data)?lines)/i,
      punctuation: /;/
    }
  },
  "proc-sql": {
    pattern: /(^proc\s+(?:fed)?sql(?:\s+[\w|=]+)?;)[\s\S]+?(?=^(?:proc\s+\w+|data|quit|run);|(?![\s\S]))/im,
    lookbehind: !0,
    inside: {
      sql: {
        pattern: RegExp(/^[ \t]*(?:select|alter\s+table|(?:create|describe|drop)\s+(?:index|table(?:\s+constraints)?|view)|create\s+unique\s+index|insert\s+into|update)(?:<str>|[^;"'])+;/.source.replace(/<str>/g, r), "im"),
        alias: "language-sql",
        inside: "sql"
      },
      "global-statements": o,
      "sql-statements": {
        pattern: /(^|\s)(?:disconnect\s+from|begin|commit|exec(?:ute)?|reset|rollback|validate)\b/i,
        lookbehind: !0,
        alias: "keyword"
      },
      number: e,
      "numeric-constant": t,
      punctuation: a,
      string: n
    }
  },
  "proc-groovy": {
    pattern: /(^proc\s+groovy(?:\s+[\w|=]+)?;)[\s\S]+?(?=^(?:proc\s+\w+|data|quit|run);|(?![\s\S]))/im,
    lookbehind: !0,
    inside: {
      comment: s,
      groovy: {
        pattern: RegExp(/(^[ \t]*submit(?:\s+(?:load|norun|parseonly))?)(?:<str>|[^"'])+?(?=endsubmit;)/.source.replace(/<str>/g, r), "im"),
        lookbehind: !0,
        alias: "language-groovy",
        inside: "groovy"
      },
      keyword: l,
      "submit-statement": g,
      "global-statements": o,
      number: e,
      "numeric-constant": t,
      punctuation: a,
      string: n
    }
  },
  "proc-lua": {
    pattern: /(^proc\s+lua(?:\s+[\w|=]+)?;)[\s\S]+?(?=^(?:proc\s+\w+|data|quit|run);|(?![\s\S]))/im,
    lookbehind: !0,
    inside: {
      comment: s,
      lua: {
        pattern: RegExp(/(^[ \t]*submit(?:\s+(?:load|norun|parseonly))?)(?:<str>|[^"'])+?(?=endsubmit;)/.source.replace(/<str>/g, r), "im"),
        lookbehind: !0,
        alias: "language-lua",
        inside: "lua"
      },
      keyword: l,
      "submit-statement": g,
      "global-statements": o,
      number: e,
      "numeric-constant": t,
      punctuation: a,
      string: n
    }
  },
  "proc-cas": {
    pattern: /(^proc\s+cas(?:\s+[\w|=]+)?;)[\s\S]+?(?=^(?:proc\s+\w+|quit|data);|(?![\s\S]))/im,
    lookbehind: !0,
    inside: {
      comment: s,
      "statement-var": {
        pattern: /((?:^|\s)=?)saveresult\s[^;]+/im,
        lookbehind: !0,
        inside: {
          statement: {
            pattern: /^saveresult\s+\S+/i,
            inside: {
              keyword: /^(?:saveresult)/i
            }
          },
          rest: i
        }
      },
      "cas-actions": y,
      statement: {
        pattern: /((?:^|\s)=?)(?:default|(?:un)?set|on|output|upload)[^;]+/im,
        lookbehind: !0,
        inside: i
      },
      step: p,
      keyword: l,
      function: c,
      format: m,
      altformat: b,
      "global-statements": o,
      number: e,
      "numeric-constant": t,
      punctuation: a,
      string: n
    }
  },
  "proc-args": {
    pattern: RegExp(/(^proc\s+\w+\s+)(?!\s)(?:[^;"']|<str>)+;/.source.replace(/<str>/g, r), "im"),
    lookbehind: !0,
    inside: i
  },
  /*Special keywords within macros*/
  "macro-keyword": d,
  "macro-variable": u,
  "macro-string-functions": {
    pattern: /((?:^|\s|=))%(?:BQUOTE|NRBQUOTE|NRQUOTE|NRSTR|QUOTE|STR)\(.*?(?:[^%]\))/i,
    lookbehind: !0,
    inside: {
      function: {
        pattern: /%(?:BQUOTE|NRBQUOTE|NRQUOTE|NRSTR|QUOTE|STR)/i,
        alias: "keyword"
      },
      "macro-keyword": d,
      "macro-variable": u,
      "escaped-char": /%['"()<>=¬^~;,#]/,
      punctuation: a
    }
  },
  "macro-declaration": {
    pattern: /^%macro[^;]+(?=;)/im,
    inside: {
      keyword: /%macro/i
    }
  },
  "macro-end": {
    pattern: /^%mend[^;]+(?=;)/im,
    inside: {
      keyword: /%mend/i
    }
  },
  /*%_zscore(headcir, _lhc, _mhc, _shc, headcz, headcpct, _Fheadcz); */
  macro: {
    pattern: /%_\w+(?=\()/,
    alias: "keyword"
  },
  input: {
    pattern: /\binput\s[-\w\s/*.$&]+;/i,
    inside: {
      input: {
        alias: "keyword",
        pattern: /^input/i
      },
      comment: s,
      number: e,
      "numeric-constant": t
    }
  },
  "options-args": {
    pattern: /(^options)[-'"|/\\<>*+=:()\w\s]*(?=;)/im,
    lookbehind: !0,
    inside: i
  },
  "cas-actions": y,
  comment: s,
  function: c,
  format: m,
  altformat: b,
  "numeric-constant": t,
  datetime: {
    // '1jan2013'd, '9:25:19pm't, '18jan2003:9:27:05am'dt
    pattern: RegExp(r + "(?:dt?|t)"),
    alias: "number"
  },
  string: n,
  step: p,
  keyword: l,
  // In SAS Studio syntax highlighting, these operators are styled like keywords
  "operator-keyword": {
    pattern: /\b(?:eq|ge|gt|in|le|lt|ne|not)\b/i,
    alias: "operator"
  },
  // Decimal (1.2e23), hexadecimal (0c1x)
  number: e,
  operator: /\*\*?|\|\|?|!!?|¦¦?|<[>=]?|>[<=]?|[-+\/=&]|[~¬^]=?/,
  punctuation: a
};
//# sourceMappingURL=sas.js.map
