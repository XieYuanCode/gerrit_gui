<template>
  <div class="setting-container relative">
    <!-- {{ shortcutsStore.shortcuts }} -->

    <n-button @click="shortcutsStore.enableAll" class="m-5" size="small" v-if="!shortcutsStore.isEnable">Enable all
      shortcuts</n-button>
    <n-button @click="shortcutsStore.disableAll" class="m-5"  size="small" type="primary" v-else
      style="background-color: var(--n-color);">Disable all shortcuts</n-button>

    <n-scrollbar style="max-height: 380px; padding: 10px;">
      <div class="flex justify-between items-center">
        <div class="flex justify-between items-center" style="width: 93%;">
          <span>Name</span>
          <span>Key</span>
        </div>
        <span>Enable</span>
      </div>
      <div v-for="shortcut in shortcutsStore.shortcuts" class="flex justify-between items-center">
        <div class="shortcut-row rounded flex justify-between items-center p-2">
          <span class="select-none">{{ shortcut.title }}</span>

          <span class="select-none">{{ shortcut.key }}</span>
        </div>
        <n-checkbox v-model:checked="shortcut.enable" />
      </div>

    </n-scrollbar>

    <n-divider class="fixed bottom-1">
      <span class="text-xs italic">
        Shortcuts
      </span>
    </n-divider>
  </div>
</template>
  
<script setup lang="ts">
import { useShortcutsStore } from "../../store"

const shortcutsStore = useShortcutsStore()
</script>
  
<style scoped>
.shortcut-row {
  border-bottom: 1px solid rgb(226, 226, 226);
  width: 95%;
}

.shortcut-row:hover {
  background-color: var(--n-close-color-hover);
  color: var(--n-text-color-hover);
}
</style>