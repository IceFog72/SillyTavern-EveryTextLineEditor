import { EveryTextLineEditor } from './EveryTextLineEditor.js';
declare global {
    interface Window {
        EveryTextLineEditor?: EveryTextLineEditor;
    }
}
export declare function onActivate(): void;
export declare function onInstall(): Promise<void>;
export declare function onUpdate(): Promise<void>;
export declare function onDelete(): Promise<void>;
export declare function onEnable(): void;
export declare function onDisable(): void;
export declare function onClean(): Promise<void>;
