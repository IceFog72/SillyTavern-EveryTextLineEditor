//#region src/prism/utils/clike-class.js
var clikeClass = () => ({
	pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\\\w.]+/i,
	lookbehind: true,
	inside: { "punctuation": /[\\.]/ }
});
//#endregion
export { clikeClass as t };

//# sourceMappingURL=clike-class-CXD3NFPG.js.map