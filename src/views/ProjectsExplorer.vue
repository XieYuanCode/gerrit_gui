<template>
  <div class="project-container select-none">
    <n-input size="tiny" placeholder="search projects" v-model:value="projectStore.remoteProjectSearchText">
      <template #prefix>
        <n-icon :component="Filter20Regular" />
      </template>
    </n-input>
    <n-scrollbar class="scroll-view" style="max-height: calc(100vh * 0.8); padding-right: 0.5rem;">
      <div @click="projectStore.selectedRemoteId = project.id" v-for="project in projectStore.remoteProjectsFiltered"
        class="project-row flex flex-col justify-between py-1"
        @contextmenu="showRemoteProjectRowContextMenu($event, project)"
        :class="{ 'project-row-selected': projectStore.selectedRemoteId === project.id }">
        <div class="project-row-first-line flex justify-between items-center pl-1 pr-2">
          <div class="project-row-title-container flex justify-between items-center">
            <n-icon>
              <Archive20Regular></Archive20Regular>
            </n-icon>
            <n-ellipsis style="max-width: 160px; margin-left: 5px;">
              {{ project.name }}
            </n-ellipsis>
          </div>
          <n-tag size="tiny" :type="getTagType(project.state)">
            {{ project.state }}
          </n-tag>
        </div>
        <div class="flex justify-between items-center pl-1">
          <div class="project-row-title-container flex justify-between items-center">
            <n-icon>
              <TextDescription20Regular></TextDescription20Regular>
            </n-icon>
            <n-ellipsis style="max-width: 160px; margin-left: 5px; font-size: 10px;">
              {{ project.description || "no description" }}
            </n-ellipsis>
          </div>
        </div>
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, Component, h, onMounted } from "vue";
import { NIcon } from 'naive-ui'
import { Archive20Regular, Filter20Regular, TextDescription20Regular, ArrowDownload20Regular, Open20Regular } from "@vicons/fluent";
import { useCloneStore, useProjectStore } from "../store"
import ContextMenu from '@imengyu/vue3-context-menu'
import { renderIcon } from "../common/icon";
import { IGerritProject } from "../message/projects";
import { open } from '@tauri-apps/api/shell';

let projectStore = useProjectStore()
let cloneStore = useCloneStore()

const showRemoteProjectRowContextMenu = (e: MouseEvent, project: IGerritProject) => {
  e.preventDefault()

  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    theme: "mac",
    items: [
      {
        label: "Gerrit Clone",
        onClick: () => {
          cloneStore.gerritClone(project.name)
        },
        icon: renderIcon(ArrowDownload20Regular)
      },
      {
        label: "Clone",
        onClick: () => {
          cloneStore.clone(project.name)
        },
        icon: renderIcon(ArrowDownload20Regular)
      },
      {
        divided: "self"
      },
      {
        label: "Open on browser",
        onClick: async () => {
          console.log(project)
          await open(`http://192.168.180.150:8080/gerrit/admin/repos/${project.name}`)
          // alert("You click a menu item");
        },
        icon: renderIcon(Open20Regular)
      }
    ]
  });

}

let getTagType = (projectState: string) => {
  switch (projectState) {
    case "ACTIVE":
      return "success";

    default:
      return "default"
  }
}

onMounted(async () => {
  try {
    await projectStore.loadRemoteProjects()
  } catch (err) {
    console.error(err);
  }
})
</script>

<style scoped>
.project-row {
  border-bottom: 1px solid rgb(225, 225, 225);
  padding-left: 2px;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
}

.project-row:hover {
  background-color: var(--n-close-color-hover);
  color: var(--n-text-color-hover);
}

.project-row-selected {
  background-color: rgba(0, 0, 0, 0.20);
}
</style>