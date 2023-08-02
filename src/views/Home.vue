<template>
  <n-layout has-sider class="main-layout h-full w-full">
    <n-layout-sider bordered content-style="padding-top: 10px;padding-bottom: 10px;">
      <Explorer data-tauri-drag-region></Explorer>
    </n-layout-sider>
    <n-layout-content style="position: relative; display: flex; flex-direction: column;">
      <Toolbar></Toolbar>
      <div class="main-content p-2">
        <n-space>
          <n-button @click="getData">getData</n-button>
          <n-button @click="logout">logout</n-button>
          <n-button @click="clone_gerrit_project">{{ `${cloneButtonText}(${received_objects}:${total_objects})`
          }}</n-button>
          <n-button @click="showContextMenu">Context Menu</n-button>
          <n-button @click="get_default_clone_directory">Get Default Clone Dir</n-button>
          <n-button @click="update_default_clone_directory">Update Default Clone Dir</n-button>
          <n-button @click="show_in_folder">Show In Folder</n-button>
          <n-button @click="show_in_terminal">Show In Terminal</n-button>
          <n-button @click="terminalStore.appendLog('asdjkghjkqwbniuxgvuiansoxauisnuigvhadfpioanmsdoqgbouxvb')">Push A
            Log</n-button>
        </n-space>
      </div>
      <n-button strong secondary circle :type="terminalStore.terminalPanelVisible ? 'primary' : 'default'"
        class="a absolute bottom-3 right-3 z-10"
        @click="terminalStore.terminalPanelVisible = !terminalStore.terminalPanelVisible" title="Toggle Terminal Panel">
        <template #icon>
          <n-icon>
            <CalendarWeekStart20Regular />
          </n-icon>
        </template>
      </n-button>

      <n-card class="a h-72 fixed bottom-0 z-0" style="width: calc(100% - 272px);" embedded hoverable
        v-show="terminalStore.terminalPanelVisible">
        <div class="flex flex-col">
          <div class="w-full flex justify-between items-center">
            <span class="a text-lg">Terminal</span>

            <n-button quaternary circle size="tiny" title="clear" @click="terminalStore.clear()">
              <template #icon>
                <n-icon>
                  <Delete20Regular />
                </n-icon>
              </template>
            </n-button>
          </div>
          <n-divider></n-divider>

          <n-log :rows="10" :log="terminalStore.formattedLogs" />
        </div>
      </n-card>
    </n-layout-content>

    <n-modal v-model:show="cloneStore.cloneModel.visible" id="clone-confirm-dialog">
      <n-card style="width: 800px" :bordered="true" size="huge" role="dialog" aria-modal="true" class="select-none">
        <div class="w-full flex justify-between items-center relative">
          <div class="left-panel">
            <img src="src/assets/download.svg" width="200" height="200" class="a drop-shadow-xl" />
          </div>
          <div class="right-panel flex flex-col w-full items-center">
            <div class="right-panel-title text-4xl mb-4">
              Clone
            </div>
            <div class="flex justify-around items-start w-full mb-2">
              <div class="flex flex-col w-1/4 items-end pr-1">
                <span>Remote URL : </span>
                <span style="margin-top: 10px;">Clone To : </span>
                <span style="margin-top: 10px;">Gerrit commit hook : </span>
              </div>
              <div class="flex flex-col w-3/4 items-start pl-2 relative">
                <input v-model="cloneStore.cloneModel.remoteURL" type="text" class="clone-form-input w-full"
                  placeholder="Remote URL" />
                <n-icon class="asd absolute" style="top: 3px; left: 7px;">
                  <Earth20Regular />
                </n-icon>
                <div class="flex justify-between items-end w-full" style="margin-top: 10px; ">
                  <input v-model="cloneStore.cloneModel.cloneTo" type="text" class="clone-form-input"
                    placeholder="Local Directory" style="width: 340px;" />
                  <n-button size="tiny">Browser...</n-button>
                </div>
                <n-icon class="asd absolute" style="top: 38px; left: 7px;">
                  <Folder20Regular />
                </n-icon>
                <n-checkbox style="margin-top: 5px;" v-model:checked="cloneStore.cloneModel.gerritCommitHook" />
              </div>
            </div>
            <div class="actions w-full flex justify-end items-center mt-10">
              <n-space>
                <n-button size="small" @click="cloneStore.cloneModel.visible = false">Cancel</n-button>
                <n-button size="small" type="primary" ghost
                  :disabled="cloneStore.cloneModel.cloneButtonDisable">Clone</n-button>
              </n-space>
            </div>
          </div>

          <div class="warring-message absolute bottom-0 left-0 text-sm text-red-500 flex items-center"
            v-if="cloneStore.cloneModel.errorMessage">
            <n-icon class="mr-1">
              <ErrorCircle20Regular />
            </n-icon>
            {{ cloneStore.cloneModel.errorMessage }}
          </div>
        </div>
        <!-- <template #footer>
          尾部
        </template> -->
      </n-card>
    </n-modal>
  </n-layout>
