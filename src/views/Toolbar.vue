<template>
  <div class="toolbar w-full h-11 flex justify-between items-center px-4" data-tauri-drag-region>
    <!-- 导航 & Title -->
    <n-space :wrap="false" style="margin-right: 20px;">
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
      <span style="white-space: nowrap;">
        {{ viewModelStore.toolbarTitle }}
      </span>
    </n-space>


    <n-space align="center" :wrap="false">
      <n-space align="center" :wrap="false">
        <n-button size="small" quaternary title="Open in folder"
          :disabled="!viewModelStore.isSelectedProjectOrOnProjectPage">
          <n-icon>
            <Folder20Regular style="scale: 1.3;"></Folder20Regular>
          </n-icon>
        </n-button>
        <n-button size="small" quaternary title="Open in terminal"
          :disabled="!viewModelStore.isSelectedProjectOrOnProjectPage">
          <n-icon>
            <CalendarWeekStart20Regular style="scale: 1.3;"></CalendarWeekStart20Regular>
          </n-icon>
        </n-button>
        <n-button size="small" quaternary title="Open in editor"
          :disabled="!viewModelStore.isSelectedProjectOrOnProjectPage">
          <img height="16" width="16" src="src/assets/vscode.png" />
        </n-button>
      </n-space>

      <n-divider vertical></n-divider>

      <n-space align="center" :wrap="false">
        <!-- Pull -->
        <n-button size="small" quaternary title="Pull" :disabled="!viewModelStore.isSelectedProjectOrOnProjectPage">
          <n-icon>
            <ArrowCurveDownLeft20Regular style="scale: 1.3;"></ArrowCurveDownLeft20Regular>
          </n-icon>
        </n-button>
        <n-button size="small" quaternary title="Push" :disabled="!viewModelStore.isSelectedProjectOrOnProjectPage">
          <n-icon>
            <ArrowCurveUpRight20Regular style="scale: 1.3;"></ArrowCurveUpRight20Regular>
          </n-icon>
        </n-button>
        <!-- Push to gerrit -->
        <n-button size="small" quaternary title="Push to gerrit"
          :disabled="!viewModelStore.isSelectedProjectOrOnProjectPage">
          <n-icon>
            <ArrowCurveUpRight20Regular style="scale: 1.3;"></ArrowCurveUpRight20Regular>
          </n-icon>
        </n-button>
      </n-space>

      <n-divider vertical></n-divider>
      <n-space align="center" :wrap="false">
        <!-- Merge -->
        <n-button size="small" quaternary title="Merge" :disabled="!viewModelStore.isSelectedProjectOrOnProjectPage">
          <n-icon>
            <Merge24Regular style="scale: 1.3;"></Merge24Regular>
          </n-icon>
        </n-button>
        <!-- Stash Save -->
        <n-button size="small" quaternary title="Rebase" :disabled="!viewModelStore.isSelectedProjectOrOnProjectPage">
          <n-icon>
            <ArrowUp20Regular style="scale: 1.3;"></ArrowUp20Regular>
          </n-icon>
        </n-button>
      </n-space>

      <n-divider vertical></n-divider>

      <n-space align="center" :wrap="false">
        <!-- Stash Reapplied -->
        <n-button size="small" quaternary title="Reapplied Stashes"
          :disabled="!viewModelStore.isSelectedProjectOrOnProjectPage">
          <n-icon>
            <ArrowAutofitDown20Regular style="scale: 1.3;"></ArrowAutofitDown20Regular>
          </n-icon>
        </n-button>
        <!-- Stash Save -->
        <n-button size="small" quaternary title="Save Stashes"
          :disabled="!viewModelStore.isSelectedProjectOrOnProjectPage">
          <n-icon>
            <ArrowAutofitUp20Regular style="scale: 1.3;"></ArrowAutofitUp20Regular>
          </n-icon>
        </n-button>
      </n-space>

      <n-divider vertical></n-divider>

      <!-- actions -->
      <n-space align="center" :wrap="false">
        <!-- Refresh -->
        <n-button size="small" quaternary title="Refresh">
          <n-icon>
            <ArrowClockwise20Regular style="scale: 1.3;"></ArrowClockwise20Regular>
          </n-icon>
        </n-button>
        <!-- Clone Popover -->
        <n-popover trigger="click" placement="bottom-end">
          <template #trigger>
            <n-button size="small" quaternary title="Clone Tasks">
              <n-badge :value="1" dot v-if="cloneStore.hasRunningCloneTask" processing
                :type="cloneStore.hasFailedCloneTask ? 'error' : 'info'">
                <n-icon>
                  <ArrowDownload20Regular style="scale: 1.3;"></ArrowDownload20Regular>
                </n-icon>
              </n-badge>
              <n-icon v-else>
                <ArrowDownload20Regular style="scale: 1.3;"></ArrowDownload20Regular>
              </n-icon>

            </n-button>

          </template>
          <ClonePopover />
        </n-popover>
        <!-- 任务按钮 -->
        <n-popover trigger="click" placement="bottom-end">
          <template #trigger>
            <n-button size="small" quaternary
              :type="isPrepareTaskRunning ? 'default' : isAllPrepareTaskSucceed ? 'success' : 'error'"
              title="Prepare Tasks">
              <n-icon v-if="isPrepareTaskRunning">
                <ArrowClockwise20Regular class="animate-spin" style="scale: 1.3;" />
              </n-icon>
              <n-icon v-if="!isPrepareTaskRunning && isAllPrepareTaskSucceed">
                <CheckmarkStarburst20Regular style="scale: 1.3;" />
              </n-icon>
              <n-icon v-if="!isPrepareTaskRunning && !isAllPrepareTaskSucceed">
                <ErrorCircle20Regular style="scale: 1.3;" />
              </n-icon>
            </n-button>
          </template>
          <PrepareCheckTasksPopover></PrepareCheckTasksPopover>
        </n-popover>
        <!-- 搜索框 -->
        <n-auto-complete v-model:value="viewModelStore.toolbarSearchText" :input-props="{
          autocomplete: 'disabled'
        }" placeholder="Search everything" size="small" ref="searchInput">
          <template #prefix>
            <n-icon :component="Search20Regular" />
          </template>
        </n-auto-complete>
      </n-space>
    </n-space>


  </div>
