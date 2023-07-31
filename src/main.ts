import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
import { createRouter, createWebHashHistory } from "vue-router"

import naive from "naive-ui"

import { routes } from "./routes"

import { createPinia } from 'pinia'

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import { initStoreData } from "./common/initStoreData";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const pinia = createPinia()


let app = createApp(App)
.use(ContextMenu)
.use(pinia)
.use(router)
.use(naive)
.mount("#app");

initStoreData()

