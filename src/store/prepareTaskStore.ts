import { defineStore } from "pinia";
import { checkLocalSSHConfig, checkRemoteSSHConfig } from "../common/prepare";

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
          return Promise.resolve(true)

          // TODO:
        }),
        new PrepareTask("Check Local SSH Config", checkLocalSSHConfig, async () => {
          // TODO:
          return Promise.resolve(true)
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