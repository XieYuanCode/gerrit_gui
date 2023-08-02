import { defineStore } from "pinia";
import { confirm } from "@tauri-apps/api/dialog"

export enum LogLevel {
  info = "Info",
  debug = "Debug",
  success = "Success",
  error = "Error"
}

export class Log {
  constructor(
    public readonly level: LogLevel,
    public log: string
  ) { }
}

export const useTerminalStore = defineStore("terminal", {
  state() {
    return {
      terminalPanelVisible: false,
      logs: [] as Log[]
    }
  },
  getters: {
    formattedLogs(state) {
      return state.logs.map(log => log.log).join("\n")
    }
  },
  actions: {
    appendLog(log: string, level: LogLevel = LogLevel.info) {
      const logWithDate = `[${new Date().toLocaleString()}] - ${level} - ${log}`
      const logInstance = new Log(level, logWithDate)
      this.logs = [logInstance].concat(this.logs)
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