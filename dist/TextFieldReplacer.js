import { createEditor } from './vendor/prism-code-editor/index.js';
import { defaultCommands } from './vendor/prism-code-editor/extensions/commands/index.js';
import { indentGuides } from './vendor/prism-code-editor/extensions/guides.js';
import { matchBrackets } from './vendor/prism-code-editor/extensions/matchBrackets/index.js';
import { highlightBracketPairs } from './vendor/prism-code-editor/extensions/matchBrackets/highlight.js';
import { DEFAULT_TEXTFIELD_EXCEPTIONS, EDITOR_ENGINES, INDENT_MODES, LANGUAGES, NAME } from './constants.js';
import { ensureFontLoaded, MONACO_DEFAULT_FONT } from './FontManager.js';
import { attachLanguageToolToMonaco, attachLanguageToolToPrism, isLanguageToolPluginAvailable } from './LanguageToolClient.js';
const ALWAYS_EXCLUDED_ANCESTOR_SELECTOR = '#etle--drawer, #etle--panel, .etle--settingsDialog, .etle--inlineEditorHost, .prism-code-editor, .monaco-editor, .CodeMirror, .ace_editor';
const BARE_ID_PATTERN = /^[A-Za-z_][A-Za-z0-9_-]*$/;
export const getTextFieldKey = (textarea) => {
    if (textarea.id)
        return `id:${textarea.id}`;
    const parts = [];
    let element = textarea;
    while (element) {
        if (element.id) {
            parts.unshift(`[id=${JSON.stringify(element.id)}]`);
            break;
        }
        const siblings = Array.from(element.parentElement?.children ?? []).filter(item => item.tagName === element.tagName && !item.classList.contains('etle--inlineEditorHost') && !item.classList.contains('etle--settingsDialog'));
        const index = siblings.indexOf(element) + 1;
        parts.unshift(`${element.tagName.toLowerCase()}:nth-of-type(${Math.max(1, index)})`);
        element = element.parentElement;
    }
    return `path:${parts.join('>')}`;
};
export const getTextFieldLabel = (textarea) => (textarea.getAttribute?.('aria-label') || textarea.labels?.[0]?.textContent?.trim() || textarea.placeholder || textarea.id || textarea.name || 'Unnamed textbox').trim().slice(0, 100);
export const parseExceptionList = (raw) => String(raw ?? '')
    .split(/[\r\n,]+/)
    .map(entry => entry.trim())
    .filter(Boolean);
