<template>
  <div class="project-container overflow-y-scroll">
    <n-menu :options="projectsMenuItems"/>
  </div>
</template>

<script setup lang="ts">
import { ref, Component, h } from "vue";
import { getProjects } from "../message/projects"
import { NIcon, type MenuOption } from 'naive-ui'
import { Archive20Regular } from "@vicons/fluent";
// import ContextMenu from '@imengyu/vue3-context-menu'

const projectsMenuItems = ref<MenuOption[]>([])

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

try {
  const projects = await getProjects()
  projectsMenuItems.value = projects.map(project => {
    return {
      label: project.name,
      key: project.id,
      icon: renderIcon(Archive20Regular)
    }
  })

  console.log(projects);

} catch (error) {
  console.error(error);
}

</script>