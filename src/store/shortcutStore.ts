import { defineStore } from "pinia"
import { uuid } from "../common/uuid"
import * as mousetrap from "mousetrap"
import { invoke } from "@tauri-apps/api"
import { customEventTarget } from "../common/event"
import { toggleQuickOpenWindowVisiable } from "../common/window"
import { useTerminalStore } from "./terminalStore"
import { isRegistered } from "@tauri-apps/api/globalShortcut"

export class Shortcut {
  public readonly id: string
  public enable: boolean = true
  public defaultKey: string
  public conflictsWithGlobal: boolean = false

  constructor(
    public title: string,
    public description: string,
    public key: string,
    public action: (event: KeyboardEvent) => any
  ) {
    this.id = uuid()
    this.active()

    this.defaultKey = key

    isRegistered(this.formatKey(this.key)).then(isRegister => {
      this.conflictsWithGlobal = isRegister
    })
  }

  private formatKey(key: string) {
    return key.replace(/mod/g, "CommandOrControl")
  }

  public active() {
    mousetrap.bind(this.key, (e) => {
      e.preventDefault()

      this.action.call(null, e)
    })

    this.enable = true
  }

  public deactive() {
    mousetrap.unbind(this.key)

    this.enable = false
  }
}
export const useShortcutsStore = defineStore("shortcut", {
  state() {
    return {
      shortcuts: [
        new Shortcut("Preferences...", "Open preference window", "mod+,", () => { invoke("toggle_setting_window_visible") }),
        new Shortcut("Search", "Focus the search input in the top right corner of the window that allows you to search for everything", "mod+f", () => { customEventTarget.dispatchEvent(new Event("Shortcut.FocusSearchInput")) }),
        new Shortcut("Quick Open", "Open quick open window that allows you to quick open local projects", "mod+shift+o", () => { toggleQuickOpenWindowVisiable() }),
        new Shortcut("Toggle Terminal Panel", "To switch between displaying or hiding on the terminal panel, you can see the current log information in the terminal panel", "mod+shift+t", () => {
          const terminalStore = useTerminalStore()
          terminalStore.terminalPanelVisible = !terminalStore.terminalPanelVisible
        })
      ] as Shortcut[]
    }
  },
  actions: {
    enableAll() {
      this.shortcuts.forEach(shortcut => shortcut.active())
    },
    disableAll() {
      this.shortcuts.forEach(shortcut => shortcut.deactive())
    }
  },
  getters: {
    isEnable: (state) => {
      return state.shortcuts.find(shortcut => shortcut.enable === true)
    },
    customized: (state) => {
      return state.shortcuts.filter(shortcut => shortcut.key !== shortcut.defaultKey)
    },
    defaulted: (state) => {
      return state.shortcuts.filter(shortcut => shortcut.key === shortcut.defaultKey)
    },
  }
})