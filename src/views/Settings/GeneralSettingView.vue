<template>
  <div class="setting-container flex flex-col justify-start items-center pt-3 relative">
    <!-- <n-h1>General</n-h1> -->
    <n-grid x-gap="12" :cols="2" class="setting-field">
      <n-gi class="a text-right">
        <span>
          Open on login :
          {{ generalSettingStore.autoLaunch }}
        </span>
      </n-gi>
      <n-gi>
        <n-checkbox v-model:checked="generalSettingStore.autoLaunch" size="small" @update:checked="updateAutoLaunch" />
      </n-gi>
    </n-grid>

    <n-grid x-gap="12" :cols="2" class="setting-field">
      <n-gi class="a text-right">
        <span>
          Default clone :
        </span>
      </n-gi>
      <n-gi>
        <n-button size="tiny" @click="updateDefaultCloneDirectory">{{ generalSettingStore.defaultClonedDir }}</n-button>
      </n-gi>
    </n-grid>

    <n-grid x-gap="12" :cols="2" class="setting-field">
      <n-gi class="a text-right">
        <span>
          Language :
        </span>
      </n-gi>
      <n-gi>
        <n-space>
          <n-select v-model:value="generalSettingStore.language" :options="languages" size="tiny" style="width: 100px;" />
          <span class="text-xs italic text-slate-400">Not available in current version</span>
        </n-space>
      </n-gi>
    </n-grid>

    <n-divider class="fixed bottom-1">
      <span class="text-xs italic">
        General
      </span>
    </n-divider>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGeneralSettingStore } from "../../store"
import * as dialog from '@tauri-apps/api/dialog'

const generalSettingStore = useGeneralSettingStore()

const updateAutoLaunch = async (checked: boolean) => await generalSettingStore.updateAutoLaunch(checked)
const updateDefaultCloneDirectory = async () => {
  let dir = await dialog.open({
    directory: true,
    multiple: false,
    title: "Select default clone directory"
  });

  if(dir !== null) {
    await generalSettingStore.updateDefaultClonedDir(dir as string)
  }
}

let languages = [
  {
    label: "English",
    value: 'english',
    disabled: true
  },
  {
    label: "Chinese",
    value: 'chinese',
    disabled: true
  }
]
</script>

<style scoped>
.setting-field {
  margin-top: 10px;
}
</style>