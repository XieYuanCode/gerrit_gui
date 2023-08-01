<template>
  <div class="setting-container relative">
    <div class="p-10 flex">
      <n-card embedded hoverable :content-style="{ 'padding': '0px' }">
        <div class="relative">
          <input type="text" placeholder="Search for shortcuts with title" class="shortcut-search-input" auto-focus
            v-model="searchText" />
          <n-icon class="absolute shortcut-search-input-icon">
            <Search24Regular></Search24Regular>
          </n-icon>
        </div>

        <div class="py-5 pl-5 overflow-hidden">
          <n-scrollbar style="max-height: 320px; padding-right: 1.25rem;">
            <n-collapse arrow-placement="right" :default-expanded-names="['customized', 'default']">
              <n-collapse-item name="customized">
                <template #header>
                  <span class="shortcut-item-section-header">Customized Shortcuts</span>
                </template>
                <template #arrow>
                  <div></div>
                </template>
                <template #header-extra>
                  <n-icon>
                    <Keyboard20Regular />
                  </n-icon>
                </template>
                <div>
                  <div class="shortcut-item flex justify-between items-center select-none"
                    v-for="customizedShortcut in filteredCustomizedShortcuts"
                    @click="selectShortcutID = customizedShortcut.id" @dblclick="startEditShortcut(customizedShortcut.id)"
                    @contextmenu="showContextMenu($event, customizedShortcut)"
                    :class="{ 'shortcut-item-select': selectShortcutID === customizedShortcut.id }">
                    <span>{{ customizedShortcut.title }}</span>
                    <input class="edit-shortcut-input" v-if="editingShortcutID === customizedShortcut.id"
                      placeholder="Esc to cancel, Enter to confirm" />
                    <ShortcutKey :shortcutKey="customizedShortcut.key" type="text" v-else></ShortcutKey>
                  </div>
                </div>
              </n-collapse-item>
              <n-collapse-item name="default">
                <template #header>
                  <span class="shortcut-item-section-header">Default Shortcuts</span>
                </template>
                <template #arrow>
                  <div></div>
                </template>
                <template #header-extra>
                  <n-icon>
                    <Keyboard20Regular />
                  </n-icon>
                </template>
                <div>
                  <div class="shortcut-item flex justify-between items-center select-none"
                    v-for="defaultedShortcut in defaultedCustomizedShortcuts"
                    @click="selectShortcutID = defaultedShortcut.id" @dblclick="startEditShortcut(defaultedShortcut.id)"
                    @contextmenu="showContextMenu($event, defaultedShortcut)"
                    :class="{ 'shortcut-item-select': selectShortcutID === defaultedShortcut.id }">
                    <span>{{ defaultedShortcut.title }}</span>
                    <input class="edit-shortcut-input" autofocus v-if="editingShortcutID === defaultedShortcut.id"
                      @blur="editingShortcutID = ''" placeholder="Esc to cancel, Enter to confirm" />
                    <ShortcutKey :shortcutKey="defaultedShortcut.key" type="text" v-else></ShortcutKey>
                  </div>
                </div>
              </n-collapse-item>
            </n-collapse>
          </n-scrollbar>
        </div>
      </n-card>

      <div style="height: 430px;" class="flex flex-col justify-between">
        <div>
          <ShortcutKey :shortcutKey="selectShortcut!.key" type="image" style="margin-left: 5px;"></ShortcutKey>

          <div style="margin-top: 10px; margin-left: 10px;" class="asd font-bold select-none">{{ selectShortcut?.title }}
          </div>
          <div style="margin-top: 10px; margin-left: 10px;" class="asd font-thin text-xs select-none">{{
            selectShortcut?.description }}</div>
        </div>

        <div style="margin-left: 10px;" class="flex">
          <n-button quaternary circle title="reset" size="small" :disabled="selectShortcut!.key === selectShortcut!.defaultKey">
            <template #icon>
              <n-icon>
                <ArrowReset20Regular />
              </n-icon>
            </template>
          </n-button>
          <n-button quaternary circle title="clear" size="small">
            <template #icon>
              <n-icon>
                <CircleOff20Regular />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
    </div>

    <span class="text-xs font-thin italic fixed bottom-2 right-2 text-slate-500 select-none">
      Double-click the field edit shortcut
    </span>
    <n-divider class="fixed bottom-1">
      <span class="text-xs italic select-none">
        Shortcuts
      </span>
    </n-divider>
  </div>
