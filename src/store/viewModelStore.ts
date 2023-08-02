import { defineStore } from "pinia"

export const useViewModelStore = defineStore("viewModel", {
  state() {
    return {
      toolbarTitle: "Gerrit Gui", // 工具栏标题文字
      toolbarSearchText: "", // 工具栏搜索关键字
      isSelectedProjectOrOnProjectPage: false, // 是否选择了本地仓库或者打开了本地仓库的页面(决定工具栏按钮是否可用)
    }
  },
})