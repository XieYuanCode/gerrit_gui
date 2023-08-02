import { defineStore } from "pinia"
import { IGerritProject, getProjects } from "../message/projects"


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