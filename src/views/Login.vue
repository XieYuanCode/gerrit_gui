<script setup lang="ts">
import { NoAccountsFilled, AccountCircleOutlined } from "@vicons/material"
import { ref } from "vue"
import { Earth20Regular, Question20Regular } from "@vicons/fluent"
import { useMessage } from "naive-ui"
import { useTerminalStore, useUserStore } from "../store"
import { useRouter } from "vue-router"

const router = useRouter();

const message = useMessage()
const userStore = useUserStore()
const terminalStore = useTerminalStore()

const login = async () => {
  try {
    await userStore.login(address.value, name.value, password.value)

    message.success(`登录成功，欢迎: ${userStore.name}`)
    terminalStore.appendLog(`[Login] 登录成功，用户信息: ${userStore.name}`)
    showModal.value = false

    router.push("/home")
  } catch (error) {
    console.error(error);
    message.error("登录失败")
  }

}
const showModal = ref(false)

const options = [{
  label: "http://192.168.180.150:8080/gerrit",
  value: 'http://192.168.180.150:8080/gerrit',
}]

const address = ref("http://192.168.180.150:8080/gerrit")
const name = ref("xieyuan")
const password = ref("123456")

</script>

<template>
  <div class="flex justify-center items-center w-full h-full">
    <n-empty description="请先登录">
      <template #icon>
        <n-icon>
          <NoAccountsFilled />
        </n-icon>
      </template>
      <template #extra>
        <n-button @click="showModal = true">
          登录
        </n-button>
      </template>
    </n-empty>
    <n-modal v-model:show="showModal">
      <n-card style="width: 320px" title="登录Gerrit账号" :bordered="true" size="huge" role="dialog" aria-modal="true" class="select-none">
        <n-space vertical>
          <div class="flex flex-col">
            <n-space align="center">
              <span>地址</span>
              <n-select :options="options" size="small" v-model:value="address" style="width: 195px;">
                <template #arrow>
                  <Earth20Regular />
                </template>
              </n-select>
            </n-space>
          </div>
          <div class="flex flex-col">
            <n-space align="center">
              <span>账号</span>
              <n-input size="small" style="width: 195px;" v-model:value="name">
                <template #suffix>
                  <n-icon>
                    <AccountCircleOutlined />
                  </n-icon>
                </template>
              </n-input>
            </n-space>
          </div>
          <div class="flex flex-col">
            <n-space align="center">
              <span>密码</span>
              <n-input size="small" style="width: 195px;" type="password" v-model:value="password"></n-input>
              <!-- <n-tooltip placement="bottom" trigger="click">
                <template #trigger>
                  <n-button circle size="tiny">
                    <template #icon>
                      <n-icon>
                        <Question20Regular />
                      </n-icon>
                    </template>
                  </n-button>
                </template>
                <span> 在Gerrit设置 -> HTTP Credentials页面生成 </span>
              </n-tooltip> -->

            </n-space>
          </div>
        </n-space>
        <template #footer>
          <n-space justify="end">
            <n-button size="small" @click="showModal = false">取消</n-button>
            <n-button type="primary" ghost size="small" @click="login">
              登录
            </n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<style scoped></style>
