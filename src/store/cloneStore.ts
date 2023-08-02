import { listen } from "@tauri-apps/api/event"
import { uuid } from "../common/uuid"
import { invoke } from "@tauri-apps/api"
import { defineStore } from "pinia"
import { useUserStore } from "./userStore"
import { useGeneralSettingStore } from "./generalSettingStore"

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
      cloneTasks: [] as CloneTask[],
      cloneModel: {
        visible: false,
        remoteURL: "",
        cloneTo: "",
        cloneButtonDisable: true,
        gerritCommitHook: true,
        errorMessage: ""
      }
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
    showCloneConfirm(projectName: string, gerritHook: boolean = true) {
      let userStore = useUserStore()
      let generalSettingStore = useGeneralSettingStore()

      let projectBaseName = projectName.split("/")[projectName.split("/").length - 1]

      this.cloneModel.remoteURL = `ssh://${userStore.username}@192.168.180.150:29418/${projectName}`
      this.cloneModel.cloneTo = `${generalSettingStore.defaultClonedDir}/${projectBaseName}`;
      this.cloneModel.gerritCommitHook = gerritHook

      this.cloneModel.visible = true
    },

    async clone(projectName: string) {


      // let task = new CloneTask(projectName)
      // this.cloneTasks.push(task)
      // await task.clone()
    },
    gerritClone(projectName: string) {
      this.cloneModel.visible = true
      // git clone "ssh://xieyuan@192.168.180.150:29418/ufe/aep-base" && scp -p -P 29418 xieyuan@192.168.180.150:hooks/commit-msg "aep-base/.git/hooks/"
      console.log(projectName);
    }
  }
})