</template>
  
<script setup lang="ts">
import { computed, ref, nextTick } from "vue";
import { Shortcut, useShortcutsStore } from "../../store"
import { Search24Regular, Keyboard20Regular, ArrowReset20Regular, CircleOff20Regular, DeleteDismiss20Regular } from "@vicons/fluent"
import ShortcutKey from "../Widget/ShortcutKey.vue"
import ContextMenu from '@imengyu/vue3-context-menu'
import { renderIcon } from "../../common/icon";

const shortcutsStore = useShortcutsStore()
const selectShortcutID = ref(shortcutsStore.shortcuts[0].id)
const searchText = ref("")
const editingShortcutID = ref(shortcutsStore.shortcuts[0].id)

const selectShortcut = computed(() => {
  return shortcutsStore.shortcuts.find(shortcut => shortcut.id === selectShortcutID.value)
})

const startEditShortcut = (id: string) => {
  editingShortcutID.value = id
  nextTick(() => {
    let input = document.getElementsByClassName("edit-shortcut-input")[0]! as HTMLInputElement

    input.addEventListener("keypress", (e) => {
      console.log(e.code);
      if (e.code === "Escape") { input.blur() }
      else if (e.code === "Enter") {
        console.log(input.value)
      }
    })
    input.focus()
  })
}

const filteredCustomizedShortcuts = computed(() => {
  if (searchText.value === "") {
    return shortcutsStore.customized
  } else {
    let result: Shortcut[] = []
    result.concat(shortcutsStore.customized.filter(s => s.title.includes(searchText.value)))

    const keys = searchText.value.split(" ")
    result.concat(shortcutsStore.customized.filter(s => {
      keys.forEach(key => {
        if (s.key.includes(key)) {
          return s
        }
      })
    }))

    return result
  }
})

const defaultedCustomizedShortcuts = computed(() => {
  if (searchText.value === "") {
    return shortcutsStore.defaulted
  } else {
    return shortcutsStore.defaulted.filter(s => s.title.includes(searchText.value))
  }
})


const showContextMenu = (e: MouseEvent, shortcut: Shortcut) => {

  e.preventDefault()

  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    theme: "mac",
    items: [
      {
        label: "Reset",
        onClick: () => {

          // cloneStore.gerritClone(project.name)
        },
        disabled: shortcut!.key === shortcut!.defaultKey,
        icon: renderIcon(ArrowReset20Regular)
      },
      // {
      //   label: "Disable",
      //   onClick: () => {
      //     // cloneStore.clone(project.name)
      //   },
      //   icon: renderIcon(CircleOff20Regular)
      // },
      {
        label: "Clear",
        onClick: () => {
          // cloneStore.clone(project.name)
        },
        icon: renderIcon(DeleteDismiss20Regular)
      }
    ]
  });
}
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

.n-card {
  min-width: 420px;
  min-height: 430px;
  max-width: 420px;
  max-height: 430px;
  /* padding: 10px; */
}

.shortcut-search-input {
  background-color: var(--n-color-embedded);
  outline: none;
  border-bottom: 1px solid rgb(178, 178, 178);
  width: 100%;
  padding-left: 30px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.shortcut-search-input-icon {
  left: 10px;
  top: 15px;
}

.shortcut-item-section-header {
  font-size: 10px;
  font-weight: bold;
  color: rgb(143, 143, 143);
}

.shortcut-item {
  width: 100%;
  padding: 5px 10px;
  border-radius: 3px;
  margin-bottom: 3px;
}

.shortcut-item:hover {
  background-color: rgb(239, 239, 239);
}

.shortcut-item-select {
  background-color: #b8e2cc !important;
}

.edit-shortcut-input {
  background-color: #b8e2cc;
  outline: none;
  border-bottom: 1px solid #7e9b8c;
}
</style>