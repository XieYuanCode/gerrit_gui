import { invoke } from '@tauri-apps/api';
import { register, isRegistered } from '@tauri-apps/api/globalShortcut';
import { getRemoteSSHConfigs } from '../message/ssh';
import { tauriStore } from '../store';

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

export const checkRemoteSSHConfig = async (): Promise<boolean> => {
  try {
    const remoteSSHConfigs = await getRemoteSSHConfigs()
    let remoteSSHList = remoteSSHConfigs.map(s => s.ssh_public_key?.trim().replace(/\n/g, ""))

    const localSSHConfig = await invoke<string>("get_local_ssh_configs")

    if (remoteSSHList.includes(localSSHConfig)) {
      let user = await tauriStore.get<any>("user")
      let userName = user.name
      return await invoke<boolean>("is_ssh_config_available", { userName })
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}