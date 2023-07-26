<template>
  <n-space vertical>
    <n-space>
      <n-checkbox v-model:checked="onlyMe" size="small" label="My" />
      <n-select v-model:value="statusValue" :options="statusOption" size="tiny" style="width: 190px;" />

    </n-space>
    <n-menu :options="changesList" :indent="15" @update:value="handleUpdateValue"/>
  </n-space>
</template>

<script setup lang="ts">
import { ref, reactive, Component, h } from "vue"
import { NIcon } from "naive-ui"
import { NotepadEdit20Regular } from "@vicons/fluent"

const onlyMe = ref(true)
const statusValue = ref("All")

const handleUpdateValue = (e)=>{
  console.log(e);
}

const statusOption = [{
  label: 'All',
  value: 'All'
}, {
  label: 'Merged',
  value: 'Merged'
}, {
  label: 'Open',
  value: 'Open'
}, {
  label: 'Abandoned',
  value: 'Abandoned'
}]

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const changesList = reactive([
  {
    label: "asd",
    key: 'hear-the-wind-sing',
    icon: renderIcon(NotepadEdit20Regular)
  },
  {
    label: "asd",
    key: 'hear-the-wind-sing1',
    icon: renderIcon(NotepadEdit20Regular)
  },
  {
    label: "asd",
    key: 'hear-the-wind-sing2',
    icon: renderIcon(NotepadEdit20Regular)
  },
  {
    label: "asd",
    key: 'hear-the-wind-sing3',
    icon: renderIcon(NotepadEdit20Regular)
  }
])
</script>