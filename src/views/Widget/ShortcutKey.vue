<template>
  <div v-if="type === 'text'">
    <span v-for="(stringKey, i) in stringKeys">{{ stringKey }} {{ i < stringKeys.length - 1 ? " + " : "" }}</span>
  </div>
  <div v-else>
    <div class="flex">
      <Key v-for="stringKey in stringKeys" :keyString="stringKey"></Key>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isMac } from '../../common/system';
import Key from "./Key.vue"

const props = defineProps({
  shortcutKey: String,
  type: String
})

const stringKeys = computed(() => {
  let result: string[] = []

  props.shortcutKey?.split("+").forEach(k => {
    if (k === "mod") {
      result.push(isMac() ? "⌘" : "⌃")
    } else if (k === 'shift') {
      result.push("⇧")
    } else if (k === 'alt') {
      result.push("⌥")
    } else if (k === 'option') {
      result.push("⌥")
    } else {
      result.push(k)
    }
  })

  return result
})
</script>