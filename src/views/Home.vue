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
          <n-button @click="terminalStore.appendLog('asdad90a7s09cia90suc0ascua09scj0asjc0ajs', LogLevel.error)">Push A
            error Log</n-button>
          <n-button @click="terminalStore.appendLog('asdkhaksjx asgbkjxnoalsxioajnskxmas', LogLevel.success)">Push A
            success Log</n-button>
          <n-button @click="terminalStore.appendLog('asdkhaksjx asgbkjxnoalsxioajnskxmas', LogLevel.info)">Push A info
            Log</n-button>
          <n-button @click="terminalStore.appendLog('asdkhaksjx asgbkjxnoalsxioajnskxmas', LogLevel.debug)">Push A debug
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
        <Terminal></Terminal>
      </n-card>
    </n-layout-content>

    <n-modal v-model:show="cloneStore.cloneModel.visible" id="clone-confirm-dialog">
      <CloneDialog></CloneDialog>
    </n-modal>
  </n-layout>
</template>

<script setup lang="ts">
import { tauriStore, useUserStore, usePrepareTaskStore, useTerminalStore, useCloneStore, LogLevel } from '../store';
import { NIcon, useMessage } from "naive-ui"
import Explorer from "./Explorer.vue"
import { invoke } from '@tauri-apps/api/tauri'
import { emit, listen } from '@tauri-apps/api/event'
import { ref, Component, h } from 'vue';
import ContextMenu from '@imengyu/vue3-context-menu'
import { open } from '@tauri-apps/api/dialog';
import Toolbar from './Toolbar.vue';
import { customEventTarget } from '../common/event';
import Terminal from "./Terminal.vue"
import CloneDialog from "./Dialog/CloneDialog.vue"
import { CalendarWeekStart20Regular } from "@vicons/fluent"

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
</style>