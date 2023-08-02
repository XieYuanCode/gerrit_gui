import { defineStore } from "pinia"
import { tauriStore } from "."
import * as tauriAutoLauncher from "tauri-plugin-autostart-api";

export const useGeneralSettingStore = defineStore("generalSetting", {
  state: () => {
    return {
      autoLaunch: true,
      defaultClonedDir: "",
      language: "english"
    }
  },
  actions: {
    async updateAutoLaunch(autoLaunch: boolean) {
      this.autoLaunch = autoLaunch

      await tauriStore.set("generalSetting.autoLaunch", autoLaunch)
      await tauriStore.save()

      if (autoLaunch == true) {
        await tauriAutoLauncher.enable()
      } else {
        await tauriAutoLauncher.disable()
      }
    },
    async updateDefaultClonedDir(dir: string) {
      this.defaultClonedDir = dir

      await tauriStore.set("generalSetting.defaultClonedDir", dir)
      await tauriStore.save()
    }
  }
})