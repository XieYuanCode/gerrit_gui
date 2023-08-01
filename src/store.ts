import { Store } from "tauri-plugin-store-api";
import { defineStore } from 'pinia'
import { loginGerrit } from "./message/login";
import { uuid } from "./common/uuid";
import { listen } from '@tauri-apps/api/event'
import { invoke } from "@tauri-apps/api";
import * as tauriAutoLauncher from "tauri-plugin-autostart-api";
import { checkLocalSSHConfig, checkRemoteSSHConfig } from "./common/prepare";
import { IGerritProject, getProjects } from "./message/projects";
import * as mousetrap from "mousetrap"
import { customEventTarget } from "./common/event";
import { toggleQuickOpenWindowVisiable } from "./common/window";

export const tauriStore = new Store(".settings.dat");

//#region User Store
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      email: "",
      name: "",
      registered_on: "",
      username: ""
    }
  },
  actions: {
    async login(address: string, username: string, password: string) {
      try {
        const result = await loginGerrit(address, username, password)
        await tauriStore.set("user", result)
        await tauriStore.set("password", password)
        await tauriStore.set("address", address)
        await tauriStore.save()

        this.email = result.email
        this.name = result.name
        this.registered_on = result.registered_on
        this.username = result.username
      } catch (error) {
        throw error
      }
    },
    async logout() {
      try {
        await tauriStore.delete("user")
        await tauriStore.delete("password")
        await tauriStore.delete("address")
        await tauriStore.save()

        this.email = ""
        this.name = ""
        this.registered_on = ""
        this.username = ""

      } catch (error) {
        throw error
      }
    }
  }
})
//#endregion

//#region Clone Task Store
export enum CloneTaskStatus {
  UnStart, Running, Succeed, Failed
}

export class CloneTask {
  progress: number = 0
  status: CloneTaskStatus = CloneTaskStatus.UnStart
  totalObjects: number = 0
  receivedObjects: number = 0
  id: string = uuid()

  constructor(
    public repoName: string
  ) { }

  async clone() {
    let unListenForTotalObjectsUpdatedEvent = await listen("clone_total_objects_updated", (t: any) => {
      this.totalObjects = t.payload.message
    })
    let unListenForReceivedObjectsUpdatedEvent = await listen("clone_received_objects_updated", (r: any) => {
      this.receivedObjects = r.payload.message

      this.progress = this.receivedObjects / this.totalObjects * 100
      console.log(this.progress);
    })

    try {
      // let localPath = await join()
      await invoke("clone_gerrit_project", {
        remotePath: "ssh://xieyuan@192.168.180.150:29418/ufe/aep-base",
        localPath: "/Users/xieyuan/code/gerrit/aep-base"
      })

    } catch (error) {
      this.status = CloneTaskStatus.Failed
    } finally {
      unListenForTotalObjectsUpdatedEvent()
      unListenForReceivedObjectsUpdatedEvent()
    }
  }
}

export const useCloneStore = defineStore("clone", {
  state: () => {
    return {
      cloneTasks: [] as CloneTask[]
    }
  },
  getters: {
    hasRunningCloneTask: (state) => {
      return !!state.cloneTasks.find(task => task.status === CloneTaskStatus.Running)
    },
    hasFailedCloneTask: (state) => {
      return !!state.cloneTasks.find(task => task.status === CloneTaskStatus.Failed)
    }
  },
  actions: {
    async clone(projectName: string) {
      let task = new CloneTask(projectName)
      this.cloneTasks.push(task)
      await task.clone()
    },
    gerritClone(projectName: string) {
      // git clone "ssh://xieyuan@192.168.180.150:29418/ufe/aep-base" && scp -p -P 29418 xieyuan@192.168.180.150:hooks/commit-msg "aep-base/.git/hooks/"
      console.log(projectName);
    }
  }
})
//#endregion

//#region General Setting Store
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
//#endregion

//#region Prepare Task Store
export enum PrepareTaskStatus { UnStart, Running, Succeed, Failed, Warring }

export class PrepareTask {
  public status: PrepareTaskStatus = PrepareTaskStatus.UnStart
  public fixButtonText: string = "Fix"

  constructor(
    public name: string,
    public task: () => Promise<boolean>,
    public fixFn?: () => Promise<boolean>
  ) { }

  async run() {
    try {
      this.status = PrepareTaskStatus.Running
      let result = await this.task()

      console.log(`Prepare task: ${this.name} 运行结果: ${result}`);
      if (result === true) {
        this.status = PrepareTaskStatus.Succeed
      } else {
        this.status = PrepareTaskStatus.Failed
      }
    } catch (error) {
      this.status = PrepareTaskStatus.Failed
    }
  }

  async fix() {
    try {
      this.status = PrepareTaskStatus.Running
      let fixResult = await this.fixFn!()

      console.log(`Prepare task: ${this.name} 修复果: ${fixResult}`);

      if (fixResult === true) {
        this.status = PrepareTaskStatus.Succeed
      } else {
        this.status = PrepareTaskStatus.Failed
      }
    } catch (error) {
      this.status = PrepareTaskStatus.Failed
    }
  }
}

export const usePrepareTaskStore = defineStore("prepareTask", {
  state() {
    return {
      tasks: [
        new PrepareTask("Check Remote SSH Config", checkRemoteSSHConfig, async () => {
          // return await invoke("fix_remote_ssh_config")

          // TODO:
        }),
        new PrepareTask("Check Local SSH Config", checkLocalSSHConfig, async () => {
          // TODO:
        }),
      ] as PrepareTask[]
    }
  },
  getters: {
    isAllSucceed: (state) => {
      return !!state.tasks.find(task => task.status === PrepareTaskStatus.Succeed)
    },
    isTaskRunning: (state) => {
      return !!state.tasks.find(task => task.status === PrepareTaskStatus.Running)
    }
  },
  actions: {
    startAllTasks() {
      this.tasks.forEach(task => task.run())
    }
  }
})
//#endregion

//#region View Model Store
export const useViewModelStore = defineStore("viewModel", {
  state() {
    return {
      toolbarTitle: "Gerrit Gui",
      toolbarSearchText: "",
      isSelectedProjectOrOnProjectPage: false,
      selectedProjectID: undefined
    }
  },
})
//#endregion

//#region Project Store
export const useProjectStore = defineStore("projects", {
  state() {
    return {
      remoteProjects: [] as IGerritProject[],
      selectedRemoteId: "",
      remoteProjectSearchText: ""
    }
  },
  actions: {
    async loadRemoteProjects() {
      this.remoteProjects = await getProjects()
    }
  },
  getters: {
    remoteProjectsFiltered: (state) => {
      if (state.remoteProjectSearchText === "") {
        return state.remoteProjects
      } else {
        return state.remoteProjects.filter(project => project.name.includes(state.remoteProjectSearchText))
      }
    }
  }
})
//#endregion

// #region shortcuts
export class Shortcut {
  public readonly id: string
  public enable: boolean = true
  public defaultKey: string

  constructor(
    public title: string,
    public description: string,
    public key: string,
    public action: (event: KeyboardEvent) => any
  ) {
    this.id = uuid()
    this.active()

    this.defaultKey = key
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
        new Shortcut("Quick Open", "Open quick open window that allows you to quick open local projects", "mod+shift+o", () => { toggleQuickOpenWindowVisiable() })
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
//#endregion



