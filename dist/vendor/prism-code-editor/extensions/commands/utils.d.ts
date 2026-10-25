import { PrismEditor } from '../../index.js';
import { HotkeyMap, EditorHotkey, HotkeySequenceOptions, Hotkey } from './types.js';
/**
 * Normalizes modifier keys to a bitmask that's used by {@link getKeysFromEvent}.
 * All keys are case insensitive.
 *
 * Rules:
 * - `alt` → `1`
 * - `ctrl` or `control` → `2`
 * - `meta` or `cmd` → `4`
 * - `shift` → `8`
 * - `mod` → `4` on Mac, `2` otherwise
 *
 * @param key Key to normalize.
 * @returns Normalized and lowercase key.
 * @example
 * normalizeKey("a") // "0+a"
 * normalizeKey("+") // "0++"
 * normalizeKey("ctrl+alt+a") // "3+a"
 * normalizeKey("10+ALT+a") // "11+a"
 * normalizeKey("shift+alt+12+a") // "13+a"
 */
declare const normalizeKey: (key: string) => string;
/**
 * Gets a `Set` of keys that match a keyboard event.
 * @param e Keyboard event to get keys for.
 */
declare const getKeysFromEvent: (e: KeyboardEvent) => Set<string>;
/**
 * Utility that runs all commands whose key matches the keyboard event until a command
 * returns a truthy value. In that case `preventDefault` and `stopImmediatePropagation`
 * are called.
 *
 * @param e Keyboard event to run commands for.
 * @param map Record mapping keys to a list of commands for that key.
 * @param data Argument to pass to the commands.
 * @returns `true` if a command returned a truthy value.
 *
 * @example
 * addEventListener("keydown", e => {
 *   const handled = !!runHotkeys(e, map, data)
 * })
 */
declare const runHotkeys: <T>(e: KeyboardEvent, map: HotkeyMap<T>, data: T) => true | undefined;
/**
 * Registers a command for the specified key.
 *
 * @param editor Editor to add the command to.
 * @param key Key the command will run for.
 * @param command Command for the specified key.
 * @param precedence Positive integer denoting the precedence of the command where `0`
 * is the highest precedence. Defaults to `2`.
 * @returns Function to remove the hotkey.
 */
declare const addEditorHotkey: <T extends {}>(editor: PrismEditor<T>, key: string, command: EditorHotkey<T>, precedence?: number) => () => void;
/**
 * Registers a command for the specified key to the hotkey map.
 *
 * @param map Map to add the command to.
 * @param key Key the command will run for.
 * @param command Command for the specified key.
 * @param precedence Positive integer denoting the precedence of the command where `0`
 * is the highest precedence. Defaults to `2`.
 * @returns Function to remove the hotkey.
 */
declare const addHotkey: <T>(map: HotkeyMap<T>, key: string, command: Hotkey<T>, precedence?: number) => () => void;
/**
 * Registers a sequential hotkey to the specifed editor.
 *
 * @param editor Editor to add the sequence to.
 * @param sequence Sequence of keys to press for the command to be executed.
 * @param command Command to execute when the sequence is pressed.
 * @returns Function to remove the hotkey.
 */
declare const addEditorHotkeySequence: <T extends {}>(editor: PrismEditor<T>, sequence: string[], command: EditorHotkey<T>, options?: HotkeySequenceOptions) => () => void;
/**
 * Registers a sequential hotkey to the specifed hotkey map.
 *
 * @param map Map to add the sequence to.
 * @param sequence Sequence of keys to press for the command to be executed.
 * @param command Command to execute when the sequence is pressed.
 * @returns Function to remove the hotkey.
 */
declare const addHotkeySequence: <T>(map: HotkeyMap<T>, sequence: string[], command: Hotkey<T>, options?: HotkeySequenceOptions) => () => void;
/**
 * Returns whether the key pressed is Alt, Shift, Control, or Meta.
 * @param e Keyboard event to check.
 */
declare const isModifierKey: (e: KeyboardEvent) => boolean;
declare const mod: number;
export { normalizeKey, getKeysFromEvent, addEditorHotkey, addHotkey, addEditorHotkeySequence, addHotkeySequence, runHotkeys, isModifierKey, mod, };
