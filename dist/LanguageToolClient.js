import { NAME } from './constants.js';
const API_BASE = '/api/plugins/languagetool';
const MAX_CHECK_LENGTH = 20000;
const SERVICE_RETRY_MS = 5000;
const ERROR_TOAST_INTERVAL_MS = 30000;
const DEFAULT_CHECK_DELAY_MS = 700;
const PROTECTED_PATTERN = /\{\{[^\n]*?\}\}|<\/?[a-z][^>\n]*>|https?:\/\/[^\s<>"']+|`[^`\n]+`/gi;
const WORD_CHAR = /[\p{L}\p{N}_'’-]/u;
const MIRROR_PROPERTIES = [
    'fontFamily', 'fontSize', 'fontWeight', 'fontStyle', 'lineHeight', 'letterSpacing', 'wordSpacing',
    'textTransform', 'textIndent', 'textAlign', 'direction', 'tabSize', 'wordBreak',
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth',
];
let serviceAvailable;
let serviceCheckedAt = 0;
let serviceStatusPromise;
let lastErrorToast = 0;
const activeAttachments = new Set();
const availabilityListeners = new Set();
let globalListenersBound = false;
export function isLanguageToolPluginAvailable() {
    return serviceAvailable === true;
}
export function subscribeLanguageToolAvailability(listener) {
    availabilityListeners.add(listener);
    return () => availabilityListeners.delete(listener);
}
function setServiceAvailable(next) {
    const prev = serviceAvailable === true;
    serviceAvailable = next;
    serviceCheckedAt = Date.now();
    if (prev !== next) {
        for (const listener of availabilityListeners) {
            try {
                listener(next);
            }
            catch { /* ignore */ }
        }
    }
}
export function probeLanguageToolPlugin(force = false, fetchImpl = globalThis.fetch.bind(globalThis)) {
    return checkServiceStatus(fetchImpl, force);
}
function readExternalConfig() {
    const ext = globalThis.SillyTavern?.getContext?.()?.extensionSettings?.languagetool;
    const languages = Array.isArray(ext?.languages) && ext.languages.length
        ? ext.languages.filter((item) => typeof item === 'string' && item.length > 0)
        : ['auto'];
    const checkDelay = typeof ext?.checkDelay === 'number' && Number.isFinite(ext.checkDelay)
        ? Math.max(100, Math.min(10000, ext.checkDelay))
        : DEFAULT_CHECK_DELAY_MS;
    const ignoreProtected = typeof ext?.ignoreProtected === 'boolean' ? ext.ignoreProtected : true;
    const ignoredWords = Array.isArray(ext?.ignoredWords)
        ? ext.ignoredWords.map((w) => String(w).trim().toLowerCase()).filter(Boolean)
        : [];
    const ignoredRules = Array.isArray(ext?.ignoredRules)
        ? ext.ignoredRules.map((r) => String(r).trim()).filter(Boolean)
        : [];
    return { languages: languages.length ? languages : ['auto'], checkDelay, ignoreProtected, ignoredWords, ignoredRules };
}
function isSpelling(match) {
    return match.rule?.issueType === 'misspelling';
}
function protectedRanges(text) {
    return [...text.matchAll(PROTECTED_PATTERN)].map(match => [match.index ?? 0, (match.index ?? 0) + match[0].length]);
}
export function filterLanguageToolMatches(text, matches, config) {
    const ignoredWords = new Set(config.ignoredWords);
    const ignoredRules = new Set(config.ignoredRules);
    const ranges = config.ignoreProtected ? protectedRanges(text) : [];
    return matches.filter(match => {
        if (!Number.isInteger(match?.offset) || !Number.isInteger(match?.length))
            return false;
        const end = match.offset + match.length;
        if (match.offset < 0 || match.length <= 0 || end > text.length)
            return false;
        if (ranges.some(([from, to]) => match.offset < to && end > from))
            return false;
        if (match.rule?.id && ignoredRules.has(match.rule.id))
            return false;
        if (isSpelling(match) && ignoredWords.has(text.slice(match.offset, end).toLowerCase()))
            return false;
        return true;
    });
}
export function rebaseLanguageToolMatches(matches, oldText, newText) {
    if (!matches.length || oldText === newText)
        return matches;
    let start = 0;
    const shortest = Math.min(oldText.length, newText.length);
    while (start < shortest && oldText[start] === newText[start])
        start++;
    let oldEnd = oldText.length;
    let newEnd = newText.length;
    while (oldEnd > start && newEnd > start && oldText[oldEnd - 1] === newText[newEnd - 1]) {
        oldEnd--;
        newEnd--;
    }
    const delta = newEnd - oldEnd;
    const inserted = newText.slice(start, newEnd);
    const extendsAfter = WORD_CHAR.test(inserted.charAt(0));
    const extendsBefore = WORD_CHAR.test(inserted.charAt(inserted.length - 1));
    const result = [];
    for (const match of matches) {
        const end = match.offset + match.length;
        if (end < start || (end === start && !extendsAfter))
            result.push(match);
        else if (match.offset > oldEnd || (match.offset === oldEnd && !extendsBefore)) {
            result.push({ ...match, offset: match.offset + delta });
        }
    }
    return result;
}
function splitTextForCheck(text) {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        let end = Math.min(start + MAX_CHECK_LENGTH, text.length);
        if (end < text.length) {
            const newline = text.lastIndexOf('\n', end);
            const space = text.lastIndexOf(' ', end);
            const boundary = Math.max(newline, space);
            if (boundary > start + Math.floor(MAX_CHECK_LENGTH * 0.5))
                end = boundary + 1;
        }
        chunks.push({ text: text.slice(start, end), start });
        start = end;
    }
    return chunks;
}
function reportError(error) {
    console.warn(`[${NAME}] LanguageTool:`, error);
    const now = Date.now();
    if (now - lastErrorToast < ERROR_TOAST_INTERVAL_MS)
        return;
    lastErrorToast = now;
    globalThis.toastr?.warning?.(String(error?.message ?? error), 'LanguageTool');
}
async function checkServiceStatus(fetchImpl, force = false) {
    if (serviceStatusPromise)
        return serviceStatusPromise;
    if (!force && serviceAvailable === false && Date.now() - serviceCheckedAt < SERVICE_RETRY_MS)
        return false;
    serviceStatusPromise = (async () => {
        try {
            const response = await fetchImpl(`${API_BASE}/status?t=${Date.now()}`, { cache: 'no-store' });
            const info = await response.json().catch(() => null);
            setServiceAvailable(response.ok && info?.ok === true);
        }
        catch {
            setServiceAvailable(false);
        }
        return Boolean(serviceAvailable);
    })().finally(() => { serviceStatusPromise = undefined; });
    return serviceStatusPromise;
}
async function checkGrammar(text, languages, signal, getHeaders, fetchImpl) {
    const headers = { ...getHeaders(), 'Content-Type': 'application/json' };
    let response;
    try {
        response = await fetchImpl(`${API_BASE}/check`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ text, languages }),
            signal,
        });
    }
    catch (error) {
        if (error?.name === 'AbortError')
            throw error;
        setServiceAvailable(false);
        throw new Error('Could not reach the LanguageTool server plugin.');
    }
    if (response.status === 404) {
        setServiceAvailable(false);
    }
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.error || `LanguageTool request failed (${response.status})`);
    }
    return response.json();
}
function replacementLabel(value) {
    if (value === '')
        return '(delete)';
    return value.trim() === '' ? '␣' : value;
}
function ensureGlobalListeners() {
    if (globalListenersBound || typeof document === 'undefined' || typeof window === 'undefined')
        return;
    globalListenersBound = true;
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            for (const controller of activeAttachments)
                controller.closePanel();
        }
    });
    document.addEventListener('pointerdown', (event) => {
        const target = event.target;
        if (target?.closest?.('.etle--ltPanel, .etle--ltBadge'))
            return;
        for (const controller of activeAttachments) {
            if (controller.isPanelOpen() && !controller.containsTarget(target)) {
                controller.closePanel();
            }
        }
    });
    const reposition = () => {
        for (const controller of activeAttachments) {
            if (controller.isPanelOpen())
                controller.positionPanel();
        }
    };
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, { capture: true, passive: true });
}
class LanguageToolController {
    adapter;
    getHeaders;
    fetchImpl;
    enabled = false;
    disposed = false;
    timer = null;
    requestId = 0;
    abort = null;
    text = '';
    matches = [];
    selectedMatch = null;
    panelVisible = false;
    checking = false;
    badge = null;
    panel = null;
    unsubs = [];
    constructor(adapter, options = {}) {
        this.adapter = adapter;
        this.getHeaders = options.getRequestHeaders
            ?? (() => globalThis.SillyTavern?.getContext?.()?.getRequestHeaders?.() ?? {});
        this.fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis);
        ensureGlobalListeners();
        activeAttachments.add(this);
        this.unsubs.push(adapter.onChange(() => this.handleValueChange()));
        this.unsubs.push(adapter.onCaretClick((offset) => this.handleCaretClick(offset)));
    }
    setEnabled(enabled) {
        if (this.disposed || this.enabled === enabled)
            return;
        this.enabled = enabled;
        if (!enabled) {
            this.clear();
            this.removeBadge();
            return;
        }
        this.ensureBadge();
        this.scheduleCheck(true);
    }
    notifyValueChanged() {
        if (this.disposed || !this.enabled)
            return;
        this.handleValueChange();
    }
    isPanelOpen() {
        return this.panelVisible;
    }
    containsTarget(target) {
        if (!target)
            return false;
        return this.adapter.getViewportElement().contains(target);
    }
    closePanel() {
        if (!this.panelVisible)
            return;
        this.panelVisible = false;
        this.panel?.classList.remove('visible');
        this.updateBadge();
    }
    dispose() {
        if (this.disposed)
            return;
        this.disposed = true;
        this.enabled = false;
        this.clear();
        this.removeBadge();
        for (const unsub of this.unsubs)
            unsub();
        this.unsubs = [];
        this.adapter.dispose?.();
        activeAttachments.delete(this);
    }
    ensureBadge() {
        if (this.badge)
            return;
        const host = this.adapter.getAnchorHost();
        if (!host)
            return;
        if (typeof getComputedStyle === 'function' && getComputedStyle(host).position === 'static') {
            host.style.position = 'relative';
        }
        const badge = document.createElement('button');
        badge.type = 'button';
        badge.className = 'etle--ltBadge';
        badge.innerHTML = '<i class="fa-solid fa-language"></i><span></span>';
        badge.addEventListener('click', (event) => {
            event.stopPropagation();
            if (!this.matches.length) {
                this.scheduleCheck(true);
                return;
            }
            if (this.panelVisible && this.selectedMatch === null)
                this.closePanel();
            else
                this.openPanel(null);
        });
        host.append(badge);
        this.badge = badge;
        this.updateBadge();
    }
    removeBadge() {
        this.badge?.remove();
        this.badge = null;
    }
    updateBadge() {
        if (!this.badge)
            return;
        const count = this.matches.length;
        this.badge.hidden = !this.enabled;
        this.badge.classList.toggle('loading', this.checking);
        this.badge.classList.toggle('has_errors', count > 0);
        this.badge.classList.toggle('active', count > 0 && this.panelVisible);
        const icon = this.badge.querySelector('i');
        if (icon)
            icon.className = this.checking ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-language';
        const span = this.badge.querySelector('span');
        if (span)
            span.textContent = count ? String(count) : '';
        this.badge.title = this.checking
            ? 'Checking with LanguageTool…'
            : serviceAvailable === false
                ? 'LanguageTool server plugin unavailable (click to retry)'
                : count
                    ? `${count} LanguageTool issue${count === 1 ? '' : 's'}`
                    : 'No LanguageTool issues';
    }
    clear() {
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.requestId++;
        this.abort?.abort();
        this.abort = null;
        this.checking = false;
        this.matches = [];
        this.text = '';
        this.selectedMatch = null;
        this.panelVisible = false;
        this.panel?.remove();
        this.panel = null;
        this.adapter.renderMatches('', [], null);
        this.updateBadge();
    }
    handleValueChange() {
        if (!this.enabled || this.disposed)
            return;
        const nextText = this.adapter.getValue();
        if (nextText === this.text && this.matches.length)
            return;
        this.scheduleCheck(false);
    }
    scheduleCheck(immediate) {
        if (this.timer !== null) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.requestId++;
        this.abort?.abort();
        this.abort = null;
        const nextText = this.adapter.getValue();
        if (!this.enabled || !nextText.trim()) {
            this.matches = [];
            this.text = nextText;
            this.selectedMatch = null;
            this.closePanel();
            this.panel?.remove();
            this.panel = null;
            this.adapter.renderMatches(nextText, [], null);
            this.updateBadge();
            return;
        }
        if (this.matches.length && this.text !== nextText) {
            this.matches = rebaseLanguageToolMatches(this.matches, this.text, nextText);
            this.text = nextText;
            if (this.selectedMatch !== null)
                this.panelVisible = false;
            this.selectedMatch = null;
            this.adapter.renderMatches(nextText, this.matches, null);
            this.renderPanel();
            this.updateBadge();
        }
        const config = readExternalConfig();
        const delay = immediate ? 0 : config.checkDelay;
        this.timer = setTimeout(() => {
            this.timer = null;
            this.runCheck(immediate).catch(() => { });
        }, delay);
    }
    async runCheck(forceStatus) {
        const requestId = ++this.requestId;
        this.checking = true;
        this.updateBadge();
        const controller = new AbortController();
        this.abort = controller;
        try {
            if (serviceAvailable !== true && !(await checkServiceStatus(this.fetchImpl, forceStatus))) {
                if (forceStatus)
                    reportError(new Error('LanguageTool server plugin is unavailable.'));
                return;
            }
            if (this.disposed || !this.enabled || requestId !== this.requestId)
                return;
            const text = this.adapter.getValue();
            if (!text.trim()) {
                this.matches = [];
                this.text = text;
                this.adapter.renderMatches(text, [], null);
                return;
            }
            const config = readExternalConfig();
            const rawMatches = [];
            for (const chunk of splitTextForCheck(text)) {
                const result = await checkGrammar(chunk.text, config.languages, controller.signal, this.getHeaders, this.fetchImpl);
                for (const match of Array.isArray(result?.matches) ? result.matches : []) {
                    rawMatches.push({ ...match, offset: match.offset + chunk.start });
                }
                if (this.disposed || !this.enabled || requestId !== this.requestId)
                    return;
            }
            if (this.disposed || !this.enabled || requestId !== this.requestId || this.adapter.getValue() !== text)
                return;
            this.text = text;
            this.matches = filterLanguageToolMatches(text, rawMatches, config);
            this.selectedMatch = null;
            this.adapter.renderMatches(text, this.matches, null);
            this.renderPanel();
        }
        catch (error) {
            if (error?.name !== 'AbortError')
                reportError(error);
        }
        finally {
            if (this.abort === controller)
                this.abort = null;
            if (requestId === this.requestId) {
                this.checking = false;
                this.updateBadge();
            }
        }
    }
    handleCaretClick(offset) {
        if (!this.enabled || !this.matches.length || this.adapter.getValue() !== this.text)
            return;
        let index = this.matches.findIndex(m => offset > m.offset && offset < m.offset + m.length);
        if (index < 0)
            index = this.matches.findIndex(m => offset >= m.offset && offset <= m.offset + m.length);
        if (index >= 0) {
            this.openPanel(index);
        }
        else if (this.panelVisible && this.selectedMatch !== null) {
            this.closePanel();
        }
    }
    openPanel(matchIndex) {
        for (const other of activeAttachments) {
            if (other !== this && other.isPanelOpen())
                other.closePanel();
        }
        this.selectedMatch = matchIndex;
        this.panelVisible = true;
        this.renderPanel();
        this.updateBadge();
    }
    renderPanel() {
        this.panel?.remove();
        this.panel = null;
        if (!this.matches.length || !this.panelVisible)
            return;
        if (this.selectedMatch !== null && !this.matches[this.selectedMatch])
            this.selectedMatch = null;
        const visible = this.selectedMatch !== null
            ? [[this.matches[this.selectedMatch], this.selectedMatch]]
            : this.matches.map((match, index) => [match, index]);
        const panel = document.createElement('section');
        panel.className = 'etle--ltPanel visible';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'LanguageTool issues');
        const header = document.createElement('header');
        header.className = 'etle--ltPanelHeader';
        const title = document.createElement('span');
        title.className = 'etle--ltPanelTitle';
        title.innerHTML = `<i class="fa-solid fa-language"></i> ${visible.length} issue${visible.length === 1 ? '' : 's'}`;
        const actions = document.createElement('span');
        actions.className = 'etle--ltPanelActions';
        if (this.selectedMatch !== null) {
            const allBtn = document.createElement('button');
            allBtn.type = 'button';
            allBtn.className = 'etle--ltPanelAll';
            allBtn.textContent = 'All';
            allBtn.addEventListener('click', () => {
                this.selectedMatch = null;
                this.renderPanel();
            });
            actions.append(allBtn);
        }
        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'etle--ltPanelClose';
        closeBtn.title = 'Close (Esc)';
        closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        closeBtn.addEventListener('click', () => this.closePanel());
        actions.append(closeBtn);
        header.append(title, actions);
        const list = document.createElement('div');
        list.className = 'etle--ltMatchList';
        for (const [match, index] of visible) {
            const item = document.createElement('article');
            item.className = `etle--ltMatchItem ${isSpelling(match) ? 'spelling' : 'grammar'}`;
            const heading = document.createElement('div');
            heading.className = 'etle--ltMatchHeader';
            const original = this.text.slice(match.offset, match.offset + match.length);
            const code = document.createElement('code');
            code.textContent = original || ' ';
            const msg = document.createElement('span');
            msg.textContent = match.shortMessage || match.message || 'Possible issue';
            heading.append(code, msg);
            item.append(heading);
            if (!isSpelling(match) && match.shortMessage && match.message && match.message !== match.shortMessage) {
                const detail = document.createElement('div');
                detail.className = 'etle--ltMatchDetail';
                detail.textContent = match.message;
                item.append(detail);
            }
            const replacements = document.createElement('div');
            replacements.className = 'etle--ltReplacements';
            const suggestions = (match.replacements ?? []).slice(0, 5);
            for (const replacement of suggestions) {
                const value = String(replacement.value ?? '');
                const chip = document.createElement('button');
                chip.type = 'button';
                chip.className = 'etle--ltChip';
                chip.textContent = replacementLabel(value);
                chip.addEventListener('click', () => {
                    if (this.adapter.getValue() !== this.text)
                        return;
                    this.adapter.applyReplacement(match.offset, match.length, value);
                    this.closePanel();
                    this.scheduleCheck(false);
                });
                replacements.append(chip);
            }
            if (!suggestions.length) {
                const none = document.createElement('span');
                none.textContent = 'No automatic replacement';
                replacements.append(none);
            }
            item.append(replacements);
            item.addEventListener('mouseenter', () => this.adapter.renderMatches(this.text, this.matches, index));
            item.addEventListener('mouseleave', () => this.adapter.renderMatches(this.text, this.matches, null));
            list.append(item);
        }
        panel.append(header, list);
        document.body.append(panel);
        this.panel = panel;
        this.positionPanel();
    }
    positionPanel() {
        if (!this.panel || !this.panelVisible)
            return;
        const viewport = this.adapter.getViewportElement();
        if (!viewport?.isConnected)
            return;
        const viewportRect = viewport.getBoundingClientRect();
        let anchorRect = null;
        if (this.selectedMatch !== null && this.matches[this.selectedMatch]) {
            anchorRect = this.adapter.getMatchRect?.(this.selectedMatch, this.matches[this.selectedMatch]) ?? null;
        }
        if (!anchorRect || anchorRect.bottom < viewportRect.top || anchorRect.top > viewportRect.bottom) {
            anchorRect = this.badge?.isConnected ? this.badge.getBoundingClientRect() : viewportRect;
        }
        const pad = 8;
        const gap = 6;
        const panelWidth = Math.min(Math.max(viewport.clientWidth, 280), Math.max(180, window.innerWidth - pad * 2));
        const left = Math.max(pad, Math.min(anchorRect.left, window.innerWidth - panelWidth - pad));
        const below = window.innerHeight - anchorRect.bottom - pad - gap;
        const above = anchorRect.top - pad - gap;
        this.panel.style.width = `${panelWidth}px`;
        this.panel.style.maxHeight = 'none';
        const natural = this.panel.scrollHeight || 220;
        const cap = Math.min(natural, this.selectedMatch === null ? Math.min(360, window.innerHeight * 0.4) : Math.max(160, window.innerHeight - pad * 2));
        const placeAbove = below < cap && above > below;
        const avail = Math.max(120, placeAbove ? above : below);
        const height = Math.min(cap, avail);
        const top = placeAbove ? Math.max(pad, anchorRect.top - gap - height) : anchorRect.bottom + gap;
        this.panel.style.left = `${left}px`;
        this.panel.style.top = `${top}px`;
        this.panel.style.maxHeight = `${height}px`;
    }
}
export function attachLanguageToolToPrism(editor, anchorHost, options) {
    const textarea = editor.textarea;
    let overlay = null;
    let inner = null;
    let mirror = null;
    let lastText = '';
    let lastMatches = [];
    let lastActive = null;
    const ensureLayers = () => {
        if (overlay && inner && mirror)
            return true;
        const parent = textarea.parentElement;
        if (!parent)
            return false;
        overlay = document.createElement('div');
        overlay.className = 'etle--ltHighlights';
        overlay.setAttribute('aria-hidden', 'true');
        inner = document.createElement('div');
        inner.className = 'etle--ltHighlightsInner';
        overlay.append(inner);
        mirror = document.createElement('div');
        mirror.className = 'etle--ltMeasure';
        mirror.setAttribute('aria-hidden', 'true');
        parent.append(overlay, mirror);
        return true;
    };
    const drawHighlights = (text, matches, activeIndex) => {
        lastText = text;
        lastMatches = matches;
        lastActive = activeIndex;
        if (!matches.length) {
            inner?.replaceChildren();
            return;
        }
        if (!textarea.isConnected || !ensureLayers() || !overlay || !inner || !mirror)
            return;
        const style = getComputedStyle(textarea);
        for (const prop of MIRROR_PROPERTIES) {
            mirror.style[prop] = style[prop];
        }
        const borderLeft = parseFloat(style.borderLeftWidth) || 0;
        const borderTop = parseFloat(style.borderTopWidth) || 0;
        const borderX = borderLeft + (parseFloat(style.borderRightWidth) || 0);
        const borderY = borderTop + (parseFloat(style.borderBottomWidth) || 0);
        Object.assign(mirror.style, {
            boxSizing: 'border-box',
            borderStyle: 'solid',
            borderColor: 'transparent',
            whiteSpace: style.whiteSpace || 'pre-wrap',
            overflowWrap: style.overflowWrap || 'break-word',
            display: 'block',
            left: `${textarea.offsetLeft}px`,
            top: `${textarea.offsetTop}px`,
            width: `${textarea.clientWidth + borderX}px`,
            height: `${textarea.clientHeight + borderY}px`,
        });
        Object.assign(overlay.style, {
            left: `${textarea.offsetLeft + borderLeft}px`,
            top: `${textarea.offsetTop + borderTop}px`,
            width: `${textarea.clientWidth}px`,
            height: `${textarea.clientHeight}px`,
        });
        inner.replaceChildren();
        mirror.textContent = text;
        const textNode = mirror.firstChild;
        if (!textNode || textNode.nodeType !== Node.TEXT_NODE)
            return;
        const box = mirror.getBoundingClientRect();
        const scaleX = box.width && mirror.offsetWidth ? box.width / mirror.offsetWidth : 1;
        const scaleY = box.height && mirror.offsetHeight ? box.height / mirror.offsetHeight : 1;
        const range = document.createRange();
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < matches.length; i++) {
            const match = matches[i];
            if (match.offset + match.length > (textNode.textContent?.length ?? 0))
                continue;
            range.setStart(textNode, match.offset);
            range.setEnd(textNode, match.offset + match.length);
            for (const rect of range.getClientRects()) {
                if (!rect.width || !rect.height)
                    continue;
                const marker = document.createElement('span');
                marker.className = `${isSpelling(match) ? 'spelling' : 'grammar'}${activeIndex === i ? ' active' : ''}`;
                marker.dataset.matchIndex = String(i);
                marker.style.left = `${(rect.left - box.left) / scaleX - borderLeft}px`;
                marker.style.top = `${(rect.top - box.top) / scaleY - borderTop}px`;
                marker.style.width = `${rect.width / scaleX}px`;
                marker.style.height = `${rect.height / scaleY}px`;
                fragment.append(marker);
            }
        }
        inner.append(fragment);
    };
    const resizeObserver = typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            if (lastMatches.length)
                drawHighlights(lastText, lastMatches, lastActive);
        })
        : null;
    resizeObserver?.observe(textarea);
    if (editor.container !== textarea)
        resizeObserver?.observe(editor.container);
    const adapter = {
        getValue: () => textarea.value,
        applyReplacement: (offset, length, replacement) => {
            const end = offset + length;
            let applied = false;
            try {
                textarea.focus();
                textarea.setSelectionRange(offset, end);
                applied = document.execCommand('insertText', false, replacement);
            }
            catch { /* fallback below */ }
            if (!applied) {
                textarea.value = `${textarea.value.slice(0, offset)}${replacement}${textarea.value.slice(end)}`;
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
            }
        },
        renderMatches: drawHighlights,
        getAnchorHost: () => anchorHost,
        getViewportElement: () => editor.container,
        getMatchRect: (matchIndex) => {
            const marker = inner?.querySelector(`[data-match-index="${matchIndex}"]`);
            return marker ? marker.getBoundingClientRect() : null;
        },
        onChange: (listener) => {
            textarea.addEventListener('input', listener);
            textarea.addEventListener('change', listener);
            return () => {
                textarea.removeEventListener('input', listener);
                textarea.removeEventListener('change', listener);
            };
        },
        onCaretClick: (listener) => {
            const handler = () => {
                if (typeof textarea.selectionStart === 'number' && textarea.selectionStart === textarea.selectionEnd) {
                    listener(textarea.selectionStart);
                }
            };
            textarea.addEventListener('click', handler);
            return () => textarea.removeEventListener('click', handler);
        },
        dispose: () => {
            resizeObserver?.disconnect();
            overlay?.remove();
            mirror?.remove();
            overlay = null;
            inner = null;
            mirror = null;
        },
    };
    return new LanguageToolController(adapter, options);
}
export function attachLanguageToolToMonaco(monaco, editor, anchorHost, options) {
    const markerOwner = 'etle-languagetool';
    const adapter = {
        getValue: () => editor.getModel?.()?.getValue?.() ?? '',
        applyReplacement: (offset, length, replacement) => {
            const model = editor.getModel?.();
            if (!model)
                return;
            const start = model.getPositionAt(offset);
            const end = model.getPositionAt(offset + length);
            const range = new monaco.Range(start.lineNumber, start.column, end.lineNumber, end.column);
            editor.executeEdits(markerOwner, [{ range, text: replacement, forceMoveMarkers: true }]);
            editor.focus?.();
        },
        renderMatches: (_text, matches) => {
            const model = editor.getModel?.();
            if (!model || !monaco?.editor?.setModelMarkers)
                return;
            const markers = matches.map((match) => {
                const start = model.getPositionAt(match.offset);
                const end = model.getPositionAt(match.offset + match.length);
                return {
                    severity: isSpelling(match) ? monaco.MarkerSeverity.Error : monaco.MarkerSeverity.Warning,
                    message: match.message || match.shortMessage || 'Possible issue',
                    source: 'LanguageTool',
                    startLineNumber: start.lineNumber,
                    startColumn: start.column,
                    endLineNumber: end.lineNumber,
                    endColumn: end.column,
                };
            });
            monaco.editor.setModelMarkers(model, markerOwner, markers);
        },
        getAnchorHost: () => anchorHost,
        getViewportElement: () => editor.getDomNode?.() ?? anchorHost,
        getMatchRect: (_matchIndex, match) => {
            const model = editor.getModel?.();
            const domNode = editor.getDomNode?.();
            if (!model || !domNode || typeof editor.getScrolledVisiblePosition !== 'function')
                return null;
            const pos = model.getPositionAt(match.offset);
            const visible = editor.getScrolledVisiblePosition(pos);
            if (!visible)
                return null;
            const editorRect = domNode.getBoundingClientRect();
            const left = editorRect.left + visible.left;
            const top = editorRect.top + visible.top;
            return new DOMRect(left, top, 12, visible.height || 18);
        },
        onChange: (listener) => {
            const disp = editor.onDidChangeModelContent?.(() => listener());
            return () => disp?.dispose?.();
        },
        onCaretClick: (listener) => {
            const disp = editor.onMouseDown?.((event) => {
                const position = event?.target?.position;
                const model = editor.getModel?.();
                const selection = editor.getSelection?.();
                if (!position || !model)
                    return;
                if (selection && !selection.isEmpty())
                    return;
                listener(model.getOffsetAt(position));
            });
            return () => disp?.dispose?.();
        },
        dispose: () => {
            const model = editor.getModel?.();
            if (model && monaco?.editor?.setModelMarkers) {
                monaco.editor.setModelMarkers(model, markerOwner, []);
            }
        },
    };
    return new LanguageToolController(adapter, options);
}
//# sourceMappingURL=LanguageToolClient.js.map