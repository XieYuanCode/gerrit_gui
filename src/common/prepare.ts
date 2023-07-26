import { invoke } from '@tauri-apps/api';
import { register, isRegistered } from '@tauri-apps/api/globalShortcut';

export const prepare = async () => {
  await registerGlobalShortcuts()
}

const registerGlobalShortcuts = async () => {
  await registerGlobalShortcutWithInvoke("CommandOrControl+,", "toggle_setting_window_visible")
}

const registerGlobalShortcutWithInvoke = async (shortcut: string, invokeName: string) => {
  // const isRegisteredShortcut = await isRegistered("CommandOrControl+,")
  const isRegisteredShortcut = await isRegistered(shortcut)
  if (!isRegisteredShortcut) {
    await register(shortcut, () => invoke(invokeName));
  }
}