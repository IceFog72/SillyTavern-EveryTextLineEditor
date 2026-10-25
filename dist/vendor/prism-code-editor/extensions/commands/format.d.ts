/**
 * Utility that formats a hotkey to display in a user interface. Modifier keys use symbols
 * on Mac and labels otherwise.
 *
 * @param hotkey Hotkey to format for display.
 * @param separator String to join the segments together with. Defaults to `" "` on Mac
 * and `"+"` otherwise.
 * @returns Formatted key for display.
 *
 * @example
 * // On Mac
 * formatHotkey("mod+s") // "⌘ S"
 * formatHotkey("12+escape") // "⇧ ⌘ Esc"
 * formatHotkey("arrowup") // "↑"
 *
 * // On Windows/Linux
 * formatHotkey("mod+s") // "Ctrl+S"
 * formatHotkey("12+escape") // "Shift+Win+Esc"
 * formatHotkey("arrowup") // "↑"
 */
declare const formatHotkey: (hotkey: string, separator?: string) => string;
/**
 * Array of keyboard shortcuts and descriptions for {@link defaultKeymap}. Useful for
 * documenting key bindings to users. It consists of tuples containing two string each
 * where the first string is the key binding and the second is the description.
 *
 * @example
 * for (const [key, description] of defaultKeymapLabels) {
 *   console.log(formatHotkey(key), description)
 * }
 */
declare const defaultKeymapLabels: [string, string][];
/**
 * Array of keyboard shortcuts and descriptions for the {@link autoComplete} extension.
 * Useful for documenting key bindings to users. It consists of tuples containing two
 * string each where the first string is the key binding and the second is the description.
 *
 * @example
 * for (const [key, description] of autoCompleteShortcutLabels) {
 *   console.log(formatHotkey(key), description)
 * }
 */
declare const autoCompleteShortcutLabels: [string, string][];
/**
 * Array of keyboard shortcuts and descriptions for the {@link searchWidget} extension.
 * Useful for documenting key bindings to users. It consists of tuples containing two
 * string each where the first string is the key binding and the second is the description.
 *
 * @example
 * for (const [key, description] of searchShortcutLabels) {
 *   console.log(formatHotkey(key), description)
 * }
 */
declare const searchShortcutLabels: [string, string][];
export { formatHotkey, defaultKeymapLabels, autoCompleteShortcutLabels, searchShortcutLabels };
