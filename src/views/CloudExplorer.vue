<template>
  <n-tabs type="segment" size="small">
    <n-tab-pane name="changes">
      <template #tab>
        <n-icon>
          <NotepadEdit20Regular></NotepadEdit20Regular>
        </n-icon>
      </template>
      <ChangesExplorer />
      123
    </n-tab-pane>
    <n-tab-pane name="Projects">
      <template #tab>
        <n-icon>
          <Archive20Regular></Archive20Regular>
        </n-icon>
      </template>
      <Suspense>
        <ProjectsExplorer />
      </Suspense>
    </n-tab-pane>
    <n-tab-pane name="Groups">
      <template #tab>
        <n-icon>
          <PeopleCommunity20Regular></PeopleCommunity20Regular>
        </n-icon>
      </template>
      Groups
    </n-tab-pane>
    <n-tab-pane name="Account">
      <template #tab>
        <n-icon>
          <InprivateAccount20Regular></InprivateAccount20Regular>
        </n-icon>
      </template>
      Account
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
import { NotepadEdit20Regular, PeopleCommunity20Regular, InprivateAccount20Regular, Archive20Regular } from "@vicons/fluent"

import { NIcon } from "naive-ui"
import ChangesExplorer from "./ChangesExplorer.vue"
import ProjectsExplorer from "./ProjectsExplorer.vue"

</script>