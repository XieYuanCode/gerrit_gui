<template>
  <div style="display: flex; flex-direction: column; justify-content: space-between; width: 100%;" class="h-full pt-5 px-2">
    <n-tabs type="segment" style="max-height: 93%" size="small" v-model:value="selectedTabView">
      <n-tab-pane name="local">
        <template #tab>
          <n-icon>
            <Desktop20Regular></Desktop20Regular>
          </n-icon>
        </template>
        <LocalExplorer></LocalExplorer>
      </n-tab-pane>
      <n-tab-pane name="cloud" style="max-height: 100%">
        <template #tab>
          <n-icon>
            <Cloud20Regular></Cloud20Regular>
          </n-icon>
        </template>
        <CloudExplorer></CloudExplorer>
      </n-tab-pane>
    </n-tabs>
    <n-space class="w-full" justify="space-between">
      <n-button size="small" circle @click="goToSettingView" quaternary>
        <n-icon>
          <Settings20Regular></Settings20Regular>
        </n-icon>
      </n-button>
      <n-dropdown trigger="click" v-if="selectedTabView === 'local'" size="small" placement="top">
        <n-button size="small" circle quaternary>
          <n-icon>
            <Add20Regular></Add20Regular>
          </n-icon>
        </n-button>
      </n-dropdown>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { Cloud20Regular, Settings20Regular, Desktop20Regular, Add20Regular } from "@vicons/fluent"
import CloudExplorer from "./CloudExplorer.vue"
import LocalExplorer from "./LocalExplorer.vue"
import { invoke } from '@tauri-apps/api/tauri'

import { ref } from "vue";
import { useRouter } from "vue-router";

let router = useRouter()

const selectedTabView = ref("local")
const goToSettingView = () => invoke("toggle_setting_window_visible")
</script>