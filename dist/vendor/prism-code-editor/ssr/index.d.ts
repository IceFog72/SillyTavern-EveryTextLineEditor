import { EditorOptions } from '../index.js';
import { TokenStream } from '../prism/index.js';
import { rainbowBrackets } from './brackets.js';
export type RenderOptions = Omit<EditorOptions, "onUpdate" | "onTokenize" | "onSelectionChange"> & {
    /**
     * Callback that can be used to modify the tokens before they're stringified to HTML.
     * If you're using an extension that modifies the tokens on the client, you should pass
     * a function here that does the same modifications. If you don't, mounting the editor
     * becomes more expensive. If you're adding rainbow brackets you can pass the
     * {@link rainbowBrackets} function to this parameter.
     */
    tokenizeCallback?(tokens: TokenStream, language: string): void;
    /**
     * Array of functions that render overlays. These functions are called in order with
     * the render options for the editor. Any HTML returned is inserted inside the overlays
     * element of the editor.
     */
    overlays?: ((options: RenderOptions) => string | undefined)[];
};
/**
 * This function renders an editor as an HTML string. This is intended to the used with
 * server-side rendering (SSR) or static-site generation (SSG). The editor can the later
 * be made interactive on the client with the {@link mountEditorsUnder} function.
 *
 * @param options Options used for the editor. Any properties you define are stringified
 * to JSON, which will later be parsed by {@link mountEditorsUnder}. This is very useful
 * if you want to add extra configuration options used to customize how the editor is
 * mounted.
 */
declare const renderEditor: <T extends {} = {}>(options: RenderOptions & Omit<T, keyof RenderOptions>) => string;
export { renderEditor, rainbowBrackets };
export * from './code-block.js';
export * from './guides.js';