</template>

<script setup lang="ts">
import { ArrowLeft20Regular, CalendarWeekStart20Regular, Folder20Regular, ArrowCurveUpRight20Regular, ArrowCurveDownLeft20Regular, ArrowRight20Regular, ArrowUp20Regular, Merge24Regular, CheckmarkStarburst20Regular, Search20Regular, ArrowClockwise20Regular, ErrorCircle20Regular, ArrowAutofitUp20Regular, ArrowAutofitDown20Regular, ArrowDownload20Regular } from "@vicons/fluent"
import { usePrepareTaskStore, useViewModelStore, useCloneStore } from "../store"
import ClonePopover from "./ClonePopover.vue"
import PrepareCheckTasksPopover from "./PrepareCheckTasksPopover.vue"
import { computed, onMounted, ref } from "vue"
import { customEventTarget } from "../common/event"

const prepareTaskStore = usePrepareTaskStore()
const cloneStore = useCloneStore()
const searchInput = ref()

const isPrepareTaskRunning = computed(() => {
  return prepareTaskStore.isTaskRunning
})

const isAllPrepareTaskSucceed = computed(() => {
  return prepareTaskStore.isAllSucceed
})

const viewModelStore = useViewModelStore()

onMounted(() => {
  customEventTarget.addEventListener("Shortcut.FocusSearchInput", () => {
    searchInput.value.focus();
  })
})
</script>

<style scoped>
.toolbar {
  box-shadow: 0 2px 2px rgb(237, 237, 237);
  -webkit-app-region: drag;
}
</style>