<template>
    <div class="flex flex-col">
        <div class="w-full flex justify-between items-center terminal-header">
            <span class="a text-lg">Terminal</span>

            <n-space>
                <n-input size="tiny" placeholder="Search for logs"></n-input>
                <n-button quaternary circle size="tiny" title="clear" @click="">
                    <template #icon>
                        <n-icon>
                            <Filter20Regular />
                        </n-icon>
                    </template>
                </n-button>
                <n-button quaternary circle size="tiny" title="clear" @click="terminalStore.clear()">
                    <template #icon>
                        <n-icon>
                            <Delete20Regular />
                        </n-icon>
                    </template>
                </n-button>
            </n-space>

        </div>

        <n-log :rows="10" :log="terminalStore.formattedLogs" language="gerrit-gui-log"/>
    </div>
</template>
<script setup lang="ts">
import { useTerminalStore } from "../store"
import { Delete20Regular, Filter20Regular } from "@vicons/fluent"

const terminalStore = useTerminalStore()
</script>

<style scoped>
.terminal-header {
    border-bottom: 1px solid rgb(209, 209, 209);
}
</style>