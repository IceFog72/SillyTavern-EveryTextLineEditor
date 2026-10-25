import { n as getClosestToken } from "./utils--SPWoSa0.js";
import { a as completionsFromRecords } from "./tooltip-CuDNNcdN.js";
import { A as htmlEventHandlers, D as attrValueXo, n as attrValueB, o as attrValueDecoding, t as ariaAttributes, v as attrValueReferrerpolicy, w as attrValueTarget } from "./data-Be9fjVqf.js";
//#region src/extensions/autocomplete/markup/svgData.ts
var overflow = [
	"visible",
	"hidden",
	"scroll",
	"auto",
	"inherit"
];
var visibility = [
	"visible",
	"hidden",
	"collapse",
	"inherit"
];
var units = ["userSpaceOnUse", "objectBoundingBox"];
var colorInterpolation = [
	"auto",
	"sRGB",
	"linearRGB",
	"inherit"
];
var preserveAspectRatio = [
	"none",
	"xMinYMin",
	"xMidYMin",
	"xMaxYMin",
	"xMinYMid",
	"xMidYMid",
	"xMaxYMid",
	"xMinYMax",
	"xMidYMax",
	"xMaxYMax",
	"meet",
	"slice"
];
var animationAttributes = {
	attributeName: null,
	attributeType: [
		"CSS",
		"XML",
		"auto"
	],
	begin: null,
	dur: null,
	end: null,
	fill: ["freeze", "remove"],
	min: null,
	max: null,
	onbegin: null,
	onrepeat: null,
	onend: null,
	restart: [
		"always",
		"whenNotActive",
		"never"
	],
	repeatCount: ["indefinite"],
	repeatDur: null,
	systemLanguage: null,
	to: null
};
var allAnimationAttributes = {
	...animationAttributes,
	accumulate: ["none", "sum"],
	additive: ["replace", "sum"],
	by: null,
	calcMode: [
		"discrete",
		"linear",
		"paced",
		"spline"
	],
	from: null,
	href: null,
	keySplines: null,
	keyTimes: null,
	values: null
};
var presentationAttributes = {
	"clip-path": null,
	"clip-rule": [
		"nonzero",
		"evenodd",
		"inherit"
	],
	color: null,
	"color-interpolation": colorInterpolation,
	"color-rendering": [
		"auto",
		"optimizeSpeed",
		"optimizeQuality",
		"inherit"
	],
	cursor: null,
	display: null,
	fill: null,
	"fill-opacity": null,
	"fill-rule": [
		"nonzero",
		"evenodd",
		"inherit"
	],
	filter: null,
	mask: null,
	opacity: null,
	"pointer-events": [
		"bounding-box",
		"visiblePainted",
		"visibleFill",
		"visibleStroke",
		"visible",
		"painted",
		"fill",
		"stroke",
		"all",
		"none"
	],
	"shape-rendering": [
		"auto",
		"optimizeSpeed",
		"crispEdges",
		"geometricPrecision",
		"inherit"
	],
	stroke: null,
	"stroke-dasharray": null,
	"stroke-dashoffset": null,
	"stroke-linecap": [
		"butt",
		"round",
		"square"
	],
	"stroke-linejoin": [
		"arcs",
		"bevel",
		"miter",
		"miter-clip",
		"round"
	],
	"stroke-miterlimit": null,
	"stroke-opacity": null,
	"stroke-width": null,
	transform: null,
	"vector-effect": [
		"none",
		"non-scaling-stroke",
		"non-scaling-size",
		"none-rotation",
		"fixed-position"
	],
	visibility
};
var textAttributes = {
	"alignment-baseline": [
		"auto",
		"baseline",
		"before-edge",
		"text-before-edge",
		"middle",
		"central",
		"after-edge",
		"text-after-edge",
		"ideographic",
		"alphabetic",
		"hanging",
		"mathematical",
		"inherit"
	],
	"baseline-shift": null,
	direction: [
		"ltr",
		"rtl",
		"inherit"
	],
	"dominant-baseline": [
		"auto",
		"use-script",
		"no-change",
		"reset-size",
		"alphabetic",
		"ideographic",
		"middle",
		"central",
		"mathematical",
		"hanging",
		"text-after-edge",
		"text-before-edge",
		"text-top"
	],
	"font-family": null,
	"font-size": null,
	"font-size-adjust": null,
	"font-stretch": null,
	"font-style": [
		"normal",
		"italic",
		"oblique"
	],
	"font-variant": null,
	"font-weight": null,
	"glyph-orientation-horizontal": null,
	"glyph-orientation-vertical": null,
	kerning: null,
	lengthAdjust: ["spacing", "spacingAndGlyphs"],
	"letter-spacing": null,
	systemLanguage: null,
	"text-anchor": [
		"start",
		"middle",
		"end",
		"inherit"
	],
	"text-decortation": [
		"none",
		"underline",
		"overline",
		"line-through",
		"blink",
		"inherit"
	],
	textLength: null,
	"unicode-bidi": null,
	"word-spacing": null,
	"writing-mode": [
		"lr-tb",
		"rl-tb",
		"tb-rl",
		"lr",
		"rl",
		"tb",
		"inherit"
	]
};
var posAttributes = {
	height: null,
	width: null,
	x: null,
	y: null
};
var filterAttributes = {
	...posAttributes,
	"color-interpolation-filters": colorInterpolation,
	result: null
};
var transferFuncAttributes = {
	amplitude: null,
	exponent: null,
	intercept: null,
	offset: null,
	slope: null,
	type: [
		"identity",
		"table",
		"discrete",
		"linear",
		"gamma"
	],
	tableValues: null,
	x: null,
	y: null
};
var pathAttributes = {
	...presentationAttributes,
	"marker-end": null,
	"marker-mid": null,
	"marker-start": null,
	pathLength: null,
	systemLanguage: null
};
var globalSvgAttributes = {
	...ariaAttributes,
	...htmlEventHandlers,
	autofocus: null,
	class: null,
	id: null,
	lang: null,
	nonce: null,
	style: null,
	tabindex: null
};
var svgTags = {
	a: {
		...presentationAttributes,
		download: null,
		href: null,
		hreflang: null,
		referrerpolicy: attrValueReferrerpolicy,
		rel: null,
		target: attrValueTarget,
		type: null
	},
	animate: {
		...allAnimationAttributes,
		"color-interpolation": colorInterpolation
	},
	animateMotion: {
		...allAnimationAttributes,
		keyPoints: null,
		path: null,
		rotate: null,
		systemLanguage: null
	},
	animateTransform: {
		...allAnimationAttributes,
		systemLanguage: null,
		type: [
			"translate",
			"scale",
			"rotate",
			"skewX",
			"skewY"
		]
	},
	circle: {
		...pathAttributes,
		cx: null,
		cy: null,
		r: null
	},
	clipPath: pathAttributes,
	defs: {
		...presentationAttributes,
		systemLanguage: null
	},
	desc: {},
	discard: {
		begin: null,
		href: null,
		systemLanguage: null
	},
	ellipse: {
		...pathAttributes,
		cx: null,
		cy: null,
		rx: null,
		ry: null
	},
	feBlend: {
		...filterAttributes,
		in: null,
		in2: null,
		mode: [
			"normal",
			"multiply",
			"screen",
			"overlay",
			"darken",
			"lighten",
			"color-dodge",
			"color-burn",
			"hard-light",
			"soft-light",
			"difference",
			"exclusion",
			"hue",
			"saturation",
			"color",
			"luminosity"
		]
	},
	feColorMatrix: {
		...filterAttributes,
		in: null,
		type: [
			"matrix",
			"saturate",
			"hueRotate",
			"luminanaceToAlpha"
		],
		values: null
	},
	feComponentTransfer: {
		...filterAttributes,
		in: null
	},
	feComposite: {
		...filterAttributes,
		in: null,
		in2: null,
		k1: null,
		k2: null,
		k3: null,
		k4: null,
		operator: [
			"over",
			"in",
			"out",
			"atop",
			"xor",
			"lighter",
			"arithmetic"
		]
	},
	feConvolveMatrix: {
		...filterAttributes,
		bias: null,
		divisor: null,
		edgeMode: [
			"duplicate",
			"wrap",
			"none"
		],
		in: null,
		kernelMatrix: null,
		kernelUnitLength: null,
		order: null,
		preserveAlpha: attrValueB,
		targetX: null,
		targetY: null
	},
	feDiffuseLighting: {
		...filterAttributes,
		diffuseConstant: null,
		in: null,
		kernelUnitLength: null,
		"lighting-color": null,
		surfaceScale: null
	},
	feDisplacementMap: {
		...filterAttributes,
		in: null,
		in2: null,
		scale: null,
		xChannelSelector: [..."RGBA"],
		yChannelSelector: [..."RGBA"]
	},
	feDistantLight: {
		azimuth: null,
		elevation: null
	},
	feDropShadow: {
		...filterAttributes,
		dx: null,
		dy: null,
		"flood-color": null,
		"flood-opacity": null,
		stdDeviation: null
	},
	feFlood: {
		...filterAttributes,
		"flood-color": null,
		"flood-opacity": null
	},
	feFuncA: transferFuncAttributes,
	feFuncB: transferFuncAttributes,
	feFuncG: transferFuncAttributes,
	feFuncR: transferFuncAttributes,
	feGaussianBlur: {
		...filterAttributes,
		edgeMode: [
			"duplicate",
			"wrap",
			"none"
		],
		in: null,
		stdDeviation: null
	},
	feImage: {
		...filterAttributes,
		href: null,
		preserveAspectRatio,
		crossorigin: attrValueXo
	},
	feMerge: filterAttributes,
	feMergeNode: {
		in: null,
		x: null,
		y: null
	},
	feMorphology: {
		...filterAttributes,
		in: null,
		operator: ["erode", "dilate"],
		radius: null
	},
	feOffset: {
		...filterAttributes,
		dx: null,
		dy: null,
		in: null
	},
	fePointLight: {
		x: null,
		y: null,
		z: null
	},
	feSpecularLighting: {
		...filterAttributes,
		in: null,
		"lighting-color": null,
		kernelUnitLength: null,
		specularConstant: null,
		specularExponent: null,
		surfaceScale: null
	},
	feSpotLight: {
		x: null,
		y: null,
		z: null,
		pointsAtX: null,
		pointsAtY: null,
		pointsAtZ: null,
		specularExponenet: null,
		limitingConeAngle: null
	},
	feTile: {
		...filterAttributes,
		in: null
	},
	feTurbulence: {
		...filterAttributes,
		baseFrequency: null,
		numOctaves: null,
		seed: null,
		stitchTiles: ["noStitch", "stitch"],
		type: ["fractalNoise", "turbulence"]
	},
	filter: {
		...posAttributes,
		filterUnits: units,
		href: null,
		primitiveUnits: units
	},
	foreignObject: {
		...presentationAttributes,
		...posAttributes,
		overflow,
		systemLanguage: null
	},
	g: {
		...presentationAttributes,
		systemLanguage: null
	},
	image: {
		...presentationAttributes,
		...posAttributes,
		crossorigin: attrValueXo,
		decoding: attrValueDecoding,
		href: null,
		"image-rendering": [
			"auto",
			"optimizeQuality",
			"optimizeSpeed"
		],
		overflow,
		preserveAspectRatio,
		systemLanguage: null
	},
	line: {
		...pathAttributes,
		x1: null,
		x2: null,
		y1: null,
		y2: null
	},
	linearGradient: {
		gradientUnits: units,
		gradientTransform: null,
		href: null,
		spreadMethod: [
			"pad",
			"reflect",
			"repeat"
		],
		x1: null,
		x2: null,
		y1: null,
		y2: null
	},
	marker: {
		...presentationAttributes,
		markerHeight: null,
		markerUnits: ["userSpaceOnUse", "strokeWidth"],
		markerWidth: null,
		orient: null,
		overflow,
		preserveAspectRatio,
		refX: null,
		refY: null,
		viewBox: null
	},
	mask: {
		...presentationAttributes,
		...posAttributes,
		maskContentUnits: units,
		maskUnits: units,
		systemLanguage: null
	},
	metadata: {},
	mpath: { href: null },
	path: {
		...pathAttributes,
		d: null
	},
	pattern: {
		...presentationAttributes,
		...posAttributes,
		href: null,
		overflow,
		patternContentUnits: units,
		patternTransform: null,
		patternUnits: units,
		preserveAspectRatio,
		systemLanguage: null,
		viewBox: null
	},
	polygon: {
		...pathAttributes,
		points: null
	},
	polyline: {
		...pathAttributes,
		points: null
	},
	radialGradient: {
		cx: null,
		cy: null,
		fr: null,
		fx: null,
		fy: null,
		gradientUnits: units,
		gradientTransform: null,
		href: null,
		r: null,
		spreadMethod: [
			"pad",
			"reflect",
			"repeat"
		]
	},
	rect: {
		...pathAttributes,
		...posAttributes,
		rx: null,
		ry: null
	},
	script: {
		async: null,
		crossorigin: attrValueXo,
		defer: null,
		href: null,
		type: null
	},
	set: animationAttributes,
	stop: {
		color: null,
		display: null,
		offset: null,
		"stop-color": null,
		"stop-opacity": null,
		visibility
	},
	style: {
		type: null,
		media: null,
		title: null
	},
	svg: {
		...presentationAttributes,
		...posAttributes,
		baseProfile: null,
		overflow,
		preserveAspectRatio,
		systemLanguage: null,
		version: null,
		viewBox: null,
		xmlns: ["http://www.w3.org/2000/svg"]
	},
	switch: {
		...presentationAttributes,
		systemLanguage: null
	},
	symbol: {
		...presentationAttributes,
		...posAttributes,
		overflow,
		preserveAspectRatio,
		refX: null,
		refY: null,
		viewBox: null
	},
	text: {
		...presentationAttributes,
		...textAttributes,
		dx: null,
		dy: null,
		overflow,
		systemLanguage: null,
		textLength: null,
		"text-rendering": [
			"auto",
			"optimizeSpeed",
			"optimizeLegibility",
			"geometricPrecision",
			"inherit"
		],
		x: null,
		y: null
	},
	textPath: {
		...presentationAttributes,
		...textAttributes,
		href: null,
		method: ["align", "stretch"],
		spacing: ["auto", "exact"],
		startOffset: null
	},
	title: {},
	tspan: {
		...presentationAttributes,
		...textAttributes,
		dx: null,
		dy: null,
		rotate: null,
		x: null,
		y: null
	},
	use: {
		...posAttributes,
		href: null,
		systemLanguage: null
	},
	view: {
		viewBox: null,
		preserveAspectRatio,
		viewTarget: null
	}
};
//#endregion
//#region src/extensions/autocomplete/markup/mathData.ts
var globalMathMLAttributes = {
	...ariaAttributes,
	...htmlEventHandlers,
	autofocus: null,
	class: null,
	dir: ["ltr", "rtl"],
	displaystyle: attrValueB,
	id: null,
	mathbackground: null,
	mathcolor: null,
	mathsize: null,
	nonce: null,
	scriptlevel: null,
	style: null,
	tabindex: null
};
var mathMLTags = {
	annotation: {
		encoding: null,
		src: null
	},
	"annotation-xml": {
		encoding: null,
		src: null
	},
	maction: {},
	math: { display: ["block", "inline"] },
	merror: {},
	mfrac: { linetickness: null },
	mi: {},
	mmultiscripts: {},
	mn: {},
	mo: {
		accent: attrValueB,
		fence: attrValueB,
		form: [
			"prefix",
			"infix",
			"postfix"
		],
		largeop: attrValueB,
		lspace: null,
		maxsize: null,
		minsize: null,
		movablelimits: attrValueB,
		rspace: null,
		separator: attrValueB,
		stretchy: attrValueB,
		symmetric: attrValueB
	},
	mover: { accent: attrValueB },
	mpadded: {
		depth: null,
		height: null,
		lspace: null,
		voffset: null,
		width: null
	},
	mphantom: {},
	mprescripts: {},
	mroot: {},
	mrow: {},
	ms: {},
	mspace: {
		depth: null,
		height: null,
		width: null
	},
	msqrt: {},
	mstyle: {},
	msub: {},
	msubsup: {},
	msup: {},
	mtable: {},
	mtd: {
		columnspan: null,
		rowspan: null
	},
	mtext: {},
	mtr: {},
	munder: { accentunder: attrValueB },
	munderover: {
		accent: attrValueB,
		accentunder: attrValueB
	},
	semantics: {}
};
//#endregion
//#region src/extensions/autocomplete/markup/index.ts
var tagPattern = /<$|<(?![\d!])([^\s/=>$<%]+)(?:\s(?:\s*([^\s/"'=>]+)(?:\s*=\s*(?!\s)(?:"[^"]*(?:"|$)|'[^']*(?:'|$)|[^\s"'=>]+(?!\S))?|(?![^\s=])))*\s*)?$/;
/**
* `false` is returned if completion shouldn't happen at the current position.
* `null` is returned if the cursor isn't in a tag.
*
* If completion should happen and the cursor is in a tag, a match array is
* returned. The match has two capturing groups; the tag's name and the last attribute's
* name.
*
* @param pattern Regular expression used to check if there's a partial tag before the
* cursor.
*/
var getTagMatch = ({ explicit, before, pos }, editor, pattern = tagPattern) => {
	return getClosestToken(editor, ".comment,.cdata,.prolog,.doctype", 0, 0, pos) || !explicit && /\s/.test(before.slice(-1)) ? false : pattern.exec(before);
};
/**
* Completion source that adds auto completion for specified tags.
* @param namespaces Array of different namespaces of tags you want to provide
* completions for. The `tags` property maps tag names in that namespace to completable
* attributes for that tag. The optional `globals` property allows you to override the
* global attributes shared by all tags in the namespace. If omitted, the
* `globalAttributes` parameter is used.
* @param globalAttributes Default global attributes. Used by unrecognized tags or when
* the `globals` property is omitted.
*  @param nestedSource Completion source that will be used whenever the completion isn't
* happening inside a tag. Can be used to provide completions for snippets for example.
* @returns A Completion source.
*/
var markupCompletion = (namespaces, globalAttributes, nestedSource) => {
	return (context, editor) => {
		const tagMatch = getTagMatch(context, editor);
		if (tagMatch) {
			let [tag, tagName, lastAttr] = tagMatch;
			let start = tagMatch.index;
			let from = start + 1;
			let options;
			if (/\s/.test(tag)) {
				let inAttrValue = /=\s*(?:"[^"]*|'[^']*|[^\s"'=]*)$/.test(tag);
				let i = 0;
				for (;; i++) {
					let tags = namespaces[i]?.tags;
					let globals = namespaces[i]?.globals || globalAttributes;
					let tagAttrs = tags?.[tagName];
					if (!tags && globals || tagAttrs) {
						if (inAttrValue) options = (globals?.[lastAttr] || tagAttrs?.[lastAttr])?.map((val) => ({
							label: val,
							icon: "unit"
						}));
						else options = completionsFromRecords([tagAttrs, globals], "enum");
						break;
					}
				}
				from = start + tag.search(/[^\s"'=]*$/);
			} else options = completionsFromRecords(namespaces.map((n) => n.tags), "property");
			if (options) return {
				from,
				options
			};
		}
		if (tagMatch != false) return nestedSource?.(context, editor);
	};
};
//#endregion
export { globalSvgAttributes as a, mathMLTags as i, markupCompletion as n, svgTags as o, globalMathMLAttributes as r, getTagMatch as t };

//# sourceMappingURL=markup-DGNiYW1g.js.map