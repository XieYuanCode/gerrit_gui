import { invoke } from '@tauri-apps/api';
import { getRemoteSSHConfigs } from '../message/ssh';
import { tauriStore } from '../store';
export const checkRemoteSSHConfig = async (): Promise<boolean> => {
  try {
    const remoteSSHConfigs = await getRemoteSSHConfigs()

    let remoteSSHList = remoteSSHConfigs.map(s => s.ssh_public_key?.trim().replace(/\n/g, ""))
    console.log(remoteSSHList)

    const localSSHConfig = await invoke<string>("get_local_ssh_configs")
    console.log(localSSHConfig)

    return remoteSSHList.includes(localSSHConfig.trim().replace(/\n/g, ""))
  } catch (error) {
    return false
  }
}

export const generateSSHKey = () => {

}

export const checkLocalSSHConfig = async () => {
  let user = await tauriStore.get<any>("user")
  let userName = user.name
  return await invoke<boolean>("is_ssh_config_available", { userName })
}