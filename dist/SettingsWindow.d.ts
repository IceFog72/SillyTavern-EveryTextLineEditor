import { SettingsPanelHost } from './SettingsPanel.js';
import { TextFieldReplacer } from './TextFieldReplacer.js';
interface SettingsWindowHost extends SettingsPanelHost {
    textFieldReplacer: TextFieldReplacer;
}
export interface SettingsWindow {
    show(fieldKey?: string): void;
    destroy(): void;
}
export declare function createSettingsWindow(host: SettingsWindowHost): SettingsWindow;
export {};
