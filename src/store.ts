import { Store } from "tauri-plugin-store-api";
import { defineStore } from 'pinia'
import { loginGerrit } from "./message/login";
import { uuid } from "./common/uuid";
import { listen } from '@tauri-apps/api/event'
import { invoke } from "@tauri-apps/api";
import * as tauriAutoLauncher from "tauri-plugin-autostart-api";
import { checkRemoteSSHConfig } from "./common/prepare";

export const tauriStore = new Store(".settings.dat");

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
    })

    await invoke("clone_gerrit_project")
    unListenForTotalObjectsUpdatedEvent()
    unListenForReceivedObjectsUpdatedEvent()

  }
}

export const useCloneStore = defineStore("clone", {
  state: () => {
    return {
      cloneTasks: [] as CloneTask[]
    }
  },
})

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

export enum PrepareTaskStatus { UnStart, Running, Succeed, Failed, Warring }

export class PrepareTask {
  public status: PrepareTaskStatus = PrepareTaskStatus.UnStart
  public fixButtonText: string = "fix"
  public fixFn?: () => Promise<void>

  constructor(
    public name: string,
    public task: () => Promise<boolean>
  ) { }

  async run() {
    try {
      this.status = PrepareTaskStatus.Running
      let result = await this.task()

      console.log(`Prepare task: ${this.name} 运行结果: ${result}` );
      if(result === true) {
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
        new PrepareTask("Check SSH Config", checkRemoteSSHConfig)
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

export const useViewModelStore = defineStore("viewModel", {
  state() {
    return {
      toolbarTitle: "Gerrit Gui"
    }
  },
})

