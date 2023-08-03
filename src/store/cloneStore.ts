import { listen } from "@tauri-apps/api/event"
import { uuid } from "../common/uuid"
import { invoke } from "@tauri-apps/api"
import { defineStore } from "pinia"
import { useUserStore } from "./userStore"
import { useGeneralSettingStore } from "./generalSettingStore"
import { exists, BaseDirectory } from '@tauri-apps/api/fs';

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
    public remoteUrl: string,
    public cloneTo: string
  ) { }


  public get repoName(): string {
    const userStore = useUserStore()
    return this.remoteUrl.replace(`ssh://${userStore.username}@192.168.180.150:29418/`, "")
  }


  async clone() {
    this.status = CloneTaskStatus.Running
    let unListenForTotalObjectsUpdatedEvent = await listen("clone_total_objects_updated", (t: any) => {
      this.totalObjects = t.payload.message
    })
    let unListenForReceivedObjectsUpdatedEvent = await listen("clone_received_objects_updated", (r: any) => {
      this.receivedObjects = r.payload.message

      this.progress = this.receivedObjects / this.totalObjects * 100
    })

    try {
      // let localPath = await join()
      await invoke("clone_gerrit_project", {
        remotePath: this.remoteUrl,
        localPath: this.cloneTo
      })
      this.status = CloneTaskStatus.Succeed

    } catch (error) {
      this.status = CloneTaskStatus.Failed
      throw error
    } finally {
      unListenForTotalObjectsUpdatedEvent()
      unListenForReceivedObjectsUpdatedEvent()
    }
  }
}

export const useCloneStore = defineStore("clone", {
  state: () => {
    return {
      cloneTasks: [] as CloneTask[],
      cloneModel: {
        visible: false,
        remoteURL: "",
        cloneTo: "",
        gerritCommitHook: true,
        errorMessage: "",
        message: "",
        isCloning: false,
      }
    }
  },
  getters: {
    projectName: (state) => {
      let userStore = useUserStore()
      return state.cloneModel.remoteURL.replace(`ssh://${userStore.username}@192.168.180.150:29418/`, "")
    },
    cloneButtonDisable: (state) => {
      if (state.cloneModel.isCloning === true) {
        return true
      } else {
        return !state.cloneModel.remoteURL || !state.cloneModel.cloneTo
      }
    },
    hasRunningCloneTask: (state) => {
      return !!state.cloneTasks.find(task => task.status === CloneTaskStatus.Running)
    },
    hasFailedCloneTask: (state) => {
      return !!state.cloneTasks.find(task => task.status === CloneTaskStatus.Failed)
    }
  },
  actions: {
    showCloneConfirm(projectName: string, gerritHook: boolean = true) {
      let userStore = useUserStore()
      let generalSettingStore = useGeneralSettingStore()

      let projectBaseName = projectName.split("/")[projectName.split("/").length - 1]

      this.cloneModel.remoteURL = `ssh://${userStore.username}@192.168.180.150:29418/${projectName}`
      this.cloneModel.cloneTo = `${generalSettingStore.defaultClonedDir}/${projectBaseName}`;
      this.cloneModel.gerritCommitHook = gerritHook
      this.cloneModel.message = ""
      this.cloneModel.errorMessage = ""

      this.cloneModel.visible = true
    },

    async clone() {
      this.cloneModel.isCloning = true

      const isTargetFolderExists = await exists(this.cloneModel.cloneTo)

      if (isTargetFolderExists === true) {
        this.cloneModel.isCloning = false
        this.cloneModel.errorMessage = "The target directory already exists"
        return;
      }

      const legalGitRepo = await invoke("git_command_ls_remote", {
        remoteUrl: this.cloneModel.remoteURL
      })

      if (legalGitRepo === false) {
        this.cloneModel.isCloning = false
        this.cloneModel.errorMessage = "Unable to connect to or authorizing a git repository"
        return;
      }

      let cloneTask = new CloneTask(this.cloneModel.remoteURL, this.cloneModel.cloneTo)

      this.cloneTasks.push(cloneTask)

      try {
        await cloneTask.clone()
        
        this.cloneModel.message = "Clone success"
      } catch (error) {
        this.cloneModel.errorMessage = error as string
      } finally {
        this.cloneModel.isCloning = false
      }

    }
  }
})