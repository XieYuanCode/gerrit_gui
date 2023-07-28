<template>
  <div class="clone-popover-container  select-none">
    <div class="popover-header relative">
      <n-icon class="mr-2">
        <DrawerArrowDownload20Regular></DrawerArrowDownload20Regular>
      </n-icon>
      Clone Tasks

      <n-button text class="a absolute right-2" title="Clear">
        <n-icon>
          <Delete20Regular></Delete20Regular>
        </n-icon>
      </n-button>
    </div>

    <div v-if="cloneStore.cloneTasks.length > 0" class="w-full overflow-y-scroll h-5/6 pr-5">
      <div v-for="cloneTask in cloneStore.cloneTasks" class="clone-task-row flex justify-between items-center">
        <n-ellipsis style="max-width: 100px; margin-right: 0.5rem;">
          {{ cloneTask.repoName }}
        </n-ellipsis>
        <n-progress type="line" :percentage="cloneTask.progress" :status="getProgressStatus(cloneTask.status)"
          :show-indicator="cloneTask.status !== CloneTaskStatus.Succeed" :height="4" class="mr-2" processing>
          <span style="font-size: 10px;">
            ( {{ cloneTask.receivedObjects || 0 }} / {{ cloneTask.totalObjects || 0 }} )
          </span>
        </n-progress>

        <n-button size="tiny" text v-if="cloneTask.status === CloneTaskStatus.Succeed" title="Open">
          <n-icon>
            <FolderOpen20Regular></FolderOpen20Regular>
          </n-icon>
        </n-button>
      </div>
    </div>
    <n-empty description="No cloning tasks" class="mt-5" v-else>
    </n-empty>
  </div>
</template>

<script setup lang="ts">
import { FolderOpen20Regular, Delete20Regular, DrawerArrowDownload20Regular } from "@vicons/fluent"
import { useCloneStore, CloneTaskStatus } from "../store"

const cloneStore = useCloneStore()

const getProgressStatus = (cloneTaskStatus: CloneTaskStatus) => {
  switch (cloneTaskStatus) {
    case CloneTaskStatus.Failed:
      return "error"
    case CloneTaskStatus.Succeed:
      return "success"
    default:
      return "default"
  }
}
</script>

<style scoped>
.clone-popover-container {
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

.clone-task-row {
  width: 100%;
  height: 30px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>