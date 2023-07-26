import { invoke } from "@tauri-apps/api"
import { useGeneralSettingStore, tauriStore } from "../store"

export const initStoreData = async () => {
  // general setting
  const generalSettingStore = useGeneralSettingStore()
  // auto launch
  let storedGeneralSettingAutoLaunch = await tauriStore.get<boolean>("generalSetting.autoLaunch")
  generalSettingStore.autoLaunch = storedGeneralSettingAutoLaunch === null ? true : storedGeneralSettingAutoLaunch

  // auto launch
  let storedGeneralSettingDefaultClonedDir = await tauriStore.get<string>("generalSetting.defaultClonedDir")
  generalSettingStore.defaultClonedDir = storedGeneralSettingDefaultClonedDir === null ? await invoke("get_default_clone_directory") : storedGeneralSettingDefaultClonedDir
}
