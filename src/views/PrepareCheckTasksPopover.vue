<template>
  <div class="task-popover-container">
    <div class="popover-header relative select-none">
      <n-icon class="mr-2">
        <ClipboardTaskListRtl20Regular></ClipboardTaskListRtl20Regular>
      </n-icon>
      Prepare Tasks
    </div>

    <div class="w-full overflow-y-auto h-5/6 pr-5 relative select-none pb-5">
      <div v-for="prepareTask in prepareTaskStore.tasks" class="prepare-task-row flex justify-between items-center">
        <n-ellipsis style="max-width: 80%; margin-right: 0.5rem;">
          - {{ prepareTask.name }}
        </n-ellipsis>

        <n-space align="center">
          <n-icon>
            <CheckmarkStarburst20Regular v-if="prepareTask.status === PrepareTaskStatus.Succeed" style="color: green;">
            </CheckmarkStarburst20Regular>
            <ErrorCircle20Regular v-if="prepareTask.status === PrepareTaskStatus.Failed" style="color: red;">
            </ErrorCircle20Regular>
            <ArrowClockwise20Filled v-if="prepareTask.status === PrepareTaskStatus.Running" class="animate-spin">
            </ArrowClockwise20Filled>
          </n-icon>

          <n-button size="tiny" class="fix-button mb-2" @click="prepareTask.fix()">{{ prepareTask.fixButtonText || "Fix" }}</n-button>
        </n-space>

      </div>
      <div class="fixed bottom-8 text-xs text-yellow-700 flex items-center">
        <n-icon>
          <Warning20Regular />
        </n-icon>
        请确保预检查任务执行成功，否则可能影响clone等功能
      </div>
      <n-divider class="fixed bottom-1 w-11/12"></n-divider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ErrorCircle20Regular, CheckmarkStarburst20Regular, ClipboardTaskListRtl20Regular, ArrowClockwise20Filled, Warning20Regular } from "@vicons/fluent"
import { usePrepareTaskStore, PrepareTaskStatus } from "../store"

const prepareTaskStore = usePrepareTaskStore()
</script>

<style scoped>
.task-popover-container {
  padding: 5px;
  width: 500px;
  height: 300px;
}

.popover-header {
  font-size: 20px;
  border-bottom: 1px solid rgb(203, 203, 203);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 5px;
}

.prepare-task-row {
  width: 100%;
  height: 30px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgb(231, 231, 231);
}</style>