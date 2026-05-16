import { BasicExtension } from '../../index.js';

export interface SearchWidget extends BasicExtension {
    /** The search widget's outer element. */
    readonly element: HTMLDivElement;
    /**
     * Hides the search widget and removes most event listeners.
     * @param focusTextarea Whether the editor's `textarea` should gain focus. Defaults to true.
     */
    close: (focusTextarea?: boolean) => void;
    /**
     * Opens the search widget.
     * @param focusInput Whether the widgets's search input should gain focus. Defaults to true.
     */
    open: (focusInput?: boolean) => void;
}
/**
 * Extension that adds a widget for search and replace functionality.
 * This extension needs styles from `prism-code-editor/search.css`.
 */
export declare const searchWidget: () => SearchWidget;
