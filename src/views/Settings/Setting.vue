<template>
  <div class="p-2">
    <n-tabs type="segment" size="small">
      <n-tab-pane name="general">
        <template #tab>
          <n-icon class="mr-1">
            <Settings20Regular></Settings20Regular>
          </n-icon>
        </template>
        <GeneralSettingView />
      </n-tab-pane>
      <n-tab-pane name="theme">
        <template #tab>
          <n-icon class="mr-1">
            <Color20Regular></Color20Regular>
          </n-icon>
        </template>
        Theme Panel
      </n-tab-pane>
      <n-tab-pane name="user">
        <template #tab>
          <n-icon class="mr-1">
            <InprivateAccount20Regular></InprivateAccount20Regular>
          </n-icon>
        </template>
        User Panel
      </n-tab-pane>
      <n-tab-pane name="git">
        <template #tab>
          <n-icon class="mr-1">
            <IosGitBranch></IosGitBranch>
          </n-icon>
        </template>
        Git Panel
      </n-tab-pane>
      <n-tab-pane name="gerrit">
        <template #tab>
          <n-icon class="mr-1">
            <IosGitCommit></IosGitCommit>
          </n-icon>
        </template>
        Gerrit Panel
      </n-tab-pane>
      <n-tab-pane name="shortcut">
        <template #tab>
          <n-icon class="mr-1">
            <Keyboard20Regular></Keyboard20Regular>
          </n-icon>
        </template>
        Shortcut Panel
      </n-tab-pane>
      <n-tab-pane name="integration">
        <template #tab>
          <n-icon class="mr-1">
            <PlugDisconnected20Regular></PlugDisconnected20Regular>
          </n-icon>
        </template>
        Integration Panel
      </n-tab-pane>
      <n-tab-pane name="update">
        <template #tab>
          <n-icon class="mr-1">
            <ArrowDownload20Filled></ArrowDownload20Filled>
          </n-icon>
        </template>
        Update Panel
      </n-tab-pane>
      <n-tab-pane name="about">
        <template #tab>
          <n-icon class="mr-1">
            <Warning20Regular></Warning20Regular>
          </n-icon>
        </template>
        About Panel
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { Settings20Regular, Color20Regular, Keyboard20Regular, PlugDisconnected20Regular, ArrowDownload20Filled, Warning20Regular, InprivateAccount20Regular } from "@vicons/fluent"
import { IosGitBranch, IosGitCommit } from "@vicons/ionicons4"

import GeneralSettingView from "./GeneralSettingView.vue"
</script>

<style></style>