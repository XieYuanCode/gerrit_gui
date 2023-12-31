import Home from "./views/Home.vue"
import Login from "./views/Login.vue"
import SettingView from "./views/Settings/Setting.vue"
import QuickOpen from "./views/QuickOpen.vue"

export const routes = [
  { path: '/', component: Home },
  { path: '/home', component: Home },
  { path: '/login', component: Login },
  { path: '/setting', component: SettingView },
  { path: "/quickopen", component: QuickOpen}
]