import { defineStore } from "pinia";
import { confirm } from "@tauri-apps/api/dialog"

export enum LogLevel {
  info = "info",
  debug = "debug",
  success = "success",
  error = "error"
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
      filterKey: '',
      searchText: "",
      logs: [] as Log[]
    }
  },
  getters: {
    formattedLogs(state) {
      if (state.filterKey === "") {
        if (state.searchText === "") {
          return state.logs.map(log => log.log).join("\n")
        } else {
          return state.logs.map(log => {
            if (log.log.includes(state.searchText)) {
              return log.log
            }
          }).join("\n")
        }
      } else {
        return state.logs.map(log => {
          if (log.level === state.filterKey) {
            if(state.searchText === "") {
              return log.log
            } else {
              if(log.log.includes(state.searchText)) {
                return log.log
              }
            }
          }
        }).join("\n")
      }
    },
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