import { l as r } from "../prismCore-AxbjJFmh.js";
var u = /\\[\r\n](?:\s|\\[\r\n]|#.*(?!.))*(?![\s#]|\\[\r\n])/.source, i = /(?:[ \t]+(?![ \t])(?:<SP_BS>)?|<SP_BS>)/.source.replace(/<SP_BS>/g, u), o = /"(?:[^"\\\r\n]|\\(?:\r\n|[\s\S]))*"|'(?:[^'\\\r\n]|\\(?:\r\n|[\s\S]))*'/.source, S = /--[\w-]+=(?:<STR>|(?!["'])(?:[^\s\\]|\\.)+)/.source.replace(/<STR>/g, o), t = {
  pattern: RegExp(o),
  greedy: !0
}, n = {
  pattern: /(^[ \t]*)#.*/m,
  lookbehind: !0,
  greedy: !0
}, e = (a, s) => RegExp(a.replace(/<OPT>/g, S).replace(/<SP>/g, i), s);
r.dockerfile = r.docker = {
  instruction: {
    pattern: /(^[ \t]*)(?:ADD|ARG|CMD|COPY|ENTRYPOINT|ENV|EXPOSE|FROM|HEALTHCHECK|LABEL|MAINTAINER|ONBUILD|RUN|SHELL|STOPSIGNAL|USER|VOLUME|WORKDIR)(?=\s)(?:\\.|[^\r\n\\])*(?:\\$(?:\s|#.*$)*(?![\s#])(?:\\.|[^\r\n\\])*)*/im,
    lookbehind: !0,
    greedy: !0,
    inside: {
      options: {
        pattern: e(/(^(?:ONBUILD<SP>)?\w+<SP>)<OPT>(?:<SP><OPT>)*/.source, "i"),
        lookbehind: !0,
        greedy: !0,
        inside: {
          property: {
            pattern: /(^|\s)--[\w-]+/,
            lookbehind: !0
          },
          string: [
            t,
            {
              pattern: /(=)(?!["'])(?:[^\s\\]|\\.)+/,
              lookbehind: !0
            }
          ],
          operator: /\\$/m,
          punctuation: /=/
        }
      },
      keyword: [
        {
          // https://docs.docker.com/engine/reference/builder/#healthcheck
          pattern: e(/(^(?:ONBUILD<SP>)?HEALTHCHECK<SP>(?:<OPT><SP>)*)(?:CMD|NONE)\b/.source, "i"),
          lookbehind: !0,
          greedy: !0
        },
        {
          // https://docs.docker.com/engine/reference/builder/#from
          pattern: e(/(^(?:ONBUILD<SP>)?FROM<SP>(?:<OPT><SP>)*(?!--)[^ \t\\]+<SP>)AS/.source, "i"),
          lookbehind: !0,
          greedy: !0
        },
        {
          // https://docs.docker.com/engine/reference/builder/#onbuild
          pattern: e(/(^ONBUILD<SP>)\w+/.source, "i"),
          lookbehind: !0,
          greedy: !0
        },
        {
          pattern: /^\w+/,
          greedy: !0
        }
      ],
      comment: n,
      string: t,
      variable: /\$(?:\w+|\{[^{}"'\\]*\})/,
      operator: /\\$/m
    }
  },
  comment: n
};
//# sourceMappingURL=docker.js.map
