<template>
  <n-card style="width: 800px" :bordered="true" size="huge" role="dialog" aria-modal="true" class="select-none">
    <div class="w-full flex justify-between items-center relative">
      <div class="left-panel">
        <img src="src/assets/download.svg" width="200" height="200" class="a drop-shadow-xl" />
      </div>
      <div class="right-panel flex flex-col w-full items-center">
        <div class="right-panel-title text-4xl mb-8">
          Clone Project
        </div>
        <div class="flex justify-around items-start w-full mb-2">
          <div class="flex flex-col items-end pr-1" style="width: 28%;">
            <span>Remote URL : </span>
            <span style="margin-top: 10px;">Clone To : </span>
            <span style="margin-top: 10px;">Gerrit commit hook : </span>
          </div>
          <div class="flex flex-col items-start pl-2 relative" style="width: 72%;">
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
        <n-divider></n-divider>
        <div class="actions w-full flex justify-end items-center">
          <n-space>
            <n-button size="small" @click="cloneStore.cloneModel.visible = false">{{ cloneStore.cloneModel.isCloning ?
              'Minimize' : 'Cancel' }}</n-button>
            <n-button size="small" type="primary" ghost :disabled="cloneStore.cloneButtonDisable"
              @click="cloneStore.clone()" :loading="cloneStore.cloneButtonDisable">Clone</n-button>
          </n-space>
        </div>
      </div>

      <div class="warring-message absolute bottom-0 left-0 text-sm text-red-500 flex items-center"
        v-if="cloneStore.cloneModel.errorMessage">
        <n-icon class="mr-1">
          <ErrorCircle20Regular />
        </n-icon>
        <n-ellipsis style="max-width: 240px">
          {{ cloneStore.cloneModel.errorMessage }}
        </n-ellipsis>
      </div>
      <div v-else v-if="cloneStore.cloneModel.message" class="absolute bottom-0 left-0 text-sm flex items-center">
        {{ cloneStore.cloneModel.message }}
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { useCloneStore } from "../../store"
import { Earth20Regular, Folder20Regular, ErrorCircle20Regular, CalendarWeekStart20Regular, Delete20Regular } from "@vicons/fluent"


const cloneStore = useCloneStore()
</script>

<style scoped>
.clone-form-input {
  font-size: 12px;
  height: 25px;
  outline: none;
  border-bottom: 1px solid rgb(164, 164, 164);
  padding-left: 20px;
  padding-bottom: 5px;
}
</style>