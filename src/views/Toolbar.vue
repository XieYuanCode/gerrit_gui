<template>
  <div class="toolbar w-full h-10 flex justify-between items-center px-4" data-tauri-drag-region>
    <!-- 导航 & Title -->
    <n-space>
      <n-button-group size="tiny">
        <n-button quaternary>
          <n-icon>
            <ArrowLeft20Regular />
          </n-icon>
        </n-button>
        <n-button quaternary>
          <n-icon>
            <ArrowRight20Regular />
          </n-icon>
        </n-button>
      </n-button-group>
      <n-text>
        {{ viewModelStore.toolbarTitle }}
      </n-text>
    </n-space>


    <!-- actions -->
    <n-space align="center">
      <!-- Clone Popover -->
      <n-popover trigger="click" placement="bottom-end">
        <template #trigger>
          <n-button size="tiny" quaternary>
            <n-icon>
              <CloudDownloadOutlined></CloudDownloadOutlined>
            </n-icon>
          </n-button>
        </template>
        <ClonePopover />
      </n-popover>
      <!-- 任务按钮 -->
      <n-popover trigger="click" placement="bottom-end">
        <template #trigger>
          <n-button size="tiny" quaternary
            :type="isPrepareTaskRunning ? 'default' : isAllPrepareTaskSucceed ? 'success' : 'error'">
            <n-icon v-if="isPrepareTaskRunning" >
              <ArrowClockwise20Filled class="animate-spin"/>
            </n-icon>
            <n-icon v-if="!isPrepareTaskRunning && isAllPrepareTaskSucceed">
              <CheckmarkStarburst20Regular />
            </n-icon>
            <n-icon v-if="!isPrepareTaskRunning && !isAllPrepareTaskSucceed">
              <ErrorCircle20Regular />
            </n-icon>
          </n-button>
        </template>
        <PrepareCheckTasksPopover></PrepareCheckTasksPopover>
      </n-popover>
      <!-- 搜索框 -->
      <n-input size="tiny" placeholder="Search">
        <template #prefix>
          <n-icon :component="Search20Regular" />
        </template>
      </n-input>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft20Regular, ArrowRight20Regular, CheckmarkStarburst20Regular, Search20Regular, ArrowClockwise20Filled, ErrorCircle20Regular } from "@vicons/fluent"
import { CloudDownloadOutlined } from "@vicons/material"
import { usePrepareTaskStore, useViewModelStore } from "../store"
import ClonePopover from "./ClonePopover.vue"
import PrepareCheckTasksPopover from "./PrepareCheckTasksPopover.vue"
import { computed } from "vue"

const prepareTaskStore = usePrepareTaskStore()

const isPrepareTaskRunning = computed(() => {
  return prepareTaskStore.isTaskRunning
})

const isAllPrepareTaskSucceed = computed(() => {
  return prepareTaskStore.isAllSucceed
})

const viewModelStore = useViewModelStore()
</script>

<style scoped>
.toolbar {
  box-shadow: 0 2px 2px rgb(237, 237, 237);
  -webkit-app-region: drag;
}
</style>