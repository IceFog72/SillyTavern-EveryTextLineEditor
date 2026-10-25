//#region src/prism/utils/patterns.js
var clikeComment = /\/\/.*|\/\*[^]*?(?:\*\/|$)/g;
var clikeString = /(["'])(?:\\[^]|(?!\1)[^\\\n])*\1/g;
var clikeNumber = /\b0x[a-f\d]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i;
var clikePunctuation = /[()[\]{}.,:;]/;
var boolean = /\b(?:false|true)\b/;
var dotPunctuation = { "punctuation": /\./ };
//#endregion
export { clikeString as a, clikePunctuation as i, clikeComment as n, dotPunctuation as o, clikeNumber as r, boolean as t };

//# sourceMappingURL=patterns-DSInPV_c.js.map