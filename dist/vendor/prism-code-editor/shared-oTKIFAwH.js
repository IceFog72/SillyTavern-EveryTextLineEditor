//#region src/prism/utils/shared.js
/**
* Creates a nested pattern where all occurrences of the string `<self>` are replaced with the pattern itself.
*
* @param {string} pattern
* @param {number} depthLog2
*/
var nested = (pattern, depthLog2) => {
	for (var i = 0; i < depthLog2; i++) pattern = pattern.replace(/<self>/g, `(?:${pattern})`);
	return pattern.replace(/<self>/g, "[]");
};
/**
* Replaces all placeholders "<n>" of given pattern with the n-th replacement (zero based).
*
* Note: This is a simple text based replacement. Be careful when using backreferences!
*
* @param {string} pattern the given pattern.
* @param {string[]} replacements a list of replacement which can be inserted into the given pattern.
* @returns the pattern with all placeholders replaced with their corresponding replacements.
* @example replace('a<0>a', ['b+']) === 'a(?:b+)a'
*/
var replace = (pattern, replacements) => pattern.replace(/<(\d+)>/g, (m, index) => `(?:${replacements[+index]})`);
/**
* @param {string} pattern 
* @param {string[]} replacements 
* @param {string=} flags
*/
var re = (pattern, replacements, flags) => RegExp(replace(pattern, replacements), flags);
//#endregion
export { re as n, replace as r, nested as t };

//# sourceMappingURL=shared-oTKIFAwH.js.map