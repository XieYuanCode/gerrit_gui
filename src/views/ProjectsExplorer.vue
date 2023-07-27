<template>
  <div class="project-container overflow-y-scroll" >
    <n-scrollbar class="scroll-view" style="max-height: calc(100vh * 0.8);">
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
      123 <br/>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, Component, h } from "vue";
import { IGerritProject, getProjects } from "../message/projects"
import { NIcon } from 'naive-ui'
import { Archive20Regular } from "@vicons/fluent";
// import ContextMenu from '@imengyu/vue3-context-menu'

let projects = ref<IGerritProject[]>([])

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

try {
  projects.value = await getProjects()

} catch (error) {
  console.error(error);
}

</script>