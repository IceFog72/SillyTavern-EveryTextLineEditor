import { l as s } from "../prismCore-AxbjJFmh.js";
import "./bash.js";
s["sh-session"] = s.shellsession = s["shell-session"] = {
  command: {
    pattern: /^(?:[^\s@:$#%*!/\\]+@[^\r\n@:$#%*!/\\]+(?::[^\0-\x1F$#%*?"<>:;|]+)?|[/~.][^\0-\x1F$#%*?"<>@:;|]*)?[$#%](?=\s)(?:[^\\\r\n \t'"<$]|[ \t](?:(?!#)|#.*$)|\\(?:[^\r]|\r\n?)|\$(?!')|<(?!<)|"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"|'[^']*'|\$'(?:[^'\\]|\\[\s\S])*'|<<-?\s*(["']?)(\w+)\1\s[\s\S]*?[\r\n]\2)+/m,
    greedy: !0,
    inside: {
      info: {
        // foo@bar:~/files$ exit
        // foo@bar$ exit
        // ~/files$ exit
        pattern: /^[^#$%]+/,
        alias: "punctuation",
        inside: {
          user: /^[^\s@:$#%*!/\\]+@[^\r\n@:$#%*!/\\]+/,
          punctuation: /:/,
          path: /[\s\S]+/
        }
      },
      bash: {
        pattern: /(^[$#%]\s*)\S[\s\S]*/,
        lookbehind: !0,
        alias: "language-bash",
        inside: s.bash
      },
      "shell-symbol": {
        pattern: /^[$#%]/,
        alias: "important"
      }
    }
  },
  output: /.(?:.*(?:[\r\n]|.$))*/
};
//# sourceMappingURL=shell-session.js.map
