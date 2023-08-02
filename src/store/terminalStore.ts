import { defineStore } from "pinia";
import { confirm } from "@tauri-apps/api/dialog"

export const useTerminalStore = defineStore("terminal", {
  state() {
    return {
      terminalPanelVisible: false,
      logs: [] as string[]
    }
  },
  getters: {
    formattedLogs(state) {
      return state.logs.join("\n")
    }
  },
  actions: {
    appendLog(log: string) {
      this.logs = [log].concat(this.logs)
    },
    clear() {
      confirm("Clear all terminal logs?", {
        'cancelLabel': 'Cancel',
        'okLabel': 'Clear',
        type: 'warning'
      }).then(result => {
        if (result === true) {
          this.logs = []
        }
      })
    }
  }
})