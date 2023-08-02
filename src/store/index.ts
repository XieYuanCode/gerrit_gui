import { Store } from "tauri-plugin-store-api";

export const tauriStore = new Store(".settings.dat");

export { useUserStore } from "./userStore"
export { CloneTaskStatus, CloneTask, useCloneStore } from "./cloneStore"
export { useGeneralSettingStore } from "./generalSettingStore"
export { PrepareTask, PrepareTaskStatus, usePrepareTaskStore } from "./prepareTaskStore"
export { useViewModelStore } from "./viewModelStore"
export { useProjectStore } from "./projectStore"
export { Shortcut, useShortcutsStore } from "./shortcutStore"
export { useTerminalStore, LogLevel } from "./terminalStore"