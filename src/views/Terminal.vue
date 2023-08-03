<template>
    <div class="flex flex-col">
        <div class="w-full flex justify-between items-center terminal-header">
            <span class="a text-lg">Terminal</span>


            <n-space>
                {{ terminalStore.searchText }}
                <n-input size="tiny" placeholder="Search for logs" v-model:value="terminalStore.searchText"></n-input>
                <n-dropdown trigger="click" :options="logFilterOptions" size="small" @select="updateFilter">
                    <n-button quaternary circle size="tiny" title="clear" @click="">
                        <template #icon>
                            <n-icon>
                                <Filter20Regular />
                            </n-icon>
                        </template>
                    </n-button>
                </n-dropdown>
                <n-button quaternary circle size="tiny" title="clear" @click="terminalStore.clear()">
                    <template #icon>
                        <n-icon>
                            <Delete20Regular />
                        </n-icon>
                    </template>
                </n-button>
            </n-space>

        </div>

        <n-log :rows="10" :log="terminalStore.formattedLogs" language="gerrit-gui-log" />
    </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { renderIcon } from "../common/icon";
import { useTerminalStore } from "../store"
import { Delete20Regular, Filter20Regular, Checkmark20Regular } from "@vicons/fluent"

const terminalStore = useTerminalStore()

const updateFilter = (key: string) => {
    if (terminalStore.filterKey === key) {
        terminalStore.filterKey = ""
    } else {
        terminalStore.filterKey = key
    }
}

const logFilterOptions = computed(() => {
    return [
        {
            label: 'info',
            key: 'info',
            icon: terminalStore.filterKey === 'info' ? renderIcon(Checkmark20Regular) : undefined
        },
        {
            label: 'debug',
            key: 'debug',
            icon: terminalStore.filterKey === 'debug' ? renderIcon(Checkmark20Regular) : undefined
        },
        {
            label: 'success',
            key: 'success',
            icon: terminalStore.filterKey === 'success' ? renderIcon(Checkmark20Regular) : undefined
        },
        {
            label: 'error',
            key: 'error',
            icon: terminalStore.filterKey === 'error' ? renderIcon(Checkmark20Regular) : undefined
        },
    ]
})
</script>

<style scoped>
.terminal-header {
    border-bottom: 1px solid rgb(209, 209, 209);
}
</style>