import { n as getClosestToken } from "../../../utils--SPWoSa0.js";
import { c as renderSnippet, o as findWords, s as optionsFromKeys } from "../../../tooltip-CuDNNcdN.js";
import { C as attrValueT, D as attrValueXo, E as attrValueW, O as attrValueY, S as attrValueSh, T as attrValueTk, _ as attrValuePopover, a as attrValueD, b as attrValueS, c as attrValueEt, d as attrValueInputautocomplete, f as attrValueLoading, g as attrValuePl, h as attrValueO, i as attrValueCe, l as attrValueFm, m as attrValueM, n as attrValueB, o as attrValueDecoding, p as attrValueLt, r as attrValueBt, s as attrValueEnterkeyhint, t as ariaAttributes, u as attrValueIm, v as attrValueReferrerpolicy, w as attrValueTarget, x as attrValueSb, y as attrValueRoles } from "../../../data-Be9fjVqf.js";
import { n as re } from "../../../shared-oTKIFAwH.js";
import { n as braces, r as space } from "../../../jsx-shared-BgBgis07.js";
//#region src/extensions/autocomplete/javascript/jsx.ts
/**
* Completion source that adds autocompletion for JSX tags.
* @param tags Object mapping tag-names to completable attributes for that tag.
* @param globalAttributes Completable attributes shared by all tags.
* @returns A Completion source. Requires a JavaScript context to work.
*/
var jsxTagCompletion = (tags, globalAttributes) => {
	const tagOptions = optionsFromKeys(tags, "property");
	const attrOptions = optionsFromKeys(globalAttributes, "enum");
	return ({ tagMatch, explicit }) => {
		if (tagMatch && (explicit || /\S/.test(tagMatch[0].slice(-1)))) {
			let [tag, tagName, lastAttr, lastAttrValue] = tagMatch;
			let start = tagMatch.index;
			let from = start + 1;
			let options = tagOptions;
			if (/[\s/>]/.test(tag)) {
				let tagAttrs = tags[tagName];
				from = start + tag.search(/[^\s"'{}=<>]*$/);
				if (lastAttrValue) options = (globalAttributes[lastAttr] || tagAttrs?.[lastAttr])?.map((val) => ({
					label: val,
					icon: "unit"
				}));
				else options = tag.slice(-1) == "=" || !tagAttrs ? 0 : attrOptions.concat(optionsFromKeys(tagAttrs, "enum"));
			}
			if (options) return {
				from,
				options
			};
		}
	};
};
//#endregion
//#region src/extensions/autocomplete/javascript/keywords.ts
var jsKeyWords = "as,await,break,case,catch,class,const,continue,debugger,default,delete,do,else,export,extends,false,finally,for,function,if,import,in,instanceof,let,new,null,of,package,return,static,super,switch,this,throw,true,try,typeof,undefined,var,void,while,with,yield".split(",").map((name) => ({
	label: name,
	icon: "keyword"
}));
var tsKeywords = jsKeyWords.concat("abstract,any,asserts,boolean,declare,enum,infer,interface,is,keyof,module,namespace,never,number,private,protected,public,readonly,string,symbol,type,unknown".split(",").map((name) => ({
	label: name,
	icon: "keyword"
})));
/**
* Completion source that adds autocompletion for JS/TS keywords.
*/
var completeKeywords = ({ path, explicit, language, pos }) => {
	if (path?.length == 1 && (path[0] || explicit)) return {
		from: pos - path[0].length,
		options: language[0] == "t" ? tsKeywords : jsKeyWords
	};
};
//#endregion
//#region src/extensions/autocomplete/javascript/reactData.ts
var fetchPriority = [
	"high",
	"low",
	"auto"
];
var align = [
	"left",
	"center",
	"right",
	"justify",
	"char"
];
var blocking = ["render"];
var mediaAttrs = {
	autoPlay: null,
	controls: null,
	controlsList: null,
	crossOrigin: attrValueXo,
	loop: null,
	mediaGroup: null,
	muted: null,
	playsInline: null,
	preload: attrValuePl,
	src: null
};
var globalReactAttributes = {
	...ariaAttributes,
	suppressContentEditableWarning: null,
	suppressHydrationWarning: null,
	children: null,
	dangerouslySetInnerHTML: null,
	ref: null,
	key: null,
	accessKey: null,
	autoCapitalize: [
		"off",
		"none",
		"on",
		"sentences",
		"words",
		"characters"
	],
	autoFocus: null,
	className: null,
	contentEditable: attrValueCe,
	contextMenu: null,
	dir: attrValueD,
	draggable: attrValueB,
	enterKeyHint: attrValueEnterkeyhint,
	hidden: null,
	id: null,
	lang: null,
	slot: null,
	spellCheck: attrValueB,
	style: null,
	tabIndex: null,
	title: null,
	translate: attrValueY,
	radioGroup: null,
	role: attrValueRoles,
	about: null,
	datatype: null,
	inlist: null,
	prefix: null,
	property: null,
	resource: null,
	rev: null,
	typeof: null,
	vocab: null,
	autoCorrect: null,
	autoSave: null,
	color: null,
	itemProp: null,
	itemScope: null,
	itemType: null,
	itemID: null,
	itemRef: null,
	results: null,
	security: null,
	unselectable: attrValueO,
	popover: attrValuePopover,
	popoverTargetAction: [
		"toggle",
		"show",
		"hide"
	],
	popoverTarget: null,
	inert: null,
	inputMode: attrValueIm,
	is: null,
	exportparts: null,
	part: null,
	onCopy: null,
	onCopyCapture: null,
	onCut: null,
	onCutCapture: null,
	onPaste: null,
	onPasteCapture: null,
	onCompositionEnd: null,
	onCompositionEndCapture: null,
	onCompositionStart: null,
	onCompositionStartCapture: null,
	onCompositionUpdate: null,
	onCompositionUpdateCapture: null,
	onFocus: null,
	onFocusCapture: null,
	onBlur: null,
	onBlurCapture: null,
	onChange: null,
	onChangeCapture: null,
	onBeforeInput: null,
	onBeforeInputCapture: null,
	onInput: null,
	onInputCapture: null,
	onReset: null,
	onResetCapture: null,
	onSubmit: null,
	onSubmitCapture: null,
	onInvalid: null,
	onInvalidCapture: null,
	onLoad: null,
	onLoadCapture: null,
	onError: null,
	onErrorCapture: null,
	onKeyDown: null,
	onKeyDownCapture: null,
	onKeyPress: null,
	onKeyPressCapture: null,
	onKeyUp: null,
	onKeyUpCapture: null,
	onAbort: null,
	onAbortCapture: null,
	onCanPlay: null,
	onCanPlayCapture: null,
	onCanPlayThrough: null,
	onCanPlayThroughCapture: null,
	onDurationChange: null,
	onDurationChangeCapture: null,
	onEmptied: null,
	onEmptiedCapture: null,
	onEncrypted: null,
	onEncryptedCapture: null,
	onEnded: null,
	onEndedCapture: null,
	onLoadedData: null,
	onLoadedDataCapture: null,
	onLoadedMetadata: null,
	onLoadedMetadataCapture: null,
	onLoadStart: null,
	onLoadStartCapture: null,
	onPause: null,
	onPauseCapture: null,
	onPlay: null,
	onPlayCapture: null,
	onPlaying: null,
	onPlayingCapture: null,
	onProgress: null,
	onProgressCapture: null,
	onRateChange: null,
	onRateChangeCapture: null,
	onSeeked: null,
	onSeekedCapture: null,
	onSeeking: null,
	onSeekingCapture: null,
	onStalled: null,
	onStalledCapture: null,
	onSuspend: null,
	onSuspendCapture: null,
	onTimeUpdate: null,
	onTimeUpdateCapture: null,
	onVolumeChange: null,
	onVolumeChangeCapture: null,
	onWaiting: null,
	onWaitingCapture: null,
	onAuxClick: null,
	onAuxClickCapture: null,
	onClick: null,
	onClickCapture: null,
	onContextMenu: null,
	onContextMenuCapture: null,
	onDoubleClick: null,
	onDoubleClickCapture: null,
	onDrag: null,
	onDragCapture: null,
	onDragEnd: null,
	onDragEndCapture: null,
	onDragEnter: null,
	onDragEnterCapture: null,
	onDragExit: null,
	onDragExitCapture: null,
	onDragLeave: null,
	onDragLeaveCapture: null,
	onDragOver: null,
	onDragOverCapture: null,
	onDragStart: null,
	onDragStartCapture: null,
	onDrop: null,
	onDropCapture: null,
	onMouseDown: null,
	onMouseDownCapture: null,
	onMouseEnter: null,
	onMouseLeave: null,
	onMouseMove: null,
	onMouseMoveCapture: null,
	onMouseOut: null,
	onMouseOutCapture: null,
	onMouseOver: null,
	onMouseOverCapture: null,
	onMouseUp: null,
	onMouseUpCapture: null,
	onSelect: null,
	onSelectCapture: null,
	onTouchCancel: null,
	onTouchCancelCapture: null,
	onTouchEnd: null,
	onTouchEndCapture: null,
	onTouchMove: null,
	onTouchMoveCapture: null,
	onTouchStart: null,
	onTouchStartCapture: null,
	onPointerDown: null,
	onPointerDownCapture: null,
	onPointerMove: null,
	onPointerMoveCapture: null,
	onPointerUp: null,
	onPointerUpCapture: null,
	onPointerCancel: null,
	onPointerCancelCapture: null,
	onPointerEnter: null,
	onPointerLeave: null,
	onPointerOver: null,
	onPointerOverCapture: null,
	onPointerOut: null,
	onPointerOutCapture: null,
	onGotPointerCapture: null,
	onGotPointerCaptureCapture: null,
	onLostPointerCapture: null,
	onLostPointerCaptureCapture: null,
	onScroll: null,
	onScrollCapture: null,
	onScrollEnd: null,
	onScrollEndCapture: null,
	onWheel: null,
	onWheelCapture: null,
	onAnimationStart: null,
	onAnimationStartCapture: null,
	onAnimationEnd: null,
	onAnimationEndCapture: null,
	onAnimationIteration: null,
	onAnimationIterationCapture: null,
	onToggle: null,
	onBeforeToggle: null,
	onTransitionCancel: null,
	onTransitionCancelCapture: null,
	onTransitionEnd: null,
	onTransitionEndCapture: null,
	onTransitionRun: null,
	onTransitionRunCapture: null,
	onTransitionStart: null,
	onTransitionStartCapture: null
};
var empty = {};
var reactTags = {
	__proto__: null,
	html: { manifest: null },
	head: { profile: null },
	title: empty,
	base: {
		href: null,
		target: attrValueTarget
	},
	link: {
		as: null,
		blocking,
		crossOrigin: attrValueXo,
		fetchPriority,
		href: null,
		hrefLang: null,
		rel: null,
		media: null,
		imageSrcSet: null,
		imageSizes: null,
		referrerPolicy: attrValueReferrerpolicy,
		sizes: null,
		type: null,
		charSet: null,
		precedence: null
	},
	meta: {
		charSet: null,
		httpEquiv: null,
		content: null,
		media: null,
		name: null
	},
	style: {
		blocking,
		media: null,
		nonce: null,
		scoped: null,
		type: null,
		href: null,
		precedence: null
	},
	body: empty,
	article: empty,
	section: empty,
	nav: empty,
	aside: empty,
	h1: empty,
	h2: empty,
	h3: empty,
	h4: empty,
	h5: empty,
	h6: empty,
	header: empty,
	footer: empty,
	address: empty,
	p: empty,
	hr: empty,
	pre: empty,
	blockquote: { cite: null },
	ol: {
		reversed: null,
		start: null,
		type: attrValueLt
	},
	ul: empty,
	li: { value: null },
	dl: empty,
	dt: empty,
	dd: { nowrap: null },
	figure: empty,
	figcaption: empty,
	main: empty,
	div: empty,
	a: {
		download: null,
		href: null,
		hrefLang: null,
		media: null,
		ping: null,
		referrerpolicy: null,
		rel: null,
		target: attrValueTarget,
		type: null
	},
	em: empty,
	strong: empty,
	small: empty,
	s: empty,
	cite: empty,
	q: { cite: null },
	dfn: empty,
	abbr: empty,
	ruby: empty,
	rt: empty,
	rp: empty,
	time: { dateTime: null },
	code: empty,
	var: empty,
	samp: empty,
	kbd: empty,
	sub: empty,
	sup: empty,
	i: empty,
	b: empty,
	u: empty,
	mark: empty,
	bdi: empty,
	bdo: empty,
	span: empty,
	br: empty,
	wbr: empty,
	ins: {
		cite: null,
		dateTime: null
	},
	del: {
		cite: null,
		dateTime: null
	},
	picture: empty,
	img: {
		alt: null,
		crossOrigin: attrValueXo,
		decoding: attrValueDecoding,
		fetchPriority,
		height: null,
		loading: attrValueLoading,
		referrerPolicy: attrValueReferrerpolicy,
		sizes: null,
		src: null,
		srcSet: null,
		useMap: null,
		width: null
	},
	iframe: {
		allow: null,
		allowFullscreen: null,
		allowTransparency: null,
		frameBorder: null,
		height: null,
		loading: attrValueLoading,
		marginHeight: null,
		marginWidth: null,
		name: null,
		referrerPolicy: attrValueReferrerpolicy,
		sandbox: attrValueSb,
		scrolling: null,
		seamless: null,
		src: null,
		srcDoc: null,
		width: null
	},
	embed: {
		height: null,
		src: null,
		type: null,
		width: null
	},
	object: {
		classID: null,
		data: null,
		form: null,
		height: null,
		name: null,
		type: null,
		useMap: null,
		width: null,
		wmode: null
	},
	param: {
		name: null,
		value: null
	},
	video: {
		height: null,
		poster: null,
		width: null,
		disablePictureInPicture: null,
		disableRemotePlayback: null,
		onResize: null,
		onResizeCapture: null,
		...mediaAttrs
	},
	audio: mediaAttrs,
	source: {
		height: null,
		media: null,
		sizes: null,
		src: null,
		srcSet: null,
		type: null,
		width: null
	},
	track: {
		default: null,
		kind: attrValueTk,
		label: null,
		src: null,
		srcLang: null
	},
	map: { name: null },
	area: {
		alt: null,
		coords: null,
		download: null,
		href: null,
		hrefLang: null,
		media: null,
		referrerPolicy: attrValueReferrerpolicy,
		rel: null,
		shape: attrValueSh,
		target: attrValueTarget
	},
	table: {
		align: [
			"left",
			"center",
			"right"
		],
		bgcolor: null,
		border: null,
		cellPadding: null,
		cellSpacing: null,
		frame: null,
		rules: [
			"none",
			"groups",
			"rows",
			"columns",
			"all"
		],
		summary: null,
		width: null
	},
	caption: empty,
	colgroup: { span: null },
	col: {
		span: null,
		width: null
	},
	tbody: empty,
	thead: empty,
	tfoot: empty,
	tr: empty,
	td: {
		abbr: null,
		align,
		colSpan: null,
		headers: null,
		rowSpan: null,
		scope: null,
		height: null,
		width: null,
		valign: [
			"top",
			"middle",
			"bottom",
			"baseline"
		]
	},
	th: {
		abbr: null,
		align,
		colSpan: null,
		headers: null,
		rowSpan: null,
		scope: attrValueS
	},
	search: empty,
	form: {
		acceptCharset: null,
		action: null,
		autoComplete: attrValueO,
		encType: attrValueEt,
		method: attrValueM,
		name: null,
		noValidate: null,
		target: attrValueTarget
	},
	label: {
		form: null,
		htmlFor: null
	},
	input: {
		accept: null,
		alt: null,
		autoComplete: attrValueInputautocomplete,
		capture: null,
		checked: null,
		defaultValue: null,
		defaultChecked: null,
		disabled: null,
		form: null,
		formAction: null,
		formEncType: attrValueEt,
		formMethod: attrValueFm,
		formNoValidate: null,
		formTarget: attrValueTarget,
		height: null,
		list: null,
		max: null,
		maxLength: null,
		min: null,
		minLength: null,
		multiple: null,
		name: null,
		pattern: null,
		placeholder: null,
		readOnly: null,
		required: null,
		size: null,
		src: null,
		step: null,
		type: attrValueT,
		value: null,
		width: null,
		onChange: null
	},
	button: {
		autoComplete: null,
		disabled: null,
		form: null,
		formAction: null,
		formEnctype: attrValueEt,
		formMethod: attrValueFm,
		formNoValidate: null,
		formTarget: attrValueTarget,
		name: null,
		type: attrValueBt,
		value: null
	},
	select: {
		autoComplete: attrValueInputautocomplete,
		defaultValue: null,
		disabled: null,
		form: null,
		multiple: null,
		name: null,
		required: null,
		size: null,
		value: null,
		onChange: null
	},
	datalist: empty,
	optgroup: {
		disabled: null,
		label: null
	},
	option: {
		disabled: null,
		label: null,
		selected: null,
		value: null
	},
	textarea: {
		autoComplete: attrValueInputautocomplete,
		cols: null,
		defaultValue: null,
		dirName: null,
		disabled: null,
		form: null,
		maxLength: null,
		minLength: null,
		name: null,
		placeholder: null,
		readOnly: null,
		required: null,
		rows: null,
		value: null,
		wrap: attrValueW,
		onChange: null
	},
	output: {
		htmlFor: null,
		form: null,
		name: null
	},
	progress: {
		value: null,
		max: null
	},
	meter: {
		form: null,
		high: null,
		low: null,
		max: null,
		min: null,
		optimum: null,
		value: null
	},
	fieldset: {
		disabled: null,
		form: null,
		name: null
	},
	legend: empty,
	details: {
		name: null,
		open: null
	},
	summary: empty,
	dialog: {
		closedBy: [
			"any",
			"closerequest",
			"none"
		],
		open: null,
		onCancel: null,
		onClose: null
	},
	script: {
		async: null,
		blocking,
		charSet: null,
		crossOrigin: attrValueXo,
		defer: null,
		fetchPriority,
		integrity: null,
		noModule: null,
		nonce: null,
		referrerPolicy: attrValueReferrerpolicy,
		src: null,
		type: null
	},
	noscript: empty,
	template: empty,
	canvas: {
		width: null,
		height: null
	},
	slot: { name: null },
	data: { value: null },
	hgroup: empty,
	menu: empty
};
//#endregion
//#region src/extensions/autocomplete/javascript/snippets.ts
var renderDocs = (item) => [renderSnippet(item.insert, "js")];
var jsSnipets = [
	{
		label: "log",
		insert: "console.log()\n",
		tabStops: [
			12,
			12,
			14
		],
		icon: "snippet",
		detail: "Log to the console",
		renderDocs
	},
	{
		label: "warn",
		insert: "console.warn()\n",
		tabStops: [
			13,
			13,
			15
		],
		icon: "snippet",
		detail: "Log warning to the console",
		renderDocs
	},
	{
		label: "error",
		insert: "console.error()\n",
		tabStops: [
			14,
			14,
			16
		],
		icon: "snippet",
		detail: "Log error to the console",
		renderDocs
	},
	{
		label: "import",
		insert: "import {  } from \"module\"\n",
		tabStops: [
			9,
			9,
			18,
			24,
			26
		],
		icon: "snippet",
		detail: "Import Statement",
		renderDocs
	},
	{
		label: "function",
		insert: "function name(params) {\n	\n}",
		tabStops: [
			9,
			13,
			14,
			20,
			25
		],
		icon: "snippet",
		detail: "Function Statement",
		renderDocs
	},
	{
		label: "class",
		insert: "class name {\n	constructor(params) {\n		\n	}\n}",
		tabStops: [
			6,
			10,
			26,
			32,
			38
		],
		icon: "snippet",
		detail: "Class Definition",
		renderDocs
	},
	{
		label: "throw",
		insert: "throw new Error(\"\")",
		tabStops: [17],
		icon: "snippet",
		detail: "Throw Exception",
		renderDocs
	},
	{
		label: "trycatch",
		insert: "try {\n	\n} catch (error) {\n	\n}",
		tabStops: [
			7,
			7,
			17,
			22,
			27
		],
		icon: "snippet",
		detail: "Try-Catch Statement",
		renderDocs
	},
	{
		label: "for",
		insert: "for (let index = 0; index < array.length; index++) {\n	\n}",
		tabStops: [
			9,
			14,
			20,
			25,
			28,
			33,
			42,
			47,
			54
		],
		icon: "snippet",
		detail: "For Loop",
		renderDocs
	},
	{
		label: "forof",
		insert: "for (const item of iterable) {\n	\n}",
		tabStops: [
			11,
			15,
			19,
			27,
			32
		],
		icon: "snippet",
		detail: "For-Of Loop",
		renderDocs
	},
	{
		label: "forin",
		insert: "for (const key in object) {\n	\n}",
		tabStops: [
			11,
			14,
			18,
			24,
			29
		],
		icon: "snippet",
		detail: "For-In Loop",
		renderDocs
	},
	{
		label: "forawaitof",
		insert: "for await (const item of iterable) {\n	\n}",
		tabStops: [
			17,
			21,
			25,
			33,
			38
		],
		icon: "snippet",
		detail: "For-Await-Of Loop",
		renderDocs
	},
	{
		label: "if",
		insert: "if () {\n	\n}",
		tabStops: [
			4,
			4,
			9
		],
		icon: "snippet",
		detail: "If Statement",
		renderDocs
	},
	{
		label: "ifelse",
		insert: "if () {\n	\n} else {\n	\n}",
		tabStops: [
			4,
			4,
			9,
			9,
			20
		],
		icon: "snippet",
		detail: "If-Else Statement",
		renderDocs
	},
	{
		label: "while",
		insert: "while () {\n	\n}",
		tabStops: [
			7,
			7,
			12
		],
		icon: "snippet",
		detail: "While Statement",
		renderDocs
	},
	{
		label: "dowhile",
		insert: "do {\n	\n} while ()",
		tabStops: [
			6,
			6,
			16
		],
		icon: "snippet",
		detail: "Do-While Statement",
		renderDocs
	},
	{
		label: "switch",
		insert: "switch () {\n	\n}",
		tabStops: [
			8,
			8,
			13
		],
		icon: "snippet",
		detail: "Switch Statement",
		renderDocs
	}
];
//#endregion
//#region src/extensions/autocomplete/javascript/jsdoc.ts
var tags = "abstract,access,alias,argument,async,augments,author,borrows,callback,class,classdesc,constant,constructor,constructs,copyright,default,deprecated,description,emits,enum,event,example,exports,extends,external,field,file,fileoverview,fires,function,generator,global,hideconstructor,host,ignore,implements,import,inheritdoc,inner,instance,interface,kind,lends,license,link,linkcode,linkplain,listens,member,memberof,method,mixes,mixin,module,name,namespace,overload,override,package,param,private,prop,property,protected,public,readonly,requires,returns,satisfies,see,since,static,summary,template,this,throws,todo,tutorial,type,typedef,var,variation,version,virtual,yields".split(",").map((label) => ({
	label,
	icon: "keyword"
}));
/** Completion source that adds completion of JSDoc tags. */
var jsDocCompletion = (context, editor) => {
	if (getClosestToken(editor, ".doc-comment", 0, 0, context.pos) && /@[a-z]*$/.test(context.lineBefore)) return {
		from: context.before.lastIndexOf("@") + 1,
		options: tags
	};
};
//#endregion
//#region src/extensions/autocomplete/javascript/index.ts
var identifierPattern = ["(?!\\s)[$\\w\\xa0-\\uffff]"];
var identifier = /* @__PURE__ */ re("^(?!\\d)<0>+$", identifierPattern);
var pathRE = /* @__PURE__ */ re("(?:(?!\\d)<0>+\\s*\\??\\.\\s*)*(?!\\d)<0>*$", identifierPattern);
var tagPattern = /* @__PURE__ */ re("(?:^|[^\\w$])(?:<|<(?!\\d)([^\\s%=<>/]+)(?:(?:<0>|<0>*<(?:[^<>=]|=[^<]|=?<(?:[^<>]|<[^<>]*>)*>)*>)(?:<0>*(?:([^\\s\"'{=<>/*]+)(?:<0>*=<0>*(?!\\s)(?:\"[^\"]*\"|'[^']*'|<1>)?|(?![^\\s=]))|<1>))*<0>*(?:=<0>*(\"[^\"]*|'[^']*))?)?)$", [space, braces]);
/**
* Adds extra properties to the completion context used by JavaScript completion sources.
*/
var jsContext = (context, editor) => {
	const before = context.before;
	const pos = context.pos;
	const matcher = editor.extensions.matchBrackets;
	let enabled = !getClosestToken(editor, ".comment,.regex", 0, 0, pos);
	let tagMatch = null;
	if (enabled) {
		if (context.language.slice(1) == "sx") {
			if (tagMatch = tagPattern.exec(before)) {
				if (tagMatch[0][1] == "<") {
					tagMatch[0] = tagMatch[0].slice(1);
					tagMatch.index++;
				}
				if (getClosestToken(editor, ".string,.comment,.regex", 0, 0, tagMatch.index + 1)) tagMatch = null;
			}
		}
		if (!tagMatch) {
			enabled = !getClosestToken(editor, ".string,.plain-text", 0, 0, pos) && !/\b(?:const|let|var|class|enum|function|interface|type)\s+(?:(?!\s)[$\w\xa0-\uffff])*$/.test(context.lineBefore);
			if (enabled && matcher) {
				let { brackets, pairs } = matcher;
				let i = 0;
				let bracket;
				for (; bracket = brackets[i]; i++) if (bracket[5] && bracket[1] < pos && brackets[pairs[i]]?.[2] > pos && /\b(?:const|let|var)\s*$/.test(before.slice(0, bracket[1]))) {
					enabled = false;
					i = 9e9;
				}
			}
		}
	}
	return {
		tagMatch,
		disabled: !enabled,
		path: enabled && !tagMatch ? before.slice(-999).match(pathRE)[0].split(/[\s?.]+/) : null
	};
};
var shouldComplete = ({ path, explicit }) => path && (path[0] || explicit);
var getFrom = ({ path, pos }) => pos - path[path.length - 1].length;
var enumerateOwnProperties = (obj, commitChars, functionCommitChars = commitChars) => {
	let options = [];
	let seen = /* @__PURE__ */ new Set();
	let boost = 0;
	let temp = obj;
	for (; temp; temp = Object.getPrototypeOf(temp), boost--) Object.getOwnPropertyNames(temp).forEach((name) => {
		if (!seen.has(name) && identifier.test(name)) {
			seen.add(name);
			let isFunc;
			try {
				isFunc = typeof obj[name] == "function";
			} catch (_) {}
			options.push({
				label: name,
				boost,
				commitChars: isFunc ? functionCommitChars : commitChars,
				icon: isFunc ? /[A-Z]/.test(name[0]) ? "class" : "function" : /[^A-Z_]/.test(name) ? "variable" : "constant"
			});
		}
	});
	return [options, seen];
};
/**
* Returns a completion source that adds completions for a scope object.
* @param scope Scope object you want to provide completions for. For example `window`.
* @param commitChars Commit characters for variables in the scope. If a character in this
* string is typed and one of these options is selected, the option  is inserted right
* before typing that character.
* @param functionCommitChars Commit characters for functions in the scope.
* If a character in this string is typed and one of these options is selected, the option
* is inserted right before typing that character. Defaults to `commitChars`.
*/
var completeScope = (scope, commitChars, functionCommitChars) => {
	const scopeSource = _completeScope(/* @__PURE__ */ new WeakMap(), scope, commitChars, functionCommitChars);
	return (context) => {
		const result = scopeSource(context);
		if (result) return {
			from: getFrom(context),
			options: result[0]
		};
	};
};
var _completeScope = (cache, scope, commitChars, functionCommitChars) => {
	return (context) => {
		if (shouldComplete(context)) {
			let path = context.path;
			let target = scope;
			let last = path.length - 1;
			let i = 0;
			while (i < last) try {
				target = target[path[i++]];
				if (target == null) return;
			} catch (_) {
				return;
			}
			target = Object(target);
			if (!cache.has(target)) cache.set(target, enumerateOwnProperties(target, commitChars, functionCommitChars));
			return cache.get(target);
		}
	};
};
var includedTypes = /* @__PURE__ */ new Set([
	"parameter",
	"class-name",
	"constant",
	"function",
	"property-access",
	"maybe-class-name",
	"generic-function",
	"expression"
]);
var identifierFilter = (value) => (type, start) => includedTypes.has(type) || type == "tag" && value[start] == "<";
var identifierSearch = re("<0>+", identifierPattern, "g");
/**
* Completion source that searches the editor for identifiers and returns them as
* completions. Best to avoid using this and {@link completeScope} at the same time.
* @param identifiers List of identifiers that should be completed even if they're not
* found in the editor.
*/
var completeIdentifiers = (identifiers) => {
	return (context, editor) => {
		return shouldComplete(context) ? {
			from: getFrom(context),
			options: Array.from(findWords(context, editor, identifierFilter(editor.value), identifierSearch, identifiers), (label) => ({
				label,
				icon: "text"
			}))
		} : null;
	};
};
/**
* Completion source that wraps {@link completeIdentifiers} and {@link completeScope} and
* removes duplicated options.
*
* This means you can provide completions for both the `window` and words in the document
* without duplicated options.
* @param scope Scope object you want to provide completions for. For example `window`.
* @param identifiers List of identifiers that should be completed even if they're not
* found in the document.
* @param commitChars Commit characters for the scope completion. If one of the characters
* in the provided string is typed and a scope option is selected, then it's inserted
* right before the character is typed.
* @param functionCommitChars Commit characters for functions in the scope completion. If
* one of the characters in the provided string is typed and a scope option is selected,
* then it's inserted right before the character is typed. Defaults to `commitChars`.
*/
var jsCompletion = (scope, identifiers, commitChars, functionCommitChars) => {
	const scopeSource = _completeScope(/* @__PURE__ */ new WeakMap(), scope, commitChars, functionCommitChars);
	return (context, editor) => {
		if (shouldComplete(context)) {
			let completions;
			let labels;
			let scopeResult = scopeSource(context);
			if (scopeResult) {
				completions = scopeResult[0].slice();
				labels = scopeResult[1];
			} else completions = [];
			findWords(context, editor, identifierFilter(editor.value), identifierSearch, identifiers).forEach((word) => {
				if (!labels?.has(word)) completions.push({
					label: word,
					icon: "text"
				});
			});
			return {
				from: getFrom(context),
				options: completions
			};
		}
	};
};
//#endregion
export { completeIdentifiers, completeKeywords, completeScope, globalReactAttributes, jsCompletion, jsContext, jsDocCompletion, jsSnipets, jsxTagCompletion, reactTags };

//# sourceMappingURL=index.js.map