export const isAlwaysExcludedTextArea = (textarea) => {
    if (textarea.dataset?.etleInternal === '1')
        return true;
    return !!textarea.closest?.(ALWAYS_EXCLUDED_ANCESTOR_SELECTOR);
};
export const matchesException = (textarea, entry) => {
    if (!entry)
        return false;
    if (BARE_ID_PATTERN.test(entry)) {
        return textarea.id === entry || textarea.name === entry;
    }
    try {
        return !!textarea.matches?.(entry) || !!textarea.closest?.(entry);
    }
    catch {
        return false;
    }
};
export const isTextAreaExcluded = (textarea, exceptions) => isAlwaysExcludedTextArea(textarea) || exceptions.some(entry => matchesException(textarea, entry));
export const guessInlineLanguage = (textarea) => {
    const id = `${textarea.id || ''} ${textarea.name || ''}`.toLowerCase();
    if (id.includes('css'))
        return 'css';
    if (id.includes('custom_include_body')
        || id.includes('custom_exclude_body')
        || id.includes('custom_include_headers')
        || id.includes('advanced_params_preview'))
        return 'yaml';
    if (id.includes('json') || (textarea.id?.startsWith('advanced_runtime_') && textarea.classList?.contains('monospace')))
        return 'json';
    return 'markdown';
};
const applySpellCheckAttributes = (textarea, enabled) => {
    if (!textarea)
        return;
    textarea.spellcheck = enabled;
    textarea.setAttribute?.('spellcheck', String(enabled));
    textarea.setAttribute?.('autocomplete', enabled ? 'on' : 'off');
    textarea.setAttribute?.('autocorrect', enabled ? 'on' : 'off');
};
const PRISM_TEXTAREA_INLINE_STYLE_GUARD = [
    ['background', 'transparent'],
    ['border', '0'],
    ['border-radius', '0'],
    ['box-shadow', 'none'],
    ['color', 'transparent'],
    ['-webkit-text-fill-color', 'transparent'],
    ['caret-color', 'var(--editor__caret, var(--pce-cursor, currentColor))'],
    ['outline', '0'],
    ['margin', '0'],
    ['padding', '0 var(--_pse) 0 var(--padding-left)'],
    ['resize', 'none'],
    ['min-height', '0'],
    ['opacity', '1'],
    ['filter', 'none'],
    ['pointer-events', 'auto'],
];
const applyPrismTextareaStyleGuard = (textarea) => {
    if (typeof textarea.style?.setProperty !== 'function')
        return;
    for (const [prop, value] of PRISM_TEXTAREA_INLINE_STYLE_GUARD) {
        textarea.style.setProperty(prop, value, 'important');
    }
};
const createPrismInlineEditor = (ctx, attachAutocomplete) => {
    let suppress = true;
    const editor = createEditor(ctx.host, {
        value: ctx.value,
        language: ctx.language,
        lineNumbers: ctx.lineNumbers,
        readOnly: ctx.readOnly,
        insertSpaces: ctx.indentMode.insertSpaces,
        tabSize: ctx.indentMode.tabSize,
        wordWrap: ctx.wordWrap,
        onUpdate: (nextValue) => {
            if (suppress)
                return;
            ctx.onChange(nextValue);
        },
    }, highlightBracketPairs(), matchBrackets(true), indentGuides(), defaultCommands());
    suppress = false;
    applyPrismTextareaStyleGuard(editor.textarea);
    applySpellCheckAttributes(editor.textarea, ctx.spellCheck);
    const languageTool = attachLanguageToolToPrism(editor, ctx.anchorHost ?? ctx.host);
    languageTool.setEnabled(Boolean(ctx.languageTool));
    if (ctx.textarea.dataset?.macros !== undefined && editor.textarea.dataset) {
        editor.textarea.dataset.macros = ctx.textarea.dataset.macros;
    }
    const detachAutocomplete = attachAutocomplete?.(editor.textarea, ctx.textarea);
    const handleBlur = () => ctx.onBlur();
    editor.textarea.addEventListener('blur', handleBlur);
    return {
        getValue: () => editor.value,
        setValue: (value) => {
            if (editor.value === value)
                return;
            suppress = true;
            try {
                editor.setOptions({ value });
            }
            catch {
                editor.setOptions({ language: 'text', value });
            }
            finally {
                suppress = false;
            }
            languageTool.notifyValueChanged();
        },
        setReadOnly: (readOnly) => editor.setOptions({ readOnly }),
        setWordWrap: (enabled) => editor.setOptions({ wordWrap: enabled }),
        setLineNumbers: (enabled) => editor.setOptions({ lineNumbers: enabled }),
        setLanguage: (language) => editor.setOptions({ language }),
        setIndentMode: (mode) => editor.setOptions({
            insertSpaces: mode.insertSpaces,
            tabSize: mode.tabSize,
        }),
        setSpellCheck: (enabled) => applySpellCheckAttributes(editor.textarea, enabled),
        setLanguageTool: (enabled) => languageTool.setEnabled(enabled),
        setMinimap: () => { },
        focus: () => editor.textarea.focus(),
        layout: () => editor.update?.(),
        dispose: () => {
            languageTool.dispose();
            if (typeof detachAutocomplete === 'function')
                detachAutocomplete();
            editor.textarea.removeEventListener('blur', handleBlur);
            editor.container?.remove();
        },
    };
};
const createMonacoInlineEditor = async (ctx, loadMonaco) => {
    const monaco = await loadMonaco();
    const container = document.createElement('div');
    container.classList.add('etle--monacoEditor');
    ctx.host.append(container);
    const languageId = ctx.language === 'text' ? 'plaintext' : ctx.language;
    const model = monaco.editor.createModel(ctx.value, languageId);
    let suppress = false;
    const editor = monaco.editor.create(container, {
        model,
        readOnly: ctx.readOnly,
        automaticLayout: true,
        minimap: { enabled: ctx.monacoMinimap },
        lineNumbers: ctx.lineNumbers ? 'on' : 'off',
        scrollBeyondLastLine: false,
        wordWrap: ctx.wordWrap ? 'on' : 'off',
        ...(ctx.fontFamily ? { fontFamily: ctx.fontFamily } : {}),
        theme: 'vs-dark',
    });
    const changeDisp = editor.onDidChangeModelContent(() => {
        if (suppress)
            return;
        ctx.onChange(model.getValue());
    });
    const blurDisp = editor.onDidBlurEditorText(() => ctx.onBlur());
    const languageTool = attachLanguageToolToMonaco(monaco, editor, ctx.anchorHost ?? ctx.host);
    languageTool.setEnabled(Boolean(ctx.languageTool));
    return {
        getValue: () => model.getValue(),
        setValue: (value) => {
            if (model.getValue() === value)
                return;
            suppress = true;
            try {
                model.setValue(value);
            }
            finally {
                suppress = false;
            }
            languageTool.notifyValueChanged();
        },
        setReadOnly: (readOnly) => editor.updateOptions({ readOnly }),
        setWordWrap: (enabled) => editor.updateOptions({ wordWrap: enabled ? 'on' : 'off' }),
        setLineNumbers: (enabled) => editor.updateOptions({ lineNumbers: enabled ? 'on' : 'off' }),
        setLanguage: (language) => monaco.editor.setModelLanguage(model, language === 'text' ? 'plaintext' : language),
        setFontFamily: (family) => editor.updateOptions({ fontFamily: family || MONACO_DEFAULT_FONT }),
        setIndentMode: (mode) => model.updateOptions({
            insertSpaces: mode.insertSpaces,
            tabSize: mode.tabSize,
        }),
        setSpellCheck: (enabled) => {
            container.querySelectorAll('textarea, .inputarea')
                .forEach(ta => applySpellCheckAttributes(ta, enabled));
        },
        setLanguageTool: (enabled) => languageTool.setEnabled(enabled),
        setMinimap: (enabled) => editor.updateOptions({ minimap: { enabled } }),
        focus: () => editor.focus(),
        layout: () => editor.layout(),
        dispose: () => {
            languageTool.dispose();
            changeDisp?.dispose?.();
            blurDisp?.dispose?.();
            editor.dispose();
            model.dispose();
            container.remove();
        },
    };
};
export class TextFieldReplacer {
    options;
    enabled = false;
    exceptions = parseExceptionList(DEFAULT_TEXTFIELD_EXCEPTIONS);
    managed = new Map();
    hostToEntry = new Map();
    mutationObserver = null;
    intersectionObserver = null;
    resizeObserver = null;
    scanScheduled = false;
    useClock = 0;
    fieldConfigs;
    listeners = new Set();
    constructor(options) {
        this.options = options;
        this.fieldConfigs = { ...options.initialFieldConfigs };
    }
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    notify() {
        this.listeners.forEach(listener => listener());
    }
    getConfig(key) {
        return Object.hasOwn(this.fieldConfigs, key) ? this.fieldConfigs[key] : {};
    }
    resolveOptions(key, textarea) {
        const config = this.getConfig(key);
        const fontId = config.fontId ?? this.options.getFontId?.() ?? '';
        const fontFamily = config.fontId !== undefined
            ? this.options.getFonts?.().find(font => font.id === fontId)?.family ?? ''
            : this.options.getFontFamily?.() ?? '';
        return {
            engine: EDITOR_ENGINES.find(engine => engine.id === config.engine) ?? this.options.getEngine(),
            language: config.language ?? (textarea ? guessInlineLanguage(textarea) : 'markdown'),
            wordWrap: config.wordWrap ?? this.options.getWordWrap(),
            lineNumbers: config.lineNumbers ?? this.options.getLineNumbers?.() ?? true,
            fontId, fontFamily,
            indentMode: INDENT_MODES.find(mode => mode.id === config.indentMode) ?? this.options.getIndentMode(),
            spellCheck: config.spellCheck ?? this.options.getSpellCheck(),
            languageTool: config.languageTool ?? false,
            minimap: config.minimap ?? this.options.getMonacoMinimap(),
        };
    }
    async loadFieldFont(key) {
        const fontId = this.getConfig(key).fontId ?? this.options.getFontId?.() ?? '';
        const font = this.options.getFonts?.().find(item => item.id === fontId);
        if (!font?.url)
            return;
        try {
            await ensureFontLoaded(font);
        }
        catch (error) {
            console.warn(`[${NAME}] Failed to load textbox font`, error);
        }
    }
    listFields() {
        const fields = new Map();
        this.getRoot()?.querySelectorAll('textarea').forEach(textarea => {
            if (!isAlwaysExcludedTextArea(textarea))
                fields.set(getTextFieldKey(textarea), textarea);
        });
        return [...new Set([...fields.keys(), ...Object.keys(this.fieldConfigs)])].map(key => {
            const textarea = fields.get(key);
            const config = { ...this.getConfig(key) };
            const state = !textarea ? 'Not on this page'
                : config.enabled === false ? 'Disabled for this textbox'
                    : isTextAreaExcluded(textarea, this.exceptions) ? 'Excluded by list'
                        : !this.enabled ? 'Replacement off'
                            : this.managed.get(textarea)?.editor ? 'Replaced' : 'Native textbox';
            return { key, label: textarea ? getTextFieldLabel(textarea) : config.label || key,
                present: !!textarea, state, config, effective: this.resolveOptions(key, textarea) };
        }).sort((a, b) => a.label.localeCompare(b.label) || a.key.localeCompare(b.key));
    }
    async setFieldConfig(key, patch) {
        const field = this.listFields().find(item => item.key === key);
        if (!field)
            return;
        const next = { ...this.fieldConfigs };
        if (patch === null)
            delete next[key];
        else {
            const config = { ...field.config, ...patch, label: field.label };
            for (const property of Object.keys(config)) {
                if (config[property] === undefined)
                    delete config[property];
            }
            if (Object.keys(config).some(property => property !== 'label'))
                next[key] = config;
            else
                delete next[key];
        }
        this.fieldConfigs = next;
        this.options.onFieldConfigsChange?.(next);
        if (patch?.fontId !== undefined && this.getConfig(key).enabled !== false)
            await this.loadFieldFont(key);
        await this.scan();
        await this.updateOptions();
        this.notify();
    }
    isExcluded(textarea) {
        return isTextAreaExcluded(textarea, this.exceptions) || this.getConfig(getTextFieldKey(textarea)).enabled === false;
    }
    getRoot() {
        return this.options.root ?? (typeof document !== 'undefined' ? document.body : null);
    }
    isEnabled() {
        return this.enabled;
    }
    getManagedCount() {
        return this.managed.size;
    }
    async setEnabled(enabled) {
        if (this.enabled === enabled)
            return;
        this.enabled = enabled;
        if (!enabled) {
            this.stopObservers();
            for (const textarea of [...this.managed.keys()]) {
                this.detach(textarea);
            }
            this.notify();
            return;
        }
        this.startObservers();
        await this.scan();
    }
    async setExceptions(raw) {
        this.exceptions = parseExceptionList(raw);
        if (!this.enabled) {
            this.notify();
            return;
        }
        for (const textarea of [...this.managed.keys()]) {
            if (this.isExcluded(textarea)) {
                this.detach(textarea);
            }
        }
        await this.scan();
    }
    async setEngine(_engine) {
        await this.updateOptions();
    }
    async updateOptions() {
        const mounts = [];
        for (const entry of this.managed.values()) {
            const { engine } = this.resolveOptions(getTextFieldKey(entry.textarea), entry.textarea);
            if (entry.requestedEngineId && entry.requestedEngineId !== engine.id && (entry.editor || entry.mounting)) {
                mounts.push(this.mountEditor(entry));
                continue;
            }
            this.applyEntryOptions(entry);
        }
        await Promise.all(mounts);
        this.notify();
    }
    applyEntryOptions(entry) {
        const { language, wordWrap, lineNumbers, fontFamily, indentMode, spellCheck, languageTool, minimap } = this.resolveOptions(getTextFieldKey(entry.textarea), entry.textarea);
        if (fontFamily)
            entry.host.style.setProperty?.('--etle-editor-font', fontFamily);
        else
            entry.host.style.removeProperty?.('--etle-editor-font');
        this.renderStatusBar(entry);
        if (!entry.editor)
            return;
        entry.editor.setLanguage?.(language);
        entry.editor.setWordWrap(wordWrap);
        entry.editor.setLineNumbers?.(lineNumbers);
        entry.editor.setFontFamily?.(fontFamily);
        entry.editor.setIndentMode(indentMode);
        entry.editor.setSpellCheck(spellCheck);
        entry.editor.setLanguageTool?.(languageTool);
        entry.editor.setMinimap(minimap);
    }
    reloadAll() {
        for (const entry of this.managed.values()) {
            if (!entry.textarea.isConnected) {
                this.detach(entry.textarea);
                continue;
            }
            this.syncEditorFromTextarea(entry);
            this.syncAttributesFromTextarea(entry);
        }
    }
    async scan() {
        if (!this.enabled)
            return;
        const root = this.getRoot();
        if (!root)
            return;
        for (const textarea of [...this.managed.keys()]) {
            if (!textarea.isConnected || this.isExcluded(textarea)) {
                this.detach(textarea);
            }
        }
        const textareas = Array.from(root.querySelectorAll('textarea'));
        const mounts = [];
        for (const textarea of textareas) {
            if (this.managed.has(textarea))
                continue;
            if (this.isExcluded(textarea))
                continue;
            const mount = this.attach(textarea);
            if (mount)
                mounts.push(mount);
        }
        await Promise.all(mounts);
        this.notify();
    }
    destroy() {
        this.enabled = false;
        this.stopObservers();
        for (const textarea of [...this.managed.keys()]) {
            this.detach(textarea);
        }
    }
    startObservers() {
        const root = this.getRoot();
        if (!root)
            return;
        if (typeof IntersectionObserver !== 'undefined') {
            this.intersectionObserver = new IntersectionObserver((entries) => {
                for (const item of entries) {
                    const entry = this.hostToEntry.get(item.target);
                    if (!entry)
                        continue;
                    entry.visible = item.isIntersecting;
                    if (item.isIntersecting && !entry.editor && !entry.mounting) {
                        this.mountEditor(entry).catch((error) => {
                            console.warn(`[${NAME}] Failed to mount inline editor`, error);
                        });
                    }
                }
            });
        }
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver((entries) => {
                for (const item of entries) {
                    const host = item.target;
                    const entry = this.hostToEntry.get(host);
                    if (!entry)
                        continue;
                    if (host.style.height) {
                        entry.textarea.style.height = host.style.height;
                    }
                    entry.editor?.layout?.();
                }
            });
        }
        if (typeof MutationObserver !== 'undefined' && root instanceof Node) {
            this.mutationObserver = new MutationObserver((mutations) => {
                let needsScan = false;
                for (const mutation of mutations) {
                    if (mutation.type === 'attributes' && mutation.target instanceof HTMLTextAreaElement) {
                        const entry = this.managed.get(mutation.target);
                        if (entry) {
                            this.syncEditorFromTextarea(entry);
                            this.syncAttributesFromTextarea(entry);
                        }
                        continue;
                    }
                    if (mutation.type === 'childList') {
                        if (mutation.target instanceof HTMLElement && mutation.target.closest?.(ALWAYS_EXCLUDED_ANCESTOR_SELECTOR)) {
                            continue;
                        }
                        for (const node of mutation.addedNodes) {
                            if (node instanceof HTMLTextAreaElement) {
                                needsScan = true;
                                break;
                            }
                            if (node instanceof HTMLElement && !node.closest?.(ALWAYS_EXCLUDED_ANCESTOR_SELECTOR) && node.querySelector?.('textarea')) {
                                needsScan = true;
                                break;
                            }
                        }
                        if (!needsScan && mutation.removedNodes.length) {
                            for (const textarea of this.managed.keys()) {
                                if (!textarea.isConnected) {
                                    needsScan = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (needsScan)
                    this.scheduleScan();
            });
            this.mutationObserver.observe(root, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['readonly', 'disabled', 'class', 'aria-invalid', 'title'],
            });
        }
    }
    stopObservers() {
        this.mutationObserver?.disconnect();
        this.mutationObserver = null;
        this.intersectionObserver?.disconnect();
        this.intersectionObserver = null;
        this.resizeObserver?.disconnect();
        this.resizeObserver = null;
        this.scanScheduled = false;
    }
    scheduleScan() {
        if (this.scanScheduled || !this.enabled)
            return;
        this.scanScheduled = true;
        const run = () => {
            this.scanScheduled = false;
            this.scan().catch((error) => console.warn(`[${NAME}] Inline textarea scan failed`, error));
        };
        if (typeof requestAnimationFrame === 'function')
            requestAnimationFrame(run);
        else
            setTimeout(run, 0);
    }
    getInitialHostHeight(textarea) {
        const inlineHeight = parseFloat(textarea.style?.height || '');
        if (Number.isFinite(inlineHeight) && inlineHeight >= 48)
            return Math.round(inlineHeight);
        try {
            const rect = textarea.getBoundingClientRect?.();
            if (rect && rect.height >= 48)
                return Math.round(rect.height);
        }
        catch { /* ignore */ }
        try {
            const computed = typeof getComputedStyle === 'function' ? parseFloat(getComputedStyle(textarea).height) : NaN;
            if (Number.isFinite(computed) && computed >= 48)
                return Math.round(computed);
        }
        catch { /* ignore */ }
        const rows = Number(textarea.rows) || 4;
        return Math.max(72, Math.min(420, rows * 22 + 16));
    }
    isElementVisible(element) {
        if (!this.intersectionObserver)
            return true;
        try {
            const rect = element.getBoundingClientRect?.();
            return !!rect && (rect.width > 0 || rect.height > 0);
        }
        catch {
            return true;
        }
    }
    attach(textarea) {
        const descriptor = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value');
        const nativeGet = descriptor?.get
            ? () => String(descriptor.get.call(textarea) ?? '')
            : () => String(textarea.value ?? '');
        const nativeSet = descriptor?.set
            ? (val) => { descriptor.set.call(textarea, val); }
            : (val) => { textarea.value = val; };
        const height = this.getInitialHostHeight(textarea);
        const host = document.createElement('div');
        host.classList.add('etle--inlineEditorHost');
        host.dataset.etleInternal = '1';
        host.style.height = `${height}px`;
        const content = document.createElement('div');
        content.classList.add('etle--inlineEditorContent');
        const statusBar = document.createElement('div');
        statusBar.classList.add('etle--inlineStatusBar');
        statusBar.setAttribute('role', 'toolbar');
        statusBar.setAttribute('aria-label', `${getTextFieldLabel(textarea)} editor settings`);
        host.append(content, statusBar);
        const initialFont = this.resolveOptions(getTextFieldKey(textarea), textarea).fontFamily;
        if (initialFont)
            host.style.setProperty?.('--etle-editor-font', initialFont);
        const visible = this.isElementVisible(host);
        const entry = {
            textarea,
            host,
            content,
            statusBar,
            editor: null,
            mountedEngineId: null,
            requestedEngineId: null,
            mounting: false,
            visible,
            lastUsedAt: 0,
            generation: 0,
            syncingFromEditor: false,
            syncingFromTextarea: false,
            dirtySinceFocus: false,
            nativeGet,
            nativeSet,
            onInput: () => {
                if (!entry.syncingFromEditor)
                    this.syncEditorFromTextarea(entry);
            },
            onChange: () => {
                if (!entry.syncingFromEditor)
                    this.syncEditorFromTextarea(entry);
            },
            onFocus: () => {
                entry.lastUsedAt = ++this.useClock;
                if (entry.editor) {
                    entry.editor.focus?.();
                }
                else if (!entry.mounting) {
                    this.mountEditor(entry).then(() => entry.editor?.focus?.()).catch((error) => {
                        console.warn(`[${NAME}] Failed to mount inline editor on focus`, error);
                    });
                }
            },
        };
        textarea.dataset.etleReplaced = '1';
        textarea.classList.add('etle--replacedSourceTextarea');
        textarea.insertAdjacentElement('afterend', host);
        this.syncAttributesFromTextarea(entry);
        this.resizeObserver?.observe(host);
        if (descriptor?.get && descriptor?.set) {
            Object.defineProperty(textarea, 'value', {
                configurable: true,
                enumerable: true,
                get: () => entry.nativeGet(),
                set: (next) => {
                    entry.nativeSet(next);
                    if (!entry.syncingFromEditor) {
                        this.syncEditorFromTextarea(entry);
                    }
                },
            });
        }
        textarea.addEventListener('input', entry.onInput);
        textarea.addEventListener('change', entry.onChange);
        textarea.addEventListener('focus', entry.onFocus);
        this.managed.set(textarea, entry);
        this.hostToEntry.set(host, entry);
        this.renderStatusBar(entry);
        if (visible) {
            this.intersectionObserver?.observe(host);
            return this.mountEditor(entry);
        }
        this.intersectionObserver?.observe(host);
        return null;
    }
    renderStatusBar(entry) {
        const key = getTextFieldKey(entry.textarea);
        const effective = this.resolveOptions(key, entry.textarea);
        const focusedSetting = entry.statusBar.contains?.(document.activeElement)
            ? document.activeElement?.dataset.inlineSetting : undefined;
        entry.statusBar.innerHTML = '';
        const change = (patch) => {
            this.setFieldConfig(key, patch).catch(error => console.error(`[${NAME}] Failed to update textbox settings`, error));
        };
        const select = (setting, label, options, value) => {
            const control = document.createElement('select');
            control.classList.add('etle--statusButton');
            control.dataset.inlineSetting = setting;
            control.setAttribute('aria-label', label);
            control.title = label;
            for (const item of options) {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.label;
                control.append(option);
            }
            control.value = value;
            control.addEventListener('change', () => change({ [setting]: control.value }));
            entry.statusBar.append(control);
        };
        const button = (label, title, action, setting, pressed, icon) => {
            const control = document.createElement('button');
            control.type = 'button';
            control.classList.add('etle--statusButton');
            if (icon) {
                control.classList.add('etle--statusIconButton');
                const glyph = document.createElement('span');
                glyph.classList.add('fa-solid', 'fa-fw', icon);
                glyph.setAttribute('aria-hidden', 'true');
                control.append(glyph);
            }
            else
                control.textContent = label;
            control.title = title;
            control.setAttribute('aria-label', title);
            control.dataset.inlineSetting = setting;
            if (pressed !== undefined) {
                control.setAttribute('aria-pressed', String(pressed));
                control.classList.toggle('etle--statusActive', pressed);
            }
            control.addEventListener('click', action);
            entry.statusBar.append(control);
            return control;
        };
        button('', 'Disable replacement for this textbox', () => change({ enabled: false }), 'disable', undefined, 'fa-xmark');
        button('', 'Open in ETLE', () => this.options.onOpenField?.(entry.textarea), 'open', undefined, 'fa-up-right-from-square');
        button('', 'All settings for this textbox', () => this.options.onOpenSettings?.(key), 'settings', undefined, 'fa-gear');
        const spacer = document.createElement('span');
        spacer.classList.add('etle--inlineStatusSpacer');
        entry.statusBar.append(spacer);
        button('', 'Word wrap for this textbox', () => change({ wordWrap: !effective.wordWrap }), 'wordWrap', effective.wordWrap, 'fa-align-left');
        button('', 'Line numbers for this textbox', () => change({ lineNumbers: !effective.lineNumbers }), 'lineNumbers', effective.lineNumbers, 'fa-list-ol');
        button('', 'Spell check for this textbox', () => change({ spellCheck: !effective.spellCheck }), 'spellCheck', effective.spellCheck, 'fa-spell-check');
        if (this.options.isLanguageToolAvailable ? this.options.isLanguageToolAvailable() : isLanguageToolPluginAvailable()) {
            button('', 'LanguageTool for this textbox', () => change({ languageTool: !effective.languageTool }), 'languageTool', effective.languageTool, 'fa-language');
        }
        if (effective.engine.id === 'monaco') {
            button('', 'Monaco minimap for this textbox', () => change({ minimap: !effective.minimap }), 'minimap', effective.minimap, 'fa-map');
        }
        select('language', 'Language for this textbox', LANGUAGES, effective.language);
        const nextEngine = EDITOR_ENGINES[(EDITOR_ENGINES.findIndex(engine => engine.id === effective.engine.id) + 1) % EDITOR_ENGINES.length];
        const engineButton = button(effective.engine.label, 'Cycle editor engine for this textbox', () => change({ engine: nextEngine.id }), 'engine');
        engineButton.classList.toggle('etle--statusActive', effective.engine.id !== 'prism');
        if (focusedSetting)
            entry.statusBar.querySelector(`[data-inline-setting="${focusedSetting}"]`)?.focus();
    }
    evictMonacoIfNeeded(target) {
        const cap = Math.max(1, this.options.maxMonacoInstances ?? 8);
        const mounted = [...this.managed.values()].filter(e => e !== target && e.editor && e.mountedEngineId === 'monaco');
        if (mounted.length < cap)
            return;
        mounted.sort((a, b) => {
            if (a.visible !== b.visible)
                return a.visible ? 1 : -1;
            return a.lastUsedAt - b.lastUsedAt;
        });
        const toEvict = mounted.length - cap + 1;
        for (let i = 0; i < toEvict; i++) {
            const victim = mounted[i];
            victim.generation++;
            victim.editor?.dispose();
            victim.editor = null;
            victim.mountedEngineId = null;
            victim.content.innerHTML = '';
            this.showNativeTextarea(victim);
        }
    }
    showNativeTextarea(entry) {
        this.intersectionObserver?.unobserve(entry.host);
        entry.textarea.classList.remove('etle--replacedSourceTextarea');
        entry.host.style.display = 'none';
    }
    async mountEditor(entry) {
        const generation = ++entry.generation;
        entry.mounting = true;
        entry.lastUsedAt = ++this.useClock;
        const previous = entry.editor;
        entry.editor = null;
        entry.mountedEngineId = null;
        previous?.dispose();
        entry.content.innerHTML = '';
        const mountHost = document.createElement('div');
        mountHost.classList.add('etle--inlineEditorMount');
        entry.content.append(mountHost);
        entry.host.style.display = '';
        entry.textarea.classList.add('etle--replacedSourceTextarea');
        this.intersectionObserver?.observe(entry.host);
        const effective = this.resolveOptions(getTextFieldKey(entry.textarea), entry.textarea);
        const engine = effective.engine;
        entry.requestedEngineId = engine.id;
        if (engine.id === 'monaco') {
            this.evictMonacoIfNeeded(entry);
        }
        const ctx = {
            host: mountHost,
            anchorHost: entry.content,
            textarea: entry.textarea,
            engine,
            language: effective.language,
            value: entry.nativeGet(),
            readOnly: !!(entry.textarea.readOnly || entry.textarea.disabled),
            wordWrap: effective.wordWrap,
            lineNumbers: effective.lineNumbers,
            fontFamily: effective.fontFamily,
            indentMode: effective.indentMode,
            spellCheck: effective.spellCheck,
            languageTool: effective.languageTool,
            monacoMinimap: effective.minimap,
            onChange: (nextValue) => {
                if (entry.generation !== generation || !this.managed.has(entry.textarea))
                    return;
                if (entry.syncingFromTextarea)
                    return;
                if (entry.nativeGet() === nextValue)
                    return;
                entry.lastUsedAt = ++this.useClock;
                entry.syncingFromEditor = true;
                try {
                    entry.nativeSet(nextValue);
                    entry.dirtySinceFocus = true;
                    entry.textarea.dispatchEvent(new Event('input', { bubbles: true }));
                }
                finally {
                    entry.syncingFromEditor = false;
                }
            },
            onBlur: () => {
                if (entry.generation !== generation || !this.managed.has(entry.textarea))
                    return;
                if (!entry.dirtySinceFocus)
                    return;
                entry.dirtySinceFocus = false;
                entry.syncingFromEditor = true;
                try {
                    entry.textarea.dispatchEvent(new Event('change', { bubbles: true }));
                }
                finally {
                    entry.syncingFromEditor = false;
                }
            },
        };
        try {
            await this.loadFieldFont(getTextFieldKey(entry.textarea));
            if (entry.generation !== generation || !this.managed.has(entry.textarea))
                return;
            let instance;
            if (this.options.createEditor) {
                instance = await this.options.createEditor(ctx);
            }
            else if (engine.id === 'monaco' && this.options.loadMonaco) {
                instance = await createMonacoInlineEditor(ctx, this.options.loadMonaco);
            }
            else {
                instance = createPrismInlineEditor(ctx, this.options.attachAutocomplete);
            }
            if (entry.generation !== generation || !this.managed.has(entry.textarea)) {
                instance.dispose();
                return;
            }
            entry.editor = instance;
            entry.mountedEngineId = engine.id;
            if (engine.id === 'monaco') {
                this.evictMonacoIfNeeded(entry);
            }
            this.syncEditorFromTextarea(entry);
            this.applyEntryOptions(entry);
        }
        catch (error) {
            if (entry.generation !== generation || !this.managed.has(entry.textarea))
                return;
            if (engine.id === 'monaco' && !this.options.createEditor) {
                console.warn(`[${NAME}] Inline Monaco failed; falling back to Prism`, error);
                try {
                    mountHost.innerHTML = '';
                    entry.editor = createPrismInlineEditor({ ...ctx, engine: { id: 'prism', label: 'Prism' } }, this.options.attachAutocomplete);
                    entry.mountedEngineId = 'prism';
                    this.syncEditorFromTextarea(entry);
                    this.applyEntryOptions(entry);
                }
                catch (fallbackError) {
                    console.warn(`[${NAME}] Failed to mount fallback inline editor`, fallbackError);
                }
            }
            else {
                console.warn(`[${NAME}] Failed to mount inline editor`, error);
            }
            if (!entry.editor)
                this.showNativeTextarea(entry);
        }
        finally {
            if (entry.generation === generation) {
                entry.mounting = false;
                this.notify();
            }
        }
    }
    syncEditorFromTextarea(entry) {
        if (!entry.editor)
            return;
        const nextValue = entry.nativeGet();
        const readOnly = !!(entry.textarea.readOnly || entry.textarea.disabled);
        entry.syncingFromTextarea = true;
        try {
            if (entry.editor.getValue() !== nextValue) {
                entry.editor.setValue(nextValue);
            }
            entry.editor.setReadOnly(readOnly);
        }
        finally {
            entry.syncingFromTextarea = false;
        }
    }
    syncAttributesFromTextarea(entry) {
        const invalid = entry.textarea.classList.contains('invalid') || entry.textarea.getAttribute?.('aria-invalid') === 'true';
        entry.host.classList.toggle('invalid', invalid);
        if (entry.textarea.getAttribute) {
            const ariaInvalid = entry.textarea.getAttribute('aria-invalid');
            if (ariaInvalid !== null)
                entry.host.setAttribute?.('aria-invalid', ariaInvalid);
            else
                entry.host.removeAttribute?.('aria-invalid');
        }
        entry.host.title = entry.textarea.title || '';
    }
    detach(textarea) {
        const entry = this.managed.get(textarea);
        if (!entry)
            return;
        entry.generation++;
        this.managed.delete(textarea);
        this.hostToEntry.delete(entry.host);
        this.intersectionObserver?.unobserve(entry.host);
        this.resizeObserver?.unobserve(entry.host);
        entry.editor?.dispose();
        entry.editor = null;
        entry.host.remove();
        textarea.removeEventListener('input', entry.onInput);
        textarea.removeEventListener('change', entry.onChange);
        textarea.removeEventListener('focus', entry.onFocus);
        if (Object.prototype.hasOwnProperty.call(textarea, 'value')) {
            delete textarea.value;
        }
        textarea.classList.remove('etle--replacedSourceTextarea');
        delete textarea.dataset.etleReplaced;
    }
}
const FIELD_ID_TO_SOURCE_PREFIX = {
    description_textarea: 'current-character-card:description',
    personality_textarea: 'current-character-card:personality',
    scenario_pole: 'current-character-card:scenario',
    firstmessage_textarea: 'current-character-card:first_mes',
    mes_example_textarea: 'current-character-card:mes_example',
    creator_notes_textarea: 'current-character-card:creator_notes',
    system_prompt_textarea: 'current-character-card:system_prompt',
    post_history_instructions_textarea: 'current-character-card:post_history_instructions',
    depth_prompt_prompt: 'current-character-card:depth_prompt_prompt',
    tags_textarea: 'current-character-card:tags',
    persona_description: 'power_user:persona_description',
    customCSS: 'power_user:custom_css',
    context_story_string: 'power_user.context:story_string',
    sysprompt_content: 'power_user.sysprompt:content',
    sysprompt_post_history: 'power_user.sysprompt:post_history',
    main_prompt_quick_edit_textarea: 'prompt:main',
    nsfw_prompt_quick_edit_textarea: 'prompt:nsfw',
    jailbreak_prompt_quick_edit_textarea: 'prompt:jailbreak',
    send_if_empty_textarea: 'oai_settings:send_if_empty',
    impersonation_prompt_textarea: 'oai_settings:impersonation_prompt',
    newchat_prompt_textarea: 'oai_settings:new_chat_prompt',
    newgroupchat_prompt_textarea: 'oai_settings:new_group_chat_prompt',
    newexamplechat_prompt_textarea: 'oai_settings:new_example_chat_prompt',
    continue_nudge_prompt_textarea: 'oai_settings:continue_nudge_prompt',
    group_nudge_prompt_textarea: 'oai_settings:group_nudge_prompt',
    wi_format_textarea: 'oai_settings:wi_format',
    description_format_textarea: 'oai_settings:description_format',
    custom_include_body: 'oai_settings:custom_include_body',
    custom_exclude_body: 'oai_settings:custom_exclude_body',
    custom_include_headers: 'oai_settings:custom_include_headers',
};
export const resolveSourceIdForField = (fieldId, sources, activeWorldName = '') => {
    const id = String(fieldId ?? '').trim();
    if (!id)
        return null;
    const mapped = FIELD_ID_TO_SOURCE_PREFIX[id];
    if (mapped) {
        const exact = sources.find(s => s.id === mapped || s.id.startsWith(`${mapped}@`));
        if (exact)
            return exact.id;
    }
    // World Info entry textareas use id="content_<uid>"
    const wiMatch = /^content_(.+)$/.exec(id);
    if (wiMatch) {
        const uid = wiMatch[1];
        if (activeWorldName) {
            const worldExact = sources.find(s => s.id === `world:${activeWorldName}:${uid}:content`);
            if (worldExact)
                return worldExact.id;
        }
        const anyWorld = sources.find(s => s.id.startsWith('world:') && s.id.endsWith(`:${uid}:content`));
        if (anyWorld)
            return anyWorld.id;
    }
    // CustomParameters runtime textareas use id="advanced_runtime_<paramId>"
    const cpMatch = /^advanced_runtime_(.+)$/.exec(id);
    if (cpMatch) {
        const paramId = cpMatch[1];
        const cpSource = sources.find(s => s.id.startsWith('custom-parameters:') && s.id.endsWith(`:${paramId}`));
        if (cpSource)
            return cpSource.id;
    }
    return null;
};
export const createDomFieldSource = (field) => {
    const id = field.id || field.name || 'field';
    const label = field.getAttribute?.('aria-label') || field.placeholder || id;
    return {
        id: `dom-field:${id}`,
        label,
        group: 'Active Field',
        groupOrder: -1,
        readonly: !!(field.readOnly || field.disabled),
        excludeFromHistory: true,
        read: () => String(field.value ?? ''),
        write: (value) => {
            if (field.value !== value) {
                field.value = value;
                field.dispatchEvent(new Event('input', { bubbles: true }));
                field.dispatchEvent(new Event('change', { bubbles: true }));
            }
        },
        save: () => { },
        meta: `DOM field #${id}`,
    };
};
//# sourceMappingURL=TextFieldReplacer.js.map