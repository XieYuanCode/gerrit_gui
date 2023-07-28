import { invoke } from '@tauri-apps/api';
import { getRemoteSSHConfigs } from '../message/ssh';
import { tauriStore } from '../store';
import { customEventTarget } from './event';
import { WebviewWindow } from '@tauri-apps/api/window'
import * as mousetrap from "mousetrap"

export const prepare = async () => {
  await registerShortcuts()
}

const registerShortcuts = async () => {
  // 打开设置页面
  await registerShortcutWithInvoke("command+,", "toggle_setting_window_visible")
  // 全局搜索
  await registerShortcutWithEvent("command+f", () => customEventTarget.dispatchEvent(new Event("Shortcut.FocusSearchInput")))
  await registerShortcutWithEvent("command+shift+o", async () => {
    const quickOpenWindow = WebviewWindow.getByLabel('quickOpenWindow')

    if (quickOpenWindow) {
      const visible = await quickOpenWindow.isVisible()

      if (visible) {
        quickOpenWindow.hide()
      } else {
        quickOpenWindow.show()
        quickOpenWindow.setFocus()
      }
    } else {
      const webview = new WebviewWindow('quickOpenWindow', {
        url: 'http://localhost:1420/#/quickopen',
        titleBarStyle: "overlay",
        center: true,
        alwaysOnTop: true,
        hiddenTitle: true,
        width: 600,
        height: 400,
        resizable: false,
        focus: true,
        transparent: true,
        decorations: false
      })

      webview.onFocusChanged((isFocusEvent) => {
        if (isFocusEvent.payload === false) {
          webview.hide()
        }
      })

      // webview.show()
      webview.setFocus()
    }

  })
}

const registerShortcutWithEvent = async (shortcut: string, callback: () => void) => {
  mousetrap.bind(shortcut, callback)
}

const registerShortcutWithInvoke = async (shortcut: string, invokeName: string) => {
  mousetrap.bind(shortcut, () => {
    console.log("123");
    invoke(invokeName)
  })
}

export const checkRemoteSSHConfig = async (): Promise<boolean> => {
  try {
    const remoteSSHConfigs = await getRemoteSSHConfigs()
    let remoteSSHList = remoteSSHConfigs.map(s => s.ssh_public_key?.trim().replace(/\n/g, ""))

    const localSSHConfig = await invoke<string>("get_local_ssh_configs")

    return remoteSSHList.includes(localSSHConfig)
  } catch (error) {
    return false
  }
}

export const checkLocalSSHConfig = async () => {
  let user = await tauriStore.get<any>("user")
  let userName = user.name
  return await invoke<boolean>("is_ssh_config_available", { userName })
}