</template>

<script setup lang="ts">
import { tauriStore, useUserStore, usePrepareTaskStore, useTerminalStore, useCloneStore } from '../store';
import { NIcon, useMessage } from "naive-ui"
import Explorer from "./Explorer.vue"
import { invoke } from '@tauri-apps/api/tauri'
import { emit, listen } from '@tauri-apps/api/event'
import { ref, Component, h } from 'vue';
import ContextMenu from '@imengyu/vue3-context-menu'
import { open } from '@tauri-apps/api/dialog';
import Toolbar from './Toolbar.vue';
import { customEventTarget } from '../common/event';
import { Earth20Regular, Folder20Regular, ErrorCircle20Regular, CalendarWeekStart20Regular, Delete20Regular } from "@vicons/fluent"

const prepareTaskStore = usePrepareTaskStore()
const cloneStore = useCloneStore()
const terminalStore = useTerminalStore()

customEventTarget.addEventListener("DataReady", () => {
  prepareTaskStore.startAllTasks()
})

const message = useMessage()
const userStore = useUserStore()

const cloneButtonText = ref("Clone")
const total_objects = ref("0")
const received_objects = ref("0")

const logout = async () => {
  await userStore.logout()
  message.success("登出成功")
}

const getData = async () => {
  const data = await tauriStore.entries()
  console.log(data)
}

const clone_gerrit_project = async () => {
  let totalObjectsUpdatedListener = await listen("clone_total_objects_updated", (t: any) => {
    total_objects.value = t.payload.message
  })
  let receivedObjectsUpdatedListener = await listen("clone_received_objects_updated", (r: any) => {
    received_objects.value = r.payload.message
  })
  invoke('my_custom_command').then(() => {
    totalObjectsUpdatedListener()
    receivedObjectsUpdatedListener()
  })
    .catch(error => {
      console.error(error)
    })
}

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const showContextMenu = (event: MouseEvent) => {
  ContextMenu.showContextMenu({
    x: event.x,
    y: event.y,
    theme: 'mac',
    items: [
      {
        label: "A menu item",
        onClick: () => {
          alert("You click a menu item");
        }
      },
      {
        label: "A submenu",
        children: [
          { label: "Item1" },
          { label: "Item2" },
          { label: "Item3" },
        ]
      },
    ]
  });

}

const get_default_clone_directory = async () => {
  let home = await invoke("get_default_clone_directory")

  console.log(home);
}

const update_default_clone_directory = async () => {
  const filePath = await open({
    directory: true,
    multiple: false,
    title: "Select default clone directory"
  });

  console.log(filePath);
}

const show_in_folder = () => invoke("show_in_folder", { path: "E:\\Documents\\gerrit_gui" })
const show_in_terminal = () => invoke("show_in_terminal", { path: "e:/Documents/gerrit_gui" })
</script>

<style scoped>
.clone-form-input {
  font-size: 12px;
  height: 25px;
  outline: none;
  border-bottom: 1px solid rgb(164, 164, 164);
  padding-left: 20px;
  padding-bottom: 5px;
}</style>