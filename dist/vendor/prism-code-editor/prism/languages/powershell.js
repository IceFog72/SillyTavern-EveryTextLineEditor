import { a as languages } from "../../core-Dr0o9A-8.js";
//#region src/prism/languages/powershell.js
var stringFunction = {
	pattern: /(^|[^`])\$\((?:\$\([^\n()]*\)|(?!\$\()[^\n)])*\)/,
	lookbehind: true
};
var variable = /\$\w+/;
var boolean = /\$(?:false|true)\b/i;
stringFunction.inside = languages.powershell = {
	"comment": {
		pattern: /(^|[^`])(?:#.*|<#[^]*?#>)/,
		lookbehind: true
	},
	"string": [{
		pattern: /"(?:`[^]|[^`"])*"/g,
		inside: {
			"function": stringFunction,
			"boolean": boolean,
			"variable": variable
		}
	}, /'(?:[^']|'')*'/g],
	"namespace": /\[[a-z](?:[^[\]]|\[(?:[^[\]]|\[[^\]]*\])*\])*\]/i,
	"boolean": boolean,
	"variable": variable,
	"function": [/\b(?:add|approve|assert|backup|b?lock|checkpoint|clear|close|compare|complete|compress|confirm|connect|convert|convertfrom|convertto|copy|debug|deny|disable|disconnect|dismount|edit|enable|enter|exit|expand|export|find|foreach|format|get|grant|group|hide|import|initialize|install|invoke|join|limit|measure|merge|move|new|open|optimize|out|ping|pop|protect|publish|push|read|receive|redo|register|remove|rename|repair|request|reset|resize|resolve|restart|restore|resume|revoke|save|search|select|send|set|show|skip|sort|split|start|step|stop|submit|suspend|switch|sync|tee|test|trace|unblock|undo|uninstall|unlock|unprotect|unpublish|unregister|update|use|wait|watch|where|write)-[a-z]+\b/i, /\b(?:ac|cat|chdir|cl[cipv]|compare|copy|cp[ip]?|cvpa|dbp|del|diff|dir|ebp|echo|epal|epcsv|epsn|erase|f[cltw]|gal|gbp|gc[is]?|gdr|g[ilmuv]|gps?|group|g?sv|[girs]wmi|iex|ii|ipal|ipcsv|ipsn|i?rm|iwr|kill|lp|ls|measure|m[ipv]|mount|move|nal|ndr|ni|nv|ogv|popd|ps|pushd|pwd|rbp|rdr?|ren|rmdir|rn?[ip]|rv|rvpa|sal|s[ap]ps|s[ap]sv|sb?p|sc|select|set|shcm|si|sleep|sls?|sort|start|tee|trcm|type|write)\b/i],
	"keyword": /\b(?:begin|break|catch|class|continue|data|define|do|dynamicparam|else|elseif|end|exit|filter|finally|for|foreach|from|function|if|inlinescript|parallel|param|process|return|sequence|switch|throw|trap|try|until|using|var|while|workflow)\b/i,
	"operator": {
		pattern: /(^|\W)(?:!|-(?:b?and|b?x?or|as|(?:not)?(?:contains|in|like|match)|eq|[gl][et]|isnot|is|join|ne|not|replace|sh[lr])\b|--|\+\+|[%/*+-]=?)/i,
		lookbehind: true
	},
	"punctuation": /[()[\]{}.,;|]/
};
//#endregion

//# sourceMappingURL=powershell.js.map