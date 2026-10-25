import { a as languages } from "../../core-Dr0o9A-8.js";
import { r as extend } from "../../language-CXbc22uF.js";
import "./c.js";
//#region src/prism/languages/objectivec.js
languages.objc = languages.objectivec = extend("c", {
	"string": /@?"(?:\\[^]|[^\\\n"])*"/g,
	"keyword": /\b(?:asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int?|long|register|return|self|short|signed|sizeof|static|struct|super|switch|typedef|typeof|union|unsigned|void|volatile|while)\b|(?:@interface|@end|@implementation|@protocol|@class|@public|@protected|@private|@property|@try|@catch|@finally|@throw|@synthesize|@dynamic|@selector)\b/,
	"operator": /-[->]?|\+\+?|!=?|==?|>>?=?|<<?=?|&&?|\|\|?|[~^@%?/*]/
});
delete languages.objc["class-name"];
//#endregion

//# sourceMappingURL=objectivec.js.map