import { basicEditor, minimalEditor, readonlyEditor } from "./setups/index.js";
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/typeof.js
function _typeof(o) {
	"@babel/helpers - typeof";
	return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
		return typeof o;
	} : function(o) {
		return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	}, _typeof(o);
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/toPrimitive.js
function toPrimitive(t, r) {
	if ("object" != _typeof(t) || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != _typeof(i)) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/toPropertyKey.js
function toPropertyKey(t) {
	var i = toPrimitive(t, "string");
	return "symbol" == _typeof(i) ? i : i + "";
}
//#endregion
//#region \0@oxc-project+runtime@0.146.0/helpers/esm/defineProperty.js
function _defineProperty(e, r, t) {
	return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
//#endregion
//#region src/webComponent.ts
var attributeMap = {
	language: [(value) => value || "text"],
	"tab-size": [(value) => +value || 2, "tabSize"],
	"insert-spaces": [(value) => value != null, "insertSpaces"],
	"line-numbers": [(value) => value != null, "lineNumbers"],
	readonly: [(value) => value != null, "readOnly"],
	"word-wrap": [(value) => value != null, "wordWrap"],
	rtl: [(value) => value != null],
	theme: [(value) => value || "vs-code-dark"]
};
var attributes = Object.keys(attributeMap);
var getOptions = (el) => {
	const options = {};
	for (let key in attributeMap) options[attributeMap[key][1] || key] = attributeMap[key][0](el.getAttribute(key));
	options.value = el.textContent;
	el.textContent = "";
	return options;
};
var addComponent = (createEditor, name) => {
	var _Class;
	customElements.define(name, (_Class = class extends HTMLElement {
		constructor() {
			super();
			_defineProperty(this, "editor", void 0);
			const internals = this.attachInternals?.();
			this.editor = createEditor(this, getOptions(this), () => this.dispatchEvent(new CustomEvent("ready")));
			if (internals) this.editor.on("update", internals.setFormValue.bind(internals));
			for (const attr in attributeMap) Object.defineProperty(this, attributeMap[attr][1] || attr, {
				enumerable: true,
				get: () => attributeMap[attr][0](this.getAttribute(attr)),
				set: /language|theme|tab-size/.test(attr) ? (val) => this.setAttribute(attr, val) : (val) => this.toggleAttribute(attr, val)
			});
		}
		get value() {
			return this.editor.value;
		}
		set value(value) {
			this.editor.setOptions({ value });
		}
		formResetCallback() {
			this.value = this.editor.options.value;
		}
		attributeChangedCallback(name, oldValue, newValue) {
			const [fn, propName] = attributeMap[name];
			const newVal = fn(newValue);
			if (fn(oldValue) != newVal) this.editor.setOptions({ [propName || name]: newVal });
		}
	}, _defineProperty(_Class, "observedAttributes", attributes), _defineProperty(_Class, "formAssociated", true), _Class));
};
/**
* Adds a custom element wrapping the {@link minimalEditor} setup.
* @param name Name of the custom element. Must be a valid custom element name.
*/
var addMinimalEditor = (name) => addComponent(minimalEditor, name);
/**
* Adds a custom element wrapping the {@link basicEditor} setup.
* @param name Name of the custom element. Must be a valid custom element name.
*/
var addBasicEditor = (name) => addComponent(basicEditor, name);
/**
* Adds a custom element wrapping the {@link readonlyEditor} setup.
* @param name Name of the custom element. Must be a valid custom element name.
*/
var addReadonlyEditor = (name) => addComponent(readonlyEditor, name);
//#endregion
export { addBasicEditor, addMinimalEditor, addReadonlyEditor };

//# sourceMappingURL=webComponent.js.map