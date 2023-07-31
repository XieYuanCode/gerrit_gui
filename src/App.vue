<script setup lang="ts">
import { lightTheme } from "naive-ui"
import { onMounted } from "vue"
import { tauriStore, useUserStore, useShortcutsStore } from "./store";
import { useRouter } from "vue-router"
import axiosInstanceManager from "./message/axios";
import { customEventTarget } from "./common/event";

const router = useRouter();
const userStore = useUserStore()
useShortcutsStore()

onMounted(async () => {
  const userData = await tauriStore.get<any>("user")
  const password = await tauriStore.get<string>("password") || ""
  const address = await tauriStore.get<string>("address") || ""

  if (!userData) {
    router.push("/login")
  } else {
    userStore.$patch(userData)
    axiosInstanceManager.currentLoginedAddress = address
    axiosInstanceManager.currentLoginAuth = {
      username: userData.username,
      password: password
    }

    customEventTarget.dispatchEvent(new Event("DataReady"))
  }

  tauriStore.onChange((key, newValue) => {
    if (key === "user" && !newValue) {// 退出登录
      router.push("/login")
    }
  })
})
</script>

<template>
  <n-message-provider>
    <router-view>
    </router-view>
  </n-message-provider>
</template>

<style scoped></style>
